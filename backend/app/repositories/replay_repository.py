from typing import List
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from app.models.replay import RePlayListing
from app.repositories.base import BaseRepository


class RePlayListingRepository(BaseRepository[RePlayListing]):
    def __init__(self, session):
        super().__init__(RePlayListing, session)

    async def get_all_with_user(self) -> List[RePlayListing]:
        stmt = (
            select(RePlayListing)
            .options(joinedload(RePlayListing.user))
            .order_by(RePlayListing.created_at.desc())
        )
        res = await self.session.execute(stmt)
        return list(res.scalars().all())
