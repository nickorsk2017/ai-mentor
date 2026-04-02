from __future__ import annotations

import logging
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.config import settings
from app.services.rabbitmq_subscriber import RabbitMQSubscriber

LOG_FILE_PATH = Path(__file__).resolve().parents[1] / "rag-index-microservice.log"
subscriber = RabbitMQSubscriber()


def configure_logging() -> None:
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)

    if any(
        isinstance(handler, logging.FileHandler)
        and Path(getattr(handler, "baseFilename", "")) == LOG_FILE_PATH
        for handler in root_logger.handlers
    ):
        return

    file_handler = logging.FileHandler(LOG_FILE_PATH, encoding="utf-8")
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(
        logging.Formatter("%(asctime)s %(levelname)s [%(name)s] %(message)s")
    )
    root_logger.addHandler(file_handler)


def create_app() -> FastAPI:
    configure_logging()
    app = FastAPI(title=settings.app_name)
    app.include_router(router)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    async def on_startup() -> None:
        await subscriber.start()

    @app.on_event("shutdown")
    async def on_shutdown() -> None:
        await subscriber.stop()

    return app


app = create_app()


def main() -> int:
    import uvicorn

    uvicorn.run("app.main:app", host="localhost", port=settings.port)
    return 0
