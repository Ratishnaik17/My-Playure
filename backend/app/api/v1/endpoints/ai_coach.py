from typing import Optional, Dict, Any
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_coach_engine import process_ai_sports_query, build_resume, llm

router = APIRouter(prefix="/ai", tags=["AI Coach"])


class AIChatRequest(BaseModel):
    message: str
    category: Optional[str] = "general"
    user_data: Optional[Dict[str, Any]] = None
    resume_data: Optional[Dict[str, Any]] = None


@router.post("/chat")
def ai_coach_chat(req: AIChatRequest):
    result = process_ai_sports_query(
        query=req.message,
        category=req.category,
        user_data=req.user_data,
        resume_data=req.resume_data,
    )
    return result


@router.post("/resume")
def ai_sports_resume(resume_data: Dict[str, Any]):
    result = build_resume(llm, {"resume_data": resume_data})
    return {
        "status": "success",
        "ats_score": result.get("ats"),
        "suggestions": result.get("suggestions"),
        "resume": result.get("resume"),
        "docx": result.get("docx"),
        "pdf": result.get("pdf"),
    }
