import uuid
from typing import List, TYPE_CHECKING
from sqlalchemy import String, ForeignKey, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.post import Post


class PostHashtag(Base):
    __tablename__ = "post_hashtags"

    post_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("posts.id", ondelete="CASCADE"), primary_key=True
    )
    hashtag_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("hashtags.id", ondelete="CASCADE"), primary_key=True
    )


class Hashtag(Base):
    __tablename__ = "hashtags"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)

    posts: Mapped[List["Post"]] = relationship(
        "Post", secondary="post_hashtags", back_populates="hashtags"
    )
