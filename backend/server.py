from datetime import datetime, timezone
import logging
import os
from pathlib import Path
import uuid

from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Crazecation API")
api_router = APIRouter(prefix="/api")


class ContactEnquiryCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    brand: str = Field(min_length=2, max_length=160)
    email: EmailStr
    phone: str = Field(min_length=5, max_length=30)
    service: str = Field(min_length=2, max_length=120)
    message: str = Field(min_length=10, max_length=3000)


class ContactEnquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    brand: str
    email: EmailStr
    phone: str
    service: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    def to_mongo(self) -> dict:
        doc = self.model_dump(mode="json")
        doc["created_at"] = self.created_at.isoformat()
        return doc


class ContactResponse(BaseModel):
    status: str
    message: str
    enquiry_id: str


@api_router.get("/")
async def root():
    return {"message": "Crazecation API is running"}


@api_router.post("/contact", response_model=ContactResponse, status_code=201)
async def create_contact_enquiry(payload: ContactEnquiryCreate):
    enquiry = ContactEnquiry(**payload.model_dump())
    await db.contact_enquiries.insert_one(enquiry.to_mongo())
    return ContactResponse(
        status="received",
        message="WE GOT IT. We'll get back to you soon.",
        enquiry_id=enquiry.id,
    )


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
    client.close()
