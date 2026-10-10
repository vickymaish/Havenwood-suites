"use client";
import { siteConfig } from "@/data/site";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="grid min-h-screen place-items-center px-6 text-center"><div><p className="eyebrow text-[var(--accent)]">{siteConfig.propertyName}</p><h1 className="font-heading mt-5 text-6xl">We hit a snag.</h1><p className="mt-5 text-sm text-[var(--muted)]">Please try loading this page again.</p><button className="button button-primary mt-8" onClick={reset}>Try again</button></div></main>;
}
