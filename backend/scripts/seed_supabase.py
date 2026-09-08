import asyncio
import sys
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import select

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT_DIR))
load_dotenv(ROOT_DIR / ".env")

from cms_defaults import DEFAULT_CLIENTS, DEFAULT_CONTENT, DEFAULT_SERVICES
from database import get_sessionmaker
from models import ClientCase, Service, SiteContent


async def upsert_content(session, section: str, content: dict) -> None:
    result = await session.execute(select(SiteContent).where(SiteContent.section == section))
    row = result.scalar_one_or_none()
    if row:
        row.content = content
    else:
        session.add(SiteContent(section=section, content=content))


async def upsert_service(session, data: dict) -> None:
    result = await session.execute(select(Service).where(Service.number == data["number"]))
    row = result.scalar_one_or_none()
    if row:
        for key, value in data.items():
            setattr(row, key, value)
    else:
        session.add(Service(**data))


async def main() -> None:
    session_factory = get_sessionmaker()
    async with session_factory() as session:
        for section, content in DEFAULT_CONTENT.items():
            await upsert_content(session, section, content)
        for service in DEFAULT_SERVICES:
            await upsert_service(session, service)
        result = await session.execute(select(ClientCase).limit(1))
        if not result.scalar_one_or_none():
            for client in DEFAULT_CLIENTS:
                session.add(ClientCase(**client))
        await session.commit()
    print("Supabase CMS seed complete")


if __name__ == "__main__":
    asyncio.run(main())
