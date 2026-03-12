# HighRiskIntel

HighRiskIntel is a Next.js 14 application for high-risk merchant onboarding, payment risk intake, processor connectivity, statement uploads, and merchant dashboard monitoring.

## What is included

- Detailed public SaaS landing page
- `sign in` and `sign up` flows
- Post-signup onboarding survey for merchant underwriting intake
- Processor connection route scaffolding
- Statement upload route scaffolding
- Protected dashboard pages with sample-data fallback
- Prisma schema for users, merchants, transactions, alerts, reports, and uploads
- Supabase helpers for auth and storage
- Risk scoring, MID health, alert generation, and weekly report helpers

## Environment

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Important values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`
- `SESSION_SECRET`
- `ENCRYPTION_KEY`
- `STRIPE_SECRET_KEY`

`ENCRYPTION_KEY` must be a 64-character hex string for AES-256 secret encryption.

## Setup

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## Notes

- The app uses Supabase Auth plus a signed app session cookie for protected routing.
- Statement parsing and processor sync are scaffolded in-process. For production, move those steps into a queue or background job system.
- Stripe connection is the most complete connector. Checkout.com, Adyen, MXMerchant, and Authorize.net are structured but still need live credential testing.
- Supabase storage expects a bucket named `statement-uploads`.
- You should add Supabase row-level security policies that mirror the merchant ownership checks used in the server routes.

## Suggested next production steps

1. Install dependencies and run Prisma against Supabase Postgres.
2. Add the missing UI polish from your final design components if you already have them elsewhere.
3. Connect background jobs for statement parsing and processor sync.
4. Add stronger webhook verification and audit logging.
5. Push this repo to GitHub and connect it to Vercel.
