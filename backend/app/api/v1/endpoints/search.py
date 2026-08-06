from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.services.search_service import SearchService
from app.schemas.search import SearchResult

router = APIRouter()


@router.get("/search", response_model=SearchResult, summary="Global search across players, coaches, clubs, academies, competitions")
async def search(
    q: str = Query(..., min_length=1, description="Search keyword"),
    sport: Optional[str] = Query(None, description="Optional sport filter"),
    limit: int = Query(10, ge=1, le=50, description="Max results per category"),
    db: AsyncSession = Depends(get_db),
):
    service = SearchService(db)
    return await service.search(query=q, sport=sport, limit=limit)
