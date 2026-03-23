from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "ai-matching-microservice"
    port: int = 8001

    # Optional: same pattern as cv-microservice (verify DB on startup when set)
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/ai_hr"

    # OpenAI — used for embeddings (LangChain OpenAIEmbeddings)
    openai_api_key: str = ""
    openai_embedding_model: str = "text-embedding-3-small"

    # Pinecone
    pinecone_api_key: str = ""
    pinecone_index_name: str = ""
    pinecone_namespace: str = "vacancies"

    # Llama via Ollama (LangChain ChatOllama)
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.1"


settings = Settings()
