import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.services.sidebar_service import SidebarService
from app.schemas.sidebar import SidebarUserSummary
from app.core.security import get_current_user_id

router = APIRouter()


@router.get("/home/sidebar", response_model=SidebarUserSummary, summary="Get user left sidebar summary stats")
async def get_left_sidebar(
    db: AsyncSession = Depends(get_db),
    current_user_id: uuid.UUID = Depends(get_current_user_id),
):
    service = SidebarService(db)
    return await service.get_sidebar_summary(user_id=current_user_id)
