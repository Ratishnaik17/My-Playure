import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class CompetitionBase(BaseModel):
    title: str
    sport: str
    organizer: str = "Playure Sports League"
    location: str = "India"
    level: Optional[str] = "State Level"
    description: Optional[str] = None
    registration_deadline: Optional[datetime] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    prize_pool: str = "₹0"
    registration_fee: Optional[str] = "Free Entry"
    max_participants: Optional[str] = "Open Entry"
    contact_info: Optional[str] = None
    status: str = "Open for Registration"
    banner_image: Optional[str] = None


class CompetitionCreate(CompetitionBase):
    pass


class CompetitionResponse(CompetitionBase):
    id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


