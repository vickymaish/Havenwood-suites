import { createClient } from "@supabase/supabase-js";

const email = process.env.TEST_ADMIN_EMAIL;
const password = process.env.TEST_ADMIN_PASSWORD;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!email || !password || !url || !anonKey) {
  console.log("SKIP: set TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD, NEXT_PUBLIC_SUPABASE_URL, and NEXT_PUBLIC_SUPABASE_ANON_KEY in the process environment.");
  process.exit(0);
}

const supabase = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
let blockId;
let checkFailed = false;

try {
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) throw new Error(`owner sign-in failed: ${signInError.message}`);
  console.log("PASS: owner sign-in succeeded.");

  const { error: listError } = await supabase.from("enquiries").select("id").limit(1);
  if (listError) throw new Error(`owner could not list enquiries: ${listError.message}`);
  console.log("PASS: owner can list enquiries.");

  const start = new Date();
  start.setUTCDate(start.getUTCDate() + 366);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  const startDate = start.toISOString().slice(0, 10);
  const endDate = end.toISOString().slice(0, 10);
  const { data: block, error: insertError } = await supabase.from("blocked_dates").insert({
    start_date: startDate,
    end_date: endDate,
    reason: "Temporary admin permission check",
  }).select("id").single();
  if (insertError || !block) throw new Error(`owner could not add a blocked range: ${insertError?.message ?? "no row returned"}`);
  blockId = block.id;
  console.log("PASS: owner can add a blocked range.");

  const { error: deleteError } = await supabase.from("blocked_dates").delete().eq("id", blockId);
  if (deleteError) throw new Error(`owner could not delete the test blocked range (id ${blockId}): ${deleteError.message}`);
  blockId = undefined;
  console.log("PASS: owner can delete a blocked range.");
} catch (error) {
  checkFailed = true;
  console.error(`FAIL: ${error instanceof Error ? error.message : String(error)}`);
} finally {
  if (blockId !== undefined) {
    const { error } = await supabase.from("blocked_dates").delete().eq("id", blockId);
    if (error) {
      checkFailed = true;
      console.error(`FAIL: cleanup of test blocked range id ${blockId} failed: ${error.message}`);
    } else {
      console.log("CLEANUP: removed the temporary blocked range.");
    }
  }
  const { error: signOutError } = await supabase.auth.signOut();
  if (signOutError) {
    checkFailed = true;
    console.error(`FAIL: sign-out failed: ${signOutError.message}`);
  } else {
    console.log("PASS: signed out.");
  }
}

if (checkFailed) process.exitCode = 1;
