import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserResponse


class RePlayListingBase(BaseModel):
    name: str
    sport: str
    category: str
    condition: str
    price: float = 0.0
    is_free: bool = False
    location: str
    description: Optional[str] = None
    image_url: Optional[str] = None


class RePlayListingCreate(RePlayListingBase):
    pass


class RePlayListingResponse(RePlayListingBase):
    id: uuid.UUID
    user_id: uuid.UUID
    user: UserResponse
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
