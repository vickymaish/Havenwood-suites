import EnquiryForm from "@/components/booking/EnquiryForm";
import { siteConfig, nightlyPriceKES, maxGuests, bedroomOptions } from "@/data/site";
import { buildMailtoLink, buildWhatsAppLink } from "@/lib/contact";
import type { PublicSettings } from "@/lib/public-settings";

export default function Booking({ settings }: { settings: PublicSettings }) {
  return <section id="booking" className="section-pad scroll-mt-24 wrap">
    <div className="mx-auto max-w-[1120px]">
      <p className="eyebrow mb-5 text-[var(--accent)]">RESERVE</p>
      <h2 id="booking-heading" tabIndex={-1} className="font-heading text-[clamp(2.75rem,6vw,5rem)] leading-none">Plan your stay</h2>
      <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)]">{`One private furnished apartment, KES ${nightlyPriceKES.toLocaleString()} per night, for up to ${maxGuests} guests. Select your dates and send an enquiry; the host will confirm availability. Check-in ${settings.check_in_time}; check-out ${settings.check_out_time}.`}</p>
      <div className="mt-12 grid gap-12 md:grid-cols-[1.4fr_1fr]">
        <EnquiryForm whatsappNumber={settings.whatsapp_number} options={bedroomOptions} />
        <aside className="h-fit rounded-lg border border-[var(--border)] p-7 md:p-8">
          <h3 className="font-heading text-2xl">Contact the host</h3>
          <dl className="mt-6 space-y-5 text-sm">
            <div><dt className="eyebrow text-[var(--muted)]">WhatsApp</dt><dd className="mt-2"><a href={buildWhatsAppLink(undefined, settings.whatsapp_number)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">+{settings.whatsapp_number}</a></dd></div>
            <div><dt className="eyebrow text-[var(--muted)]">Email</dt><dd className="mt-2"><a href={buildMailtoLink()} className="underline underline-offset-4">{siteConfig.ownerEmail}</a></dd></div>
            <div><dt className="eyebrow text-[var(--muted)]">Stay details</dt><dd className="mt-2">Bookings are per night. Check-out is at 12 noon; a little extra time may be possible by arrangement.</dd></div>
          </dl>
          <p className="mt-6 border-t border-[var(--border)] pt-6 text-sm leading-6 text-[var(--muted)]">Cancellations are non-refundable.</p>
        </aside>
      </div>
    </div>
  </section>;
}
