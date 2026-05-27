"""
Certificate and Achievement Models.
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    type = Column(String, default="completion")  # completion | achievement | excellence
    score = Column(Float, default=0)
    issued_date = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="certificates")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    icon = Column(String, default="🏆")
    rarity = Column(String, default="common")  # common | rare | epic | legendary
    earned_date = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="achievements")
