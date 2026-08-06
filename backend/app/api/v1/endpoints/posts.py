import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.services.post_service import PostService
from app.schemas.post import PostCreate, PostUpdate, PostResponse, PostMediaCreate
from app.schemas.common import StatusResponse
from app.core.security import get_current_user_id, get_optional_user_id
from app.utils.upload import save_upload_file, determine_media_type

router = APIRouter()


@router.post("/posts", response_model=PostResponse, status_code=status.HTTP_201_CREATED, summary="Create a new post")
async def create_post(
    post_data: PostCreate,
    db: AsyncSession = Depends(get_db),
    current_user_id: uuid.UUID = Depends(get_current_user_id),
):
    service = PostService(db)
    return await service.create_post(user_id=current_user_id, post_data=post_data)


@router.post("/posts/upload-media", response_model=List[PostMediaCreate], summary="Upload multiple images/videos for a post")
async def upload_post_media(
    files: List[UploadFile] = File(...),
):
    media_items = []
    for idx, f in enumerate(files):
        url = save_upload_file(f)
        m_type = determine_media_type(f.filename or "")
        media_items.append(
            PostMediaCreate(
                media_type=m_type,
                media_url=url,
                sort_order=idx,
            )
        )
    return media_items


@router.get("/posts/{id}", response_model=PostResponse, summary="Get post by ID")
async def get_post(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user_id: Optional[uuid.UUID] = Depends(get_optional_user_id),
):
    service = PostService(db)
    return await service.get_post_by_id(post_id=id, current_user_id=current_user_id)


@router.put("/posts/{id}", response_model=PostResponse, summary="Update post by ID")
async def update_post(
    id: uuid.UUID,
    update_data: PostUpdate,
    db: AsyncSession = Depends(get_db),
    current_user_id: uuid.UUID = Depends(get_current_user_id),
):
    service = PostService(db)
    return await service.update_post(post_id=id, user_id=current_user_id, update_data=update_data)


@router.delete("/posts/{id}", response_model=StatusResponse, summary="Delete post by ID")
async def delete_post(
    id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user_id: uuid.UUID = Depends(get_current_user_id),
):
    service = PostService(db)
    success = await service.delete_post(post_id=id, user_id=current_user_id)
    return StatusResponse(
        success=success,
        message="Post deleted successfully." if success else "Failed to delete post."
    )
