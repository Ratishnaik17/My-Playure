from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.services.trending_service import TrendingService
from app.schemas.trending import TrendingResponse

router = APIRouter()


@router.get("/trending", response_model=TrendingResponse, summary="Get trending hashtags and sports")
async def get_trending(
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    service = TrendingService(db)
    return await service.get_trending(limit=limit)
