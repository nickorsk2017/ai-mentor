from __future__ import annotations

from pydantic import BaseModel, Field


class IndexVacancyRequest(BaseModel):
    """Payload to embed and upsert a vacancy into Pinecone."""

    vacancy_id: str = Field(..., min_length=1, description="Stable id, e.g. vacancy UUID")
    title: str = Field("", max_length=512)
    company: str | None = Field(None, max_length=512)
    description: str = Field(
        ...,
        min_length=1,
        description="Job description (plain text or HTML; HTML tags are stripped for embedding)",
    )


class IndexVacancyResponse(BaseModel):
    vacancy_id: str
    dimensions: int
    namespace: str
    llama_summary: str = Field(
        ...,
        description="Short note from the Llama model (Ollama) about the indexed role",
    )


class DeleteVacancyIndexResponse(BaseModel):
    vacancy_id: str
    deleted: bool = True
    namespace: str


class HealthResponse(BaseModel):
    status: str
    service: str
    openai_configured: bool
    pinecone_configured: bool
    ollama_base_url: str
    ollama_model: str
