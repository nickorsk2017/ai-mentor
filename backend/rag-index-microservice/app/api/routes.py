from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, Query

from _common.schemas.vacancy_index import (
    CvIndexPayload,
    CvIndexResponse,
    DeleteCvIndexResponse,
    DeleteVacancyIndexResponse,
    VacancyIndexPayload,
    VacancyIndexResponse,
)
from app.services import cv_vector_index_service, vacancy_vector_index_service

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/health")
def health() -> dict:
    logger.info("Health check requested")
    return {"status": "ok"}

async def _upsert_cv_index(payload: CvIndexPayload) -> CvIndexResponse:
    logger.info("CV index upsert started for user_id=%s", payload.user_id)
    try:
        result = await cv_vector_index_service.add_to_index(payload)
        logger.info("CV index upsert succeeded for user_id=%s", payload.user_id)
        return result
    except ValueError as e:
        logger.warning("CV index upsert validation failed for user_id=%s: %s", payload.user_id, e)
        raise HTTPException(status_code=400, detail=str(e)) from e
    except RuntimeError as e:
        logger.error("CV index upsert unavailable for user_id=%s: %s", payload.user_id, e)
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:  # noqa: BLE001
        logger.exception("CV index upsert upstream error for user_id=%s", payload.user_id)
        raise HTTPException(
            status_code=502,
            detail=f"Upstream error while indexing: {type(e).__name__}: {e}",
        ) from e


@router.patch("/cv/index", response_model=CvIndexResponse)
async def upsert_cv_to_index_patch(payload: CvIndexPayload) -> CvIndexResponse:
    return await _upsert_cv_index(payload)


@router.delete("/cv/index", response_model=DeleteCvIndexResponse)
async def delete_cv_from_index(
    user_id: str = Query(..., min_length=1),
) -> DeleteCvIndexResponse:
    try:
        result = await cv_vector_index_service.delete_cv_index(user_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Upstream error while deleting from index: {type(e).__name__}: {e}",
        ) from e


@router.patch("/vacancies/index", response_model=VacancyIndexResponse)
async def add_vacancy_to_index(body: VacancyIndexPayload) -> VacancyIndexResponse:
    try:
        result = await vacancy_vector_index_service.add_vacancy_to_index(body)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Upstream error while indexing: {type(e).__name__}: {e}",
        ) from e


@router.delete("/vacancies/index/{vacancy_id}", response_model=DeleteVacancyIndexResponse)
async def delete_vacancy_from_index_endpoint(vacancy_id: str) -> DeleteVacancyIndexResponse:
    logger.info("Vacancy index delete started for vacancy_id=%s", vacancy_id)
    try:
        result = await vacancy_vector_index_service.delete_vacancy_index(vacancy_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Upstream error while deleting from index: {type(e).__name__}: {e}",
        ) from e
