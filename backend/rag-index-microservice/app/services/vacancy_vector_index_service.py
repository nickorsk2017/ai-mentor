from __future__ import annotations

import asyncio
from typing import Any

import logging

from langchain_openai import OpenAIEmbeddings
from pinecone import Pinecone
from fastapi import HTTPException
import json

from app.config import settings
from _common.schemas.vacancy_index import (
    VacancyIndexPayload,
    VacancyIndexResponse,
    DeleteVacancyIndexResponse,
)
from app.services.vacancy_data_extraction_service import extract_vacancy_data_for_index

logger = logging.getLogger(__name__)
pc = Pinecone(api_key=settings.pinecone_api_key)
index = pc.Index(settings.pinecone_index)

def _get_embeddings_client() -> OpenAIEmbeddings:
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is not set (required for embeddings)")

    kwargs: dict[str, Any] = {
        "model": settings.openai_embedding_model,
        "api_key": settings.openai_api_key,
    }

    if settings.openai_embedding_dimensions is not None:
        kwargs["dimensions"] = int(settings.openai_embedding_dimensions)
    return OpenAIEmbeddings(**kwargs)

embeddings_client = _get_embeddings_client()

def _build_vacancy_embedding_data(text: str) -> list[float]:
    return embeddings_client.embed_query(text)


def _sanitize_metadata_value(value: Any) -> str | int | float | bool | list[str]:
    """Pinecone metadata supports scalar values and list[str], never null."""
    if value is None:
        return ""
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float, str)):
        return value
    if isinstance(value, list):
        return [str(v) for v in value if v is not None]
    return str(value)


def _sanitize_metadata(md: dict[str, Any]) -> dict[str, str | int | float | bool | list[str]]:
    return {k: _sanitize_metadata_value(v) for k, v in md.items()}


async def add_vacancy_to_index(req: VacancyIndexPayload) -> VacancyIndexResponse:
    try:
        extracted_vacancy_data = await extract_vacancy_data_for_index(
            req.title,
            req.company,
            req.description,
        )
        summary = extracted_vacancy_data.summary
        extracted_vacancy_data = extracted_vacancy_data.model_dump(mode="json")
    
        embedding = await asyncio.to_thread(_build_vacancy_embedding_data, summary)
        stages = [stage.model_dump(mode="json") for stage in req.stages]
        stages = json.dumps(stages)

        metadata = {
            "kind": "vacancy",
            "user_id": req.user_id,
            "vacancy_id": req.vacancy_id,
            "company": (req.company or "").strip(),
            "summary": summary,
            **extracted_vacancy_data,
            "title": req.title,
            "stages": stages,
        }
        metadata = _sanitize_metadata(metadata)

        await asyncio.to_thread(
            index.upsert,
            vectors=[{
                "id": req.vacancy_id,
                "values": embedding,
                "metadata": metadata,
            }],
            namespace="vacancies",
        )

        return VacancyIndexResponse(
            vacancy_id=req.vacancy_id,
            dimensions=len(embedding),
            namespace="vacancies",
            summary=summary,
            extracted=extracted_vacancy_data,
        )

    except Exception as e:
        logger.error("VACANCY INDEX VALIDATION ERROR: ", e)
        raise HTTPException(
            status_code=502,
            detail=f"Upstream error while indexing: {type(e).__name__}: {e}",
        ) from e


async def delete_vacancy_index(vacancy_id: str) -> DeleteVacancyIndexResponse:
    if not vacancy_id.strip():
        raise ValueError("vacancy_id is required")
    
    await asyncio.to_thread(
        index.delete,
        filter={"vacancy_id": {"$eq": vacancy_id}},
        namespace="vacancies",
    )
    
    return DeleteVacancyIndexResponse(
        vacancy_id=vacancy_id,
        deleted=True,
        namespace="vacancies",
    )
