import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Numeric, Boolean, Integer, DateTime, ForeignKey, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class Athlete(Base):
    __tablename__ = "athletes"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True
    )
    sport_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("sports.id", ondelete="SET NULL"), nullable=True
    )
    position: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    batting_style: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    bowling_style: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    playing_level: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, default="Local")  # Local, State, National, International
    height: Mapped[Optional[float]] = mapped_column(Numeric(5, 2), nullable=True)
    weight: Mapped[Optional[float]] = mapped_column(Numeric(5, 2), nullable=True)
    dominant_hand: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    playing_since: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    profile_views: Mapped[int] = mapped_column(Integer, default=0)
    supporters_count: Mapped[int] = mapped_column(Integer, default=0)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user: Mapped["User"] = relationship("User")
    sport: Mapped[Optional["Sport"]] = relationship("Sport")
