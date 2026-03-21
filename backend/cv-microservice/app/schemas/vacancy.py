from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class CreateVacancyRequest(BaseModel):
    user_id: UUID
    title: str
    company: str | None = None
    description: str = ""


class VacancyResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    company: str | None = None
    description: str
    created_at: datetime


class GetVacanciesRequest(BaseModel):
    user_id: UUID


class VacanciesResponse(BaseModel):
    vacancies: list[VacancyResponse]