import uuid
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.services.comment_service import CommentService
from app.schemas.comment import CommentCreate, CommentResponse
from app.schemas.common import PaginatedResponse, PaginationMeta, StatusResponse
from app.core.security import get_current_user_id

router = APIRouter()


@router.get("/posts/{id}/comments", response_model=PaginatedResponse[CommentResponse], summary="List comments for a post")
async def list_comments(
    id: uuid.UUID,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    service = CommentService(db)
    items, total = await service.get_comments(post_id=id, page=page, limit=limit)
    meta = PaginationMeta(
        total=total,
        page=page,
        limit=limit,
        has_next=(page * limit) < total,
        has_previous=page > 1,
    )
    return PaginatedResponse[CommentResponse](items=items, meta=meta)


@router.post("/posts/{id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED, summary="Add comment or nested reply to a post")
async def add_comment(
    id: uuid.UUID,
    comment_data: CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user_id: uuid.UUID = Depends(get_current_user_id),
):
    service = CommentService(db)
    return await service.add_comment(post_id=id, user_id=current_user_id, comment_data=comment_data)


@router.delete("/comments/{id}", response_model=StatusResponse, summary="Delete own comment")
async def delete_comment(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user_id: uuid.UUID = Depends(get_current_user_id),
):
    service = CommentService(db)
    success = await service.delete_comment(comment_id=id, user_id=current_user_id)
    return StatusResponse(
        success=success,
        message="Comment deleted successfully." if success else "Failed to delete comment."
    )
