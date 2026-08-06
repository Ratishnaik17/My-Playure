from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.services.competition_service import CompetitionService
from app.schemas.competition import CompetitionResponse, CompetitionCreate

router = APIRouter()


@router.get("/competitions/upcoming", response_model=List[CompetitionResponse], summary="Fetch upcoming competitions")
async def get_upcoming_competitions(
    sport: Optional[str] = Query(None, description="Filter competitions by sport"),
    limit: int = Query(10, ge=1, le=50, description="Limit count"),
    db: AsyncSession = Depends(get_db),
):
    service = CompetitionService(db)
    return await service.get_upcoming_competitions(sport=sport, limit=limit)


@router.post("/competitions", response_model=CompetitionResponse, status_code=status.HTTP_201_CREATED, summary="Create a new competition")
async def create_competition(
    comp_in: CompetitionCreate,
    db: AsyncSession = Depends(get_db),
):
    service = CompetitionService(db)
    return await service.create_competition(comp_in)

