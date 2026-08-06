import re
import uuid
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.post import Post, PostMedia
from app.models.hashtag import Hashtag, PostHashtag
from app.repositories.post_repository import PostRepository
from app.repositories.user_repository import UserRepository
from app.schemas.post import PostCreate, PostUpdate, PostResponse, PostMediaResponse
from app.schemas.user import UserResponse
from app.core.exceptions import EntityNotFoundException, ForbiddenException


class PostService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.post_repo = PostRepository(session)
        self.user_repo = UserRepository(session)

    async def _extract_and_link_hashtags(self, post: Post, content: str):
        tags = set(re.findall(r"#(\w+)", content))
        for tag in tags:
            tag_name = tag.lower()
            stmt = select(Hashtag).where(Hashtag.name == tag_name)
            res = await self.session.execute(stmt)
            hashtag_obj = res.scalars().first()

            if not hashtag_obj:
                hashtag_obj = Hashtag(name=tag_name)
                self.session.add(hashtag_obj)
                await self.session.flush()

            post_hashtag = PostHashtag(post_id=post.id, hashtag_id=hashtag_obj.id)
            self.session.add(post_hashtag)

    async def create_post(self, user_id: uuid.UUID, post_data: PostCreate) -> PostResponse:
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            from app.models.user import User
            user = User(
                id=user_id,
                full_name="Ratish Naik",
                username="ratish_naik",
                email="ratish@playure.com",
                profile_image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                bio="State-level athlete competing across India.",
                role="athlete",
                sport="Cricket",
                state="Karnataka",
                city="Bengaluru",
                verified=True,
            )
            self.session.add(user)
            await self.session.flush()

        new_post = Post(
            user_id=user_id,
            content=post_data.content,
            post_type=post_data.post_type,
            sport=post_data.sport or user.sport,
            achievement_type=post_data.achievement_type,
            visibility=post_data.visibility,
            location=post_data.location,
            is_draft=post_data.is_draft,
        )
        self.session.add(new_post)
        await self.session.flush()

        # Add media
        for idx, m in enumerate(post_data.media):
            media_item = PostMedia(
                post_id=new_post.id,
                media_type=m.media_type,
                media_url=m.media_url,
                sort_order=m.sort_order if m.sort_order is not None else idx,
            )
            self.session.add(media_item)

        # Extract hashtags
        await self._extract_and_link_hashtags(new_post, post_data.content)

        await self.session.commit()
        return await self.get_post_by_id(new_post.id, current_user_id=user_id)

    async def get_post_by_id(
        self, post_id: uuid.UUID, current_user_id: Optional[uuid.UUID] = None
    ) -> PostResponse:
        post = await self.post_repo.get_post_with_details(post_id)
        if not post:
            raise EntityNotFoundException("Post", str(post_id))

        likes_count = await self.post_repo.get_likes_count(post.id)
        comments_count = await self.post_repo.get_comments_count(post.id)

        is_liked = False
        is_saved = False
        if current_user_id:
            is_liked = await self.post_repo.is_liked_by_user(post.id, current_user_id)
            is_saved = await self.post_repo.is_saved_by_user(post.id, current_user_id)

        media_responses = [
            PostMediaResponse.model_validate(m) for m in post.media
        ]
        hashtag_names = [h.name for h in post.hashtags]

        return PostResponse(
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
            likes_count=likes_count,
            comments_count=comments_count,
            is_liked_by_me=is_liked,
            is_saved_by_me=is_saved,
            hashtags=hashtag_names,
        )

    async def update_post(
        self, post_id: uuid.UUID, user_id: uuid.UUID, update_data: PostUpdate
    ) -> PostResponse:
        post = await self.post_repo.get_by_id(post_id)
        if not post:
            raise EntityNotFoundException("Post", str(post_id))

        if post.user_id != user_id:
            raise ForbiddenException("You cannot edit another user's post.")

        update_dict = update_data.model_dump(exclude_unset=True)
        updated_post = await self.post_repo.update(post, update_dict)
        return await self.get_post_by_id(updated_post.id, current_user_id=user_id)

    async def delete_post(self, post_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        post = await self.post_repo.get_by_id(post_id)
        if not post:
            raise EntityNotFoundException("Post", str(post_id))

        if post.user_id != user_id:
            raise ForbiddenException("You cannot delete another user's post.")

        return await self.post_repo.delete(post_id)
