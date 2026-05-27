"""
Code Journal Schemas.
"""

from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime


class JournalEntryBase(BaseModel):
    title: str
    code: Optional[str] = ""
    language: str = "python"
    description: Optional[str] = ""
    tags: Optional[List[str]] = []
    is_starred: bool = False


class JournalEntryCreate(JournalEntryBase):
    pass


class JournalEntryUpdate(BaseModel):
    title: Optional[str] = None
    code: Optional[str] = None
    language: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    is_starred: Optional[bool] = None


class JournalEntryResponse(JournalEntryBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
