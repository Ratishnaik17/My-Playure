import asyncio
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker, AsyncEngine
from app.core.config import settings
from app.core.logging import logger


def build_engine() -> AsyncEngine:
    try:
        # Create primary engine
        primary_engine = create_async_engine(
            settings.DATABASE_URL,
            echo=False,
            future=True,
            pool_pre_ping=True,
        )
        return primary_engine
    except Exception as e:
        logger.warning(f"Could not build primary PostgreSQL engine: {e}. Falling back to SQLite.")
        return create_async_engine(settings.SQLITE_FALLBACK_URL, echo=False, future=True)


engine = build_engine()

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
