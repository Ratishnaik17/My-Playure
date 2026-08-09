from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/notifications", tags=["Real-Time Notifications"])

# Initial mock notifications dataset representing rich platform events
MOCK_NOTIFICATIONS = [
    {
        "id": 1,
        "type": "registration_approved",
        "category": "competitions",
        "title": "Registration Approved! 🏆",
        "message": "Your registration for Maharashtra State Athletics Championship 2026 has been approved by the tournament director.",
        "icon": "trophy",
        "image": "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=100&auto=format&fit=crop&q=80",
        "action_url": "competitions",
        "priority": "high",
        "is_read": False,
        "time_ago": "2 mins ago"
    },
    {
        "id": 2,
        "type": "new_message",
        "category": "messages",
        "title": "New Direct Message 💬",
        "message": "Neeraj Chopra: 'Looking forward to the state trials next week! Keep pushing hard.'",
        "icon": "chat",
        "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
        "action_url": "messages",
        "priority": "medium",
        "is_read": False,
        "time_ago": "15 mins ago"
    },
    {
        "id": 3,
        "type": "ai_report_ready",
        "category": "ai_coach",
        "title": "Weekly Progress Report Ready 🤖",
        "message": "Your AI Coach has compiled your Zone 2 cardio & 1RM power metrics for this micro-cycle.",
        "icon": "smart_toy",
        "image": None,
        "action_url": "ai_coach",
        "priority": "medium",
        "is_read": False,
        "time_ago": "1 hour ago"
    },
    {
        "id": 4,
        "type": "team_invitation",
        "category": "social",
        "title": "Team Collaboration Invite 👥",
        "message": "Rahul Dravid invited you to join 'India Elite Athletics Squad' as a Javelin Specialist.",
        "icon": "groups",
        "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
        "action_url": "collaboration",
        "priority": "medium",
        "is_read": True,
        "time_ago": "3 hours ago"
    },
    {
        "id": 5,
        "type": "match_schedule",
        "category": "competitions",
        "title": "Match Schedule Released 📅",
        "message": "Your Quarter-Final match is scheduled for Court 4 tomorrow at 5:00 PM.",
        "icon": "event_available",
        "image": None,
        "action_url": "competitions",
        "priority": "high",
        "is_read": True,
        "time_ago": "Yesterday"
    },
    {
        "id": 6,
        "type": "security_alert",
        "category": "system",
        "title": "Security Alert 🔒",
        "message": "New sign-in detected from Chrome on Windows in Mumbai, MH.",
        "icon": "security",
        "image": None,
        "action_url": "settings",
        "priority": "high",
        "is_read": True,
        "time_ago": "2 days ago"
    }
]

MOCK_PREFERENCES = {
    "competitions": True,
    "messages": True,
    "social": True,
    "ai_coach": True,
    "system": True,
    "email_enabled": True,
    "push_enabled": True,
    "sms_enabled": False
}


class NotificationPreferenceUpdate(BaseModel):
    competitions: Optional[bool] = None
    messages: Optional[bool] = None
    social: Optional[bool] = None
    ai_coach: Optional[bool] = None
    system: Optional[bool] = None
    email_enabled: Optional[bool] = None
    push_enabled: Optional[bool] = None
    sms_enabled: Optional[bool] = None


@router.get("/")
def get_notifications(
    category: Optional[str] = None, 
    query: Optional[str] = None, 
    unread_only: bool = False
):
    """Fetch user notifications with category filtering and keyword search"""
    items = MOCK_NOTIFICATIONS

    if unread_only:
        items = [n for n in items if not n["is_read"]]

    if category and category.lower() != "all":
        items = [n for n in items if n["category"].lower() == category.lower()]

    if query:
        q = query.lower()
        items = [n for n in items if q in n["title"].lower() or q in n["message"].lower()]

    unread_count = sum(1 for n in MOCK_NOTIFICATIONS if not n["is_read"])
    return {
        "notifications": items,
        "unread_count": unread_count,
        "total": len(items)
    }


@router.get("/unread")
def get_unread_notifications():
    """Fetch unread notifications only"""
    unread = [n for n in MOCK_NOTIFICATIONS if not n["is_read"]]
    return {"notifications": unread, "count": len(unread)}


@router.get("/count")
def get_unread_count():
    """Get total unread notification count for Navbar badge"""
    unread_count = sum(1 for n in MOCK_NOTIFICATIONS if not n["is_read"])
    return {"unread_count": unread_count}


@router.patch("/{notification_id}/read")
def mark_notification_read(notification_id: int):
    """Mark single notification as read"""
    for n in MOCK_NOTIFICATIONS:
        if n["id"] == notification_id:
            n["is_read"] = True
            break
            
    unread_count = sum(1 for n in MOCK_NOTIFICATIONS if not n["is_read"])
    return {"status": "success", "notification_id": notification_id, "unread_count": unread_count}


@router.patch("/read-all")
def mark_all_notifications_read():
    """Mark all notifications as read"""
    for n in MOCK_NOTIFICATIONS:
        n["is_read"] = True
        
    return {"status": "success", "unread_count": 0}


@router.delete("/{notification_id}")
def delete_notification(notification_id: int):
    """Delete a notification"""
    global MOCK_NOTIFICATIONS
    MOCK_NOTIFICATIONS = [n for n in MOCK_NOTIFICATIONS if n["id"] != notification_id]
    unread_count = sum(1 for n in MOCK_NOTIFICATIONS if not n["is_read"])
    return {"status": "success", "unread_count": unread_count}


@router.get("/preferences")
def get_notification_preferences():
    """Fetch user notification preferences settings"""
    return {"preferences": MOCK_PREFERENCES}


@router.patch("/preferences")
def update_notification_preferences(update: NotificationPreferenceUpdate):
    """Update notification preferences settings"""
    for key, value in update.model_dump(exclude_unset=True).items():
        if key in MOCK_PREFERENCES:
            MOCK_PREFERENCES[key] = value
            
    return {"status": "success", "preferences": MOCK_PREFERENCES}
