from datetime import datetime, timezone
import io
import logging
import os
from pathlib import Path
from typing import Annotated
import uuid

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, File, HTTPException, UploadFile
from motor.motor_asyncio import AsyncIOMotorClient
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.middleware.cors import CORSMiddleware

from auth import auth_configured, require_admin
from cms_defaults import DEFAULT_CLIENTS, DEFAULT_CONTENT, DEFAULT_SERVICES, DEFAULT_TESTIMONIALS
from database import database_configured, get_db, get_sessionmaker
from models import AdminUser, ClientCase, ContactEnquiry, MediaAsset, Service, SiteContent, Testimonial
from schemas import (
    ClientInput,
    ContactEnquiryCreate,
    ContactResponse,
    ContentUpdate,
    EnquiryUpdate,
    ServiceInput,
    TestimonialInput,
    serialize_base,
    serialize_client,
    serialize_service,
    serialize_testimonial,
)
from storage_client import get_supabase_admin, storage_configured

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
mongo_client = AsyncIOMotorClient(mongo_url)
mongo_db = mongo_client[os.environ['DB_NAME']]

app = FastAPI(title="Crazecation API")
api_router = APIRouter(prefix="/api")

ALLOWED_IMAGE_MIME = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif"}


def default_public_payload() -> dict:
    return {
        "configured": False,
        "content": DEFAULT_CONTENT,
        "services": [{**item, "id": f"default-service-{item['number']}", "image": item.get("image_url")} for item in DEFAULT_SERVICES],
        "clients": [{**item, "id": f"default-client-{index}", "services": item["services_provided"], "image": item.get("image_url"), "links": "Add website / social links."} for index, item in enumerate(DEFAULT_CLIENTS, 1)],
        "testimonials": DEFAULT_TESTIMONIALS,
    }


async def public_cms_payload() -> dict:
    if not database_configured():
        return default_public_payload()
    try:
        session_factory = get_sessionmaker()
        async with session_factory() as session:
            content_rows = (await session.execute(select(SiteContent))).scalars().all()
            services = (await session.execute(select(Service).where(Service.published.is_(True)).order_by(Service.sort_order, Service.number))).scalars().all()
            clients = (await session.execute(select(ClientCase).where(ClientCase.published.is_(True)).order_by(ClientCase.sort_order, ClientCase.created_at))).scalars().all()
            testimonials = (await session.execute(select(Testimonial).where(Testimonial.published.is_(True)).order_by(Testimonial.sort_order, Testimonial.created_at))).scalars().all()
        content = {section: data for section, data in DEFAULT_CONTENT.items()}
        content.update({row.section: row.content for row in content_rows})
        return {
            "configured": True,
            "content": content,
            "services": [serialize_service(item) for item in services] or default_public_payload()["services"],
            "clients": [serialize_client(item) for item in clients] or default_public_payload()["clients"],
            "testimonials": [serialize_testimonial(item) for item in testimonials],
        }
    except (SQLAlchemyError, HTTPException):
        payload = default_public_payload()
        payload["setup_required"] = True
        return payload


def detect_image_mime(data: bytes, declared: str | None) -> str:
    detected = None
    if data.startswith(b"\xff\xd8\xff"):
        detected = "image/jpeg"
    elif data.startswith(b"\x89PNG\r\n\x1a\n"):
        detected = "image/png"
    elif data.startswith((b"GIF87a", b"GIF89a")):
        detected = "image/gif"
    elif len(data) > 12 and data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        detected = "image/webp"
    if not detected or detected != declared:
        raise HTTPException(status_code=415, detail="File content must match a JPEG, PNG, WebP or GIF image.")
    return detected


@api_router.get("/")
async def root():
    return {
        "message": "Crazecation API is running",
        "supabase_database": database_configured(),
        "supabase_auth": auth_configured(),
        "supabase_storage": storage_configured(),
    }


@api_router.get("/cms/public")
async def get_public_cms():
    return await public_cms_payload()


@api_router.post("/contact", response_model=ContactResponse, status_code=201)
async def create_contact_enquiry(payload: ContactEnquiryCreate):
    if database_configured():
        try:
            session_factory = get_sessionmaker()
            async with session_factory() as session:
                enquiry = ContactEnquiry(**payload.model_dump())
                session.add(enquiry)
                await session.commit()
                await session.refresh(enquiry)
                enquiry_id = str(enquiry.id)
        except SQLAlchemyError as exc:
            raise HTTPException(status_code=503, detail="Supabase database is configured but unavailable.") from exc
    else:
        enquiry_id = str(uuid.uuid4())
        doc = payload.model_dump(mode="json")
        doc.update({"id": enquiry_id, "status": "new", "created_at": datetime.now(timezone.utc).isoformat()})
        await mongo_db.contact_enquiries.insert_one(doc)
    return ContactResponse(status="received", message="WE GOT IT. We'll get back to you soon.", enquiry_id=enquiry_id)


@api_router.get("/admin/setup-status")
async def admin_setup_status():
    return {
        "database": database_configured(),
        "auth": auth_configured(),
        "storage": storage_configured(),
        "bucket": os.environ.get("SUPABASE_BUCKET", "cms-images"),
    }


@api_router.get("/admin/me")
async def admin_me(admin: Annotated[AdminUser, Depends(require_admin)]):
    return serialize_base(admin)


@api_router.get("/admin/content")
async def admin_content(_: Annotated[AdminUser, Depends(require_admin)], db: Annotated[AsyncSession, Depends(get_db)]):
    rows = (await db.execute(select(SiteContent))).scalars().all()
    content = {section: data for section, data in DEFAULT_CONTENT.items()}
    content.update({row.section: row.content for row in rows})
    return content


@api_router.put("/admin/content/{section}")
async def update_content(section: str, payload: ContentUpdate, _: Annotated[AdminUser, Depends(require_admin)], db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(select(SiteContent).where(SiteContent.section == section))
    row = result.scalar_one_or_none()
    if row:
        row.content = payload.content
    else:
        row = SiteContent(section=section, content=payload.content)
        db.add(row)
    await db.commit()
    return {"section": section, "content": payload.content}


async def list_model(db: AsyncSession, model):
    result = await db.execute(select(model).order_by(model.sort_order, model.created_at))
    return result.scalars().all()


@api_router.get("/admin/services")
async def admin_services(_: Annotated[AdminUser, Depends(require_admin)], db: Annotated[AsyncSession, Depends(get_db)]):
    return [serialize_service(item) for item in await list_model(db, Service)]


@api_router.post("/admin/services", status_code=201)
async def create_service(payload: ServiceInput, _: Annotated[AdminUser, Depends(require_admin)], db: Annotated[AsyncSession, Depends(get_db)]):
    item = Service(**payload.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return serialize_service(item)


@api_router.put("/admin/services/{item_id}")
async def update_service(item_id: str, payload: ServiceInput, _: Annotated[AdminUser, Depends(require_admin)], db: Annotated[AsyncSession, Depends(get_db)]):
    item = await db.get(Service, uuid.UUID(item_id))
    if not item:
        raise HTTPException(status_code=404, detail="Service not found")
    for key, value in payload.model_dump().items():
        setattr(item, key, value)
    await db.commit()
    return serialize_service(item)


@api_router.delete("/admin/services/{item_id}", status_code=204)
async def delete_service(item_id: str, _: Annotated[AdminUser, Depends(require_admin)], db: Annotated[AsyncSession, Depends(get_db)]):
    item = await db.get(Service, uuid.UUID(item_id))
    if not item:
        raise HTTPException(status_code=404, detail="Service not found")
    await db.delete(item)
    await db.commit()


@api_router.get("/admin/clients")
async def admin_clients(_: Annotated[AdminUser, Depends(require_admin)], db: Annotated[AsyncSession, Depends(get_db)]):
    return [serialize_client(item) for item in await list_model(db, ClientCase)]


@api_router.post("/admin/clients", status_code=201)
async def create_client_case(payload: ClientInput, _: Annotated[AdminUser, Depends(require_admin)], db: Annotated[AsyncSession, Depends(get_db)]):
    item = ClientCase(**payload.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return serialize_client(item)


@api_router.put("/admin/clients/{item_id}")
async def update_client_case(item_id: str, payload: ClientInput, _: Annotated[AdminUser, Depends(require_admin)], db: Annotated[AsyncSession, Depends(get_db)]):
    item = await db.get(ClientCase, uuid.UUID(item_id))
    if not item:
        raise HTTPException(status_code=404, detail="Client not found")
    for key, value in payload.model_dump().items():
        setattr(item, key, value)
    await db.commit()
    return serialize_client(item)


@api_router.delete("/admin/clients/{item_id}", status_code=204)
async def delete_client_case(item_id: str, _: Annotated[AdminUser, Depends(require_admin)], db: Annotated[AsyncSession, Depends(get_db)]):
    item = await db.get(ClientCase, uuid.UUID(item_id))
    if not item:
        raise HTTPException(status_code=404, detail="Client not found")
    await db.delete(item)
    await db.commit()


@api_router.get("/admin/testimonials")
async def admin_testimonials(_: Annotated[AdminUser, Depends(require_admin)], db: Annotated[AsyncSession, Depends(get_db)]):
    return [serialize_testimonial(item) for item in await list_model(db, Testimonial)]


@api_router.post("/admin/testimonials", status_code=201)
async def create_testimonial(payload: TestimonialInput, _: Annotated[AdminUser, Depends(require_admin)], db: Annotated[AsyncSession, Depends(get_db)]):
    item = Testimonial(**payload.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return serialize_testimonial(item)


@api_router.put("/admin/testimonials/{item_id}")
async def update_testimonial(item_id: str, payload: TestimonialInput, _: Annotated[AdminUser, Depends(require_admin)], db: Annotated[AsyncSession, Depends(get_db)]):
    item = await db.get(Testimonial, uuid.UUID(item_id))
    if not item:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    for key, value in payload.model_dump().items():
        setattr(item, key, value)
    await db.commit()
    return serialize_testimonial(item)


@api_router.delete("/admin/testimonials/{item_id}", status_code=204)
async def delete_testimonial(item_id: str, _: Annotated[AdminUser, Depends(require_admin)], db: Annotated[AsyncSession, Depends(get_db)]):
    item = await db.get(Testimonial, uuid.UUID(item_id))
    if not item:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    await db.delete(item)
    await db.commit()


@api_router.get("/admin/enquiries")
async def admin_enquiries(_: Annotated[AdminUser, Depends(require_admin)], db: Annotated[AsyncSession, Depends(get_db)]):
    rows = (await db.execute(select(ContactEnquiry).order_by(ContactEnquiry.created_at.desc()).limit(300))).scalars().all()
    return [serialize_base(item) for item in rows]


@api_router.patch("/admin/enquiries/{item_id}")
async def update_enquiry(item_id: str, payload: EnquiryUpdate, _: Annotated[AdminUser, Depends(require_admin)], db: Annotated[AsyncSession, Depends(get_db)]):
    item = await db.get(ContactEnquiry, uuid.UUID(item_id))
    if not item:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    item.status = payload.status
    await db.commit()
    return serialize_base(item)


@api_router.get("/admin/media")
async def admin_media(_: Annotated[AdminUser, Depends(require_admin)], db: Annotated[AsyncSession, Depends(get_db)]):
    rows = (await db.execute(select(MediaAsset).order_by(MediaAsset.created_at.desc()).limit(200))).scalars().all()
    return [serialize_base(item) for item in rows]


@api_router.post("/admin/media", status_code=201)
async def upload_media(
    admin: Annotated[AdminUser, Depends(require_admin)],
    db: Annotated[AsyncSession, Depends(get_db)],
    file: UploadFile = File(...),
):
    if not storage_configured():
        raise HTTPException(status_code=503, detail="Supabase Storage is not configured.")
    max_bytes = int(os.environ.get("MAX_IMAGE_BYTES", str(5 * 1024 * 1024)))
    data = await file.read(max_bytes + 1)
    if not data:
        raise HTTPException(status_code=400, detail="Empty file")
    if len(data) > max_bytes:
        raise HTTPException(status_code=413, detail="Image exceeds the 5 MB limit")
    detected = detect_image_mime(data, file.content_type)
    object_path = f"cms/{admin.supabase_user_id}/{uuid.uuid4().hex}.{ALLOWED_IMAGE_MIME[detected]}"
    bucket = os.environ.get("SUPABASE_BUCKET", "cms-images")
    client = get_supabase_admin()
    try:
        client.storage.from_(bucket).upload(
            path=object_path,
            file=io.BytesIO(data),
            file_options={"content-type": detected, "cache-control": "31536000, immutable", "upsert": "false"},
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Storage upload failed: {exc}") from exc
    public_url = f"{os.environ['SUPABASE_URL'].rstrip('/')}/storage/v1/object/public/{bucket}/{object_path}"
    asset = MediaAsset(bucket=bucket, object_path=object_path, public_url=public_url, mime_type=detected, byte_size=len(data), uploaded_by=admin.supabase_user_id)
    db.add(asset)
    await db.commit()
    await db.refresh(asset)
    return serialize_base(asset)


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    mongo_client.close()
