from datetime import datetime, timezone, timedelta
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.competition_repository import CompetitionRepository
from app.schemas.competition import CompetitionResponse, CompetitionCreate
from app.models.competition import Competition


class CompetitionService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.comp_repo = CompetitionRepository(session)

    async def get_upcoming_competitions(
        self, sport: Optional[str] = None, limit: int = 50
    ) -> List[CompetitionResponse]:
        competitions = await self.comp_repo.get_upcoming_competitions(sport=sport, limit=limit)
        return [CompetitionResponse.model_validate(c) for c in competitions]

    async def create_competition(
        self, comp_in: CompetitionCreate
    ) -> CompetitionResponse:
        data = comp_in.model_dump()
        now = datetime.now(timezone.utc)
        if not data.get("start_date"):
            data["start_date"] = now + timedelta(days=14)
        if not data.get("end_date"):
            data["end_date"] = now + timedelta(days=16)
        if not data.get("registration_deadline"):
            data["registration_deadline"] = now + timedelta(days=10)

        comp = Competition(**data)
        comp_created = await self.comp_repo.create(comp)
        await self.session.commit()
        return CompetitionResponse.model_validate(comp_created)


