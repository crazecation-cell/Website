# Crazecation Supabase CMS Setup

This project includes a production-ready Supabase CMS layer for the Crazecation website.

## What the CMS manages

- Home page imagery, counters, client marquee slots and process cards
- Services, including publishing, ordering, images, tags and capability lists
- Client stories and case-study fields
- Testimonials
- Contact-form service options
- Social links
- Media uploads through Supabase Storage
- Contact enquiries and enquiry status

## Required Supabase project setup

1. Create a Supabase project.
2. Go to Project Settings → API and copy:
   - Project URL
   - Publishable key
   - Secret key or legacy service-role key
3. Go to Connect → Transaction Pooler and copy the port `6543` connection string.
4. Go to Storage and create a public bucket named `cms-images`.
5. Go to Authentication → Providers and enable Email/password.

## Backend environment

Add these values to `backend/.env` on the server running FastAPI:

```env
DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_JWKS_URL=https://PROJECT_REF.supabase.co/auth/v1/.well-known/jwks.json
SUPABASE_ISSUER=https://PROJECT_REF.supabase.co/auth/v1
SUPABASE_SECRET_KEY=YOUR_BACKEND_ONLY_SECRET_KEY
SUPABASE_BUCKET=cms-images
MAX_IMAGE_BYTES=5242880
```

The database URL must be the Transaction Pooler URL on port `6543`. Do not use the direct `db.PROJECT_REF.supabase.co:5432` URL.

Never expose `SUPABASE_SECRET_KEY` in frontend code.

## Frontend environment

Add these values to the frontend environment:

```env
REACT_APP_SUPABASE_URL=https://PROJECT_REF.supabase.co
REACT_APP_SUPABASE_PUBLISHABLE_KEY=YOUR_BROWSER_SAFE_PUBLISHABLE_KEY
```

Restart both frontend and backend after changing environment variables.

## Create the database tables

From the backend directory:

```bash
alembic upgrade head
python scripts/seed_supabase.py
```

## Create the first admin

```bash
python scripts/create_admin.py admin@example.com 'TemporaryPassword123!'
```

Then open `/admin/login` and sign in with that email and password.

## Deployment architecture

Supabase hosts:

- Postgres database
- Email/password authentication
- CMS image storage

Supabase does not host the React frontend or FastAPI backend directly. Use:

- Frontend: Vercel or Netlify
- Backend: Render, Railway or another Python host
- Database/Auth/Storage: Supabase

Set the same environment variables in the hosting providers. The frontend must also have `REACT_APP_BACKEND_URL` pointing to the deployed FastAPI URL.

## Security notes

- Admin CMS routes require a Supabase bearer token.
- The token is verified against Supabase JWKS.
- The user must also exist in the `admin_users` table with the `admin` role.
- The public website only reads published services, clients and testimonials.
- Image uploads are limited to JPEG, PNG, WebP and GIF up to 5 MB.
- Contact submissions are stored in Postgres once `DATABASE_URL` is configured.
