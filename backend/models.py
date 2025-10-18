from pydantic import BaseModel
from typing import List, Optional

class UserProfile(BaseModel):
    email: str
    name: str
    role: str
    procedure: str
    stage: str
    language: str
    timezone: str
    hospital: str
    interests: List[str]
    availability: List[str]
    intro: str

class UserProfileResponse(UserProfile):
    id: int

    class Config:
        from_attributes = True

class MatchRequest(BaseModel):
    user_id: int
    filters: Optional[dict] = {}

class MatchResponse(BaseModel):
    mentor: UserProfileResponse
    introduction: str