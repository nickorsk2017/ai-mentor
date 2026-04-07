from fastapi import APIRouter, HTTPException
from uuid import UUID

from ..services.vacancy_service import (
    upsert_vacancy,
    get_vacancies,
    delete_vacancy,
)
from _common.schemas.vacancy import (
    UpsertVacancyRequest,
    DeleteVacancyResponse,
    VacancyResponse,
    VacanciesResponse,
)

router = APIRouter()


@router.get("/health")
def health() -> dict:
    return {"status": "ok"}


@router.patch("/vacancies/{vacancy_id}", response_model=VacancyResponse)
async def upsert_vacancy_endpoint(
    vacancy_id: UUID, req: UpsertVacancyRequest
) -> VacancyResponse:
    responseData = await upsert_vacancy(vacancy_id, req)
    if responseData is None:
        raise HTTPException(status_code=404, detail="Vacancy not found")
    return responseData


@router.get("/vacancies", response_model=VacanciesResponse)
async def get_vacancy_endpoint(user_id: UUID) -> VacanciesResponse:
    return await get_vacancies(user_id)


@router.delete("/vacancies/{vacancy_id}", response_model=DeleteVacancyResponse)
async def delete_vacancy_endpoint(vacancy_id: UUID, user_id: UUID) -> DeleteVacancyResponse:
    deleted = await delete_vacancy(vacancy_id, user_id)
    if deleted is None:
        raise HTTPException(status_code=404, detail="Vacancy not found")
    return deleted