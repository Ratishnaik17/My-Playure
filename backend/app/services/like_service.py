import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.like import Like
from app.repositories.like_repository import LikeRepository
from app.repositories.post_repository import PostRepository
from app.schemas.like import LikeCountResponse
from app.core.exceptions import EntityNotFoundException, BadRequestException


class LikeService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.like_repo = LikeRepository(session)
        self.post_repo = PostRepository(session)

    async def like_post(self, post_id: uuid.UUID, user_id: uuid.UUID) -> LikeCountResponse:
        post = await self.post_repo.get_by_id(post_id)
        if not post:
            raise EntityNotFoundException("Post", str(post_id))

        existing = await self.like_repo.get_like(post_id=post_id, user_id=user_id)
        if not existing:
            new_like = Like(post_id=post_id, user_id=user_id)
            await self.like_repo.create(new_like)

        total_likes = await self.post_repo.get_likes_count(post_id)
        return LikeCountResponse(
            post_id=post_id,
            total_likes=total_likes,
            is_liked_by_me=True,
        )

    async def unlike_post(self, post_id: uuid.UUID, user_id: uuid.UUID) -> LikeCountResponse:
        post = await self.post_repo.get_by_id(post_id)
        if not post:
            raise EntityNotFoundException("Post", str(post_id))

        await self.like_repo.delete_like(post_id=post_id, user_id=user_id)
        total_likes = await self.post_repo.get_likes_count(post_id)
        return LikeCountResponse(
            post_id=post_id,
            total_likes=total_likes,
            is_liked_by_me=False,
        )
