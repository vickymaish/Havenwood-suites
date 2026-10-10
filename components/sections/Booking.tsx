import EnquiryForm from "@/components/booking/EnquiryForm";
import { siteConfig, bedroomOptions } from "@/data/site";
import { content } from "@/data/content";
import { buildWhatsAppLink } from "@/lib/contact";
import type { PublicSettings } from "@/lib/public-settings";

export default function Booking({ settings }: { settings: PublicSettings }) {
  return <section id="booking" className="section-pad scroll-mt-24 wrap">
    <div className="mx-auto max-w-[1120px]">
      <h2 id="booking-heading" tabIndex={-1} className="font-heading text-[clamp(2.75rem,6vw,5rem)] leading-none">{content.booking.title}</h2>
      <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)]">{content.booking.description}</p>
      <div className="mt-12 grid gap-12 md:grid-cols-[1.4fr_1fr]">
        <EnquiryForm whatsappNumber={siteConfig.whatsappNumber} options={settings.bedroom_options.length ? settings.bedroom_options : bedroomOptions} />
        <aside className="h-fit rounded-[var(--radius-card)] border border-[var(--border)] p-7 md:p-8">
          <h3 className="font-heading text-2xl">{content.booking.contactTitle}</h3>
          <dl className="mt-6 space-y-5 text-sm">
            <div><dt className="eyebrow text-[var(--muted)]">{content.booking.whatsappLabel}</dt><dd className="mt-2 flex flex-wrap gap-4"><a href={buildWhatsAppLink(undefined, siteConfig.whatsappNumber)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{siteConfig.whatsappDisplay}</a><a href={`tel:+${siteConfig.whatsappNumber}`} className="underline underline-offset-4">{content.booking.callLabel}</a></dd></div>
            <div><dt className="eyebrow text-[var(--muted)]">{content.booking.stayDetailsLabel}</dt><dd className="mt-2">{content.booking.details}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  </section>;
}
