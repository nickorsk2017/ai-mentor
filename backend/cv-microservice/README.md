# cv-microservice

FastAPI service for storing CVs and running placeholder analysis.

## Endpoints

- `GET /v1/health` – health check
- `POST /v1/cvs` – create CV (expects JSON body)
- `GET /v1/cvs/{cv_id}` – fetch CV

## Run locally

```bash
cp .env.example .env
export $(grep -v '^#' .env | xargs)

uvicorn main:app --reload --host 0.0.0.0 --port ${PORT:-8000}
```

```bash
pip install .
uvicorn main:app --reload --host 0.0.0.0 --port ${PORT:-8000}
```

## Notes

- Database tables are created automatically on startup (dev convenience).
- For production, replace the bootstrap with Alembic migrations.

## Create CV request body

```json
{
  "user_id": "00000000-0000-0000-0000-000000000000",
  "cv_text": "Paste CV text here"
}
```

