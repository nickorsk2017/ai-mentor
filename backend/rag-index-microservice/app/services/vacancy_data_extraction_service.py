from __future__ import annotations

import asyncio

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from app.config import settings
from app.prompts.extract_data_vacancy_prompts import EXTRACT__DATA_VACANCY_PROMPT, EXTRACT_VACANCY_FIELDS
from app.schemas.vacancy_index import VacancyIndexRecord
from app.services.skills_data_extraction_service import extract_skills_from_vacancy
from app.utils import strip_html_to_text


def _get_llm_client() -> ChatOpenAI:
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is not set (required for extraction)")

    return ChatOpenAI(
        model=settings.openai_chat_model,
        api_key=settings.openai_api_key,
        temperature=0,
    )


async def _invoke_vacancy_record(llm: ChatOpenAI, human_content: str) -> VacancyIndexRecord:
    chain = llm.with_structured_output(VacancyIndexRecord)

    return chain.invoke(
        [
            SystemMessage(
                content=EXTRACT__DATA_VACANCY_PROMPT.format(FIELDS=EXTRACT_VACANCY_FIELDS),
            ),
            HumanMessage(content=human_content),
        ],
    )


async def extract_vacancy_data_for_index(
    description: str,
) -> VacancyIndexRecord:
    try:
        llm = _get_llm_client()

        text = strip_html_to_text(description)

        skills = await extract_skills_from_vacancy(llm, text)
        other = await _invoke_vacancy_record(llm, text)

        data = other.model_dump()
        data["skills"] = skills

        return VacancyIndexRecord(
            **data
        )
    except Exception as e:
        raise e
