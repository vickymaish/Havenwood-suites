import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !anonKey) {
  console.log("SKIP: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to run the read-only RLS check.");
  process.exit(0);
}

const supabase = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
const { data: enquiries, error: enquiryError } = await supabase.from("enquiries").select("id").limit(1);
if (!enquiryError && enquiries?.length) {
  console.error("FAIL: anonymous access returned an enquiry row.");
  process.exit(1);
}
console.log(`PASS: anonymous enquiries access ${enquiryError ? "is denied" : "returns no rows"}.`);

for (const table of ["blocked_dates", "site_settings"]) {
  const { error } = await supabase.from(table).select("*").limit(1);
  if (error) {
    console.error(`FAIL: anonymous read of ${table} failed: ${error.message}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: anonymous read of ${table} is allowed.`);
  }
}
