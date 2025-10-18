# D:\Coding\Personal\Hackathon\HealLink\backend\services.py

from sqlalchemy.orm import Session
from sentence_transformers import SentenceTransformer
import numpy as np
import requests # <-- ADDED for Ollama
import json     # <-- ADDED for Ollama

from database import User, get_faiss_index, get_user_id_map, update_faiss_index
from models import UserProfile

# --- Model Initialization ---
# The sentence-transformer model for embeddings remains unchanged.
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

# --- REMOVED ---
# We no longer need to load the Gemma tokenizer or model in Python.
# tokenizer = AutoTokenizer.from_pretrained("google/gemma-2b-it")
# gemma_model = AutoModelForCausalLM.from_pretrained(...)
# ---

def create_user_profile(db: Session, profile: UserProfile):
    embedding = embedding_model.encode(profile.intro, convert_to_tensor=False).tolist()
    
    db_user = User(
        email=profile.email,
        name=profile.name,
        role=profile.role,
        procedure=profile.procedure,
        stage=profile.stage,
        language=profile.language,
        timezone=profile.timezone,
        hospital=profile.hospital,
        interests=profile.interests,
        availability=profile.availability,
        intro=profile.intro,
        embedding=embedding
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    if db_user.role == "mentor":
        update_faiss_index(db)

    return db_user

def find_best_match(db: Session, mentee_id: int):
    mentee = db.query(User).filter(User.id == mentee_id).first()
    if not mentee:
        return None

    index = get_faiss_index()
    user_id_map = get_user_id_map()

    if index.ntotal == 0:
        return None

    mentee_embedding = np.array(mentee.embedding).astype('float32').reshape(1, -1)
    
    k = 1
    distances, indices = index.search(mentee_embedding, k)
    
    if len(indices) == 0:
        return None

    best_match_index = indices[0][0]
    mentor_id = user_id_map[best_match_index]
    
    mentor = db.query(User).filter(User.id == mentor_id).first()
    return mentor

# --- REWRITTEN FUNCTION ---
# This function now calls the Ollama API instead of running the model locally.
def generate_introduction(mentee: User, mentor: User):
    shared_interests = list(set(mentee.interests) & set(mentor.interests))
    
    prompt = f"""
    You are a friendly and empathetic assistant for HealLink, a platform connecting medical mentors and mentees.
    Your task is to create a warm, brief introduction between a mentee and a mentor.

    Mentee: {mentee.name}
    - Procedure: {mentee.procedure}
    - Stage: {mentee.stage}
    - A bit about them: {mentee.intro}

    Mentor: {mentor.name}
    - Procedure: {mentor.procedure}
    - Stage: {mentor.stage}
    - A bit about them: {mentor.intro}

    Shared Interests: {', '.join(shared_interests) if shared_interests else 'None'}

    Based on this, write a short, welcoming message to introduce them in a chat.
    Start by greeting both of them.
    Highlight their shared medical journey.
    If they have shared interests, mention one to help break the ice.
    Keep it under 100 words.
    """

    ollama_api_url = "http://localhost:11434/api/generate"
    
    payload = {
        "model": "gemma3n:e2b",
        "prompt": prompt,
        "stream": False  # We want the full response at once
    }

    try:
        response = requests.post(ollama_api_url, data=json.dumps(payload))
        response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)

        # The actual generated text is in the 'response' key of the JSON
        response_text = response.json().get('response', '')
        return response_text.strip()

    except requests.exceptions.ConnectionError as e:
        print("Error: Could not connect to Ollama server.")
        print("Please ensure the Ollama application is running.")
        return "Sorry, the AI introduction service is currently unavailable. Please try again later."
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return "Sorry, an error occurred while generating the introduction."