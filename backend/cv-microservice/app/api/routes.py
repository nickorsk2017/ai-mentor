from fastapi import APIRouter, HTTPException
from uuid import UUID

from ..services.cv_service import (
    upsert_cv,
    get_cv,
    health_check,
)
from ..schemas.cv import UpsertCVRequest, CVResponse
from ..services.vacancy_service import (
    upsert_vacancy,
    get_vacancies,
    update_vacancy,
    delete_vacancy,
)
from ..schemas.vacancy import (
    CreateVacancyRequest,
    UpdateVacancyRequest,
    DeleteVacancyResponse,
    VacancyResponse,
    VacanciesResponse,
)

router = APIRouter()


@router.get("/health")
def health() -> dict:
    return health_check()


@router.put("/cvs", response_model=CVResponse)
async def upsert_cv_endpoint(req: UpsertCVRequest) -> CVResponse:
    return await upsert_cv(req)


@router.get("/cvs/{cv_id}", response_model=CVResponse)
async def get_cv_endpoint(cv_id: UUID) -> CVResponse:
    return await get_cv(cv_id)


@router.post("/vacancies", response_model=VacancyResponse)
async def upsert_vacancy_endpoint(req: CreateVacancyRequest) -> VacancyResponse:
    return await upsert_vacancy(req)


@router.put("/vacancies/{vacancy_id}", response_model=VacancyResponse)
async def update_vacancy_endpoint(
    vacancy_id: UUID, req: UpdateVacancyRequest
) -> VacancyResponse:
    updated = await update_vacancy(vacancy_id, req)
    if updated is None:
        raise HTTPException(status_code=404, detail="Vacancy not found")
    return updated


@router.get("/vacancies", response_model=VacanciesResponse)
async def get_vacancy_endpoint(user_id: UUID) -> VacanciesResponse:
    return await get_vacancies(user_id)


@router.delete("/vacancies/{vacancy_id}", response_model=DeleteVacancyResponse)
async def delete_vacancy_endpoint(vacancy_id: UUID, user_id: UUID) -> DeleteVacancyResponse:
    deleted = await delete_vacancy(vacancy_id, user_id)
    if deleted is None:
        raise HTTPException(status_code=404, detail="Vacancy not found")
    return deleted