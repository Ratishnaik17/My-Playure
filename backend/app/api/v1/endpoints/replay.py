import uuid
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.services.replay_service import RePlayService
from app.schemas.replay import RePlayListingCreate, RePlayListingResponse
from app.core.security import get_current_user_id

router = APIRouter(prefix="/replay", tags=["RePlay Marketplace"])


@router.get("/listings", response_model=List[RePlayListingResponse], summary="Get all marketplace listings")
async def get_all_listings(
    db: AsyncSession = Depends(get_db),
):
    service = RePlayService(db)
    return await service.get_all_listings()


@router.post("/listings", response_model=RePlayListingResponse, status_code=status.HTTP_201_CREATED, summary="Create a new marketplace listing")
async def create_listing(
    listing_data: RePlayListingCreate,
    db: AsyncSession = Depends(get_db),
    current_user_id: uuid.UUID = Depends(get_current_user_id),
):
    service = RePlayService(db)
    return await service.create_listing(user_id=current_user_id, listing_in=listing_data)
