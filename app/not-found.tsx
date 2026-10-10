import Link from "next/link";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center px-6 text-center"><div><p className="eyebrow text-[var(--accent)]">NEVEL APARTMENT · ELDORET</p><h1 className="font-heading mt-5 text-6xl">Page not found.</h1><p className="mt-5 text-sm text-[var(--muted)]">That address does not lead to a page here.</p><Link className="button button-primary mt-8" href="/">Return to the house</Link></div></main>;
}
