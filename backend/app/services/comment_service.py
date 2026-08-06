import uuid
from typing import List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.comment import Comment
from app.repositories.comment_repository import CommentRepository
from app.repositories.post_repository import PostRepository
from app.repositories.user_repository import UserRepository
from app.schemas.comment import CommentCreate, CommentResponse
from app.schemas.user import UserResponse
from app.core.exceptions import EntityNotFoundException, ForbiddenException, BadRequestException


class CommentService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.comment_repo = CommentRepository(session)
        self.post_repo = PostRepository(session)
        self.user_repo = UserRepository(session)

    def _map_comment(self, comment: Comment) -> CommentResponse:
        raw_replies = comment.__dict__.get("replies", [])
        replies_mapped = [self._map_comment(r) for r in raw_replies] if raw_replies else []
        user_obj = comment.__dict__.get("user") or comment.user
        return CommentResponse(
            id=comment.id,
            post_id=comment.post_id,
            user_id=comment.user_id,
            user=UserResponse.model_validate(user_obj),
            parent_comment_id=comment.parent_comment_id,
            comment=comment.comment,
            created_at=comment.created_at,
            replies=replies_mapped,
        )

    async def get_comments(
        self, post_id: uuid.UUID, page: int = 1, limit: int = 20
    ) -> Tuple[List[CommentResponse], int]:
        post = await self.post_repo.get_by_id(post_id)
        if not post:
            raise EntityNotFoundException("Post", str(post_id))

        skip = (page - 1) * limit
        comments, total = await self.comment_repo.get_comments_for_post(
            post_id=post_id, skip=skip, limit=limit
        )

        mapped_comments = [self._map_comment(c) for c in comments]
        return mapped_comments, total

    async def add_comment(
        self, post_id: uuid.UUID, user_id: uuid.UUID, comment_data: CommentCreate
    ) -> CommentResponse:
        post = await self.post_repo.get_by_id(post_id)
        if not post:
            raise EntityNotFoundException("Post", str(post_id))

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

        if comment_data.parent_comment_id:
            parent = await self.comment_repo.get_by_id(comment_data.parent_comment_id)
            if not parent:
                raise EntityNotFoundException("Parent Comment", str(comment_data.parent_comment_id))
            if parent.post_id != post_id:
                raise BadRequestException("Parent comment does not belong to this post.")

        new_comment = Comment(
            post_id=post_id,
            user_id=user_id,
            parent_comment_id=comment_data.parent_comment_id,
            comment=comment_data.comment,
        )
        saved_comment = await self.comment_repo.create(new_comment)
        full_comment = await self.comment_repo.get_comment_with_user(saved_comment.id)
        return self._map_comment(full_comment)

    async def delete_comment(self, comment_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        comment = await self.comment_repo.get_by_id(comment_id)
        if not comment:
            raise EntityNotFoundException("Comment", str(comment_id))

        if comment.user_id != user_id:
            raise ForbiddenException("You cannot delete another user's comment.")

        return await self.comment_repo.delete(comment_id)
