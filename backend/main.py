# D:\Coding\Personal\Hackathon\HealLink\backend\main.py

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, update_faiss_index, SessionLocal
from models import UserProfile, UserProfileResponse, MatchRequest, MatchResponse
import services
from database import User
from fastapi.middleware.cors import CORSMiddleware # <--- ADD THIS IMPORT

app = FastAPI(title="HealLink API")

# --- ADD THIS ENTIRE BLOCK ---
# This is the CORS configuration.
origins = [
    "http://localhost:5173", # The origin for your Vite React app
    "http://localhost:3000", # A common origin for create-react-app
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
)
# -----------------------------


@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    update_faiss_index(db)
    db.close()

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

    introduction = services.generate_introduction(mentee, mentor)
    
    return {
        "mentor": mentor,
        "introduction": introduction
    }

@app.post("/admin/rebuild-index/")
def rebuild_index(db: Session = Depends(get_db)):
    update_faiss_index(db)
    return {"message": "FAISS index has been rebuilt successfully."}