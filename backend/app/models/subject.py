"""
Subject and Topic Models.
"""

from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    semester = Column(Integer, default=6)
    credits = Column(Integer, default=4)
    description = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    topics = relationship("Topic", back_populates="subject", cascade="all, delete-orphan")
    tests = relationship("Test", back_populates="subject", cascade="all, delete-orphan")


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    name = Column(String, nullable=False)
    description = Column(Text, default="")
    difficulty = Column(String, default="medium")  # easy | medium | hard
    estimated_hours = Column(Float, default=2.0)
    order_index = Column(Integer, default=0)

    subject = relationship("Subject", back_populates="topics")
