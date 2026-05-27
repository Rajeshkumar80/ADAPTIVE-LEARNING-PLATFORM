"""
Certificate and Achievement Schemas.
"""

from pydantic import BaseModel, ConfigDict
from datetime import datetime


class CertificateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    title: str
    subject: str
    type: str
    score: float
    issued_date: datetime


class AchievementResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    title: str
    description: str
    icon: str
    rarity: str
    earned_date: datetime
