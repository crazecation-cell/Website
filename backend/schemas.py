from datetime import datetime
from typing import Any, Literal
import uuid

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ContactEnquiryCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    brand: str = Field(min_length=2, max_length=160)
    email: EmailStr
    phone: str = Field(min_length=5, max_length=30)
    service: str = Field(min_length=2, max_length=120)
    message: str = Field(min_length=10, max_length=3000)


class ContactResponse(BaseModel):
    status: str
    message: str
    enquiry_id: str


class ContentUpdate(BaseModel):
    content: dict[str, Any]


class ServiceInput(BaseModel):
    number: str = Field(min_length=1, max_length=12)
    name: str = Field(min_length=2, max_length=160)
    short: str = Field(min_length=2)
    headline: list[str] = Field(default_factory=list)
    body: str = Field(min_length=2)
    items: list[str] = Field(default_factory=list)
    tag: str | None = None
    image_url: str | None = None
    sort_order: int = 0
    published: bool = True


class ClientInput(BaseModel):
    name: str = Field(min_length=2, max_length=180)
    industry: str = Field(min_length=2, max_length=120)
    category: str | None = None
    challenge: str = Field(min_length=2)
    services_provided: str = Field(min_length=2)
    approach: str = Field(min_length=2)
    result: str = Field(min_length=2)
    website_url: str | None = None
    social_url: str | None = None
    image_url: str | None = None
    sort_order: int = 0
    published: bool = True


class TestimonialInput(BaseModel):
    client_name: str = Field(min_length=2, max_length=160)
    role: str | None = None
    company: str | None = None
    quote: str = Field(min_length=5)
    image_url: str | None = None
    sort_order: int = 0
    published: bool = True


class EnquiryUpdate(BaseModel):
    status: Literal["new", "read", "replied", "archived"]


class AdminModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


def serialize_base(obj) -> dict[str, Any]:
    data = {column.name: getattr(obj, column.name) for column in obj.__table__.columns}
    for key, value in data.items():
        if isinstance(value, uuid.UUID):
            data[key] = str(value)
        elif isinstance(value, datetime):
            data[key] = value.isoformat()
    return data


def serialize_service(obj) -> dict[str, Any]:
    data = serialize_base(obj)
    data["image"] = data.get("image_url")
    return data


def serialize_client(obj) -> dict[str, Any]:
    data = serialize_base(obj)
    data["services"] = data.get("services_provided")
    data["image"] = data.get("image_url")
    data["links"] = " / ".join(filter(None, [data.get("website_url"), data.get("social_url")])) or "Add website / social links."
    return data


def serialize_testimonial(obj) -> dict[str, Any]:
    data = serialize_base(obj)
    data["image"] = data.get("image_url")
    return data
