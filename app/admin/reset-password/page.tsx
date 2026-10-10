"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { siteConfig } from "@/data/site";

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("Checking your recovery link...");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    let supabase: ReturnType<typeof createClient>;
    try { supabase = createClient(); }
    catch { setMessage("Password recovery is not configured. Contact the site owner."); return; }
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) { setReady(true); setMessage(""); }
      else setMessage("This recovery link is invalid or expired. Ask the project owner to send a new one from Supabase Authentication → Users.");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) { setReady(true); setMessage(""); }
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  async function updatePassword(formData: FormData) {
    const password = String(formData.get("password") ?? "");
    const confirmation = String(formData.get("confirmation") ?? "");
    if (password.length < 12) { setMessage("Choose a password with at least 12 characters."); return; }
    if (password !== confirmation) { setMessage("The passwords do not match."); return; }
    setSaving(true);
    const { error } = await createClient().auth.updateUser({ password });
    if (error) { setMessage("The password could not be updated. Request a new recovery link and try again."); setSaving(false); return; }
    await createClient().auth.signOut();
    window.location.assign("/admin/login?password-updated=1");
  }

  return <main className="grid min-h-screen place-items-center bg-[var(--surface)] px-5 py-10 text-[var(--text)]"><section className="w-full max-w-lg rounded-[var(--radius-card)] border border-[var(--border)] bg-white p-7 shadow-[var(--shadow-soft)] sm:p-10">
    <p className="eyebrow text-[var(--accent)]">{siteConfig.propertyName}</p>
    <h1 className="font-heading mt-4 text-3xl">Reset your password</h1>
    {ready ? <form action={updatePassword} className="mt-6 grid gap-5"><p className="text-sm leading-6 text-[var(--muted)]">Choose a new password for the owner account.</p><label className="grid gap-2 text-sm">New password<input name="password" type="password" autoComplete="new-password" minLength={12} required className="min-h-12 rounded-[var(--radius-input)] border border-[var(--border)] px-3 text-base" /></label><label className="grid gap-2 text-sm">Confirm new password<input name="confirmation" type="password" autoComplete="new-password" minLength={12} required className="min-h-12 rounded-[var(--radius-input)] border border-[var(--border)] px-3 text-base" /></label>{message && <p role="alert" className="text-sm text-warning">{message}</p>}<button disabled={saving} className="button button-primary w-full disabled:opacity-60">{saving ? "Updating..." : "Set new password"}</button></form> : <p role="status" className="mt-6 rounded-[var(--radius-input)] bg-[var(--surface)] p-4 text-sm leading-6">{message}</p>}
    <Link className="mt-6 inline-flex min-h-11 items-center text-sm underline underline-offset-4" href="/admin/login">Back to sign in</Link>
  </section></main>;
}
