import asyncio
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import select
from supabase import create_client

ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT_DIR))
load_dotenv(ROOT_DIR / ".env")

from database import get_sessionmaker
from models import AdminUser


async def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("Usage: python scripts/create_admin.py admin@example.com 'TemporaryPassword123!'")
    email, password = sys.argv[1], sys.argv[2]
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SECRET_KEY")
    if not url or not key:
        raise SystemExit("SUPABASE_URL and SUPABASE_SECRET_KEY are required")

    auth_admin = create_client(url, key)
    response = auth_admin.auth.admin.create_user({"email": email, "password": password, "email_confirm": True})
    user = response.user
    if not user:
        raise SystemExit("Supabase did not return a user")

    session_factory = get_sessionmaker()
    async with session_factory() as session:
        result = await session.execute(select(AdminUser).where(AdminUser.supabase_user_id == user.id))
        admin = result.scalar_one_or_none()
        if not admin:
            session.add(AdminUser(supabase_user_id=user.id, email=email, role="admin", disabled=False))
        else:
            admin.email = email
            admin.disabled = False
        await session.commit()
    print(f"Admin ready: {email} / Supabase user {user.id}")


if __name__ == "__main__":
    asyncio.run(main())
