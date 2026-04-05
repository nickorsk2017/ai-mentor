from __future__ import annotations

import asyncio
import json
import logging

from dataclasses import dataclass, field
from uuid import UUID
from typing import Any
from fastapi import HTTPException
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_groq import ChatGroq

from app.schemas.vacancy_ranked import (
    VacancyRanked,
    VacanciesRankedResponse,
)

from app.config import settings
from app.prompts.ranking_prompt import (
    VACANCIES_RANK_PROMPT,
    CV_VACANCY_RANK_USER_TEMPLATE,
    SENIORITY_RULES_PROMPT,
    ADVICE_RULES_PROMPT
)
from app.schemas import RankingResponse, VacancyFromIndex
from app.utils import strip_html_to_text

from app.services.vector_store_service import (
    get_cv_profile_text_and_skills_from_pinecone,
    get_index_vacancies_from_pinecone,
    unknown_listing_created_at,
)

logger = logging.getLogger(__name__)

def _vacancy_block(vacancyIndex: VacancyFromIndex, cv_skills: list[str]) -> str:
    plain_summary = strip_html_to_text(vacancyIndex.summary or "")
    company = vacancyIndex.company or "(unknown)"
    vacancy_skills = (vacancyIndex.meta_data or {}).get("skills")

    cv_skill_lowercase = {skill.lower() for skill in cv_skills}
    aligned = sorted({skill for skill in vacancy_skills if skill.lower() in cv_skill_lowercase})
    not_aligned = sorted({s for s in vacancy_skills if s.lower() not in cv_skill_lowercase})

    data = {
        "vacancy_id": vacancyIndex.id,
        "title": vacancyIndex.title or "(untitled)",
        "company": company,
        "summary": plain_summary,
        "skills": json.dumps(vacancy_skills),
        "aligned_skills": json.dumps(aligned),
        "not_aligned_skills": json.dumps(not_aligned),
    }

    return json.dumps(data)


def _get_ranking_data_llm(cv_text: str, cv_skills: list[str], vacancies_from_index: list[VacancyFromIndex]) -> RankingResponse:
    if not settings.groq_api_key:
        raise RuntimeError("GROQ_API_KEY is not set")

    try:
        llm = ChatGroq(
            model=settings.groq_chat_model,
            api_key=settings.groq_api_key,
            temperature=0,
            model_kwargs={
                "response_format": {"type": "json_object"},
            }
        )


        blocks = "\n".join(_vacancy_block(vacancy_from_index, cv_skills) for vacancy_from_index in vacancies_from_index)

        cv_plane_text = strip_html_to_text(cv_text)

        cv_and_vacancies_list_prompt = CV_VACANCY_RANK_USER_TEMPLATE.format(
            cv_text=cv_plane_text,
            vacancy_blocks=blocks,
        )

        raw = llm.invoke(
            [
                SystemMessage(content=VACANCIES_RANK_PROMPT),
                SystemMessage(content=SENIORITY_RULES_PROMPT),
                SystemMessage(content=ADVICE_RULES_PROMPT),
                HumanMessage(content=cv_and_vacancies_list_prompt),
            ]
        )

        data = raw.content

        if isinstance(data, str):
            data = json.loads(data)
        else:
            raise TypeError(f"Unexpected content type: {type(data)}")

        return RankingResponse.model_validate(data)
    except Exception as e:
        logger.error("VACANCY INDEX VALIDATION ERROR: ", e)
        raise HTTPException(
            status_code=502,
            detail=f"Upstream error while indexing: {type(e).__name__}: {e}",
        ) from e


def _merge_ranking(
    vacancies_from_index: list[VacancyFromIndex],
    ranking_data_llm: RankingResponse,
    cv_skills: list[str],
) -> list[VacancyRanked]:
    by_id: dict[str, VacancyFromIndex] = {str(r.id): r for r in vacancies_from_index}
    seen: set[str] = set()
    result: list[VacancyRanked] = []

    cv_skill_lowercase = {s.lower() for s in cv_skills}

    for item in ranking_data_llm.rankings:
        key = item.vacancy_id
        if key and key in by_id and key not in seen:
            vacancy = by_id[key]

            stages = vacancy.meta_data.get("stages", "[]")
            stages = json.loads(stages)

            advice = (item.advice or "").strip() or None
            seniority_score = item.seniority_score
            other_score = item.other_score
            domain_score = item.domain_score
            summary = item.summary
            # Compute aligned / not-aligned skills based on CV vs vacancy metadata
            vacancy_skills = (vacancy.meta_data or {}).get("skills")

            aligned = sorted({s for s in vacancy_skills if s.lower() in cv_skill_lowercase}) or []
            not_aligned = sorted({s for s in vacancy_skills if s.lower() not in cv_skill_lowercase}) or []
    
            len_aligned = len(aligned)
            len_not_aligned = len(not_aligned)

            tech_score =  round((len_aligned / (len_aligned + len_not_aligned)) * 100) if (len_aligned + len_not_aligned > 0) else 0
            match_score = round((tech_score + seniority_score + other_score) / (3 if other_score else 2))

            result.append(
                VacancyRanked(
                    id=key,
                    title=vacancy.title,
                    company=vacancy.company,
                    created_at=unknown_listing_created_at(),
                    user_id=vacancy.user_id,
                    match_score=match_score,
                    advice=advice,
                    tech_score=tech_score,
                    seniority_score=seniority_score,
                    other_score=other_score,
                    domain_score=domain_score,
                    aligned_skills=aligned,
                    not_aligned_skills=not_aligned,
                    summary=summary,
                    stages=stages,
                )
            )
            seen.add(key)

    return result


async def rank_vacancies_by_cv(
    cv_text: str,
    cv_skills: list[str],
    vacancies_from_index: list[VacancyFromIndex],
) -> list[VacancyRanked]:
    if not vacancies_from_index:
        return []

    ranking_data_llm = await asyncio.to_thread(_get_ranking_data_llm, cv_text, cv_skills, vacancies_from_index)
    if ranking_data_llm is None:
        raise RuntimeError("Ranking returned empty result")

    merged = _merge_ranking(vacancies_from_index, ranking_data_llm, cv_skills)
    return merged


async def get_vacancies_by_user_id(user_id: UUID) -> VacanciesRankedResponse:
    cv_text, cv_skills = await get_cv_profile_text_and_skills_from_pinecone(user_id)
    if not cv_text:
        return VacanciesRankedResponse(vacancies=[])
        
    pinecone_rows = await get_index_vacancies_from_pinecone(user_id, cv_text=cv_text)
    vacancies_from_index = [row.vacancy for row in pinecone_rows]

    if not vacancies_from_index:
        return VacanciesRankedResponse(vacancies=[])

    try:
        vacancies_ranked = await rank_vacancies_by_cv(cv_text, cv_skills, vacancies_from_index)
    except Exception as e:
        raise RuntimeError(f"Ranking failed: {e}") from e
    

    vacancies: list[VacancyRanked] = []
    for vacancy_ranked in vacancies_ranked:  
        vacancies.append(
            vacancy_ranked
        )

    return VacanciesRankedResponse(vacancies=vacancies)