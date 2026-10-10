# Client handover

## Accounts and ownership

| Service | Owner | Transfer at handover |
| --- | --- | --- |
| GitHub repository | Client should be the organization/repository owner; developer is a collaborator | Transfer repository ownership or move it into the client's organization; confirm client admin access and branch/deployment settings. |
| Vercel project | Client should own the team and project | Transfer the project or recreate it in the client's team; confirm domain, production branch, build settings, environment variables, and deployment access. |
| Supabase project | Client should own the organization and project | Transfer project/organization ownership; confirm database, migrations, Auth users, RLS policies, backups, and billing access. Never provide a service-role key to the site. |
| Web3Forms | Client should own the account and production access key | Replace the shared developer key with a client-owned key. Follow [Enquiry email](ENQUIRY-EMAIL.md). |
| Domain registrar | Client should be the registrant and account owner | Identify the registrar, confirm client billing/recovery email, transfer account or domain management, and verify DNS points to the client's Vercel project. |

## Handover steps

1. Confirm the client can sign in to every account above and has recovery access and billing ownership.
2. Transfer the repository, Vercel project, and Supabase project, or recreate them in client-owned accounts and migrate the data safely.
3. Replace all shared developer credentials with client-owned credentials in Vercel. Use placeholders in written instructions; share credentials only through an approved password manager.
4. Confirm the custom domain, DNS, production deployment, Supabase owner login, database policies, and enquiry email with a test submission.
5. Remove developer access when the client confirms the site is operating and accepts the handover.

## Account inventory to complete

Record the GitHub repository URL, Vercel project, Supabase project reference, Web3Forms account owner, domain name, and registrar in the client's password manager. Do not put credentials or recovery codes in this repository.
