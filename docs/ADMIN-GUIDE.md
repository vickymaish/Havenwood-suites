# Owner admin guide

## Sign in and account recovery

1. Open `/admin/login` and sign in with the owner account created in Supabase Authentication. There is no default login and the site has no public sign-up flow.
2. To reset a lost password, open the Supabase project, go to **Authentication → Users**, select the owner's user, and send a password recovery email from the user actions. The link should return to `/admin/reset-password`; add that URL to the Supabase Auth redirect allow-list if required. Follow the link to choose a new password.

## Daily flow

1. Open **Enquiries** and review requests marked **New**. Check the dates and guest count, then reply by WhatsApp or email.
2. Mark a request **Contacted** after replying. Mark it **Confirmed** only after the host and guest agree, or **Declined** if it cannot be accepted. The dashboard flags overlaps for review; it does not accept bookings automatically.
3. In **Availability**, add a blocked date range for owner use, maintenance, or closure. The start date is included and the end date is the checkout boundary. Remove blocks when dates reopen.
4. In **Settings**, update confirmed prices, guest limits, check-in/out times, tagline, and welcome copy. The WhatsApp contact is maintained in `data/site.ts` and is read-only in Settings.
5. After marking an enquiry **Confirmed**, use **Send payment details** to open the prepared WhatsApp message. This button appears only when the server environment has `MPESA_TILL` set.
6. Sign out when finished. Supabase row-level security protects admin data; do not disable it to make public availability queries work.
