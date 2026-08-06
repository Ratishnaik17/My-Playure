from typing import List
from pydantic import BaseModel
from app.schemas.sidebar import SidebarUserSummary
from app.schemas.post import PostResponse
from app.schemas.trending import TrendingResponse
from app.schemas.competition import CompetitionResponse
from app.schemas.user import SuggestedPlayerResponse
from app.schemas.ai_assistant import AIAssistantCardResponse
from app.schemas.common import PaginationMeta


class HomeFeedSection(BaseModel):
    items: List[PostResponse]
    meta: PaginationMeta


class HomeResponse(BaseModel):
    user_summary: SidebarUserSummary
    feed: HomeFeedSection
    trending: TrendingResponse
    upcoming_competitions: List[CompetitionResponse]
    suggested_players: List[SuggestedPlayerResponse]
    ai_assistant: AIAssistantCardResponse
