import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class CollaborationCreate(BaseModel):
    sport: str = Field(..., example="Football")
    location: str = Field(..., example="Turf Park, Koramangala")
    datetime_info: Optional[str] = Field(None, example="Today, 19:00")
    players_needed: int = Field(default=5, ge=1, le=50, example=5)
    admin_name: Optional[str] = Field(default="Ratish Naik")
    admin_avatar: Optional[str] = Field(default="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80")


class CollaborationResponse(BaseModel):
    id: uuid.UUID
    admin_name: str
    admin_avatar: str
    sport: str
    sport_icon: str
    location: str
    time: str
    is_live: bool
    is_time_gold: bool
    current_players: int
    total_players: int
    status: str
    is_joined: bool = False
    created_at: datetime

    class Config:
        from_attributes = True
