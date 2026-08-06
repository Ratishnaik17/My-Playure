from typing import List
from pydantic import BaseModel


class QuickActionItem(BaseModel):
    id: str
    label: str
    action_type: str


class AIAssistantCardResponse(BaseModel):
    title: str = "Playure AI Coach"
    subtitle: str = "Ask for performance analysis, training routines, or match tactics"
    suggested_prompts: List[str]
    recent_chats_count: int = 0
    quick_actions: List[QuickActionItem]
