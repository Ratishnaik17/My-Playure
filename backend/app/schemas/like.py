import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class LikeResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    post_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LikeCountResponse(BaseModel):
    post_id: uuid.UUID
    total_likes: int
    is_liked_by_me: bool
