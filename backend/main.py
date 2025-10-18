from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect # <-- WebSocket imports
from sqlalchemy.orm import Session
import json # <-- To handle JSON messages over WebSocket

from database import get_db, update_faiss_index, SessionLocal
from models import UserProfile, UserProfileResponse, MatchRequest, MatchResponse
import services
from database import User
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="HealLink API")

# --- CORS Configuration (should already be here) ---
origins = ["http://localhost:5173", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- NEW: WebSocket Connection Manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        print(f"User {user_id} connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, user_id: int):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            print(f"User {user_id} disconnected. Total connections: {len(self.active_connections)}")

    async def send_personal_message(self, message: str, user_id: int):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)

manager = ConnectionManager()

# --- NEW: WebSocket Endpoint ---
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            recipient_id = message_data['recipient_id']
            # Re-package message to include sender's ID
            full_message = {
                "sender_id": user_id,
                "text": message_data['text']
            }
            await manager.send_personal_message(json.dumps(full_message), recipient_id)
    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception as e:
        print(f"Error in WebSocket for user {user_id}: {e}")
        manager.disconnect(user_id)


# --- Existing Endpoints (no changes needed below this line) ---
@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    update_faiss_index(db)
    db.close()

# We need a way for a mentor to see who has matched with them.
# This requires a small change to the MatchResponse model and the /match endpoint.
# Let's add a `mentee` field to the MatchResponse.
class EnrichedMatchResponse(MatchResponse):
    mentee: UserProfileResponse

# We also need a way to store matches in the database.
# This is a significant change, let's simplify for now by not persisting matches
# and instead focusing on the live chat functionality.

@app.post("/users/", response_model=UserProfileResponse)
def create_user(profile: UserProfile, db: Session = Depends(get_db)):
    db_user = services.create_user_profile(db, profile)
    return db_user

@app.get("/users/{user_id}", response_model=UserProfileResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# For the demo, we'll create a temporary in-memory store of matches for mentors to look up.
# In a real app, this would be a database table.
mentor_connections = {}

@app.get("/users/by-email/{email}", response_model=UserProfileResponse)
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/match/", response_model=MatchResponse)
def get_match(request: MatchRequest, db: Session = Depends(get_db)):
    mentee = db.query(User).filter(User.id == request.user_id).first()
    if not mentee:
        raise HTTPException(status_code=404, detail="Mentee not found")

    mentor = services.find_best_match(db, request.user_id)
    if not mentor:
        raise HTTPException(status_code=404, detail="No suitable mentor found")

    # Store this connection in our temporary store
    if mentor.id not in mentor_connections:
        mentor_connections[mentor.id] = []
    # Avoid duplicate mentee entries
    if not any(m['id'] == mentee.id for m in mentor_connections[mentor.id]):
        mentor_connections[mentor.id].append(vars(mentee))
    
    introduction = services.generate_introduction(mentee, mentor)
    
    return {
        "mentor": mentor,
        "introduction": introduction,
        "mentee": mentee # Pass mentee info back as well
    }

# NEW endpoint for mentors to check their connections
@app.get("/mentors/{mentor_id}/chats", response_model=list[UserProfileResponse])
def get_mentor_chats(mentor_id: int):
    connections = mentor_connections.get(mentor_id, [])
    # Convert dicts back to UserProfileResponse models
    return [UserProfileResponse.model_validate(c) for c in connections]
