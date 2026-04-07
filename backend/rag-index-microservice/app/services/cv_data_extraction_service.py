from __future__ import annotations

import asyncio

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from app.config import settings
from app.prompts.index_to_vector_db import EXTRACT_CV_FIELDS_RULES, EXTRACT_DATA_CV_PROMPT
from app.schemas.cv_extraction import CvExtractionRecord
from app.services.skills_data_extraction_service import extract_skills_from_text
from app.utils import strip_html_to_text


def _get_llm_client() -> ChatOpenAI:
    if not settings.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is not set (required for CV extraction)")

    return ChatOpenAI(
        model=settings.openai_chat_model,
        api_key=settings.openai_api_key,
        temperature=0,
    )
def _build_prompt(
    cv_html: str
) -> str:
    plain_cv = strip_html_to_text(cv_html)
    return f"""CV OF CANDIDATE:\n
        {plain_cv}"""


def _invoke_summary_years(llm: ChatOpenAI, cv_html: str) -> CvExtractionRecord:
    chain = llm.with_structured_output(CvExtractionRecord)

    result = chain.invoke(
        [
            SystemMessage(
                content=EXTRACT_DATA_CV_PROMPT.format(
                    FIELDS=EXTRACT_CV_FIELDS_RULES,
                ),
            ),
            HumanMessage(content=_build_prompt(cv_html)),
        ]
    )

    return result


async def extract_cv_data_for_index(cv_html: str) -> CvExtractionRecord:
    try:
        llm = _get_llm_client()
        text = strip_html_to_text(cv_html)

        skills = await extract_skills_from_text(llm, text)
        other = _invoke_summary_years(llm, text)

        print(skills)

        return CvExtractionRecord(
            skills=skills,
            summary=other.summary,
            years_expereance=other.years_expereance,
        )
    except Exception as e:
        print(f"Error extracting CV data: {e}")
        return CvExtractionRecord(
            skills=[],
            summary="",
            years_expereance=0,
        )