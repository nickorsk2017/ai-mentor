# cv-microservice

FastAPI service for storing CVs and running placeholder analysis.

## Endpoints

- `GET /v1/health` – health check
- `POST /v1/cvs` – create CV (expects JSON body)
- `GET /v1/cvs/{cv_id}` – fetch CV

## Run locally

```bash
cp .env.example .env
# Set DATABASE_URL (e.g. postgresql+asyncpg://user:pass@localhost:5432/ai_hr)

uv sync   # or: pip install .
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Database migrations (Alembic)

Uses the same `DATABASE_URL` as the app; Alembic swaps `+asyncpg` → `+psycopg2` for sync migrations.

```bash
cd backend/cv-microservice
alembic upgrade head
```

Create a new revision after model changes:

```bash
alembic revision --autogenerate -m "describe change"
alembic upgrade head
```

## Notes

- Schema is managed with Alembic; startup only checks that PostgreSQL is reachable.

## Create CV request body

```json
{
  "user_id": "00000000-0000-0000-0000-000000000000",
  "cv_text": "Paste CV text here"
}
```

