from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class PostCreate(BaseModel):
    authorName: str
    authorAvatar: str
    sport: str
    text: str
    postType: Optional[str] = "General"
    imageUrl: Optional[str] = None

@router.get("/")
def get_posts():
    return {
        "status": "success",
        "message": "Posts endpoint ready",
        "posts": []
    }

@router.post("/")
def create_post(post: PostCreate):
    return {
        "status": "success",
        "message": "Post created successfully",
        "post": post.dict()
    }
