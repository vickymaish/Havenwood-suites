"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { siteConfig } from "@/data/site";

export default function LoginPage() {
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(formData: FormData) {
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      });
      if (loginError) {
        setError("The email or password is incorrect. Please try again.");
        setLoading(false);
        return;
      }
      window.location.assign("/admin/enquiries");
    } catch {
      setError("Sign in is temporarily unavailable. Check your connection and try again.");
      setLoading(false);
    }
  }

  return <main className="min-h-screen bg-[var(--surface)] p-4 text-[var(--text)] sm:p-8">
    <div className="mx-auto grid min-h-[calc(100svh-2rem)] max-w-6xl overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm sm:min-h-[calc(100svh-4rem)] md:grid-cols-2">
      <section className="relative hidden min-h-[620px] bg-[var(--text)] text-white md:block">
        <Image src="/images/havenwood-lounge-wide.jpeg" alt={`Interior of ${siteConfig.propertyName}`} fill priority sizes="(max-width: 767px) 0px, 50vw" className="object-cover opacity-65" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-x-10 bottom-10">
          <p className="eyebrow text-white/75">OWNER PORTAL</p>
          <h1 className="font-heading mt-4 max-w-md text-5xl leading-[1.02]">A considered stay, thoughtfully managed.</h1>
          <p className="mt-4 text-sm text-white/80">Manage enquiries and availability for {siteConfig.propertyName}.</p>
        </div>
      </section>
      <section className="flex min-h-[calc(100svh-2rem)] flex-col p-6 sm:p-10 md:min-h-0 md:p-12 lg:p-16">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="font-heading text-2xl">{siteConfig.propertyName}</Link>
          <Link href="/" className="min-h-11 px-2 py-3 text-xs text-[var(--muted)] underline underline-offset-4">Back to website</Link>
        </div>
        <div className="my-auto py-12">
          <p className="eyebrow text-[var(--accent)]">PRIVATE OWNER PORTAL</p>
          <h2 className="font-heading mt-4 text-4xl sm:text-5xl">Welcome back.</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">Sign in to manage your guest enquiries, availability, and property details.</p>
          {!configured && <p role="status" className="mt-6 rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-6">Owner sign-in is not configured yet. Add the Supabase URL and anon or publishable key in the deployment environment, then redeploy.</p>}
          <form action={login} className="mt-8 grid gap-5">
            <label className="grid gap-2 text-sm font-medium" htmlFor="email">Email address
              <input className="min-h-12 rounded-md border border-[var(--border)] bg-[var(--surface)]/60 px-3 text-base outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20" id="email" name="email" type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} required />
            </label>
            <label className="grid gap-2 text-sm font-medium" htmlFor="password">Password
              <input className="min-h-12 rounded-md border border-[var(--border)] bg-[var(--surface)]/60 px-3 text-base outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20" id="password" name="password" type="password" autoComplete="current-password" required />
            </label>
            {error && <p role="alert" className="rounded-md border border-warning/20 bg-warning-surface p-3 text-sm text-warning">{error}</p>}
            <button type="submit" disabled={loading} className="button button-primary mt-1 w-full disabled:cursor-wait disabled:opacity-60">{loading ? "Signing in…" : "Sign in"}</button>
          </form>
        </div>
        <p className="text-xs leading-5 text-[var(--muted)]">Authorized property owner access only.</p>
      </section>
    </div>
  </main>;
}
