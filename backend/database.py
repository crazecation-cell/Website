import os
from pathlib import Path
from urllib.parse import urlparse

from dotenv import load_dotenv
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

_engine = None
_sessionmaker = None


def database_url() -> str | None:
    return os.environ.get("DATABASE_URL")


def database_configured() -> bool:
    return bool(database_url())


def validate_pooler_url(url: str) -> None:
    parsed = urlparse(url)
    host = parsed.hostname or ""
    if parsed.port != 6543 or "pooler.supabase.com" not in host:
        raise HTTPException(
            status_code=500,
            detail="DATABASE_URL must be the Supabase Transaction Pooler URL on port 6543.",
        )


def get_engine():
    global _engine
    if _engine:
        return _engine
    url = database_url()
    if not url:
        raise HTTPException(status_code=503, detail="Supabase DATABASE_URL is not configured.")
    validate_pooler_url(url)
    _engine = create_async_engine(
        url.replace("postgresql://", "postgresql+asyncpg://", 1),
        pool_size=10,
        max_overflow=5,
        pool_timeout=30,
        pool_recycle=1800,
        pool_pre_ping=False,
        echo=False,
        connect_args={"statement_cache_size": 0, "command_timeout": 30},
    )
    return _engine


def get_sessionmaker():
    global _sessionmaker
    if not _sessionmaker:
        _sessionmaker = async_sessionmaker(
            bind=get_engine(),
            class_=AsyncSession,
            expire_on_commit=False,
            autocommit=False,
            autoflush=False,
        )
    return _sessionmaker


async def get_db():
    session_factory = get_sessionmaker()
    async with session_factory() as session:
        yield session
