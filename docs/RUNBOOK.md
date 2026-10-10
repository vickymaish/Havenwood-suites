# Operations runbook

## Site returns a 404

1. In Vercel, confirm the project points at this repository and the correct production branch, and that the Root Directory is the repository root.
2. Confirm the framework is Next.js and the Build Command is `npm run build`. Check the deployment build log for the first error, then redeploy after correcting it.
3. Confirm the route exists in `app/` and the domain is assigned to the correct Vercel project. This repository has no custom `vercel.json`, `basePath`, `assetPrefix`, static export, or custom output directory.

## Site returns a 500

1. In Vercel, open the failed deployment's Functions/Runtime Logs and note the first exception and route.
2. Check the deployment environment contains the required Supabase URL and public key. Public pages are designed to render without Supabase; the owner login screen explains when admin configuration is missing.
3. Check Supabase project status, database connectivity, and RLS policies. Do not add a service-role key to fix a public request.
4. Run `npm run verify` locally and compare the first failing route or build error.

## Enquiries stop arriving

1. Submit a test enquiry and check whether it appears in `/admin/enquiries`; Supabase storage and Web3Forms email are independent.
2. Check Vercel environment variables for `NEXT_PUBLIC_WEB3FORMS_KEY`, then redeploy because public variables are baked into the build.
3. Check the Web3Forms account's email usage and whether the shared key's roughly 250 monthly messages have been used. Move to a client-owned key using [Enquiry email](ENQUIRY-EMAIL.md).
4. If the enquiry is absent in Supabase, check the project status, database tables, and RLS insert policy. Keep the guest's alternate WhatsApp contact available while investigating.

## Supabase is paused

Free projects with low database activity can be paused after a week of inactivity. The owner should open Supabase Dashboard, select the project, and choose **Resume project**. Wait for it to become healthy, then test the site and admin dashboard. See [Supabase's project pausing guide](https://supabase.com/docs/guides/platform/free-project-pausing) for current details.

## Run local verification

1. Configure `.env.local` with placeholders replaced by the relevant project values.
2. Run `npm run verify` from the repository root. It runs lint, creates the production build, starts the production server, and requests `/`, `/robots.txt`, and `/admin/login`.
3. All three routes should return HTTP 200. Review the command output for the first build or request failure.
