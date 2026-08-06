import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.services.user_service import UserService
from app.schemas.user import SuggestedPlayerResponse
from app.core.security import get_current_user_id

router = APIRouter()


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
