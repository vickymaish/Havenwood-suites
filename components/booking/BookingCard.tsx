"use client";

import { useState } from "react";
import { format } from "date-fns";
import { maxGuests, nightlyPriceKES } from "@/data/site";
import { bookingSelectionSchema } from "@/lib/validation";
import { useBookingSelection } from "./BookingSelection";

const field = "min-h-14 w-full rounded-[var(--radius-input)] border border-[var(--border)] bg-white px-3 text-base text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15";

export default function BookingCard() {
  const { selection, setSelection } = useBookingSelection();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const today = format(new Date(), "yyyy-MM-dd");
  function change(name: keyof typeof selection, value: string) {
    const updated = { ...selection, [name]: value };
    setSelection(updated);
    setErrors((current) => ({ ...current, [name]: "" }));
  }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = bookingSelectionSchema.safeParse(selection);
    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map((issue) => [String(issue.path[0]), issue.message])));
      return;
    }
    setErrors({});
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", "#booking");
    requestAnimationFrame(() => document.getElementById("booking-heading")?.focus());
  }
  return <div className="relative z-20 mx-auto mt-0 w-[min(100%-2rem,1180px)] md:-mt-14">
    <form onSubmit={submit} noValidate className="grid gap-4 rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-card)] md:grid-cols-[1fr_1fr_.7fr_auto] md:items-end md:gap-5 md:p-6">
      <label className="grid gap-2 text-sm font-medium">Check-in<input aria-invalid={!!errors.checkIn} className={field} type="date" min={today} value={selection.checkIn} onChange={(e) => change("checkIn", e.target.value)} />{errors.checkIn && <span className="text-sm text-warning">{errors.checkIn}</span>}</label>
      <label className="grid gap-2 text-sm font-medium">Check-out<input aria-invalid={!!errors.checkOut} className={field} type="date" min={selection.checkIn || today} value={selection.checkOut} onChange={(e) => change("checkOut", e.target.value)} />{errors.checkOut && <span className="text-sm text-warning">{errors.checkOut}</span>}</label>
      <label className="grid gap-2 text-sm font-medium">Guests<input aria-invalid={!!errors.guests} className={field} type="number" min="1" max={maxGuests} step="1" value={selection.guests} onChange={(e) => change("guests", e.target.value)} />{errors.guests && <span className="text-sm text-warning">{errors.guests}</span>}</label>
      <button type="submit" className="button button-primary min-h-14 w-full md:w-auto">Check availability</button>
      <p className="text-sm text-[var(--muted)] md:col-span-4">From KES {nightlyPriceKES.toLocaleString()} per night</p>
    </form>
  </div>;
}
