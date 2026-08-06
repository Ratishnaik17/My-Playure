import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.services.like_service import LikeService
from app.schemas.like import LikeCountResponse
from app.core.security import get_current_user_id

router = APIRouter()


@router.post("/posts/{id}/like", response_model=LikeCountResponse, summary="Like a post")
async def like_post(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user_id: uuid.UUID = Depends(get_current_user_id),
):
    service = LikeService(db)
    return await service.like_post(post_id=id, user_id=current_user_id)


@router.delete("/posts/{id}/like", response_model=LikeCountResponse, summary="Unlike a post")
async def unlike_post(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user_id: uuid.UUID = Depends(get_current_user_id),
):
    service = LikeService(db)
    return await service.unlike_post(post_id=id, user_id=current_user_id)
