"use client";

import Image from "next/image";
import { bedroomOptions } from "@/data/site";
import { getPhotosForListing } from "@/lib/photos";

type StayOption = { bedrooms: 1 | 2 | 3; label: string; pricePerNightKES: number; maxGuests: number; description: string };

export default function Stays({ options = bedroomOptions }: { options?: readonly StayOption[] }) {
  return <section id="stays" className="section-pad bg-[var(--surface)]"><div className="wrap">
    <p className="eyebrow text-[var(--accent)]">WAYS TO STAY</p>
    <h2 className="font-heading mt-4 text-[clamp(2.5rem,5vw,4.5rem)]">Choose your space.</h2>
    <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">The whole house is private to you for every option. Any bedrooms you do not book stay locked.</p>
    <div className="mt-10 grid gap-6 md:grid-cols-3">{options.map((option) => <StayCard key={option.bedrooms} option={option} />)}</div>
    <p className="mt-7 text-sm font-medium">Same house. The whole house is private to you; unused bedrooms stay locked.</p>
  </div></section>;
}

function StayCard({ option }: { option: StayOption }) {
  const photos = getPhotosForListing(option.bedrooms);
  const preferredRoom = option.bedrooms === 1 ? "bedroom" : option.bedrooms === 2 ? "kitchen" : "exterior";
  const lead = photos.find((photo) => photo.room === preferredRoom) ?? photos[0];
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
      <p className="eyebrow text-[var(--accent)]">PRIVATE HOUSE</p>
      <h3 className="font-heading mt-2 text-2xl">{option.label}</h3>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{option.description}</p>
      <p className="mt-5 text-lg">{option.pricePerNightKES > 0 ? <>KES {option.pricePerNightKES.toLocaleString()} <span className="text-xs text-[var(--muted)]">per night</span></> : <span className="text-sm text-[var(--muted)]">Price to be confirmed</span>}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{option.maxGuests > 0 ? `Up to ${option.maxGuests} guests` : "Guest limit to be confirmed"}</p>
      <button onClick={select} className="button button-primary mt-5 w-full">Choose this option</button>
    </div>
  </article>;
}
