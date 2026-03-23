from __future__ import annotations

import asyncio
from typing import Any

from langchain_openai import OpenAIEmbeddings
from pinecone import Pinecone

from ..config import settings
from ..schemas.matching import (
    IndexVacancyRequest,
    IndexVacancyResponse,
    DeleteVacancyIndexResponse,
)
from .llm_service import llama_vacancy_index_note
from .text_utils import strip_html_to_text


def _metadata_for_pinecone(
    vacancy_id: str,
    title: str,
    company: str | None,
) -> dict[str, Any]:
    """Pinecone metadata: flat JSON-serializable fields (strings recommended)."""
    meta: dict[str, Any] = {
        "kind": "vacancy",
        "vacancy_id": vacancy_id,
        "title": (title or "")[:512],
    }
    if company:
        meta["company"] = company[:512]
    return meta


def _build_embedding_text(req: IndexVacancyRequest) -> str:
    title = (req.title or "").strip()
    company = (req.company or "").strip()
    body = strip_html_to_text(req.description)
    parts = [p for p in (title, company, body) if p]
    if not parts:
        raise ValueError("No text to embed after processing vacancy")
    return "\n\n".join(parts)


def _embed_sync(text: str) -> list[float]:
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is not set (required for embeddings)")
    emb = OpenAIEmbeddings(
        model=settings.openai_embedding_model,
        api_key=settings.openai_api_key,
    )
    return emb.embed_query(text)


def _upsert_sync(vector_id: str, values: list[float], metadata: dict[str, Any]) -> None:
    if not settings.pinecone_api_key or not settings.pinecone_index_name:
        raise RuntimeError("PINECONE_API_KEY and PINECONE_INDEX_NAME must be set")
    pc = Pinecone(api_key=settings.pinecone_api_key)
    index = pc.Index(settings.pinecone_index_name)
    index.upsert(
        vectors=[{"id": vector_id, "values": values, "metadata": metadata}],
        namespace=settings.pinecone_namespace,
    )


def _delete_sync(vector_id: str) -> None:
    if not settings.pinecone_api_key or not settings.pinecone_index_name:
        raise RuntimeError("PINECONE_API_KEY and PINECONE_INDEX_NAME must be set")
    pc = Pinecone(api_key=settings.pinecone_api_key)
    index = pc.Index(settings.pinecone_index_name)
    index.delete(ids=[vector_id], namespace=settings.pinecone_namespace)


async def index_vacancy(req: IndexVacancyRequest) -> IndexVacancyResponse:
    text = _build_embedding_text(req)

    values = await asyncio.to_thread(_embed_sync, text)
    metadata = _metadata_for_pinecone(req.vacancy_id, req.title, req.company)
    await asyncio.to_thread(_upsert_sync, req.vacancy_id, values, metadata)

    excerpt = strip_html_to_text(req.description)[:400]
    llama_note = await asyncio.to_thread(
        llama_vacancy_index_note,
        req.title,
        req.company,
        excerpt,
    )

    return IndexVacancyResponse(
        vacancy_id=req.vacancy_id,
        dimensions=len(values),
        namespace=settings.pinecone_namespace,
        llama_summary=llama_note,
    )


async def delete_vacancy_index(vacancy_id: str) -> DeleteVacancyIndexResponse:
    if not vacancy_id.strip():
        raise ValueError("vacancy_id is required")
    await asyncio.to_thread(_delete_sync, vacancy_id)
    return DeleteVacancyIndexResponse(
        vacancy_id=vacancy_id,
        deleted=True,
        namespace=settings.pinecone_namespace,
    )
