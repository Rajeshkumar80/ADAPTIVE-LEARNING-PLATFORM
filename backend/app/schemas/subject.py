"""
Subject Schemas.
"""

from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class SubjectBase(BaseModel):
    code: str
    name: str
    semester: int = 6
    credits: int = 4
    description: Optional[str] = ""


class SubjectCreate(SubjectBase):
    pass


class SubjectResponse(SubjectBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
