import uuid
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class SidebarUserSummary(BaseModel):
    id: uuid.UUID
    full_name: str
    username: str
    profile_image: Optional[str] = None
    cover_image: Optional[str] = None
    role: str
    sport: str
    state: str
    city: str
    verified: bool
    followers_count: int
    following_count: int
    profile_views: int
    saved_posts_count: int = 0

    model_config = ConfigDict(from_attributes=True)
