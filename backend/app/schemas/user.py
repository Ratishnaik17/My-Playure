import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class UserBase(BaseModel):
    full_name: str
    username: str
    email: str
    profile_image: Optional[str] = None
    cover_image: Optional[str] = None
    bio: Optional[str] = None
    role: str = "athlete"  # athlete, coach, club, academy
    sport: str
    state: str
    city: str


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    profile_image: Optional[str] = None
    cover_image: Optional[str] = None
    bio: Optional[str] = None
    sport: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None


class UserResponse(UserBase):
    id: uuid.UUID
    verified: bool
    followers_count: int
    following_count: int
    profile_views: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SuggestedPlayerResponse(BaseModel):
    id: uuid.UUID
    full_name: str
    username: str
    profile_image: Optional[str] = None
    role: str
    sport: str
    state: str
    city: str
    verified: bool
    followers_count: int
    mutual_connections_count: int = 0
    recommendation_reason: str = "Matching Sport & Location"

    model_config = ConfigDict(from_attributes=True)
