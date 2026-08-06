import uuid
from typing import Optional, List, Tuple
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.models.follower import Follower
from app.models.saved_post import SavedPost
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, session: AsyncSession):
        super().__init__(User, session)

    async def get_by_username(self, username: str) -> Optional[User]:
        stmt = select(User).where(User.username == username)
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def get_by_email(self, email: str) -> Optional[User]:
        stmt = select(User).where(User.email == email)
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def get_saved_posts_count(self, user_id: uuid.UUID) -> int:
        stmt = select(func.count()).select_from(SavedPost).where(SavedPost.user_id == user_id)
        res = await self.session.execute(stmt)
        return res.scalar() or 0

    async def get_suggested_athletes(
        self,
        current_user_id: uuid.UUID,
        sport: Optional[str] = None,
        state: Optional[str] = None,
        limit: int = 10
    ) -> List[Tuple[User, int]]:
        """
        Suggest athletes based on matching sport/state excluding current user and already followed users.
        Returns list of (User, mutual_connections_count).
        """
        # Get IDs of users current user already follows
        following_stmt = select(Follower.following_id).where(Follower.follower_id == current_user_id)
        following_res = await self.session.execute(following_stmt)
        following_ids = set(following_res.scalars().all())
        following_ids.add(current_user_id)

        # Base suggestion query
        query = select(User).where(User.id.notin_(following_ids))

        conditions = []
        if sport:
            conditions.append(User.sport == sport)
        if state:
            conditions.append(User.state == state)

        if conditions:
            query = query.where(or_(*conditions))

        query = query.order_by(User.followers_count.desc()).limit(limit)
        res = await self.session.execute(query)
        users = list(res.scalars().all())

        # Calculate mock/real mutual connections
        results = []
        for user in users:
            mutual_stmt = select(func.count()).select_from(Follower).where(
                Follower.follower_id.in_(
                    select(Follower.following_id).where(Follower.follower_id == current_user_id)
                ),
                Follower.following_id == user.id
            )
            m_res = await self.session.execute(mutual_stmt)
            mutual_count = m_res.scalar() or 0
            results.append((user, mutual_count))

        return results
