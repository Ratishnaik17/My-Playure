import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, DateTime, Index, Uuid, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base


class Competition(Base):
    __tablename__ = "competitions"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    sport: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    organizer: Mapped[str] = mapped_column(String(150), nullable=False)
    location: Mapped[str] = mapped_column(String(150), nullable=False)
    level: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, default="Open")  # State, National, District, College, etc.
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    registration_deadline: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    start_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    prize_pool: Mapped[str] = mapped_column(String(100), nullable=False, default="₹0")
    registration_fee: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, default="Free Entry")
    max_participants: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, default="Open Entry")
    contact_info: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="upcoming", index=True)  # upcoming, ongoing, completed
    banner_image: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    __table_args__ = (
        Index("idx_competitions_status_sport", "status", "sport"),
        Index("idx_competitions_deadline", "registration_deadline"),
    )

