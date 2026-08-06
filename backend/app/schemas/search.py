from typing import List, Optional
from pydantic import BaseModel
from app.schemas.user import UserResponse
from app.schemas.competition import CompetitionResponse


class SearchResult(BaseModel):
    query: str
    players: List[UserResponse] = []
    coaches: List[UserResponse] = []
    clubs: List[UserResponse] = []
    academies: List[UserResponse] = []
    competitions: List[CompetitionResponse] = []
    total_count: int = 0
