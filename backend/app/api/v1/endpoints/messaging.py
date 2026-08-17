import uuid
import os
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, and_, or_, func
from sqlalchemy.orm import joinedload

from app.database.session import get_db
from app.core.security import get_current_user_id
from app.models.user import User
from app.models.message import Conversation, ConversationParticipant, Message

router = APIRouter(prefix="/messaging", tags=["Real-Time Messaging"])

# Realtime states
TYPING_STATES = {}
ONLINE_STATES = {
    "neeraj_javelin": {"online": True, "last_seen": "Online"},
    "rahul_dravid": {"online": False, "last_seen": "Yesterday at 06:20 PM"},
    "sneha_reddy": {"online": True, "last_seen": "Online"},
    "vikram_singh": {"online": False, "last_seen": "Yesterday at 11:15 PM"},
}


class SendMessageRequest(BaseModel):
    conversation_id: uuid.UUID
    text: Optional[str] = None
    attachment_url: Optional[str] = None
    attachment_type: Optional[str] = None
    attachment_name: Optional[str] = None


class TypingRequest(BaseModel):
    conversation_id: uuid.UUID
    is_typing: bool


async def ensure_default_conversations(db: AsyncSession, current_user_id: uuid.UUID):
    # Check if user already has conversations
    res = await db.execute(
        select(ConversationParticipant).where(ConversationParticipant.user_id == current_user_id)
    )
    if res.scalars().first():
        return

    # Create recipient users if they don't exist
    recipients_data = [
        ("Neeraj Chopra", "neeraj_javelin", "neeraj@playure.com", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", "Olympic Gold Medalist • Javelin"),
        ("Rahul Dravid", "rahul_dravid", "rahul@playure.com", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80", "Head Coach • India Cricket"),
        ("Sneha Reddy", "sneha_reddy", "sneha@playure.com", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", "Sports Physio & Nutritionist"),
        ("Vikram Singh", "vikram_singh", "vikram@playure.com", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80", "Badminton Club Manager")
    ]

    users = {}
    for name, username, email, avatar, role in recipients_data:
        res_u = await db.execute(select(User).where(User.username == username))
        u = res_u.scalars().first()
        if not u:
            u = User(
                id=uuid.uuid4(),
                full_name=name,
                username=username,
                email=email,
                profile_image=avatar,
                role=role,
                sport="Cricket" if "Cricket" in role else "Athletics",
                state="Delhi",
                city="New Delhi",
                verified=True
            )
            db.add(u)
            await db.flush()
        users[username] = u

    # Make sure current user exists in users table
    res_curr = await db.execute(select(User).where(User.id == current_user_id))
    curr_user = res_curr.scalars().first()
    if not curr_user:
        curr_user = User(
            id=current_user_id,
            full_name="Ratish Naik",
            username="ratishnaik",
            email="ratish@playure.com",
            role="athlete",
            sport="Cricket",
            state="Karnataka",
            city="Bengaluru",
            verified=True
        )
        db.add(curr_user)
        await db.flush()

    # 1. Neeraj Chopra
    conv1 = Conversation(is_group=False)
    db.add(conv1)
    await db.flush()
    db.add_all([
        ConversationParticipant(conversation_id=conv1.id, user_id=current_user_id),
        ConversationParticipant(conversation_id=conv1.id, user_id=users["neeraj_javelin"].id)
    ])
    msg1_1 = Message(
        conversation_id=conv1.id,
        sender_id=users["neeraj_javelin"].id,
        text="Hey Ratish! Saw your latest javelin throw clip on Playure. Impressive distance!",
        status="seen",
        created_at=datetime.now(timezone.utc) - timedelta(minutes=12)
    )
    msg1_2 = Message(
        conversation_id=conv1.id,
        sender_id=current_user_id,
        text="Thanks Neeraj sir! Working hard on my release angle and runway speed.",
        status="seen",
        created_at=datetime.now(timezone.utc) - timedelta(minutes=7)
    )
    msg1_3 = Message(
        conversation_id=conv1.id,
        sender_id=users["neeraj_javelin"].id,
        text="Looking forward to the state trials next week! Keep pushing hard.",
        status="delivered",
        created_at=datetime.now(timezone.utc)
    )
    db.add_all([msg1_1, msg1_2, msg1_3])

    # 2. Rahul Dravid
    conv2 = Conversation(is_group=False)
    db.add(conv2)
    await db.flush()
    db.add_all([
        ConversationParticipant(conversation_id=conv2.id, user_id=current_user_id),
        ConversationParticipant(conversation_id=conv2.id, user_id=users["rahul_dravid"].id)
    ])
    msg2_1 = Message(
        conversation_id=conv2.id,
        sender_id=current_user_id,
        text="Good evening Sir, please check my batting session analysis video when free.",
        status="seen",
        created_at=datetime.now(timezone.utc) - timedelta(days=1, hours=2)
    )
    msg2_2 = Message(
        conversation_id=conv2.id,
        sender_id=users["rahul_dravid"].id,
        text="Reviewed your batting technique video. Great footwork on the cover drive!",
        status="seen",
        created_at=datetime.now(timezone.utc) - timedelta(days=1)
    )
    db.add_all([msg2_1, msg2_2])

    # 3. Sneha Reddy
    conv3 = Conversation(is_group=False)
    db.add(conv3)
    await db.flush()
    db.add_all([
        ConversationParticipant(conversation_id=conv3.id, user_id=current_user_id),
        ConversationParticipant(conversation_id=conv3.id, user_id=users["sneha_reddy"].id)
    ])
    msg3_1 = Message(
        conversation_id=conv3.id,
        sender_id=users["sneha_reddy"].id,
        text="Here is your customized Zone 2 recovery plan PDF.",
        attachment_url="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        attachment_type="pdf",
        attachment_name="Recovery_Plan_Zone2.pdf",
        status="seen",
        created_at=datetime.now(timezone.utc) - timedelta(days=2)
    )
    db.add(msg3_1)

    # 4. Vikram Singh
    conv4 = Conversation(is_group=False)
    db.add(conv4)
    await db.flush()
    db.add_all([
        ConversationParticipant(conversation_id=conv4.id, user_id=current_user_id),
        ConversationParticipant(conversation_id=conv4.id, user_id=users["vikram_singh"].id)
    ])
    msg4_1 = Message(
        conversation_id=conv4.id,
        sender_id=users["vikram_singh"].id,
        text="Court 4 is reserved for your match at 5 PM tomorrow.",
        status="seen",
        created_at=datetime.now(timezone.utc) - timedelta(days=7)
    )
    db.add(msg4_1)

    await db.commit()


@router.get("/conversations")
async def get_conversations(
    query: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user_id: uuid.UUID = Depends(get_current_user_id),
):
    await ensure_default_conversations(db, current_user_id)

    # Get all conversations user is participating in
    stmt = (
        select(Conversation)
        .join(ConversationParticipant)
        .where(ConversationParticipant.user_id == current_user_id)
        .options(
            joinedload(Conversation.participants).joinedload(ConversationParticipant.user),
            joinedload(Conversation.messages)
        )
    )
    res = await db.execute(stmt)
    conversations = res.unique().scalars().all()

    chats = []
    for conv in conversations:
        # Find the recipient (the other participant)
        other_part = next((p for p in conv.participants if p.user_id != current_user_id), None)
        if not other_part:
            continue
        recipient = other_part.user

        # Get last message
        sorted_messages = sorted(conv.messages, key=lambda m: m.created_at)
        last_msg_obj = sorted_messages[-1] if sorted_messages else None
        last_message_text = last_msg_obj.text if last_msg_obj else ""
        if last_msg_obj and last_msg_obj.attachment_url and not last_message_text:
            last_message_text = f"Sent an {last_msg_obj.attachment_type or 'attachment'}"

        timestamp = ""
        if last_msg_obj:
            dt = last_msg_obj.created_at
            # Format time beautifully
            if dt.date() == datetime.now(timezone.utc).date():
                timestamp = dt.strftime("%I:%M %p")
            elif dt.date() == (datetime.now(timezone.utc) - timedelta(days=1)).date():
                timestamp = "Yesterday"
            else:
                timestamp = dt.strftime("%b %d")

        # Unread count (messages sent by recipient that are not seen)
        unread_count = sum(
            1 for m in conv.messages 
            if m.sender_id != current_user_id and m.status != "seen"
        )

        online_info = ONLINE_STATES.get(recipient.username, {"online": False, "last_seen": "Offline"})

        chats.append({
            "id": conv.id,
            "recipient": {
                "id": recipient.id,
                "name": recipient.full_name,
                "avatar": recipient.profile_image or "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                "role": recipient.role,
                "online": online_info["online"],
                "last_seen": online_info["last_seen"]
            },
            "last_message": last_message_text,
            "timestamp": timestamp,
            "unread_count": unread_count,
            "is_typing": TYPING_STATES.get(conv.id, False)
        })

    # Search filter
    if query:
        q = query.lower()
        chats = [
            c for c in chats 
            if q in c["recipient"]["name"].lower() or q in c["last_message"].lower() or q in c["recipient"]["role"].lower()
        ]

    # Sort conversations by last message timestamp desc
    chats = sorted(chats, key=lambda c: next((co.updated_at for co in conversations if co.id == c["id"]), datetime.min), reverse=True)

    return {"conversations": chats, "total_unread": sum(c["unread_count"] for c in chats)}


@router.get("/conversations/{conversation_id}/messages")
async def get_messages(
    conversation_id: uuid.UUID,
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user_id: uuid.UUID = Depends(get_current_user_id),
):
    stmt = (
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .options(joinedload(Message.sender))
    )
    res = await db.execute(stmt)
    db_messages = res.scalars().all()

    formatted = []
    for m in db_messages:
        attachment = None
        if m.attachment_url:
            attachment = {
                "url": m.attachment_url,
                "type": m.attachment_type,
                "name": m.attachment_name
            }
        
        # Human readable time
        dt = m.created_at
        timestamp = dt.strftime("%I:%M %p")

        formatted.append({
            "id": m.id,
            "conversation_id": m.conversation_id,
            "sender_id": m.sender_id,
            "sender_name": m.sender.full_name,
            "sender_avatar": m.sender.profile_image or "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "text": m.text or "",
            "timestamp": timestamp,
            "status": m.status,
            "attachment": attachment
        })

    # Pagination slice
    sliced = formatted[offset: offset + limit]
    return {
        "conversation_id": conversation_id,
        "messages": sliced,
        "total": len(formatted)
    }


@router.post("/send")
async def send_message(
    req: SendMessageRequest,
    db: AsyncSession = Depends(get_db),
    current_user_id: uuid.UUID = Depends(get_current_user_id),
):
    # Verify participation
    stmt = (
        select(ConversationParticipant)
        .where(
            and_(
                ConversationParticipant.conversation_id == req.conversation_id,
                ConversationParticipant.user_id == current_user_id
            )
        )
    )
    res = await db.execute(stmt)
    if not res.scalars().first():
        raise HTTPException(status_code=403, detail="You are not a participant in this conversation")

    # Create new message
    new_msg = Message(
        id=uuid.uuid4(),
        conversation_id=req.conversation_id,
        sender_id=current_user_id,
        text=req.text,
        attachment_url=req.attachment_url,
        attachment_type=req.attachment_type,
        attachment_name=req.attachment_name,
        status="delivered"
    )
    db.add(new_msg)

    # Touch conversation updated_at
    await db.execute(
        update(Conversation)
        .where(Conversation.id == req.conversation_id)
        .values(updated_at=datetime.now(timezone.utc))
    )

    await db.commit()

    # Reload sender info
    res_msg = await db.execute(
        select(Message)
        .where(Message.id == new_msg.id)
        .options(joinedload(Message.sender))
    )
    m = res_msg.scalars().first()

    attachment = None
    if m.attachment_url:
        attachment = {
            "url": m.attachment_url,
            "type": m.attachment_type,
            "name": m.attachment_name
        }

    return {
        "status": "success",
        "message": {
            "id": m.id,
            "conversation_id": m.conversation_id,
            "sender_id": m.sender_id,
            "sender_name": m.sender.full_name,
            "sender_avatar": m.sender.profile_image or "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "text": m.text or "",
            "timestamp": m.created_at.strftime("%I:%M %p"),
            "status": m.status,
            "attachment": attachment
        }
    }


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
async def mark_read(
    conversation_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user_id: uuid.UUID = Depends(get_current_user_id),
):
    # Set all messages sent by others in this conversation to seen
    await db.execute(
        update(Message)
        .where(
            and_(
                Message.conversation_id == conversation_id,
                Message.sender_id != current_user_id
            )
        )
        .values(status="seen")
    )
    await db.commit()
    return {"status": "success", "conversation_id": conversation_id}


@router.post("/typing")
async def broadcast_typing(
    req: TypingRequest,
    current_user_id: uuid.UUID = Depends(get_current_user_id),
):
    TYPING_STATES[req.conversation_id] = req.is_typing
    return {"status": "success", "conversation_id": req.conversation_id, "is_typing": req.is_typing}


@router.get("/search")
async def search_users(
    query: str,
    db: AsyncSession = Depends(get_db),
    current_user_id: uuid.UUID = Depends(get_current_user_id),
):
    """Search for athletes to start a new direct message conversation"""
    stmt = (
        select(User)
        .where(
            and_(
                User.id != current_user_id,
                or_(
                    User.full_name.ilike(f"%{query}%"),
                    User.username.ilike(f"%{query}%")
                )
            )
        )
        .limit(10)
    )
    res = await db.execute(stmt)
    users = res.scalars().all()

    return [
        {
            "id": u.id,
            "full_name": u.full_name,
            "username": u.username,
            "profile_image": u.profile_image or "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "role": u.role,
            "sport": u.sport,
            "city": u.city,
            "state": u.state
        }
        for u in users
    ]


@router.post("/new-conversation")
async def start_conversation(
    recipient_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user_id: uuid.UUID = Depends(get_current_user_id),
):
    # Get all conversations for current user
    stmt = (
        select(Conversation)
        .join(ConversationParticipant)
        .where(ConversationParticipant.user_id == current_user_id)
        .options(joinedload(Conversation.participants))
    )
    res = await db.execute(stmt)
    convs = res.unique().scalars().all()
    
    existing_conv = None
    for c in convs:
        if not c.is_group and any(p.user_id == recipient_id for p in c.participants):
            existing_conv = c
            break

    if existing_conv:
        return {"status": "exists", "conversation_id": existing_conv.id}

    # Create new conversation
    new_conv = Conversation(is_group=False)
    db.add(new_conv)
    await db.flush()

    db.add_all([
        ConversationParticipant(conversation_id=new_conv.id, user_id=current_user_id),
        ConversationParticipant(conversation_id=new_conv.id, user_id=recipient_id)
    ])
    await db.commit()

    return {"status": "created", "conversation_id": new_conv.id}
