# Havenwood Suites

A Next.js site for a private three-bedroom house in Eldoret. Guests can enquire about one, two, or all three bedrooms; the house remains private to their group, and unused bedrooms stay locked. Enquiries are stored in Supabase and also sent through Web3Forms.

## Project structure

- `app/` contains the public site, SEO routes, and owner dashboard.
- `components/` contains the public sections, gallery, booking selector, enquiry form, and dashboard UI.
- `data/site.ts` is the single source for property identity, contact details, base prices, guest limits, hero image, and image crop.
- `data/content.ts` contains the approved public copy.
- `data/photos.ts` maps the house photos to listings and gallery labels.
- `lib/` contains validation, contacts, photo selection, public settings, and Supabase clients.
- `supabase/migrations/` contains the enquiry-bedroom migration.
- `docs/` contains [handover](docs/HANDOVER.md), [email](docs/ENQUIRY-EMAIL.md), [admin](docs/ADMIN-GUIDE.md), [environment](docs/ENVIRONMENT.md), [content checklist](docs/CONTENT-CHECKLIST.md), and [runbook](docs/RUNBOOK.md) guides.

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set the values described in [Environment](docs/ENVIRONMENT.md).
3. Start the development server with `npm run dev`.
4. Run `npm run verify` before deployment. It runs lint, unit tests, the previous-client leftovers check, and the production build.
5. Run `npm run smoke` against the running production server. `BASE_URL` defaults to `http://localhost:3000`.

## Updating property content and photos

1. Review open owner-confirmation items in [the content checklist](docs/CONTENT-CHECKLIST.md) before launch.
2. Edit approved page copy in `data/content.ts`.
3. Add the owner-approved image files to `public/images`, add entries to `data/photos.ts`, and choose an existing photo for `heroImage` in `data/site.ts`. Set the desktop and mobile crop in `heroObjectPosition`.
4. `node scripts/audit-images.mjs` reports image dimensions and hashes.

## Supabase setup

1. Configure the public project URL and anon or publishable key. This app does not use a service-role key.
2. Apply `supabase/migrations/202610060001_add_enquiry_bedrooms.sql` and confirm the `enquiries`, `blocked_dates`, and `site_settings` tables and their row-level security policies are present.
3. In Supabase Authentication, disable public sign-ups and create the owner's user. There is no default login or public sign-up page.
4. Add the same environment variables to the required Vercel environments and redeploy.
5. Review Settings in `/admin/settings`; replace any unset or inherited values with owner-confirmed information.

## Admin acceptance checklist

1. Log in at `/admin/login` with the owner account created in Supabase.
2. Change an enquiry's status and confirm the change persists after reloading.
3. Use **Reply on WhatsApp** on an enquiry.
4. Add a blocked date range in Availability, confirm it appears, then delete it.
5. Edit the bedroom prices in Settings and confirm the public stay cards use those values.
6. Mark a test enquiry **Confirmed** and use **Send payment details**; the button appears only when the server environment has `MPESA_TILL` set.
7. In a private browser window while signed out, confirm `/admin` redirects to `/admin/login`.
8. Confirm an anonymous Supabase session cannot read enquiry records. Run `npm run check:rls` with the public Supabase URL and anon key to check the policy; it does not insert data.
9. To exercise owner permissions, provide `TEST_ADMIN_EMAIL` and `TEST_ADMIN_PASSWORD` in the process environment and run `npm run check:admin`. This signs in, lists enquiries, creates and removes a future blocked range, and signs out.

See [Admin guide](docs/ADMIN-GUIDE.md), [Environment guide](docs/ENVIRONMENT.md), and [Handover guide](docs/HANDOVER.md) for operating details. Keep `.env.local` private and never commit credentials.
