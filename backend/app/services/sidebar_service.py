import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.schemas.sidebar import SidebarUserSummary
from app.core.exceptions import EntityNotFoundException


class SidebarService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.user_repo = UserRepository(session)

    async def get_sidebar_summary(self, user_id: uuid.UUID) -> SidebarUserSummary:
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise EntityNotFoundException("User", str(user_id))

        saved_count = await self.user_repo.get_saved_posts_count(user_id)

        return SidebarUserSummary(
            id=user.id,
            full_name=user.full_name,
            username=user.username,
            profile_image=user.profile_image,
            cover_image=user.cover_image,
            role=user.role,
            sport=user.sport,
            state=user.state,
            city=user.city,
            verified=user.verified,
            followers_count=user.followers_count,
            following_count=user.following_count,
            profile_views=user.profile_views,
            saved_posts_count=saved_count,
        )
