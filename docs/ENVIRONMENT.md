# Environment variables

| Variable | Purpose | Where to get it | Public? |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap, and absolute image URLs | Client's production domain / Vercel Domains | Yes; embedded at build time |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project API URL | Supabase Dashboard → Project Settings → API | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key for browser and server clients | Supabase Dashboard → Project Settings → API | Yes; public client key, protected by RLS |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Alternative public key for newer Supabase projects; use when no anon key is configured | Supabase Dashboard → Project Settings → API Keys | Yes; public client key, protected by RLS |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Web3Forms enquiry email access key | Web3Forms account; use the client-owned key after handover | Yes; included in the browser bundle |
| `MPESA_TILL` | Till number included only in the authenticated admin's payment message | Client-owned value; set in local `.env.local` or Vercel Project Settings → Environment Variables | No; server-only |
| `VERIFY_PORT` | Optional local port used by `npm run verify` (default `3187`) | Choose an unused local port if needed | Local verification only |

`NEXT_PUBLIC_` values are fixed into the client bundle at build time. After changing one in Vercel, redeploy the relevant environment. Never create or use a Supabase service-role key for this app. `.env.example` contains placeholders; keep `.env.local` untracked.

`MPESA_TILL` is not a `NEXT_PUBLIC_` variable. Set it only in the server environment (or local `.env.local`), then redeploy. If it is empty, the admin payment-details button stays hidden.
