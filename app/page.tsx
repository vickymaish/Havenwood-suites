import Image from "next/image";
import { property } from "@/data/property";
import { content } from "@/data/content";
import { BookingLink, FAQ, FloatingWhatsApp, Navigation, PhotoGallery, Reveal, WhatsAppLink } from "@/components/site";
import Booking from "@/components/sections/Booking";
import BookingCard from "@/components/booking/BookingCard";
import Stays from "@/components/sections/Stays";
import { siteConfig, bedroomOptions, heroImage, heroObjectPosition } from "@/data/site";
import { getPublicSettings } from "@/lib/public-settings";
import { getHero } from "@/lib/photos";
import { buildWhatsAppLink } from "@/lib/contact";

export default async function Home() {
  const settings = await getPublicSettings();
  const hero = getHero(heroImage);
  const canonicalBase = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const mapQuery = siteConfig.locationMapQuery.startsWith("TODO") ? siteConfig.location : siteConfig.locationMapQuery;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: siteConfig.propertyName,
    telephone: siteConfig.whatsappDisplay,
    address: { "@type": "PostalAddress", addressLocality: siteConfig.city, addressCountry: siteConfig.countryCode },
    image: `${canonicalBase}${hero.src}`,
    ...(bedroomOptions.some((option) => option.pricePerNightKES > 0) ? { priceRange: `KES ${bedroomOptions.map((option) => option.pricePerNightKES).filter(Boolean).join("–")}` } : {}),
    ...(siteConfig.ownerEmail.includes("@") ? { email: siteConfig.ownerEmail } : {}),
  };
  return <main id="top">
    <a href="#main-content" className="skip-link">Skip to content</a>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <Navigation />
    <section id="hero" className="relative flex h-[78svh] min-h-[560px] max-h-[850px] items-end overflow-hidden bg-[var(--text)] text-white">
      <Image src={hero.src} alt={hero.alt} fill priority sizes="100vw" className="object-cover" style={{ objectPosition: heroObjectPosition.mobile }} />
      <div className="absolute inset-0 bg-black/65" />
      <style>{`@media(min-width:768px){#hero img{object-position:${heroObjectPosition.desktop}!important}}`}</style>
      <div className="wrap relative z-10 pb-24 pt-36 md:pb-28">
        <Reveal className="max-w-[700px]">
          <p className="eyebrow mb-5 text-white/85">{property.hero.eyebrow}</p>
          <h1 className="font-heading max-w-[680px] text-[clamp(2.75rem,5.5vw,5rem)] font-semibold leading-[1.05]">{property.hero.title}</h1>
          <p className="mt-5 max-w-[480px] text-base leading-7 text-white/90">{property.hero.description}</p>
          <div className="mt-7 flex flex-wrap gap-3"><BookingLink>Explore your stay</BookingLink><WhatsAppLink whatsappNumber={siteConfig.whatsappNumber}>Chat with your host</WhatsAppLink></div>
        </Reveal>
      </div>
    </section>
    <BookingCard />
    <div id="main-content" tabIndex={-1} />
    <section id="apartment" className="section-pad wrap">
      <Reveal className="mx-auto max-w-[750px] text-center">
        <p className="eyebrow text-[var(--accent)]">{content.story.eyebrow}</p>
        <h2 className="font-heading mt-4 text-[clamp(2.25rem,4.5vw,4rem)] font-semibold leading-tight">{content.story.title}</h2>
        <p className="mx-auto mt-5 max-w-[600px] text-base leading-7 text-[var(--muted)]">{content.story.description}</p>
      </Reveal>
    </section>
    <Stays />
    <section id="spaces" className="section-pad wrap">
      <Reveal><p className="eyebrow text-[var(--accent)]">SPACES</p><h2 className="font-heading mt-4 text-4xl font-semibold">Make yourself at home.</h2></Reveal>
      <div className="mt-8 grid gap-x-10 sm:grid-cols-2">{content.spaces.map((space) => <article key={space.title} className="border-t border-[var(--border)] py-6"><h3 className="font-heading text-xl">{space.title}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{space.description}</p></article>)}</div>
      <a href="#gallery" className="mt-4 inline-flex min-h-11 items-center font-medium text-[var(--accent)] underline underline-offset-4">Browse the photos</a>
    </section>
    <section className="section-pad bg-[var(--surface)]"><div className="wrap grid gap-8 md:grid-cols-[.8fr_1.2fr] md:gap-20"><Reveal><p className="eyebrow text-[var(--accent)]">WHY STAY</p><h2 className="font-heading mt-4 text-4xl font-semibold">Room for your group.</h2></Reveal><ul className="divide-y divide-[var(--border)]">{content.whyStay.map((point) => <li key={point} className="py-4 text-sm leading-6">{point}</li>)}</ul></div></section>
    <section id="gallery" className="section-pad wrap">
      <Reveal><p className="eyebrow text-[var(--accent)]">A CLOSER LOOK</p><h2 className="font-heading mt-3 text-[clamp(2.25rem,4.5vw,4rem)] font-semibold">Spaces at {siteConfig.propertyName}</h2><p className="mt-3 max-w-xl text-base leading-7 text-[var(--muted)]">Browse the house photos.</p></Reveal>
      <PhotoGallery />
    </section>
    <section id="amenities" className="section-pad bg-[var(--surface)]"><div className="wrap grid gap-8 md:grid-cols-[.8fr_1.2fr] md:gap-20"><Reveal><p className="eyebrow text-[var(--accent)]">AMENITIES</p><h2 className="font-heading mt-4 text-4xl font-semibold">The details.</h2></Reveal><ul className="divide-y divide-[var(--border)]">{content.amenities.map((item) => <li key={item} className="py-4 text-sm">{item}</li>)}</ul></div></section>
    <section id="location" className="section-pad wrap grid gap-8 md:grid-cols-2 md:items-center">
      <div><p className="eyebrow text-[var(--accent)]">{siteConfig.city.toUpperCase()}</p><h2 className="font-heading mt-4 text-4xl font-semibold">{content.location.title}</h2><p className="mt-4 text-base leading-7 text-[var(--muted)]">{content.location.description}</p><p className="mt-4 text-sm font-medium">{siteConfig.location}</p></div>
      <div className="relative h-[280px] overflow-hidden rounded-[var(--radius-card)] bg-[var(--surface)] md:h-[360px]"><iframe title={`Map of ${siteConfig.city}, ${siteConfig.country}`} src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><a className="absolute bottom-4 right-4 rounded-full bg-white px-4 py-3 text-sm font-medium shadow-[var(--shadow-soft)]" href={`https://maps.google.com/?q=${encodeURIComponent(mapQuery)}`} target="_blank" rel="noreferrer">Open Google Maps</a></div>
    </section>
    <section id="rules" className="section-pad bg-[var(--surface)]"><div className="wrap grid gap-8 md:grid-cols-2"><div><p className="eyebrow text-[var(--accent)]">HOUSE RULES</p><h2 className="font-heading mt-4 text-4xl font-semibold">Before your stay.</h2></div><ul className="divide-y divide-[var(--border)]">{content.houseRules.map((rule) => <li key={rule} className="py-4 text-sm leading-6">{rule}</li>)}</ul></div></section>
    <section id="faq" className="section-pad wrap grid gap-8 md:grid-cols-[.8fr_1.2fr] md:gap-20"><div><p className="eyebrow text-[var(--accent)]">GOOD TO KNOW</p><h2 className="font-heading mt-4 text-4xl font-semibold">Frequently asked questions</h2></div><FAQ /></section>
    <Booking settings={settings} />
    <footer className="wrap py-10"><div className="flex flex-col gap-5 border-t border-[var(--border)] pt-7 sm:flex-row sm:items-center sm:justify-between"><div><a href="#top" className="font-heading text-xl font-bold">{siteConfig.propertyName}</a><p className="mt-1 text-sm text-[var(--muted)]">{siteConfig.location}</p></div><div className="flex flex-wrap gap-x-5 gap-y-3 text-sm"><a href={buildWhatsAppLink()} className="hover:text-[var(--accent)]">WhatsApp {siteConfig.whatsappDisplay}</a><a href={`tel:+${siteConfig.whatsappNumber}`} className="hover:text-[var(--accent)]">Call {siteConfig.whatsappDisplay}</a>{siteConfig.ownerEmail.includes("@") && <a href={`mailto:${siteConfig.ownerEmail}`} className="hover:text-[var(--accent)]">{siteConfig.ownerEmail}</a>}</div></div><div className="mt-6 flex justify-between text-xs text-[var(--muted)]"><span>© {new Date().getFullYear()} {siteConfig.propertyName}</span><span>{siteConfig.location}</span></div><a href="/admin/login" className="mt-4 inline-flex min-h-11 items-center text-xs text-[var(--muted)] underline">Owner sign in</a></footer>
    <FloatingWhatsApp whatsappNumber={siteConfig.whatsappNumber} />
  </main>;
}
