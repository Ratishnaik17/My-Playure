import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, DateTime, Index, Uuid, Text, Integer, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class Collaboration(Base):
    __tablename__ = "collaborations"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    admin_name: Mapped[str] = mapped_column(String(150), nullable=False, default="Ratish Naik")
    admin_avatar: Mapped[str] = mapped_column(String(500), nullable=False, default="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80")
    sport: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    sport_icon: Mapped[str] = mapped_column(String(20), nullable=False, default="🏆")
    location: Mapped[str] = mapped_column(String(150), nullable=False)
    time: Mapped[str] = mapped_column(String(100), nullable=False, default="Upcoming")
    is_live: Mapped[bool] = mapped_column(Boolean, default=False)
    is_time_gold: Mapped[bool] = mapped_column(Boolean, default=True)
    current_players: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    total_players: Mapped[int] = mapped_column(Integer, nullable=False, default=7)
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="active", index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    __table_args__ = (
        Index("idx_collaborations_status_sport", "status", "sport"),
    )


class CollaborationMember(Base):
    __tablename__ = "collaboration_members"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    collaboration_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("collaborations.id", ondelete="CASCADE"), nullable=False
    )
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True
    )
    joined_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
