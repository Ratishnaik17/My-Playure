from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.base import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False)  # registration, follow, message, ai_report, system
    category = Column(String(50), nullable=False)  # competitions, messages, social, ai_coach, system, security
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    icon = Column(String(50), default="bell")
    image = Column(String(500), nullable=True)
    action_url = Column(String(500), nullable=True)
    priority = Column(String(20), default="medium")  # high, medium, low
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User")


class NotificationPreference(Base):
    __tablename__ = "notification_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    competitions = Column(Boolean, default=True)
    messages = Column(Boolean, default=True)
    social = Column(Boolean, default=True)
    ai_coach = Column(Boolean, default=True)
    system = Column(Boolean, default=True)
    email_enabled = Column(Boolean, default=True)
    push_enabled = Column(Boolean, default=True)
    sms_enabled = Column(Boolean, default=False)

    # Relationships
    user = relationship("User")
