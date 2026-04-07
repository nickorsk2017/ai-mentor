from __future__ import annotations
from ast import keyword

from pydantic import BaseModel, Field


class CvExtractionRecord(BaseModel):
    summary: str = Field(
        default="",
        description="8-10 sentences: roles, impact, technologies, domains.",
    )
    skills: list[str] = Field(
        default_factory=list
    )
    years_expereance: float = Field(
        default=0.0,
        ge=0,
        le=80,
        description="Total years of relevant professional experience as a number.",
    )