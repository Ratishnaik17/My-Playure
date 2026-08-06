import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserResponse


class CommentCreate(BaseModel):
    comment: str
    parent_comment_id: Optional[uuid.UUID] = None


class CommentResponse(BaseModel):
    id: uuid.UUID
    post_id: uuid.UUID
    user_id: uuid.UUID
    user: UserResponse
    parent_comment_id: Optional[uuid.UUID] = None
    comment: str
    created_at: datetime
    replies: List["CommentResponse"] = []

    model_config = ConfigDict(from_attributes=True)


CommentResponse.model_rebuild()
