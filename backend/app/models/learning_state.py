"""
Learning State Models — TopicMastery and StudySession.
"""

from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Text, ForeignKey
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class TopicMastery(Base):
    __tablename__ = "topic_mastery"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"))
    mastery = Column(Float, default=0)  # 0-100
    forgetting_risk = Column(String, default="low")  # low | medium | high
    last_reviewed = Column(DateTime(timezone=True), server_default=func.now())


class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True)
    duration_minutes = Column(Integer, default=0)
    focus_score = Column(Float, default=0)
    notes = Column(Text, default="")

    user = relationship("User", back_populates="study_sessions")
