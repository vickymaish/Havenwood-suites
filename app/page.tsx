import Image from "next/image";
import { property } from "@/data/property";
import { BookingLink, FAQ, FloatingWhatsApp, Navigation, PhotoGallery, Reveal, WhatsAppLink } from "@/components/site";
import Booking from "@/components/sections/Booking";
import BookingCard from "@/components/booking/BookingCard";
import { siteConfig } from "@/data/site";
import { getPublicSettings } from "@/lib/public-settings";
import { getHero } from "@/lib/photos";
import { heroImage, heroObjectPosition, nightlyPriceKES } from "@/data/site";

export default async function Home() {
  const settings = await getPublicSettings();
  const hero = getHero(heroImage);
  const canonicalBase = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  const jsonLd = { "@context": "https://schema.org", "@type": ["VacationRental", "LodgingBusiness"], name: property.name, telephone: siteConfig.whatsappDisplay, email: siteConfig.ownerEmail, address: { "@type": "PostalAddress", addressLocality: "Eldoret", addressCountry: "KE" }, image: `${canonicalBase}${hero.src}`, priceRange: `KES ${nightlyPriceKES.toLocaleString()} per night` };
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
          <div className="mt-7 flex flex-wrap gap-3"><BookingLink className="button button-primary">Explore your stay</BookingLink><WhatsAppLink whatsappNumber={settings.whatsapp_number}>Chat with your host</WhatsAppLink></div>
        </Reveal>
      </div>
    </section>
    <BookingCard />
    <div id="main-content" tabIndex={-1} />
    <section id="apartment" className="section-pad wrap">
      <Reveal className="mx-auto max-w-[750px] text-center">
        <p className="eyebrow text-[var(--accent)]">{property.house.eyebrow}</p>
        <h2 className="font-heading mt-4 text-[clamp(2.25rem,4.5vw,4rem)] font-semibold leading-tight">{property.house.title}</h2>
        <p className="mx-auto mt-5 max-w-[600px] text-base leading-7 text-[var(--muted)]">{property.house.description}</p>
        <p className="mt-6 text-sm font-medium">One private apartment <span className="px-2 text-[var(--border)]">·</span> KES {nightlyPriceKES.toLocaleString()} per night</p>
      </Reveal>
    </section>
    <section id="spaces" className="section-pad bg-[var(--surface)]">
      <div className="wrap grid gap-10 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)]"><Image src="/images/havenwood-dining-nook.jpeg" alt="Dining nook at Havenwood Suites" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" /></div>
        <Reveal><p className="eyebrow text-[var(--accent)]">ROOM TO SETTLE IN</p><h2 className="font-heading mt-4 text-4xl font-semibold leading-tight">Everyday comfort, all in one place.</h2><p className="mt-5 text-base leading-7 text-[var(--muted)]">Relax in the lounge, prepare a meal in the kitchen, and make yourself at home in a private, fully furnished apartment.</p><a href="#gallery" className="mt-6 inline-flex min-h-11 items-center font-medium text-[var(--accent)] underline underline-offset-4">See the apartment photos</a></Reveal>
      </div>
    </section>
    <section id="gallery" className="section-pad wrap">
      <Reveal><p className="eyebrow text-[var(--accent)]">A CLOSER LOOK</p><h2 className="font-heading mt-3 text-[clamp(2.25rem,4.5vw,4rem)] font-semibold">Spaces at Havenwood</h2><p className="mt-3 max-w-xl text-base leading-7 text-[var(--muted)]">Browse the lounge, bedroom, kitchen, bathroom, and more.</p></Reveal>
      <PhotoGallery />
    </section>
    <section id="amenities" className="section-pad bg-[var(--surface)]">
      <div className="wrap grid gap-8 md:grid-cols-[.8fr_1.2fr] md:gap-20"><Reveal><p className="eyebrow text-[var(--accent)]">THE DETAILS</p><h2 className="font-heading mt-4 text-4xl font-semibold">Settle in with ease.</h2><p className="mt-4 text-base leading-7 text-[var(--muted)]">A welcoming space with the essentials for a comfortable visit.</p></Reveal><div className="grid sm:grid-cols-2">{property.amenities.map((item) => <div key={item} className="flex min-h-16 items-center border-b border-[var(--border)] text-sm">{item}</div>)}</div></div>
    </section>
    <section id="reviews" className="section-pad wrap text-center"><p className="eyebrow text-[var(--accent)]">GUEST REVIEWS</p><h2 className="font-heading mt-4 text-3xl font-semibold">Your stay could be the first story.</h2><p className="mx-auto mt-3 max-w-lg text-[var(--muted)]">Guest reviews will be shared here as they come in.</p></section>
    <section id="location" className="bg-[var(--surface)]">
      <div className="grid md:min-h-[460px] md:grid-cols-2"><div className="relative min-h-[300px] md:min-h-full"><Image src="/images/havenwood-exterior.jpeg" alt="Havenwood Suites exterior" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" /></div><div className="flex items-center py-14"><div className="wrap md:max-w-[560px] md:px-12"><p className="eyebrow text-[var(--accent)]">A PLACE IN ELDORET</p><h2 className="font-heading mt-4 text-4xl font-semibold">Make Eldoret your base.</h2><p className="mt-4 text-base leading-7 text-[var(--muted)]">{property.locationDescription}</p><p className="mt-4 text-sm font-medium">{property.location}</p></div></div></div>
      <div className="wrap py-10 md:py-14"><div className="relative h-[260px] overflow-hidden rounded-[var(--radius-card)] bg-[var(--border)] md:h-[360px]"><iframe title="Map showing Havenwood Suites in Eldoret" src={property.mapEmbedUrl || `https://www.google.com/maps?q=${encodeURIComponent(`${property.fullName}, ${property.location}`)}&output=embed`} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><a className="absolute bottom-4 right-4 rounded-full bg-white px-4 py-3 text-sm font-medium shadow-sm" href={`https://maps.google.com/?q=${encodeURIComponent(`${property.fullName}, ${property.location}`)}`} target="_blank" rel="noreferrer">Open in Google Maps ↗</a></div></div>
    </section>
    <section id="faq" className="section-pad wrap grid gap-8 md:grid-cols-[.8fr_1.2fr] md:gap-20"><div><p className="eyebrow text-[var(--accent)]">GOOD TO KNOW</p><h2 className="font-heading mt-4 text-4xl font-semibold">Frequently asked questions</h2></div><FAQ /></section>
    <Booking settings={settings} />
    <footer className="wrap py-10"><div className="flex flex-col gap-5 border-t border-[var(--border)] pt-7 sm:flex-row sm:items-center sm:justify-between"><div><a href="#top" className="font-heading text-xl font-bold">{property.name}</a><p className="mt-1 text-sm text-[var(--muted)]">{property.location}</p></div><div className="flex flex-wrap gap-x-5 gap-y-3 text-sm"><a href={`https://wa.me/${settings.whatsapp_number}`} className="hover:text-[var(--accent)]">WhatsApp +{settings.whatsapp_number}</a><a href={`mailto:${siteConfig.ownerEmail}`} className="hover:text-[var(--accent)]">{siteConfig.ownerEmail}</a></div></div><div className="mt-6 flex justify-between text-xs text-[var(--muted)]"><span>© {new Date().getFullYear()} {property.name}</span><span>{property.location}</span></div><a href="/admin/login" className="mt-4 inline-flex min-h-11 items-center text-xs text-[var(--muted)] underline">Owner sign in</a></footer>
    <FloatingWhatsApp whatsappNumber={settings.whatsapp_number} />
  </main>;
}
