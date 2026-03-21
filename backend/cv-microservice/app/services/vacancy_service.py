from __future__ import annotations

from ..db.session import SessionLocal
from ..models.vacancy import Vacancy as VacancyModel
from ..schemas.vacancy import CreateVacancyRequest, VacancyResponse, GetVacanciesRequest, VacanciesResponse


async def create_vacancy(req: CreateVacancyRequest) -> VacancyResponse:
    async with SessionLocal() as db:
        vacancy = VacancyModel(
            user_id=req.user_id,
            title=req.title,
            company=req.company,
            description=req.description,
        )
        db.add(vacancy)
        await db.commit()
        await db.refresh(vacancy)

        return VacancyResponse(
            id=vacancy.id,
            user_id=vacancy.user_id,
            title=vacancy.title,
            company=vacancy.company,
            description=vacancy.description,
            created_at=vacancy.created_at,
        )

async def get_vacancies(req: GetVacanciesRequest) -> VacanciesResponse:
    async with SessionLocal() as db:
        vacancies = await db.query(VacancyModel).filter(VacancyModel.user_id == req.user_id).all()
        
        return VacanciesResponse(vacancies=[VacancyResponse.model_validate(vacancy) for vacancy in vacancies])

