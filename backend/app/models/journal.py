"""
Code Journal Entry Model.
"""

from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    code = Column(Text, default="")
    language = Column(String, default="python")
    description = Column(Text, default="")
    tags = Column(JSON, default=list)
    is_starred = Column(Boolean, default=False)
    is_public = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="journal_entries")
