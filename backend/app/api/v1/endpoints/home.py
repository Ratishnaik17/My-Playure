import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.services.home_service import HomeService
from app.schemas.home import HomeResponse
from app.core.security import get_current_user_id

router = APIRouter()


@router.get("/home", response_model=HomeResponse, summary="Get aggregated homepage data in a single API call")
async def get_homepage(
    db: AsyncSession = Depends(get_db),
    current_user_id: uuid.UUID = Depends(get_current_user_id),
):
    service = HomeService(db)
    return await service.get_home_page_data(user_id=current_user_id)
