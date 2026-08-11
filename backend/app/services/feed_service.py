import math
import uuid
from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.post_repository import PostRepository
from app.schemas.post import PostResponse, PostMediaResponse
from app.schemas.user import UserResponse
from app.schemas.common import PaginatedResponse, PaginationMeta


class FeedService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.post_repo = PostRepository(session)

    async def get_feed(
        self,
        author_id: Optional[uuid.UUID] = None,
        sport: Optional[str] = None,
        achievement_type: Optional[str] = None,
        post_type: Optional[str] = None,
        sort_by: str = "latest",
        page: int = 1,
        limit: int = 20,
        current_user_id: Optional[uuid.UUID] = None,
    ) -> PaginatedResponse[PostResponse]:
        skip = (page - 1) * limit
        posts, total = await self.post_repo.get_feed_posts(
            sport=sport,
            achievement_type=achievement_type,
            post_type=post_type,
            sort_by=sort_by,
            skip=skip,
            limit=limit,
            user_id=current_user_id,
            author_id=author_id,
        )

        item_responses: List[PostResponse] = []
        for post in posts:
            likes_cnt = await self.post_repo.get_likes_count(post.id)
            comments_cnt = await self.post_repo.get_comments_count(post.id)
            is_liked = False
            is_saved = False
            if current_user_id:
                is_liked = await self.post_repo.is_liked_by_user(post.id, current_user_id)
                is_saved = await self.post_repo.is_saved_by_user(post.id, current_user_id)

            media_responses = [PostMediaResponse.model_validate(m) for m in post.media]
            hashtag_names = [h.name for h in post.hashtags]

            item_responses.append(
                PostResponse(
                    id=post.id,
                    user_id=post.user_id,
                    user=UserResponse.model_validate(post.user),
                    content=post.content,
                    post_type=post.post_type,
                    sport=post.sport,
                    achievement_type=post.achievement_type,
                    visibility=post.visibility,
                    location=post.location,
                    is_draft=post.is_draft,
                    created_at=post.created_at,
                    updated_at=post.updated_at,
                    media=media_responses,
                    likes_count=likes_cnt,
                    comments_count=comments_cnt,
                    is_liked_by_me=is_liked,
                    is_saved_by_me=is_saved,
                    hashtags=hashtag_names,
                )
            )

        total_pages = math.ceil(total / limit) if limit > 0 else 1
        meta = PaginationMeta(
            total=total,
            page=page,
            limit=limit,
            has_next=page < total_pages,
            has_previous=page > 1,
        )

        return PaginatedResponse[PostResponse](items=item_responses, meta=meta)
