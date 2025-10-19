# D:\Coding\Personal\Hackathon\HealLink\backend\main.py

from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import Optional
import json

from database import get_db, update_faiss_index, SessionLocal
from models import UserProfile, UserProfileResponse, MatchRequest, MatchResponse
import services
from database import User
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="HealLink API")

# --- CORS Configuration ---
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:5174",  # Vite alternative
    "http://localhost:5175",  # Add more ports
    "http://localhost:5176",  # that Vite might use
    "http://localhost:5177",  # Your current frontend port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
    "http://127.0.0.1:5176",
    "http://127.0.0.1:5177",
    "http://localhost:3000",  # React default
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- WebSocket and Connection Manager (Unchanged) ---
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

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            recipient_id = message_data['recipient_id']
            full_message = { "sender_id": user_id, "text": message_data['text'] }
            await manager.send_personal_message(json.dumps(full_message), recipient_id)
    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception as e:
        print(f"Error in WebSocket for user {user_id}: {e}")
        manager.disconnect(user_id)

# --- Standard Endpoints ---
@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    update_faiss_index(db)
    db.close()

mentor_connections = {}

@app.post("/users/", response_model=UserProfileResponse)
def create_user(profile: UserProfile, db: Session = Depends(get_db)):
    try:
        print(f"Creating/updating user with data: {profile}")  # Debug log
        
        # Validate all required fields are present and non-empty
        required_fields = ['email', 'name', 'role', 'procedure', 'stage', 'language', 'timezone', 'hospital', 'intro']
        missing_fields = [field for field in required_fields if not getattr(profile, field)]
        if missing_fields:
            raise HTTPException(
                status_code=400, 
                detail=f"Missing required fields: {', '.join(missing_fields)}"
            )
        
        # Check if email exists
        db_user = db.query(User).filter(User.email == profile.email).first()
        if db_user:
            # Update existing user
            updated_user = services.update_user_profile(db, db_user.id, profile)
            print(f"Successfully updated user: {updated_user.email}")  # Debug log
            return updated_user
        
        # Create new user
        new_user = services.create_user_profile(db, profile)
        print(f"Successfully created user: {new_user.email}")  # Debug log
        return new_user
    except HTTPException as he:
        print(f"HTTP error creating/updating user: {str(he.detail)}")  # Debug log
        raise
    except Exception as e:
        print(f"Error creating/updating user: {str(e)}")  # Debug log
        raise HTTPException(status_code=400, detail=f"Error creating/updating user: {str(e)}")

@app.put("/users/{user_id}", response_model=UserProfileResponse)
def update_user(user_id: int, profile: UserProfile, db: Session = Depends(get_db)):
    updated_user = services.update_user_profile(db, user_id, profile)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@app.delete("/users/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    success = services.delete_user_profile(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    for mentor_id in list(mentor_connections.keys()):
        mentor_connections[mentor_id] = [
            mentee for mentee in mentor_connections[mentor_id] if mentee['id'] != user_id
        ]
    return {"ok": True}

@app.get("/users/by-email/{email}", response_model=Optional[UserProfileResponse])
async def get_user_by_email(email: str, db: Session = Depends(get_db)):
    """
    Check if a user exists by email. Returns:
    - The user object if found (200 OK)
    - None if not found (200 OK with null)
    This lets the frontend distinguish between new and existing users.
    """
    try:
        print(f"Looking up user with email: {email}")  # Debug log
        db_user = db.query(User).filter(User.email == email).first()
        
        if db_user:
            print(f"Found existing user: {db_user.email}")  # Debug log
            return db_user
        else:
            print(f"No user found with email: {email}")  # Debug log
            return None
            
    except Exception as e:
        print(f"Database error in get_user_by_email: {str(e)}")
        raise HTTPException(status_code=500, detail="Database error")
    db_user = db.query(User).filter(User.email == email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.get("/users/{user_id}", response_model=UserProfileResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# --- THIS IS THE PRIMARY FIX ---
# This ensures that if a user is not found, a proper 404 is raised
# BEFORE FastAPI tries to validate a `None` response.
@app.get("/users/by-email/{email}", response_model=UserProfileResponse)
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
# --------------------------------

@app.post("/match/", response_model=MatchResponse)
def get_match(request: MatchRequest, db: Session = Depends(get_db)):
    mentee = db.query(User).filter(User.id == request.user_id).first()
    if not mentee:
        raise HTTPException(status_code=404, detail="Mentee not found")
    if mentee.role != "mentee":
        raise HTTPException(status_code=400, detail="The user ID provided is not for a mentee")
    
    mentor = services.find_best_match(db, request.user_id)
    if not mentor:
        raise HTTPException(status_code=404, detail="No suitable mentor found")
        
    if mentor.id not in mentor_connections:
        mentor_connections[mentor.id] = []

    mentee_data = UserProfileResponse.model_validate(mentee, from_attributes=True).model_dump()
    if not any(m['id'] == mentee.id for m in mentor_connections[mentor.id]):
        mentor_connections[mentor.id].append(mentee_data)
        
    introduction = services.generate_introduction(mentee, mentor)
    return { "mentor": mentor, "introduction": introduction, "mentee": mentee }

# --- THIS IS A SECONDARY STABILITY FIX ---
# This correctly validates the dictionary without misusing `from_attributes`.
@app.get("/mentors/{mentor_id}/chats", response_model=list[UserProfileResponse])
def get_mentor_chats(mentor_id: int):
    connections = mentor_connections.get(mentor_id, [])
    return [UserProfileResponse.model_validate(c) for c in connections]
# -----------------------------------------

@app.get("/users/", response_model=list[UserProfileResponse])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [UserProfileResponse.model_validate(u, from_attributes=True) for u in users]