from __future__ import annotations

from langchain_community.chat_models import ChatOllama
from langchain_core.messages import HumanMessage

from ..config import settings


def llama_vacancy_index_note(
    title: str,
    company: str | None,
    description_excerpt: str,
) -> str:
    """
    One short sentence from Llama (via Ollama) acknowledging what was indexed.
    Falls back gracefully if Ollama is down.
    """
    excerpt = (description_excerpt or "")[:800]
    prompt = (
        "You are a recruiting assistant. In ONE short sentence (max 25 words), "
        "confirm that this job vacancy was indexed for candidate matching. "
        "Mention the role title. Do not use bullet points.\n\n"
        f"Title: {title or 'Untitled'}\n"
        f"Company: {company or 'N/A'}\n"
        f"Description excerpt: {excerpt}"
    )
    try:
        llm = ChatOllama(
            model=settings.ollama_model,
            base_url=settings.ollama_base_url,
            temperature=0.2,
        )
        msg = llm.invoke([HumanMessage(content=prompt)])
        content = getattr(msg, "content", None) or str(msg)
        return content.strip() if isinstance(content, str) else str(content).strip()
    except Exception as exc:  # noqa: BLE001 — degrade gracefully for dev
        return (
            f"Vacancy indexed for search; Llama (Ollama) note unavailable ({type(exc).__name__})."
        )
