"""
User Model — supports both student and admin roles.
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, default="")
    role = Column(String, default="student")  # student | admin
    is_active = Column(Boolean, default=True)

    # Student fields
    usn = Column(String, unique=True, nullable=True, index=True)
    semester = Column(Integer, nullable=True, index=True)
    branch = Column(String, nullable=True)
    section = Column(String, nullable=True, index=True)
    cgpa = Column(Float, default=0.0)

    # Admin fields
    employee_id = Column(String, unique=True, nullable=True)
    department = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    journal_entries = relationship("JournalEntry", back_populates="user", cascade="all, delete-orphan")
    test_attempts = relationship("TestAttempt", back_populates="user", cascade="all, delete-orphan")
    certificates = relationship("Certificate", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("Achievement", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    study_sessions = relationship("StudySession", back_populates="user", cascade="all, delete-orphan")
