import uuid
from datetime import datetime, timezone
from sqlalchemy import DateTime, ForeignKey, Index, Uuid
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base


class Follower(Base):
    __tablename__ = "followers"

    follower_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True, index=True
    )
    following_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    __table_args__ = (
        Index("idx_followers_follower_following", "follower_id", "following_id"),
        Index("idx_followers_following", "following_id"),
    )
