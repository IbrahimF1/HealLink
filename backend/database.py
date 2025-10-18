from sqlalchemy import create_engine, Column, Integer, String, Text, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import numpy as np
import faiss

DATABASE_URL = "sqlite:///./heallink.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    role = Column(String)
    procedure = Column(String)
    stage = Column(String)
    language = Column(String)
    timezone = Column(String)
    hospital = Column(String)
    interests = Column(JSON)
    availability = Column(JSON)
    intro = Column(Text)
    embedding = Column(JSON)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# In-memory FAISS index for vector search
# In a production scenario, you would persist this index
index = None
user_id_map = {}

def get_faiss_index():
    global index
    if index is None:
        # Assuming embeddings are of dimension 384 from 'all-MiniLM-L6-v2'
        index = faiss.IndexFlatL2(384)
    return index

def get_user_id_map():
    global user_id_map
    return user_id_map

def update_faiss_index(db_session):
    global index, user_id_map
    index = faiss.IndexFlatL2(384)
    user_id_map = {}
    
    mentors = db_session.query(User).filter(User.role == "mentor").all()
    for i, mentor in enumerate(mentors):
        if mentor.embedding:
            embedding_array = np.array(mentor.embedding).astype('float32').reshape(1, -1)
            index.add(embedding_array)
            user_id_map[i] = mentor.id

    print(f"FAISS index updated with {index.ntotal} mentor embeddings.")