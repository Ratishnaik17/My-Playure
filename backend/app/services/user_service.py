import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserResponse, SuggestedPlayerResponse
from app.core.exceptions import EntityNotFoundException


class UserService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.user_repo = UserRepository(session)

    async def get_user(self, user_id: uuid.UUID) -> UserResponse:
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise EntityNotFoundException("User", str(user_id))
        return UserResponse.model_validate(user)

    async def get_suggested_players(
        self, current_user_id: uuid.UUID, sport: Optional[str] = None, limit: int = 5
    ) -> List[SuggestedPlayerResponse]:
        current_user = await self.user_repo.get_by_id(current_user_id)
        target_sport = sport or (current_user.sport if current_user else None)
        target_state = current_user.state if current_user else None

        results = await self.user_repo.get_suggested_athletes(
            current_user_id=current_user_id,
            sport=target_sport,
            state=target_state,
            limit=limit,
        )

        suggestions = []
        for user, mutual_count in results:
            reason = f"Top Athlete in {user.sport}"
            if target_sport and user.sport == target_sport:
                reason = f"Plays {user.sport}"
            if target_state and user.state == target_state:
                reason = f"Based in {user.state}"

            suggestions.append(
                SuggestedPlayerResponse(
                    id=user.id,
                    full_name=user.full_name,
                    username=user.username,
                    profile_image=user.profile_image,
                    role=user.role,
                    sport=user.sport,
                    state=user.state,
                    city=user.city,
                    verified=user.verified,
                    followers_count=user.followers_count,
                    mutual_connections_count=mutual_count,
                    recommendation_reason=reason,
                )
            )

        return suggestions
