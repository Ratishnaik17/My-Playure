import uuid
from typing import List, Optional, Tuple
from sqlalchemy import select, func, or_, and_, desc
from sqlalchemy.orm import selectinload, joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.post import Post, PostMedia
from app.models.like import Like
from app.models.comment import Comment
from app.models.saved_post import SavedPost
from app.models.hashtag import Hashtag, PostHashtag
from app.repositories.base import BaseRepository


class PostRepository(BaseRepository[Post]):
    def __init__(self, session: AsyncSession):
        super().__init__(Post, session)

    async def get_post_with_details(self, post_id: uuid.UUID) -> Optional[Post]:
        stmt = (
            select(Post)
            .options(
                joinedload(Post.user),
                selectinload(Post.media),
                selectinload(Post.hashtags),
            )
            .where(Post.id == post_id)
        )
        res = await self.session.execute(stmt)
        return res.scalars().first()

    async def get_feed_posts(
        self,
        sport: Optional[str] = None,
        achievement_type: Optional[str] = None,
        post_type: Optional[str] = None,
        sort_by: str = "latest",  # latest, trending
        skip: int = 0,
        limit: int = 20,
        include_drafts: bool = False,
        user_id: Optional[uuid.UUID] = None,
        author_id: Optional[uuid.UUID] = None,
    ) -> Tuple[List[Post], int]:
        """
        Fetch feed posts with optional filters, eagerly loading user, media & hashtags.
        Returns (posts, total_count).
        """
        query = select(Post).options(
            joinedload(Post.user),
            selectinload(Post.media),
            selectinload(Post.hashtags),
        )

        if not include_drafts:
            query = query.where(Post.is_draft == False)
        elif user_id:
            query = query.where(or_(Post.is_draft == False, Post.user_id == user_id))

        if author_id:
            query = query.where(Post.user_id == author_id)

        if sport:
            query = query.where(Post.sport == sport)

        if achievement_type:
            query = query.where(Post.achievement_type == achievement_type)

        if post_type:
            query = query.where(Post.post_type == post_type)

        # Count total matching query
        count_query = select(func.count()).select_from(query.subquery())
        count_res = await self.session.execute(count_query)
        total = count_res.scalar() or 0

        # Sorting
        if sort_by == "trending":
            # Trending sort by like & comment counts
            sub_likes = select(Like.post_id, func.count(Like.id).label("l_cnt")).group_by(Like.post_id).subquery()
            sub_comments = select(Comment.post_id, func.count(Comment.id).label("c_cnt")).group_by(Comment.post_id).subquery()

            query = (
                query.outerjoin(sub_likes, Post.id == sub_likes.c.post_id)
                .outerjoin(sub_comments, Post.id == sub_comments.c.post_id)
                .order_by(
                    desc(func.coalesce(sub_likes.c.l_cnt, 0) + func.coalesce(sub_comments.c.c_cnt, 0) * 2),
                    desc(Post.created_at)
                )
            )
        else:
            query = query.order_by(desc(Post.created_at))

        query = query.offset(skip).limit(limit)
        res = await self.session.execute(query)
        posts = list(res.scalars().all())

        return posts, total

    async def get_likes_count(self, post_id: uuid.UUID) -> int:
        stmt = select(func.count()).select_from(Like).where(Like.post_id == post_id)
        res = await self.session.execute(stmt)
        return res.scalar() or 0

    async def get_comments_count(self, post_id: uuid.UUID) -> int:
        stmt = select(func.count()).select_from(Comment).where(Comment.post_id == post_id)
        res = await self.session.execute(stmt)
        return res.scalar() or 0

    async def is_liked_by_user(self, post_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        stmt = select(func.count()).select_from(Like).where(
            and_(Like.post_id == post_id, Like.user_id == user_id)
        )
        res = await self.session.execute(stmt)
        return (res.scalar() or 0) > 0

    async def is_saved_by_user(self, post_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        stmt = select(func.count()).select_from(SavedPost).where(
            and_(SavedPost.post_id == post_id, SavedPost.user_id == user_id)
        )
        res = await self.session.execute(stmt)
        return (res.scalar() or 0) > 0
