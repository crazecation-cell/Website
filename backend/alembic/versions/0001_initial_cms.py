"""initial supabase cms schema

Revision ID: 0001_initial_cms
Revises:
Create Date: 2026-07-01
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0001_initial_cms"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute('CREATE EXTENSION IF NOT EXISTS pgcrypto')

    op.create_table(
        "admin_users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("supabase_user_id", sa.String(64), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("role", sa.String(40), nullable=False, server_default="admin"),
        sa.Column("disabled", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("supabase_user_id"),
        sa.UniqueConstraint("email"),
    )
    op.create_index("ix_admin_users_supabase_user_id", "admin_users", ["supabase_user_id"])
    op.create_index("ix_admin_users_email", "admin_users", ["email"])

    op.create_table(
        "site_content",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("section", sa.String(80), nullable=False),
        sa.Column("content", postgresql.JSONB(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("section"),
    )
    op.create_index("ix_site_content_section", "site_content", ["section"])

    common = [
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("published", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    ]

    op.create_table(
        "services",
        *common,
        sa.Column("number", sa.String(12), nullable=False),
        sa.Column("name", sa.String(160), nullable=False),
        sa.Column("short", sa.Text(), nullable=False),
        sa.Column("headline", postgresql.JSONB(), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("items", postgresql.JSONB(), nullable=False),
        sa.Column("tag", sa.String(80)),
        sa.Column("image_url", sa.Text()),
        sa.UniqueConstraint("number"),
    )
    op.create_index("ix_services_number", "services", ["number"])
    op.create_index("ix_services_sort_order", "services", ["sort_order"])
    op.create_index("ix_services_published", "services", ["published"])

    op.create_table(
        "client_cases",
        *common,
        sa.Column("name", sa.String(180), nullable=False),
        sa.Column("industry", sa.String(120), nullable=False),
        sa.Column("category", sa.String(80)),
        sa.Column("challenge", sa.Text(), nullable=False),
        sa.Column("services_provided", sa.Text(), nullable=False),
        sa.Column("approach", sa.Text(), nullable=False),
        sa.Column("result", sa.Text(), nullable=False),
        sa.Column("website_url", sa.Text()),
        sa.Column("social_url", sa.Text()),
        sa.Column("image_url", sa.Text()),
    )
    op.create_index("ix_client_cases_category", "client_cases", ["category"])
    op.create_index("ix_client_cases_sort_order", "client_cases", ["sort_order"])
    op.create_index("ix_client_cases_published", "client_cases", ["published"])

    op.create_table(
        "testimonials",
        *common,
        sa.Column("client_name", sa.String(160), nullable=False),
        sa.Column("role", sa.String(160)),
        sa.Column("company", sa.String(160)),
        sa.Column("quote", sa.Text(), nullable=False),
        sa.Column("image_url", sa.Text()),
    )
    op.create_index("ix_testimonials_sort_order", "testimonials", ["sort_order"])
    op.create_index("ix_testimonials_published", "testimonials", ["published"])

    op.create_table(
        "media_assets",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("bucket", sa.String(120), nullable=False),
        sa.Column("object_path", sa.Text(), nullable=False),
        sa.Column("public_url", sa.Text(), nullable=False),
        sa.Column("mime_type", sa.String(80), nullable=False),
        sa.Column("byte_size", sa.BigInteger(), nullable=False),
        sa.Column("uploaded_by", sa.String(64), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("object_path"),
    )

    op.create_table(
        "contact_enquiries",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("brand", sa.String(160), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(30), nullable=False),
        sa.Column("service", sa.String(120), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("status", sa.String(40), nullable=False, server_default="new"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_index("ix_contact_enquiries_email", "contact_enquiries", ["email"])
    op.create_index("ix_contact_enquiries_status", "contact_enquiries", ["status"])
    op.create_index("ix_contact_enquiries_created_at", "contact_enquiries", ["created_at"])


def downgrade() -> None:
    op.drop_table("contact_enquiries")
    op.drop_table("media_assets")
    op.drop_table("testimonials")
    op.drop_table("client_cases")
    op.drop_table("services")
    op.drop_table("site_content")
    op.drop_table("admin_users")
