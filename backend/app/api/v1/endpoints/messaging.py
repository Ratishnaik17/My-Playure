from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import os
import uuid

router = APIRouter(prefix="/messaging", tags=["Real-Time Messaging"])

# In-memory realtime state fallback for live simulation
TYPING_STATES = {}
ONLINE_USERS = {
    "1": {"online": True, "last_seen": "Online"},
    "2": {"online": True, "last_seen": "Online"},
    "3": {"online": False, "last_seen": "Today at 09:30 AM"},
    "4": {"online": True, "last_seen": "Online"},
    "5": {"online": False, "last_seen": "Yesterday at 11:15 PM"},
}

# Initial rich mock conversation store
MOCK_CONVERSATIONS = [
    {
        "id": 1,
        "recipient": {
            "id": 2,
            "name": "Neeraj Chopra",
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
            "role": "Olympic Gold Medalist • Javelin",
            "online": True,
            "last_seen": "Online"
        },
        "last_message": "Looking forward to the state trials next week! Keep pushing hard.",
        "timestamp": "10:42 AM",
        "unread_count": 2,
        "is_typing": False
    },
    {
        "id": 2,
        "recipient": {
            "id": 3,
            "name": "Rahul Dravid",
            "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
            "role": "Head Coach • India Cricket",
            "online": False,
            "last_seen": "Today at 09:30 AM"
        },
        "last_message": "Reviewed your batting technique video. Great footwork on the cover drive!",
        "timestamp": "Yesterday",
        "unread_count": 0,
        "is_typing": False
    },
    {
        "id": 3,
        "recipient": {
            "id": 4,
            "name": "Sneha Reddy",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            "role": "Sports Physio & Nutritionist",
            "online": True,
            "last_seen": "Online"
        },
        "last_message": "Here is your customized Zone 2 recovery plan PDF.",
        "timestamp": "2 days ago",
        "unread_count": 0,
        "is_typing": False
    },
    {
        "id": 4,
        "recipient": {
            "id": 5,
            "name": "Vikram Singh",
            "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
            "role": "Badminton Club Manager",
            "online": False,
            "last_seen": "Yesterday at 11:15 PM"
        },
        "last_message": "Court 4 is reserved for your match at 5 PM tomorrow.",
        "timestamp": "Aug 4",
        "unread_count": 0,
        "is_typing": False
    }
]

MOCK_MESSAGES = {
    1: [
        {
            "id": "m-1",
            "conversation_id": 1,
            "sender_id": 2,
            "sender_name": "Neeraj Chopra",
            "sender_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
            "text": "Hey Ratish! Saw your latest javelin throw clip on Playure. Impressive distance!",
            "timestamp": "10:30 AM",
            "status": "seen",
            "attachment": None
        },
        {
            "id": "m-2",
            "conversation_id": 1,
            "sender_id": 1,  # Logged in user Ratish
            "sender_name": "Ratish Naik",
            "sender_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "text": "Thanks Neeraj sir! Working hard on my release angle and runway speed.",
            "timestamp": "10:35 AM",
            "status": "seen",
            "attachment": None
        },
        {
            "id": "m-3",
            "conversation_id": 1,
            "sender_id": 2,
            "sender_name": "Neeraj Chopra",
            "sender_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
            "text": "Looking forward to the state trials next week! Keep pushing hard.",
            "timestamp": "10:42 AM",
            "status": "delivered",
            "attachment": None
        }
    ],
    2: [
        {
            "id": "m-21",
            "conversation_id": 2,
            "sender_id": 1,
            "sender_name": "Ratish Naik",
            "sender_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "text": "Good evening Sir, please check my batting session analysis video when free.",
            "timestamp": "Yesterday 4:15 PM",
            "status": "seen",
            "attachment": None
        },
        {
            "id": "m-22",
            "conversation_id": 2,
            "sender_id": 3,
            "sender_name": "Rahul Dravid",
            "sender_avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
            "text": "Reviewed your batting technique video. Great footwork on the cover drive!",
            "timestamp": "Yesterday 6:20 PM",
            "status": "seen",
            "attachment": None
        }
    ],
    3: [
        {
            "id": "m-31",
            "conversation_id": 3,
            "sender_id": 4,
            "sender_name": "Sneha Reddy",
            "sender_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            "text": "Here is your customized Zone 2 recovery plan PDF.",
            "timestamp": "2 days ago",
            "status": "seen",
            "attachment": {
                "url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                "type": "pdf",
                "name": "Recovery_Plan_Zone2.pdf"
            }
        }
    ],
    4: [
        {
            "id": "m-41",
            "conversation_id": 4,
            "sender_id": 5,
            "sender_name": "Vikram Singh",
            "sender_avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
            "text": "Court 4 is reserved for your match at 5 PM tomorrow.",
            "timestamp": "Aug 4",
            "status": "seen",
            "attachment": None
        }
    ]
}


class SendMessageRequest(BaseModel):
    conversation_id: int
    text: Optional[str] = None
    attachment_url: Optional[str] = None
    attachment_type: Optional[str] = None
    attachment_name: Optional[str] = None


class TypingRequest(BaseModel):
    conversation_id: int
    is_typing: bool


@router.get("/conversations")
def get_conversations(query: Optional[str] = None):
    """Fetch active chat list for current user with search filtering"""
    chats = MOCK_CONVERSATIONS
    if query:
        q = query.lower()
        chats = [
            c for c in chats 
            if q in c["recipient"]["name"].lower() or q in c["last_message"].lower() or q in c["recipient"]["role"].lower()
        ]
    return {"conversations": chats, "total_unread": sum(c["unread_count"] for c in chats)}


@router.get("/conversations/{conversation_id}/messages")
def get_messages(conversation_id: int, limit: int = 20, offset: int = 0):
    """Fetch paginated messages for a conversation"""
    messages = MOCK_MESSAGES.get(conversation_id, [])
    # Slice for pagination simulation
    sliced = messages[offset: offset + limit]
    return {
        "conversation_id": conversation_id,
        "messages": sliced,
        "total": len(messages)
    }


@router.post("/send")
def send_message(req: SendMessageRequest):
    """Send a new message with text or attachment"""
    conv_id = req.conversation_id
    if conv_id not in MOCK_MESSAGES:
        MOCK_MESSAGES[conv_id] = []
    
    new_msg = {
        "id": f"m-{uuid.uuid4().hex[:8]}",
        "conversation_id": conv_id,
        "sender_id": 1,  # Ratish Naik
        "sender_name": "Ratish Naik",
        "sender_avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        "text": req.text or "",
        "timestamp": datetime.now().strftime("%I:%M %p"),
        "status": "delivered",
        "attachment": {
            "url": req.attachment_url,
            "type": req.attachment_type,
            "name": req.attachment_name
        } if req.attachment_url else None
    }
    
    MOCK_MESSAGES[conv_id].append(new_msg)

    # Update conversation last message snippet
    for conv in MOCK_CONVERSATIONS:
        if conv["id"] == conv_id:
            conv["last_message"] = req.text if req.text else f"Sent an {req.attachment_type or 'attachment'}"
            conv["timestamp"] = new_msg["timestamp"]
            break

    return {"status": "success", "message": new_msg}


@router.post("/upload")
async def upload_attachment(file: UploadFile = File(...)):
    """Upload media file attachment up to 20MB"""
    os.makedirs("uploads/attachments", exist_ok=True)
    filename = f"{uuid.uuid4().hex[:8]}_{file.filename}"
    file_path = os.path.join("uploads/attachments", filename)
    
    content = await file.read()
    if len(content) > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum 20MB limit")
        
    with open(file_path, "wb") as f:
        f.write(content)
        
    url = f"http://localhost:8000/static/uploads/attachments/{filename}"
    
    # Determine type
    ext = file.filename.split(".")[-1].lower() if "." in file.filename else ""
    if ext in ["jpg", "jpeg", "png", "webp", "gif"]:
        file_type = "image"
    elif ext in ["pdf"]:
        file_type = "pdf"
    elif ext in ["mp4", "webm", "mov"]:
        file_type = "video"
    elif ext in ["doc", "docx"]:
        file_type = "doc"
    else:
        file_type = "file"
        
    return {
        "url": url,
        "type": file_type,
        "name": file.filename
    }


@router.post("/mark-read/{conversation_id}")
def mark_read(conversation_id: int):
    """Auto mark all messages in a conversation as read (blue check marks)"""
    if conversation_id in MOCK_MESSAGES:
        for msg in MOCK_MESSAGES[conversation_id]:
            if msg["sender_id"] != 1:  # mark incoming messages
                msg["status"] = "seen"
    
    for conv in MOCK_CONVERSATIONS:
        if conv["id"] == conversation_id:
            conv["unread_count"] = 0
            break
            
    return {"status": "success", "conversation_id": conversation_id}


@router.post("/typing")
def set_typing(req: TypingRequest):
    """Broadcast typing status update"""
    TYPING_STATES[req.conversation_id] = req.is_typing
    return {"conversation_id": req.conversation_id, "is_typing": req.is_typing}


@router.get("/users/search")
def search_users(q: str = Query(..., min_length=1)):
    """Search registered users to start new chat"""
    users_db = [
        {"id": 2, "name": "Neeraj Chopra", "role": "Olympic Javelin Thrower", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", "sport": "Athletics"},
        {"id": 3, "name": "Rahul Dravid", "role": "Cricket Head Coach", "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80", "sport": "Cricket"},
        {"id": 4, "name": "Sneha Reddy", "role": "Physiotherapist", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", "sport": "Sports Medicine"},
        {"id": 5, "name": "Vikram Singh", "role": "Badminton Coach", "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80", "sport": "Badminton"},
        {"id": 6, "name": "P.V. Sindhu", "role": "Badminton Champion", "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", "sport": "Badminton"},
        {"id": 7, "name": "Sunil Chhetri", "role": "Football Captain", "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80", "sport": "Football"}
    ]
    query_str = q.lower()
    results = [u for u in users_db if query_str in u["name"].lower() or query_str in u["sport"].lower() or query_str in u["role"].lower()]
    return {"results": results}
