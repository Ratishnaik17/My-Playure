from typing import List, Optional, Dict
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.models.competition import Competition


class SearchRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def global_search(
        self, query: str, sport: Optional[str] = None, limit: int = 10
    ) -> Dict[str, List]:
        pattern = f"%{query}%"

        # Base user query
        u_stmt = select(User).where(
            or_(
                User.full_name.ilike(pattern),
                User.username.ilike(pattern),
                User.bio.ilike(pattern),
                User.sport.ilike(pattern),
                User.city.ilike(pattern),
                User.state.ilike(pattern),
            )
        )
        if sport:
            u_stmt = u_stmt.where(User.sport == sport)

        u_res = await self.session.execute(u_stmt.limit(50))
        users = list(u_res.scalars().all())

        players = [u for u in users if u.role == "athlete"]
        coaches = [u for u in users if u.role == "coach"]
        clubs = [u for u in users if u.role == "club"]
        academies = [u for u in users if u.role == "academy"]

        # Competition search
        c_stmt = select(Competition).where(
            or_(
                Competition.title.ilike(pattern),
                Competition.organizer.ilike(pattern),
                Competition.location.ilike(pattern),
                Competition.sport.ilike(pattern),
            )
        )
        if sport:
            c_stmt = c_stmt.where(Competition.sport == sport)

        c_res = await self.session.execute(c_stmt.limit(limit))
        competitions = list(c_res.scalars().all())

        return {
            "players": players[:limit],
            "coaches": coaches[:limit],
            "clubs": clubs[:limit],
            "academies": academies[:limit],
            "competitions": competitions[:limit],
        }
