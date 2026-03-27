from __future__ import annotations

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    service: str
    openai_configured: bool
    pinecone_configured: bool
