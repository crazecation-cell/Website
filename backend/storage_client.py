import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import HTTPException
from supabase import Client, create_client

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

_client: Client | None = None


def storage_configured() -> bool:
    return bool(os.environ.get("SUPABASE_URL") and os.environ.get("SUPABASE_SECRET_KEY"))


def get_supabase_admin() -> Client:
    global _client
    if _client:
        return _client
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SECRET_KEY")
    if not url or not key:
        raise HTTPException(status_code=503, detail="Supabase Storage is not configured.")
    _client = create_client(url, key)
    return _client
