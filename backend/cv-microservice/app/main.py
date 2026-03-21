from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routes import router as cv_router
from .db.base import Base
from .db.session import engine
from .config import settings


async def init_db() -> None:
    # Simple dev-time bootstrap. For production, use Alembic migrations.
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception as e:
        msg = str(e)
        if "InvalidCatalogNameError" in msg or "does not exist" in msg:
            raise RuntimeError(
                "PostgreSQL database does not exist. "
                "Create it (e.g. `createdb ai_hr`) or update DATABASE_URL."
            ) from e
        raise


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name)
    app.include_router(cv_router)

    @app.on_event("startup")
    async def _startup() -> None:
        await init_db()

    app.add_middleware(
    CORSMiddleware,
        allow_origins=["http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app


app = create_app()


def main() -> int:
    """
    Console-script entrypoint used by `cv-microservice`.
    """
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.port)
    return 0

