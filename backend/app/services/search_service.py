from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.search_repository import SearchRepository
from app.schemas.search import SearchResult
from app.schemas.user import UserResponse
from app.schemas.competition import CompetitionResponse


class SearchService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.search_repo = SearchRepository(session)

    async def search(
        self, query: str, sport: Optional[str] = None, limit: int = 10
    ) -> SearchResult:
        if not query or len(query.strip()) == 0:
            return SearchResult(query=query, total_count=0)

        data = await self.search_repo.global_search(query=query.strip(), sport=sport, limit=limit)

        players = [UserResponse.model_validate(u) for u in data["players"]]
        coaches = [UserResponse.model_validate(u) for u in data["coaches"]]
        clubs = [UserResponse.model_validate(u) for u in data["clubs"]]
        academies = [UserResponse.model_validate(u) for u in data["academies"]]
        competitions = [CompetitionResponse.model_validate(c) for c in data["competitions"]]

        total = len(players) + len(coaches) + len(clubs) + len(academies) + len(competitions)

        return SearchResult(
            query=query,
            players=players,
            coaches=coaches,
            clubs=clubs,
            academies=academies,
            competitions=competitions,
            total_count=total,
        )
