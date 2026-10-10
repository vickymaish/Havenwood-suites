"use client";

import Image from "next/image";
import { bedroomOptions } from "@/data/site";
import { content } from "@/data/content";
import { getLeadPhotoForListing } from "@/lib/photos";
import { formatNightlyPrice } from "@/lib/pricing";

type StayOption = { bedrooms: 1 | 2 | 3; label: string; pricePerNightKES: number; priceMax?: number; maxGuests: number };

export default function Stays({ options = bedroomOptions }: { options?: readonly StayOption[] }) {
  return <section id="stays" className="section-pad bg-[var(--surface)]"><div className="wrap">
    <h2 className="font-heading mt-4 text-[clamp(2.5rem,5vw,4.5rem)]">{content.stays.title}</h2>
    <div className="mt-10 grid gap-6 md:grid-cols-3">{options.map((option) => <StayCard key={option.bedrooms} option={option} />)}</div>
    <p className="mt-7 text-sm font-medium">{content.stays.note}</p>
  </div></section>;
}

function StayCard({ option }: { option: StayOption }) {
  const lead = getLeadPhotoForListing(option.bedrooms);
  const select = () => {
    window.dispatchEvent(new CustomEvent("havenwood:bedrooms", { detail: option.bedrooms }));
    document.getElementById("booking")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    window.history.replaceState(null, "", "#booking");
  };
  return <article className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]">
    <div className="relative aspect-[4/3] bg-[var(--surface)]">
      {lead && <Image src={lead.src} alt={lead.alt} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover" />}
    </div>
    <div className="p-6">
      <p className="eyebrow text-[var(--accent)]">{content.stays.tags[option.bedrooms]}</p>
      <h3 className="font-heading mt-2 text-2xl">{option.label}</h3>
      <p className="mt-5 text-lg">{formatNightlyPrice(option)} <span className="text-xs text-[var(--muted)]">{content.stays.perNight}</span></p>
      {option.bedrooms !== 3 && <p className="mt-2 text-sm text-[var(--muted)]">{content.stays.sleepsUpTo} {option.maxGuests}</p>}
      <button onClick={select} className="button button-primary mt-5 w-full">{content.stays.choose}</button>
    </div>
  </article>;
}
