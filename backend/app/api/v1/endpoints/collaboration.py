import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database.session import get_db
from app.models.collaboration import Collaboration, CollaborationMember
from app.schemas.collaboration import CollaborationCreate, CollaborationResponse

router = APIRouter(prefix="/collaborations", tags=["Collaboration Hub"])

# Default Initial Seed Requests
DEFAULT_SEED_REQUESTS = [
    {
        "admin_name": "Rahul Dravid",
        "admin_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
        "sport": "Football",
        "sport_icon": "⚽",
        "location": "Turf Park, Koramangala",
        "time": "Today, 19:00",
        "is_live": True,
        "is_time_gold": True,
        "current_players": 5,
        "total_players": 7,
        "status": "active",
    },
    {
        "admin_name": "Sneha Reddy",
        "admin_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        "sport": "Badminton",
        "sport_icon": "🏸",
        "location": "Indiranagar Club",
        "time": "Tomorrow, 07:00",
        "is_live": False,
        "is_time_gold": False,
        "current_players": 1,
        "total_players": 4,
        "status": "active",
    },
    {
        "admin_name": "Vikram Singh",
        "admin_avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
        "sport": "Cricket",
        "sport_icon": "🏏",
        "location": "HSR Layout Grounds",
        "time": "Sat, 14:00",
        "is_live": False,
        "is_time_gold": False,
        "current_players": 10,
        "total_players": 11,
        "status": "active",
    },
]


@router.get("", response_model=List[CollaborationResponse])
async def get_collaborations(
    sport: Optional[str] = Query(None, description="Filter by sport name"),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """
    Fetch all active collaboration requests stored in PostgreSQL Database.
    If database is empty, seed initial high-quality requests automatically.
    """
    query = select(Collaboration).order_by(Collaboration.created_at.desc()).limit(limit)
    if sport and sport.lower() != "all" and sport.lower() != "all sports":
        query = select(Collaboration).filter(func.lower(Collaboration.sport) == sport.lower()).order_by(Collaboration.created_at.desc()).limit(limit)

    result = await db.execute(query)
    collaborations = list(result.scalars().all())

    # If DB has no items yet, seed default items
    if not collaborations and (not sport or sport.lower() == "all" or sport.lower() == "all sports"):
        for seed in DEFAULT_SEED_REQUESTS:
            new_collab = Collaboration(
                id=uuid.uuid4(),
                admin_name=seed["admin_name"],
                admin_avatar=seed["admin_avatar"],
                sport=seed["sport"],
                sport_icon=seed["sport_icon"],
                location=seed["location"],
                time=seed["time"],
                is_live=seed["is_live"],
                is_time_gold=seed["is_time_gold"],
                current_players=seed["current_players"],
                total_players=seed["total_players"],
                status=seed["status"],
            )
            db.add(new_collab)
        await db.commit()

        # Re-fetch after seeding
        result = await db.execute(query)
        collaborations = list(result.scalars().all())

    return collaborations


@router.post("", response_model=CollaborationResponse, status_code=status.HTTP_201_CREATED)
async def create_collaboration(
    payload: CollaborationCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new collaboration request in PostgreSQL Database.
    """
    # Sport icon lookup
    sport_lower = payload.sport.lower()
    sport_icon = "🏆"
    if "football" in sport_lower:
        sport_icon = "⚽"
    elif "cricket" in sport_lower:
        sport_icon = "🏏"
    elif "badminton" in sport_lower:
        sport_icon = "🏸"
    elif "kabaddi" in sport_lower:
        sport_icon = "🤼"
    elif "basketball" in sport_lower:
        sport_icon = "🏀"
    elif "tennis" in sport_lower:
        sport_icon = "🎾"
    elif "volleyball" in sport_lower:
        sport_icon = "🏐"
    elif "hockey" in sport_lower:
        sport_icon = "🏑"

    needed = payload.players_needed
    total = needed + 1  # 1 admin + needed players

    time_str = payload.datetime_info or "Upcoming"

    new_collab = Collaboration(
        id=uuid.uuid4(),
        admin_name=payload.admin_name or "Ratish Naik",
        admin_avatar=payload.admin_avatar or "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        sport=payload.sport,
        sport_icon=sport_icon,
        location=payload.location,
        time=time_str,
        is_live=False,
        is_time_gold=True,
        current_players=1,
        total_players=total,
        status="active",
    )

    db.add(new_collab)
    await db.commit()
    await db.refresh(new_collab)

    return new_collab


@router.post("/{collaboration_id}/join", response_model=CollaborationResponse)
async def toggle_join_collaboration(
    collaboration_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Toggle join / leave squad for a collaboration request in PostgreSQL DB.
    """
    query = select(Collaboration).filter(Collaboration.id == collaboration_id)
    result = await db.execute(query)
    collab = result.scalar_one_or_none()

    if not collab:
        raise HTTPException(status_code=404, detail="Collaboration request not found")

    if collab.current_players < collab.total_players:
        collab.current_players += 1
    else:
        # If full, reset or toggle leave
        collab.current_players = max(1, collab.current_players - 1)

    await db.commit()
    await db.refresh(collab)

    return collab
