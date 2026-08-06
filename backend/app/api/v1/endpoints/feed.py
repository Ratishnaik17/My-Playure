import uuid
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.services.feed_service import FeedService
from app.schemas.post import PostResponse
from app.schemas.common import PaginatedResponse
from app.core.security import get_optional_user_id

router = APIRouter()


@router.get("/feed", response_model=PaginatedResponse[PostResponse], summary="Fetch homepage feed posts")
async def get_feed(
    sport: Optional[str] = Query(None, description="Filter posts by sport"),
    achievement_type: Optional[str] = Query(None, description="Filter posts by achievement type"),
    post_type: Optional[str] = Query(None, description="Filter by post type (normal, achievement, tournament, check_in)"),
    sort_by: str = Query("latest", description="Sort order: 'latest' or 'trending'"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
    current_user_id: Optional[uuid.UUID] = Depends(get_optional_user_id),
):
    service = FeedService(db)
    return await service.get_feed(
        sport=sport,
        achievement_type=achievement_type,
        post_type=post_type,
        sort_by=sort_by,
        page=page,
        limit=limit,
        current_user_id=current_user_id,
    )
