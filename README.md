# AI HR Mentor

## What This Project Is

AI HR Mentor is an end-to-end AI career mentor for job seekers that turns a raw CV into a ranked list of best-fit vacancies and concrete upskilling advice.

It is built as a real-world, production-style AI system: multi-service FastAPI backend, RAG, and a polished Next.js frontend.

The project is split into `frontend/` (Next.js UI) and `backend/` (FastAPI microservices).

Live demo: https://match-vacancy.com/

## Project Structure

```text
ai-hr-agent/
├── frontend/
│   └── main-app/                 # Next.js frontend
├── backend/
│   ├── gateway/                  # API gateway (entrypoint for frontend)
│   ├── cv-microservice/          # CV storage service
│   ├── vacancy-microservice/     # Vacancy CRUD service
│   ├── rag-index-microservice/   # CV/vacancy extraction + Pinecone indexing
│   ├── ranking-microservice/     # CV-to-vacancy ranking service
│   ├── _common/                  # Shared schemas, DB models, shared env
│   └── README.md                 # Backend overview
└── makefile                      # Top-level install/run helpers
```

## System Design Overview

- **Frontend (`frontend/main-app`)**: Next.js app that exposes the AI career mentor UI and talks only to the gateway over HTTP.
- **API Gateway (`backend/gateway`)**: Single entrypoint for the frontend; proxies REST calls to the underlying microservices and publishes indexing events to RabbitMQ.
- **Core microservices**:
  - `cv-microservice`: stores CVs in PostgreSQL and exposes CRUD + simple queries.
  - `vacancy-microservice`: manages vacancies and interview stages in PostgreSQL.
  - `rag-index-microservice`: extracts structured data from CVs/vacancies, builds embeddings, and writes to Pinecone.
  - `ranking-microservice`: pulls the indexed CV + vacancies from Pinecone, runs LLM-based ranking, and returns ordered matches plus aligned/missing skills.
- **Shared layer (`backend/_common`)**: centralizes Pydantic schemas, SQLAlchemy models, Alembic migrations, and the shared `.env` config used by all backend services.
- **Infrastructure**:
  - **PostgreSQL** for transactional storage (CVs, vacancies, stages).
  - **RabbitMQ** as a broker for async indexing events.
  - **Pinecone** as the vector store for CV and vacancy embeddings.
  - **Docker / docker-compose** to run all services, DB, and RabbitMQ locally as a single stack.

## Main Docs

- Backend overview: [`backend/README.md`](backend/README.md)
- Frontend overview: [`frontend/main-app/README.md`](frontend/main-app/README.md)
- Gateway details: [`backend/gateway/README.md`](backend/gateway/README.md)
- CV service: [`backend/cv-microservice/README.md`](backend/cv-microservice/README.md)
- Vacancy service: [`backend/vacancy-microservice/README.md`](backend/vacancy-microservice/README.md)
- RAG index service: [`backend/rag-index-microservice/README.md`](backend/rag-index-microservice/README.md)
- Ranking service: [`backend/ranking-microservice/README.md`](backend/ranking-microservice/README.md)

## Shared Environment

Backend services use a shared env file:

- `backend/_common/.env`
- template config: `backend/_common/.env.example`


## How to Run the Project

Before running anything, **define `backend/_common/.env`** using the template at `backend/_common/.env.example` (copy it and fill in your own keys).

### 1. Run everything with Docker (recommended)

- Make sure Docker Desktop (or Docker Engine + Compose) is running.
- From the repo root, start the full stack:

```bash
docker compose up --build
```

- In VS Code / Cursor you can also use the **Docker** debug configuration:
  - Open the **Run and Debug** panel.
  - Select `Docker`.
  - Press the green **Run** / **Debug** button to build and start all services defined in `docker-compose.yml`.

Once started:

- Backend gateway: `http://localhost:8001`
- Frontend: `http://localhost:3000`

### 2. Run with VS Code / Cursor debug (Backend + Frontend)

- For this mode, you need also a local **PostgreSQL** and **RabbitMQ** running on your machine.

- Open **Run and Debug** in VS Code / Cursor.
- Choose the **compound configuration**:
  - `Backend + Frontend`
- Press the green **Run** / **Debug** button.

This will:

- Start all backend microservices via `uv run`:
  - `Gateway service`
  - `CV service`
  - `RAG index service`
  - `Ranking service`
  - `Vacancy service`
- Start the Next.js dev server:
  - `Frontend (Next.js dev)` on `http://localhost:3000`
