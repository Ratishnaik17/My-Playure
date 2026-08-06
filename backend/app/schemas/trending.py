from typing import List
from pydantic import BaseModel


class TrendingHashtagItem(BaseModel):
    name: str
    post_count: int


class TrendingSportItem(BaseModel):
    sport: str
    post_count: int
    active_athletes_count: int = 0


class TrendingResponse(BaseModel):
    trending_hashtags: List[TrendingHashtagItem]
    trending_sports: List[TrendingSportItem]
