import EnquiryForm from "@/components/booking/EnquiryForm";
import { siteConfig, bedroomOptions } from "@/data/site";
import { buildMailtoLink, buildWhatsAppLink } from "@/lib/contact";
import type { PublicSettings } from "@/lib/public-settings";

export default function Booking({ settings }: { settings: PublicSettings }) {
  const showOwnerEmail = siteConfig.ownerEmail.includes("@");
  return <section id="booking" className="section-pad scroll-mt-24 wrap">
    <div className="mx-auto max-w-[1120px]">
      <p className="eyebrow mb-5 text-[var(--accent)]">ENQUIRE</p>
      <h2 id="booking-heading" tabIndex={-1} className="font-heading text-[clamp(2.75rem,6vw,5rem)] leading-none">Plan your stay</h2>
      <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)]">Choose one, two, or three bedrooms in the private house. Send an enquiry with your dates and guest count; the host will confirm availability, rate, and check-in details.</p>
      <div className="mt-12 grid gap-12 md:grid-cols-[1.4fr_1fr]">
        <EnquiryForm whatsappNumber={siteConfig.whatsappNumber} options={settings.bedroom_options.length ? settings.bedroom_options : bedroomOptions} />
        <aside className="h-fit rounded-[var(--radius-card)] border border-[var(--border)] p-7 md:p-8">
          <h3 className="font-heading text-2xl">Contact the host</h3>
          <dl className="mt-6 space-y-5 text-sm">
            <div><dt className="eyebrow text-[var(--muted)]">WhatsApp</dt><dd className="mt-2 flex flex-wrap gap-4"><a href={buildWhatsAppLink(undefined, siteConfig.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{siteConfig.whatsappDisplay}</a><a href={`tel:+${siteConfig.whatsappNumber}`} className="underline underline-offset-4">Call</a></dd></div>
            {showOwnerEmail && <div><dt className="eyebrow text-[var(--muted)]">Email</dt><dd className="mt-2"><a href={buildMailtoLink()} className="underline underline-offset-4">{siteConfig.ownerEmail}</a></dd></div>}
            <div><dt className="eyebrow text-[var(--muted)]">Stay details</dt><dd className="mt-2">The owner will confirm the price, guest limit, and check-in arrangements when replying to your enquiry.</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  </section>;
}
