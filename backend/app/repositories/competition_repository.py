from typing import List, Optional
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.competition import Competition
from app.repositories.base import BaseRepository


class CompetitionRepository(BaseRepository[Competition]):
    def __init__(self, session: AsyncSession):
        super().__init__(Competition, session)

    async def get_upcoming_competitions(
        self, sport: Optional[str] = None, limit: int = 50
    ) -> List[Competition]:
        stmt = select(Competition)
        if sport and sport != "All Sports":
            stmt = stmt.where(Competition.sport == sport)

        stmt = stmt.order_by(desc(Competition.created_at)).limit(limit)
        res = await self.session.execute(stmt)
        return list(res.scalars().all())

