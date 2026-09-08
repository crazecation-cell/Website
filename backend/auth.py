import os
from pathlib import Path
from typing import Annotated, Any

import jwt
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient, PyJWKClientError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import AdminUser

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

bearer = HTTPBearer(auto_error=False)
_jwks_client = None


def auth_configured() -> bool:
    return bool(os.environ.get("SUPABASE_JWKS_URL") and os.environ.get("SUPABASE_ISSUER"))


def get_jwks_client() -> PyJWKClient:
    global _jwks_client
    if _jwks_client:
        return _jwks_client
    jwks_url = os.environ.get("SUPABASE_JWKS_URL")
    if not jwks_url:
        raise HTTPException(status_code=503, detail="Supabase Auth is not configured.")
    _jwks_client = PyJWKClient(jwks_url, cache_jwk_set=True)
    return _jwks_client


async def current_claims(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
) -> dict[str, Any]:
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")
    try:
        signing_key = get_jwks_client().get_signing_key_from_jwt(credentials.credentials).key
        return jwt.decode(
            credentials.credentials,
            signing_key,
            algorithms=["RS256", "ES256", "EdDSA"],
            audience="authenticated",
            issuer=os.environ["SUPABASE_ISSUER"],
            options={"require": ["sub", "exp", "iss", "aud"]},
        )
    except KeyError as exc:
        raise HTTPException(status_code=503, detail="Supabase Auth issuer is not configured.") from exc
    except (jwt.PyJWTError, PyJWKClientError) as exc:
        raise HTTPException(status_code=401, detail="Invalid or expired token") from exc


async def require_admin(
    claims: Annotated[dict[str, Any], Depends(current_claims)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> AdminUser:
    result = await db.execute(
        select(AdminUser).where(
            AdminUser.supabase_user_id == claims["sub"],
            AdminUser.role == "admin",
            AdminUser.disabled.is_(False),
        )
    )
    admin = result.scalar_one_or_none()
    if not admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return admin
