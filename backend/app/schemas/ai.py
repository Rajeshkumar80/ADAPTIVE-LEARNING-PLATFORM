"""
AI Service Schemas.
"""

from pydantic import BaseModel
from typing import Optional, List


class AIQueryRequest(BaseModel):
    query: str
    context: Optional[str] = None


class AIQueryResponse(BaseModel):
    response: str
    sources: List[str] = []
