import uuid
from typing import Optional
from sqlalchemy import select, delete, and_
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.like import Like
from app.repositories.base import BaseRepository


class LikeRepository(BaseRepository[Like]):
    def __init__(self, session: AsyncSession):
        super().__init__(Like, session)

    async def get_like(self, post_id: uuid.UUID, user_id: uuid.UUID) -> Optional[Like]:
        stmt = select(Like).where(and_(Like.post_id == post_id, Like.user_id == user_id))
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def delete_like(self, post_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        stmt = delete(Like).where(and_(Like.post_id == post_id, Like.user_id == user_id))
        res = await self.session.execute(stmt)
        await self.session.commit()
        return res.rowcount > 0
