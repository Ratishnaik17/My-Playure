import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.user import UserResponse


class PostMediaBase(BaseModel):
    media_type: str  # image, video
    media_url: str
    sort_order: int = 0


class PostMediaCreate(PostMediaBase):
    pass


class PostMediaResponse(PostMediaBase):
    id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)


class PostCreate(BaseModel):
    content: str
    post_type: str = "normal"  # normal, achievement, tournament, check_in
    sport: Optional[str] = None
    achievement_type: Optional[str] = None
    visibility: str = "public"
    location: Optional[str] = None
    is_draft: bool = False
    media: List[PostMediaCreate] = Field(default_factory=list)


class PostUpdate(BaseModel):
    content: Optional[str] = None
    post_type: Optional[str] = None
    sport: Optional[str] = None
    achievement_type: Optional[str] = None
    visibility: Optional[str] = None
    location: Optional[str] = None
    is_draft: Optional[bool] = None


class PostResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    user: UserResponse
    content: str
    post_type: str
    sport: Optional[str] = None
    achievement_type: Optional[str] = None
    visibility: str
    location: Optional[str] = None
    is_draft: bool
    created_at: datetime
    updated_at: datetime
    media: List[PostMediaResponse] = Field(default_factory=list)
    likes_count: int = 0
    comments_count: int = 0
    is_liked_by_me: bool = False
    is_saved_by_me: bool = False
    hashtags: List[str] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)
