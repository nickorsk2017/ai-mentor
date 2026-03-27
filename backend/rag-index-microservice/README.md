# rag-index-microservice

FastAPI service for **vacancy RAG indexing**: LLM extraction, OpenAI embeddings, Pinecone upsert/delete.

Same layout and stack as `ai-ranking-microservice` (FastAPI, LangChain, Pydantic settings, uv).

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/v1/vacancies/health` | Config flags |
| `POST` | `/v1/vacancies/index` | Extract fields → embed summary → upsert |
| `DELETE` | `/v1/vacancies/index/{vacancy_id}` | Delete vectors for `vacancy_id` |

## Run

```bash
cp .env.example .env
uv sync
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8002
```

## Index payload (`POST /v1/vacancies/index`)

```json
{
  "user_id": "uuid",
  "vacancy_id": "uuid",
  "title": "…",
  "company": "…",
  "description": "<p>…</p>"
}
```

Configure the frontend with `NEXT_PUBLIC_RAG_INDEX_MICROSERVICE_URL` (default `http://localhost:8002`).
