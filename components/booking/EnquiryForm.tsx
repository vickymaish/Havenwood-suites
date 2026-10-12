"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useForm, type FieldError } from "react-hook-form";
import { bedroomOptions, siteConfig } from "@/data/site";
import { content } from "@/data/content";
import { buildMailtoLink, buildWhatsAppLink } from "@/lib/contact";
import { hasBlockedDateOverlap } from "@/lib/availability";
import { calcNights, enquirySchema, estimateTotalKES, getGuestChoices, normalizeKenyanPhone, type EnquiryValues } from "@/lib/validation";
import { createClient } from "@/lib/supabase/client";
import { useBookingSelection } from "@/components/booking/BookingSelection";

type SentEnquiry = EnquiryValues & { nights: number; pricePerNightKES: number; priceMax?: number; estimatedTotalKES: number };
type FormStatus = "idle" | "sending" | "success" | "error";
const inputClass = "min-h-12 w-full rounded-md border border-[var(--border)] bg-white/60 px-3 text-base text-[var(--text)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20";

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: FieldError; hint?: string; children: React.ReactNode }) {
  const errorId = `${id}-error`;
  return <div className="grid gap-2">
    <label htmlFor={id} className="text-xs font-medium tracking-wide">{label}</label>
    {children}
    {hint && <span className="text-xs text-[var(--muted)]">{hint}</span>}
    {error?.message && <p id={errorId} className="text-xs text-warning">{error.message}</p>}
  </div>;
}

function summaryText(data: SentEnquiry) {
  return [
    `Hello, I'm ${data.name}.`,
    `I'd like to enquire about ${data.nights} ${data.nights === 1 ? "night" : "nights"} at ${siteConfig.propertyName}.`,
    `Property: ${siteConfig.propertyName}; check-in: ${data.checkIn}; check-out: ${data.checkOut}; guests: ${data.guests}.`,
    data.pricePerNightKES > 0 ? `Estimated rate${data.priceMax && data.priceMax > data.pricePerNightKES ? " from" : ""} KES ${data.pricePerNightKES.toLocaleString()} per night; estimated total${data.priceMax && data.priceMax > data.pricePerNightKES ? " from" : ""} KES ${data.estimatedTotalKES.toLocaleString()}.` : "Rate: to be confirmed by the host.",
    `Phone: ${normalizeKenyanPhone(data.phone) ?? data.phone}; email: ${data.email}.`,
    data.message ? `Message: ${data.message}` : "",
  ].filter(Boolean).join("\n");
}

export default function EnquiryForm({ whatsappNumber, options = bedroomOptions }: { whatsappNumber?: string; options?: readonly { bedrooms:1|2|3; label:string; pricePerNightKES:number; priceMax?:number; maxGuests:number }[] }) {
  const { selection } = useBookingSelection();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [sent, setSent] = useState<SentEnquiry | null>(null);
  const [notice, setNotice] = useState("");
  const [unavailable, setUnavailable] = useState(false);
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | null>(null);
  const [dateRanges, setDateRanges] = useState<{ start: string; end: string }[]>([]);
  const confirmationRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { name: "", phone: "", email: "", bedrooms: "3", checkIn: "", checkOut: "", guests: "1", message: "", botcheck: "" },
  });
  const [checkIn, checkOut, message = "", bedrooms = "3", guestCount = "1"] = watch(["checkIn", "checkOut", "message", "bedrooms", "guests"]);
  useEffect(() => {
    if (selection.checkIn) setValue("checkIn", selection.checkIn);
    if (selection.checkOut) setValue("checkOut", selection.checkOut);
    if (selection.guests) setValue("guests", selection.guests);
  }, [selection, setValue]);
  const selectedOption = options.find((option) => option.bedrooms === Number(bedrooms)) ?? options[2]!;
  const selectedListing = selectedBedrooms === null ? undefined : options.find((option) => option.bedrooms === selectedBedrooms);
  const selectedMax = selectedOption.maxGuests;
  const guestChoices = getGuestChoices(selectedMax);
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const checkOutMin = checkIn && !Number.isNaN(parseISO(checkIn).getTime()) ? format(addDays(parseISO(checkIn), 1), "yyyy-MM-dd") : todayStr;
  const nights = calcNights(checkIn, checkOut);
  const validDates = checkIn >= todayStr && nights >= 1 && nights <= 60;
  const estimate = selectedListing ? estimateTotalKES(nights, selectedListing.pricePerNightKES) : 0;

  useEffect(() => {
    let active = true;
    void (async () => {
      const cacheKey = "havenwood-public-date-ranges";
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) { const parsed: unknown = JSON.parse(cached); if (typeof parsed === "object" && parsed !== null && "time" in parsed && "ranges" in parsed && typeof parsed.time === "number" && Array.isArray(parsed.ranges) && Date.now() - parsed.time < 60_000) { if (active) setDateRanges(parsed.ranges as { start: string; end: string }[]); return; } }
      } catch { /* Fetch fresh public availability if local cache is unavailable. */ }
      const { data, error } = await createClient().from("blocked_dates").select("start_date,end_date");
      if (!error && data && active) { const ranges = data.map((row) => ({ start: row.start_date, end: row.end_date })); setDateRanges(ranges); try { sessionStorage.setItem(cacheKey, JSON.stringify({ time: Date.now(), ranges })); } catch { /* Cache is optional. */ } }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const choose = (event: Event) => {
      const count = (event as CustomEvent<number>).detail;
      if ([1, 2, 3].includes(count)) {
        const option = options.find((item) => item.bedrooms === count);
        if (!option) return;
        setSelectedBedrooms(count);
        setValue("bedrooms", String(count) as EnquiryValues["bedrooms"]);
        if (Number(guestCount) > option.maxGuests) setValue("guests", String(option.maxGuests));
      }
    };
    window.addEventListener("havenwood:bedrooms", choose);
    return () => window.removeEventListener("havenwood:bedrooms", choose);
  }, [setValue, guestCount, options]);

  useEffect(() => {
    setUnavailable(Boolean(checkIn && checkOut && hasBlockedDateOverlap(checkIn, checkOut, dateRanges)));
  }, [checkIn, checkOut, dateRanges]);

  useEffect(() => {
    if (status === "success") confirmationRef.current?.focus();
  }, [status]);

  async function submit(values: EnquiryValues) {
    setNotice("");
    const option = options.find((item) => item.bedrooms === Number(values.bedrooms)) ?? options[2]!;
    if (option.maxGuests > 0 && Number(values.guests) > option.maxGuests) {
      setNotice(`This option can accommodate up to ${option.maxGuests} guests. Please adjust the guest count or contact us.`);
      setStatus("error");
      return;
    }
    const countNights = calcNights(values.checkIn, values.checkOut);
    const submission: SentEnquiry = { ...values, nights: countNights, pricePerNightKES: option.pricePerNightKES, priceMax: option.priceMax, estimatedTotalKES: estimateTotalKES(countNights, option.pricePerNightKES) };
    if (values.botcheck?.trim()) {
      setSent(submission);
      setStatus("success");
      return;
    }
    try {
      const lastSubmission = Number(sessionStorage.getItem("havenwood-enquiry-last-submit") ?? 0);
      const remaining = 30_000 - (Date.now() - lastSubmission);
      if (remaining > 0) {
        setNotice(`Please wait ${Math.ceil(remaining / 1000)} seconds before sending another enquiry.`);
        setStatus("error");
        return;
      }
    } catch {
      // Storage may be unavailable in private browsing; continue without persistence.
    }
    setStatus("sending");
    try { sessionStorage.setItem("havenwood-enquiry-last-submit", String(Date.now())); } catch { /* Storage is optional. */ }
    const db = createClient();
    const databaseWrite = db.from("enquiries").insert({
      name: values.name.trim(), phone: normalizeKenyanPhone(values.phone)!, email: values.email.trim(),
      check_in: values.checkIn, check_out: values.checkOut, guests: Number(values.guests), bedrooms: Number(values.bedrooms), message: values.message?.trim() || null, status: "new",
    });
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    const emailSend = (async () => {
      if (!accessKey) throw new Error("Web3Forms is not configured");
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `[${siteConfig.propertyName}] New enquiry: ${values.name}, ${values.checkIn} to ${values.checkOut}`,
          from_name: `${siteConfig.propertyName} Website`,
          replyto: values.email,
          name: values.name,
          email: values.email,
          phone: normalizeKenyanPhone(values.phone),
          check_in: values.checkIn,
          check_out: values.checkOut,
          nights: countNights,
          guests: values.guests,
          bedrooms: values.bedrooms,
          price_per_night_kes: option.pricePerNightKES,
          estimated_total_kes: estimateTotalKES(countNights, option.pricePerNightKES),
          property: siteConfig.propertyName,
          message: values.message ?? "",
          botcheck: values.botcheck ?? "",
        }),
      });
      const result: unknown = await response.json();
      const success = typeof result === "object" && result !== null && "success" in result && result.success === true;
      if (!response.ok || !success) throw new Error("Web3Forms rejected the enquiry");
    })();
    const outcomes = await Promise.allSettled([databaseWrite, emailSend]);
    const databaseSucceeded = outcomes[0]?.status === "fulfilled" && !outcomes[0].value.error;
    const emailSucceeded = outcomes[1]?.status === "fulfilled";
    setSent(submission);
    if (databaseSucceeded || emailSucceeded) setStatus("success");
    else {
      setSent(submission);
      setStatus("error");
      setNotice("We could not save or email your enquiry. Please contact us directly.");
    }
  }

  const firstName = sent?.name.trim().split(/\s+/)[0] ?? "";
  const details = sent ? summaryText(sent) : "";
  if (status === "success" && sent) return <div ref={confirmationRef} tabIndex={-1} role="status" aria-live="polite" className="rounded-lg border border-[var(--border)] bg-white/50 p-7 outline-none focus:ring-2 focus:ring-[var(--accent)]">
    <p className="eyebrow text-[var(--accent)]">ENQUIRY SENT</p>
    <h3 className="font-heading mt-4 text-3xl">Thank you, {firstName}.</h3>
      <p className="mt-3 text-sm leading-7">{content.enquiryReceived}</p>
    <div className="mt-6 flex flex-wrap items-center gap-5">
      <a className="button button-primary" href={buildWhatsAppLink(details, whatsappNumber)} target="_blank" rel="noopener noreferrer">Continue on WhatsApp</a>
      <button className="min-h-11 text-sm underline underline-offset-4" onClick={() => { reset(); setSent(null); setNotice(""); setStatus("idle"); }}>Send another enquiry</button>
    </div>
  </div>;

  return <form className="grid gap-6" onSubmit={handleSubmit(submit)} noValidate>
    {status === "error" && <div role="alert" className="rounded-lg border border-warning/20 bg-warning-surface p-4 text-sm text-warning">
      <p>{notice || "Something went wrong sending your enquiry."}</p>
      <p className="mt-2 text-warning/80">Your details are still here. You can try again, or reach us directly:</p>
      <div className="mt-3 flex flex-wrap gap-4">
        <a href={buildWhatsAppLink(details, whatsappNumber)} target="_blank" rel="noopener noreferrer" className="min-h-11 underline underline-offset-4">Message us on WhatsApp</a>
        {siteConfig.ownerEmail.includes("@") && <a href={buildMailtoLink(`Enquiry: ${siteConfig.propertyName}`, details)} className="min-h-11 underline underline-offset-4">Email us directly</a>}
      </div>
    </div>}
    <Field id="name" label="Full name" error={errors.name}><input id="name" autoComplete="name" className={inputClass} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} {...register("name")} /></Field>
    <input type="hidden" {...register("bedrooms")} />
    <div className="grid gap-6 sm:grid-cols-2">
      <Field id="phone" label="Phone / WhatsApp" hint="e.g. 0712 345 678" error={errors.phone}><input id="phone" type="tel" inputMode="tel" autoComplete="tel" className={inputClass} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} {...register("phone")} /></Field>
      <Field id="email" label="Email" error={errors.email}><input id="email" type="email" autoComplete="email" className={inputClass} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} {...register("email")} /></Field>
    </div>
    <div className="grid gap-6 sm:grid-cols-3">
      <Field id="checkIn" label="Check-in" error={errors.checkIn}><input id="checkIn" type="date" min={todayStr} className={inputClass} aria-invalid={!!errors.checkIn} aria-describedby={errors.checkIn ? "checkIn-error" : undefined} {...register("checkIn")} /></Field>
      <Field id="checkOut" label="Check-out" error={errors.checkOut}><input id="checkOut" type="date" min={checkOutMin} className={inputClass} aria-invalid={!!errors.checkOut} aria-describedby={errors.checkOut ? "checkOut-error" : undefined} {...register("checkOut")} /></Field>
      <Field id="guests" label="Number of guests" hint={`Sleeps up to ${selectedMax} for this option.`} error={errors.guests}><select id="guests" className={inputClass} aria-invalid={!!errors.guests} aria-describedby={errors.guests ? "guests-error" : undefined} {...register("guests")}>{guestChoices.map((count) => <option key={count} value={count}>{count} {count === 1 ? "guest" : "guests"}</option>)}</select></Field>
    </div>
    {unavailable && <p role="status" className="rounded-lg border border-[var(--border)] bg-white/70 px-4 py-3 text-sm">Those dates look unavailable, message us on WhatsApp to check.</p>}
    {selectedListing && validDates && selectedListing.pricePerNightKES > 0
      ? <p className="rounded-[var(--radius-input)] bg-[var(--surface)] px-4 py-3 text-sm">Estimated total: {selectedListing.priceMax && selectedListing.priceMax > selectedListing.pricePerNightKES ? "from " : ""}KES {estimate.toLocaleString()} for {nights} {nights === 1 ? "night" : "nights"} ({selectedListing.priceMax && selectedListing.priceMax > selectedListing.pricePerNightKES ? "from " : ""}KES {selectedListing.pricePerNightKES.toLocaleString()} per night). Final rate is confirmed by the host.</p>
      : <p className="rounded-[var(--radius-input)] bg-[var(--surface)] px-4 py-3 text-sm">Your estimated total will appear here once you select a stay option and your dates.</p>}
    <Field id="message" label="Message (optional)" hint={`${message.length}/600`} error={errors.message}><textarea id="message" rows={4} className={`${inputClass} py-3`} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} {...register("message")} /></Field>
    <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" {...register("botcheck")} />
    <button type="submit" disabled={status === "sending"} className="button button-primary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit">{status === "sending" ? "Sending..." : "Send enquiry"}</button>
    {siteConfig.ownerEmail.includes("@") && <p className="text-sm text-[var(--muted)]">Prefer email? <a href={buildMailtoLink()} className="underline underline-offset-4">{siteConfig.ownerEmail}</a></p>}
  </form>;
}
