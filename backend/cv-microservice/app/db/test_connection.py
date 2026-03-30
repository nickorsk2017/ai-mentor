from __future__ import annotations

import asyncio

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

from app.config import settings


ASYNC_DB_URL = settings.database_url


async def test() -> None:
    engine = create_async_engine(ASYNC_DB_URL, echo=True)

    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT 1"))
        print("connected:", result.scalar())

    await engine.dispose()


def main() -> int:
    asyncio.run(test())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())