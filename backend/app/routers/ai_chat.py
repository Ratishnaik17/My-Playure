from typing import Optional, Dict, Any
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_coach_engine import process_ai_sports_query

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    category: Optional[str] = "general"
    user_data: Optional[Dict[str, Any]] = None
    resume_data: Optional[Dict[str, Any]] = None


@router.post("/chat")
def ai_sports_chat(req: ChatRequest):
    return process_ai_sports_query(
        query=req.message,
        category=req.category,
        user_data=req.user_data,
        resume_data=req.resume_data,
    )
