# ai-matching-microservice

FastAPI service for **vacancy → vector index** using:

- **LangChain** — orchestration
- **OpenAI** — text embeddings (`OpenAIEmbeddings`)
- **Pinecone** — vector database (upsert)
- **Llama** — short confirmation text via **Ollama** (`ChatOllama`)

Layout mirrors `cv-microservice`: `app/main.py`, `app/api/routes.py`, `app/config.py`, `app/schemas/`, `app/services/`, `app/db/session.py`.

## Prerequisites

1. **OpenAI API key** — for embeddings.
2. **Pinecone** — serverless index whose **dimension** matches the embedding model (e.g. `text-embedding-3-small` → **1536**).
3. **Ollama** running locally with a Llama-family model, e.g. `ollama pull llama3.1` (optional for indexing; a fallback message is returned if Ollama is down).
4. **PostgreSQL** — same as cv-microservice; startup runs `SELECT 1` against `DATABASE_URL`.

## Run locally

```bash
cp .env.example .env
# Fill OPENAI_API_KEY, PINECONE_*, optional OLLAMA_*

uv sync
uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/v1/health` | Config flags + Ollama URL/model |
| `POST` | `/v1/vacancies/index` | Embed vacancy → Pinecone upsert → Llama note |

### Index vacancy

```bash
curl -s -X POST http://localhost:8001/v1/vacancies/index \
  -H "Content-Type: application/json" \
  -d '{
    "vacancy_id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Senior Backend Engineer",
    "company": "Acme",
    "description": "<p>We need Python and FastAPI experience.</p>"
  }'
```

Response includes `dimensions`, `namespace`, and `llama_summary`.

## Environment variables

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | Embeddings |
| `OPENAI_EMBEDDING_MODEL` | Default `text-embedding-3-small` |
| `PINECONE_API_KEY` | Pinecone client |
| `PINECONE_INDEX_NAME` | Target index |
| `PINECONE_NAMESPACE` | Default `vacancies` |
| `OLLAMA_BASE_URL` | Default `http://localhost:11434` |
| `OLLAMA_MODEL` | Default `llama3.1` |
| `DATABASE_URL` | Async Postgres URL for health check |
