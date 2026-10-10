import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { property } from "@/data/property";
import { content } from "@/data/content";
import { BookingLink, FAQ, FloatingWhatsApp, Navigation, PhotoGallery, Reveal, WhatsAppLink } from "@/components/site";
import Booking from "@/components/sections/Booking";
import BookingCard from "@/components/booking/BookingCard";
import Stays from "@/components/sections/Stays";
import { siteConfig, heroImage, heroObjectPosition } from "@/data/site";
import { getPublicSettings } from "@/lib/public-settings";
import { getHero } from "@/lib/photos";
import { buildWhatsAppLink } from "@/lib/contact";

export const dynamic = "force-dynamic";

export default async function Home() {
  const settings = await getPublicSettings();
  const hero = getHero(heroImage);
  const canonicalBase = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const mapQuery = siteConfig.locationMapQuery;
  const configuredPrices = settings.bedroom_options.map((option) => option.pricePerNightKES).filter((price) => price > 0);
  const directionsPhotoExists = existsSync(join(process.cwd(), "public", "images", "finding-us.jpeg"));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: siteConfig.propertyName,
    telephone: siteConfig.whatsappDisplay,
    address: { "@type": "PostalAddress", addressLocality: siteConfig.city, addressCountry: siteConfig.countryCode },
    image: `${canonicalBase}${hero.src}`,
    ...(configuredPrices.length ? { priceRange: `KES ${Math.min(...configuredPrices).toLocaleString("en-US")}–${Math.max(...configuredPrices).toLocaleString("en-US")}` } : {}),
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
          <p className="eyebrow mb-5 text-white/85">{content.hero.eyebrow}</p>
          <h1 className="font-heading max-w-[680px] text-[clamp(2.75rem,5.5vw,5rem)] font-semibold leading-[1.05]">{content.hero.title}</h1>
          <p className="mt-5 max-w-[480px] text-base leading-7 text-white/90">{content.hero.description}</p>
          <div className="mt-7 flex flex-wrap gap-3"><BookingLink>{content.hero.primaryAction}</BookingLink><WhatsAppLink whatsappNumber={siteConfig.whatsappNumber}>{content.hero.whatsappAction}</WhatsAppLink></div>
        </Reveal>
      </div>
    </section>
    <BookingCard settings={settings} />
    <div id="main-content" tabIndex={-1} />
    <section aria-label="At a glance" className="border-y border-[var(--border)] bg-[var(--surface)]">
      <div className="wrap flex flex-wrap items-center justify-center py-5 text-xs leading-6 md:text-sm">{content.atAGlance.map((item, index) => <span key={item} className={index ? "border-l border-[var(--border)] px-3" : "px-3"}>{item}</span>)}</div>
    </section>
    <section id="story" className="section-pad wrap">
      <Reveal className="mx-auto max-w-[750px] text-center">
        <p className="eyebrow text-[var(--accent)]">{content.story.eyebrow}</p>
        <h2 className="font-heading mt-4 text-[clamp(2.25rem,4.5vw,4rem)] font-semibold leading-tight">{content.story.title}</h2>
        <p className="mx-auto mt-5 max-w-[600px] text-base leading-7 text-[var(--muted)]">{content.story.description}</p>
      </Reveal>
    </section>
    <Stays options={settings.bedroom_options} />
    <section id="gallery" className="section-pad wrap">
      <Reveal><p className="eyebrow text-[var(--accent)]">A CLOSER LOOK</p><h2 className="font-heading mt-3 text-[clamp(2.25rem,4.5vw,4rem)] font-semibold">{content.gallery.title}</h2></Reveal>
      <PhotoGallery />
    </section>
    <section id="find-us" className="section-pad bg-[var(--surface)]">
      <div className="wrap">
        <Reveal><p className="eyebrow text-[var(--accent)]">{content.directions.eyebrow}</p><h2 className="font-heading mt-3 text-[clamp(2.25rem,4.5vw,4rem)] font-semibold">{content.directions.title}</h2></Reveal>
        <div className={`mt-8 grid gap-8 ${directionsPhotoExists ? "md:grid-cols-2" : "md:grid-cols-[1.2fr_.8fr]"}`}>
          <div>
            <ol className="grid gap-4">{content.directions.steps.map((step, index) => <li key={step} className="flex gap-4 text-sm leading-6"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--border)] font-medium">{index + 1}</span><span>{step}</span></li>)}</ol>
            <div className="mt-6 flex flex-wrap gap-3"><a className="button button-primary" href={`https://maps.google.com/?q=${encodeURIComponent(mapQuery)}`} target="_blank" rel="noreferrer">{content.directions.openMaps}</a><a className="button button-outline" href={`tel:+${siteConfig.whatsappNumber}`}>{content.directions.callForDirections}</a></div>
          </div>
          {directionsPhotoExists && <figure className="relative min-h-[240px] overflow-hidden rounded-[var(--radius-card)]"><Image src="/images/finding-us.jpeg" alt="Building near Havenwood Suites" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" /><figcaption className="absolute inset-x-0 bottom-0 bg-black/55 px-4 py-3 text-sm text-white">Look for this building</figcaption></figure>}
          <ul className={`grid grid-cols-2 gap-3 self-start text-xs leading-5 text-[var(--muted)] ${directionsPhotoExists ? "md:col-span-2" : ""}`}>{content.directions.nearby.map((place) => <li key={place} className="border-t border-[var(--border)] py-3">{place}</li>)}</ul>
        </div>
        {property.mapEmbedUrl && <div className="relative mt-8 h-[300px] overflow-hidden rounded-[var(--radius-card)]"><iframe title="Map of Havenwood Suites" src={property.mapEmbedUrl} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>}
      </div>
    </section>
    <section id="faq" className="section-pad wrap grid gap-8 md:grid-cols-[.8fr_1.2fr] md:gap-20"><div><p className="eyebrow text-[var(--accent)]">{content.faqEyebrow}</p><h2 className="font-heading mt-4 text-4xl font-semibold">{content.faqHeading}</h2></div><FAQ /></section>
    <Booking settings={settings} />
    <footer className="wrap py-10"><div className="flex flex-col gap-5 border-t border-[var(--border)] pt-7 sm:flex-row sm:items-center sm:justify-between"><div><a href="#top" className="font-heading text-xl font-bold">{siteConfig.propertyName}</a><p className="mt-1 text-sm text-[var(--muted)]">{siteConfig.city}</p></div><div className="flex flex-wrap gap-x-5 gap-y-3 text-sm"><a href={buildWhatsAppLink()} className="hover:text-[var(--accent)]">{content.navigation.whatsapp} {siteConfig.whatsappDisplay}</a><a href={`tel:+${siteConfig.whatsappNumber}`} className="hover:text-[var(--accent)]">{content.booking.callLabel}</a></div></div><a href="/admin/login" className="mt-4 inline-flex min-h-11 items-center text-xs text-[var(--muted)] underline">{content.navigation.ownerSignIn}</a></footer>
    <FloatingWhatsApp whatsappNumber={siteConfig.whatsappNumber} />
  </main>;
}
