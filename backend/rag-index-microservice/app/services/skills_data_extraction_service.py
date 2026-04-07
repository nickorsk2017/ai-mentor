from __future__ import annotations
import asyncio
import json

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from app.prompts.extract_cv_skills_prompt import SKILLS_PROCESSING_PROMPT, KEYWORDS_PROCESSING_PROMPT, NORMALIZE_SKILLS_PROMPT

def extract_skills_from_keywords(llm: ChatOpenAI, keywords: str) -> str:

    return llm.invoke(
        [
            SystemMessage(content=SKILLS_PROCESSING_PROMPT),
            HumanMessage(content=keywords),
        ]
    )

def normalize_skills(llm: ChatOpenAI, skills: str) -> str:

    return llm.invoke(
        [
            SystemMessage(content=NORMALIZE_SKILLS_PROMPT),
            HumanMessage(content=skills),
        ]
    )

def extract_keywords_from_text(llm: ChatOpenAI, text: str) -> list[str]:

    return llm.invoke(
        [
            SystemMessage(content=KEYWORDS_PROCESSING_PROMPT),
            HumanMessage(content=text),
        ]
    )


async def extract_skills_from_text(llm: ChatOpenAI, text: str) -> list[str]:

    try:
        lower_text = text.lower()
        keywords = await asyncio.to_thread(extract_keywords_from_text, llm, lower_text)
        skills = await asyncio.to_thread(extract_skills_from_keywords, llm, keywords.content)
        normalized_skills = await asyncio.to_thread(normalize_skills, llm, skills.content)
    except Exception as e:
        print(f"Error extracting skills from text: {e}")
        return []

    parsed = json.loads(normalized_skills.content)
    if not isinstance(parsed, list):
        return []
    return [str(item).strip() for item in parsed if str(item).strip()]
