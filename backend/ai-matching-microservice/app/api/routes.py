from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ..config import settings
from ..schemas.matching import (
    HealthResponse,
    IndexVacancyRequest,
    IndexVacancyResponse,
    DeleteVacancyIndexResponse,
)
from ..services import vector_index_service

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        service=settings.app_name,
        openai_configured=bool(settings.openai_api_key),
        pinecone_configured=bool(settings.pinecone_api_key and settings.pinecone_index_name),
        ollama_base_url=settings.ollama_base_url,
        ollama_model=settings.ollama_model,
    )


@router.post("/vacancies/index", response_model=IndexVacancyResponse)
async def index_vacancy_endpoint(body: IndexVacancyRequest) -> IndexVacancyResponse:
    """
    Embed vacancy text with OpenAI (LangChain), upsert into Pinecone,
    then ask Llama (Ollama) for a short confirmation line.
    """
    try:
        return await vector_index_service.index_vacancy(body)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:  # noqa: BLE001
        raise HTTPException(
            status_code=502,
            detail=f"Upstream error while indexing: {type(e).__name__}: {e}",
        ) from e


@router.delete("/vacancies/index/{vacancy_id}", response_model=DeleteVacancyIndexResponse)
async def delete_vacancy_index_endpoint(vacancy_id: str) -> DeleteVacancyIndexResponse:
    try:
        return await vector_index_service.delete_vacancy_index(vacancy_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:  # noqa: BLE001
        raise HTTPException(
            status_code=502,
            detail=f"Upstream error while deleting from index: {type(e).__name__}: {e}",
        ) from e
