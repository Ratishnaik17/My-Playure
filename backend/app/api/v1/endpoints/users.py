import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from app.database.session import get_db
from app.services.user_service import UserService
from app.schemas.user import SuggestedPlayerResponse
from app.core.security import get_current_user_id

router = APIRouter()


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    bio: Optional[str] = None


@router.get("/users/suggestions", response_model=List[SuggestedPlayerResponse], summary="Get suggested athletes for networking")
async def get_suggested_users(
    sport: Optional[str] = Query(None, description="Sport filter"),
    limit: int = Query(5, ge=1, le=20, description="Max suggestions count"),
    db: AsyncSession = Depends(get_db),
    current_user_id: uuid.UUID = Depends(get_current_user_id),
):
    service = UserService(db)
    return await service.get_suggested_players(
        current_user_id=current_user_id, sport=sport, limit=limit
    )


@router.get("/users/me", summary="Get current user details")
async def get_my_profile(
    db: AsyncSession = Depends(get_db),
    current_user_id: uuid.UUID = Depends(get_current_user_id),
):
    service = UserService(db)
    user = await service.user_repo.get_by_id(current_user_id)
    if not user:
        # Auto-create default user matching profile info
        from app.models.user import User
        user = User(
            id=current_user_id,
            full_name="Arjun Mehta",
            username="arjunmehta",
            email="arjun@playure.com",
            role="Professional Cricketer",
            sport="Cricket",
            city="Bengaluru",
            state="India",
            bio='{"about": "Passionate cricketer with 8+ years of experience in competitive cricket. Represented Mumbai in Ranji Trophy and currently playing in the Premier League. Focused on continuous improvement and team success.", "website": "playure.com/arjunmehta", "attributes": ["Right Hand Batsman", "Right Arm Off Break", "All Rounder"]}'
        )
        await service.user_repo.create(user)
    return {
        "id": user.id,
        "full_name": user.full_name,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "sport": user.sport,
        "city": user.city,
        "state": user.state,
        "bio": user.bio
    }


@router.put("/users/me", summary="Update current user details")
async def update_my_profile(
    update_data: UserProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user_id: uuid.UUID = Depends(get_current_user_id),
):
    service = UserService(db)
    user = await service.user_repo.get_by_id(current_user_id)
    if not user:
        from app.models.user import User
        user = User(
            id=current_user_id,
            full_name="Arjun Mehta",
            username="arjunmehta",
            email="arjun@playure.com",
            role="Professional Cricketer",
            sport="Cricket",
            city="Bengaluru",
            state="India",
            bio='{"about": "Passionate cricketer with 8+ years of experience in competitive cricket. Represented Mumbai in Ranji Trophy and currently playing in the Premier League. Focused on continuous improvement and team success.", "website": "playure.com/arjunmehta", "attributes": ["Right Hand Batsman", "Right Arm Off Break", "All Rounder"]}'
        )
        user = await service.user_repo.create(user)
    
    update_dict = update_data.model_dump(exclude_unset=True)
    await service.user_repo.update(user, update_dict)
    return {
        "status": "success",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "sport": user.sport,
            "city": user.city,
            "state": user.state,
            "bio": user.bio
        }
    }
