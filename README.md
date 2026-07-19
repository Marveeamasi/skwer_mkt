# SKWER MKT

WhatsApp-assisted social-commerce checkout, referral, order and repeat-sales platform for Nigerian informal vendors.

The authoritative product specification is `SKWER_MKT.md`. Implementation and verification status is recorded in `progress.md`.

## Local setup

Requirements: Node.js 20+, npm, a Supabase project, and Paystack test credentials. Supabase CLI and Docker are optional when using the hosted project.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Populate `.env.local` only. Never place real service-role, Paystack, Cloudinary, email or signing secrets in `.env.example`.

## Database

Apply migrations in filename order, then apply `supabase/seed.sql` only in a development/test project. The seed uses fictional identities and local-only credentials.

```powershell
npx supabase db reset
```

## Verification

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Paystack test payments require `PAYMENTS_ENABLED="true"` and a test secret key. Live payments must remain disabled until Paystack approval, seller settlement/KYC, legal review and reconciliation testing are complete.

## Local Paystack webhook

See `docs/paystack-local-webhook.md`. The endpoint is:

```text
POST /api/webhooks/paystack
```

Paystack cannot call localhost directly. Use the included ngrok script only while intentionally exposing the local test application.

## Deployment

Recommended production stack: Vercel, hosted Supabase, a custom HTTPS domain and Paystack-approved split/subaccount configuration. Configure the production callback and webhook URLs from the final domain, review all policy placeholders professionally, run the complete verification suite, inspect the client bundle for secrets and confirm RLS before enabling live collection.
