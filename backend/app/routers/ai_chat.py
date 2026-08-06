from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
def ai_sports_chat(req: ChatRequest):
    return {
        "status": "success",
        "reply": f"Playure AI Sports Coach: I received your question: '{req.message}'. FastAPI backend AI endpoint ready!"
    }
