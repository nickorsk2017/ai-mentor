from __future__ import annotations

import asyncio

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from app.config import settings
from app.prompts.index_to_vector_db import EXTRACT__DATA_VACANCY_PROMPT, EXTRACT_VACANCY_FIELDS
from app.schemas.vacancy_index import VacancyIndexRecord
from app.services.skills_data_extraction_service import extract_skills_from_text
from app.utils import strip_html_to_text


def _build_prompt(
    title: str,
    company: str | None,
    description_html: str,
) -> str:
    description = strip_html_to_text(description_html)
    parts = [
        f"Job title : {title or '(empty)'}",
        f"Company: {company or '(unknown)'}",
        "Job description:",
        description or "(empty)",
    ]
    return "\n".join(parts)


def _get_llm_client() -> ChatOpenAI:
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is not set (required for extraction)")

    return ChatOpenAI(
        model=settings.openai_chat_model,
        api_key=settings.openai_api_key,
        temperature=0,
    )


def _invoke_vacancy_record(llm: ChatOpenAI, human_content: str) -> VacancyIndexRecord:
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
    title: str,
    company: str | None,
    description: str,
) -> VacancyIndexRecord:
    llm = _get_llm_client()
    human_content = _build_prompt(title, company, description)

    skills_result, record = await asyncio.gather(
        extract_skills_from_text(llm, human_content),
        asyncio.to_thread(_invoke_vacancy_record, llm, human_content),
    )

    return record.model_copy(update={"skills": skills_result.skills})
