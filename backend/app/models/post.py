import uuid
from datetime import datetime, timezone
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Text, Boolean, Integer, DateTime, ForeignKey, Index, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.comment import Comment
    from app.models.like import Like
    from app.models.hashtag import Hashtag


class PostMedia(Base):
    __tablename__ = "post_media"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    post_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("posts.id", ondelete="CASCADE"), nullable=False, index=True
    )
    media_type: Mapped[str] = mapped_column(String(20), nullable=False)  # image, video
    media_url: Mapped[str] = mapped_column(String(500), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    post: Mapped["Post"] = relationship("Post", back_populates="media")


class Post(Base):
    __tablename__ = "posts"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    content: Mapped[str] = mapped_column(Text, nullable=False)
    post_type: Mapped[str] = mapped_column(
        String(40), nullable=False, default="normal", index=True
    )  # normal, achievement, tournament, check_in
    sport: Mapped[Optional[str]] = mapped_column(String(80), nullable=True, index=True)
    achievement_type: Mapped[Optional[str]] = mapped_column(String(80), nullable=True, index=True)
    visibility: Mapped[str] = mapped_column(String(20), nullable=False, default="public")
    location: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    is_draft: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="posts")
    media: Mapped[List[PostMedia]] = relationship(
        "PostMedia", back_populates="post", cascade="all, delete-orphan", order_by="PostMedia.sort_order"
    )
    comments: Mapped[List["Comment"]] = relationship(
        "Comment", back_populates="post", cascade="all, delete-orphan"
    )
    likes: Mapped[List["Like"]] = relationship(
        "Like", back_populates="post", cascade="all, delete-orphan"
    )
    hashtags: Mapped[List["Hashtag"]] = relationship(
        "Hashtag", secondary="post_hashtags", back_populates="posts"
    )

    __table_args__ = (
        Index("idx_posts_sport_created", "sport", "created_at"),
        Index("idx_posts_user_created", "user_id", "created_at"),
        Index("idx_posts_type_created", "post_type", "created_at"),
    )
