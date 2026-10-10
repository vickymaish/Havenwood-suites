"use client";

import Image from "next/image";
import { useState } from "react";
import { bedroomOptions } from "@/data/site";
import { getPhotosForListing } from "@/lib/photos";

const leadImages = {
  1: { src: "/images/havenwood-lounge-wide.jpeg", alt: "Havenwood Suites lounge", matchingPhoto: "lounge" },
  2: { src: "/images/havenwood-lounge-wide.jpeg", alt: "Havenwood Suites lounge", matchingPhoto: "lounge" },
  3: { src: "/images/havenwood-lounge-wide.jpeg", alt: "Havenwood Suites lounge", matchingPhoto: "lounge" },
} as const;

type StayOption = { bedrooms: 1 | 2 | 3; label: string; pricePerNightKES: number; maxGuests: number; description: string };

export default function Stays({ options = bedroomOptions }: { options?: readonly StayOption[] }) {
  const option = options.find((item) => item.bedrooms === 3) ?? options[0];
  if (!option) return null;
  return <section id="stays" className="section-pad bg-[var(--surface)]"><div className="wrap">
    <p className="eyebrow text-[var(--accent)]">HAVENWOOD SUITES</p>
    <h2 className="font-heading mt-4 text-[clamp(2.5rem,5vw,4.5rem)]">One private apartment.</h2>
    <div className="mt-10 max-w-xl"><StayCard option={option} /></div>
  </div></section>;
}

function StayCard({ option }: { option: StayOption }) {
  const photos = getPhotosForListing(option.bedrooms);
  const lead = leadImages[option.bedrooms];
  const leadIndex = Math.max(0, photos.findIndex((photo) => photo.id === lead.matchingPhoto));
  const [active, setActive] = useState(leadIndex);
  const selectedPhoto = photos[active]!;
  const imageSrc = active === leadIndex ? lead.src : selectedPhoto.src;
  const imageAlt = active === leadIndex ? lead.alt : selectedPhoto.alt;
  const select = () => {
    window.dispatchEvent(new CustomEvent("nevel:bedrooms", { detail: option.bedrooms }));
    window.location.hash = "booking";
  };

  return <article className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]">
    <div className="relative aspect-[4/3] bg-[var(--border)]">
      <Image src={imageSrc} alt={imageAlt} fill sizes="(max-width: 1023px) 100vw, 33vw" className="object-cover" />
      <button aria-label="Previous photo" className="absolute left-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-black/55 text-white" onClick={() => setActive((active + photos.length - 1) % photos.length)}>‹</button>
      <button aria-label="Next photo" className="absolute right-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-black/55 text-white" onClick={() => setActive((active + 1) % photos.length)}>›</button>
      <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-xs text-white">{active + 1} / {photos.length}</span>
    </div>
    <div className="flex gap-2 overflow-x-auto p-3" aria-label={`Photos for ${option.label}`}>
      {photos.slice(0, 8).map((photo, index) => <button key={photo.id} aria-label={`Show photo ${index + 1}`} aria-pressed={active === index} onClick={() => setActive(index)} className={`relative h-14 w-16 shrink-0 overflow-hidden rounded ${active === index ? "ring-2 ring-[var(--accent)]" : "opacity-70"}`}>
        <Image src={photo.src} alt="" fill sizes="64px" className="object-cover" />
      </button>)}
    </div>
    <div className="p-6 pt-2">
      <p className="eyebrow text-[var(--accent)]">PRIVATE FURNISHED APARTMENT</p>
      <h3 className="font-heading mt-2 text-3xl">{option.label}</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">Up to {option.maxGuests} guests</p>
      <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{option.description}</p>
      <p className="mt-5 text-lg">KES {option.pricePerNightKES.toLocaleString()} <span className="text-xs text-[var(--muted)]">per night</span></p>
      <button onClick={select} className="button button-primary mt-5 w-full">Check dates</button>
    </div>
  </article>;
}
