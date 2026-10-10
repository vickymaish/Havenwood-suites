# Enquiry email

## Current setup

The email notification uses a shared Web3Forms access key registered to the developer. The key is supplied through `NEXT_PUBLIC_WEB3FORMS_KEY`; it is not hard-coded in the application. Web3Forms currently allows roughly 250 emails per month on the shared key, across sites. Enquiries are also saved separately in the site's Supabase `enquiries` table when that service is available.

The email subject includes the property name and guest dates, the sender name is the property website, and the property name is included in the email body.

## Move to a client-owned key

1. Go to [web3forms.com](https://web3forms.com/) and create an account/key using the client's email address.
2. In Vercel, open the project, then **Settings → Environment Variables**. Set `NEXT_PUBLIC_WEB3FORMS_KEY` to the new key for each environment used by the client.
3. Redeploy the project with the build cache cleared so the `NEXT_PUBLIC_` value is included in the client bundle.
4. Submit a test enquiry using the deployed site.
5. Confirm the message arrives at the configured recipient and that the enquiry also appears in the Supabase admin dashboard.

Never write a real access key in this guide, source code, or a committed environment file. Because the variable is public in the browser bundle, treat it as an application access key, not a server-only secret.
