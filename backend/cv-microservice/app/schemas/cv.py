from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel


class UpsertCVRequest(BaseModel):
    user_id: UUID
    cv_text: str


class CVResponse(BaseModel):
    id: UUID
    user_id: UUID
    cv_text: str
    created_at: datetime


class AnalyzeCVResponse(BaseModel):
    id: UUID
    extracted_skills: dict[str, Any]
    recommendations: list[str] = []


