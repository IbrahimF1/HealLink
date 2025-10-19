from pydantic import BaseModel
from typing import List, Optional

from enum import Enum

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"

class UserProfile(BaseModel):
    email: str
    name: str
    age: int
    gender: Gender
    role: str
    procedure: str
    stage: str
    language: str
    timezone: str
    hospital: str
    interests: List[str] = []
    availability: List[str] = []  # Make optional with default empty list
    intro: str

class UserProfileResponse(UserProfile):
    id: int

    class Config:
        from_attributes = True

class MatchFilters(BaseModel):
    age_min: Optional[int] = None
    age_max: Optional[int] = None
    gender: Optional[List[str]] = None
    procedure: Optional[str] = None
    stage: Optional[str] = None
    language: Optional[str] = None
    hospital: Optional[str] = None

class MatchRequest(BaseModel):
    user_id: int
    filters: Optional[MatchFilters] = None

class MatchResponse(BaseModel):
    mentor: UserProfileResponse
    introduction: str