import uuid
from typing import List, Tuple, Optional
from sqlalchemy import select, func, desc, asc
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.comment import Comment
from app.repositories.base import BaseRepository


class CommentRepository(BaseRepository[Comment]):
    def __init__(self, session: AsyncSession):
        super().__init__(Comment, session)

    async def get_comments_for_post(
        self, post_id: uuid.UUID, skip: int = 0, limit: int = 50
    ) -> Tuple[List[Comment], int]:
        """
        Fetch top-level comments for a post with eager loading of user and nested replies.
        """
        # Count total top-level comments for pagination
        count_stmt = (
            select(func.count())
            .select_from(Comment)
            .where(Comment.post_id == post_id, Comment.parent_comment_id == None)
        )
        count_res = await self.session.execute(count_stmt)
        total = count_res.scalar() or 0

        # Query top-level comments
        stmt = (
            select(Comment)
            .options(
                joinedload(Comment.user),
                selectinload(Comment.replies).joinedload(Comment.user),
            )
            .where(Comment.post_id == post_id, Comment.parent_comment_id == None)
            .order_by(desc(Comment.created_at))
            .offset(skip)
            .limit(limit)
        )
        res = await self.session.execute(stmt)
        comments = list(res.scalars().all())

        return comments, total

    async def get_comment_with_user(self, comment_id: uuid.UUID) -> Optional[Comment]:
        stmt = (
            select(Comment)
            .options(
                joinedload(Comment.user),
                selectinload(Comment.replies).joinedload(Comment.user),
            )
            .where(Comment.id == comment_id)
        )
        res = await self.session.execute(stmt)
        return res.scalars().first()
