"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { property } from "@/data/property";
import { content } from "@/data/content";
import { buildWhatsAppLink } from "@/lib/contact";


export function BookingLink({ children, className = "button button-primary", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return <a className={className} href="#booking" onClick={() => { onClick?.(); requestAnimationFrame(() => document.getElementById("booking-heading")?.focus()); }}>{children}</a>;
}
export function WhatsAppLink({ children, className = "button button-outline", whatsappNumber }: { children: React.ReactNode; className?: string; whatsappNumber?: string }) {
	return <a className={className} href={buildWhatsAppLink(undefined, whatsappNumber)} target="_blank" rel="noopener noreferrer">{children}</a>;
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 40); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  const links = [[content.navigation.stays, "#stays"], [content.navigation.gallery, "#gallery"], [content.navigation.findUs, "#find-us"], [content.navigation.faq, "#faq"]];
  useEffect(() => {
    if (!open) return;
    const nav = document.getElementById("mobile-navigation");
    const getItems = () => [...(nav?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [])];
    getItems()[0]?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); menuButtonRef.current?.focus(); }
      if (event.key !== "Tab") return;
      const items = getItems();
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [open]);
  return <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${scrolled ? "bg-white text-[var(--text)] shadow-[var(--shadow-nav)]" : "text-white"}`}>
    <div className="wrap flex h-[76px] items-center justify-between">
      <a href="#top" className="font-heading text-xl font-bold leading-none tracking-tight">{property.name}</a>
      <nav className="hidden items-center gap-9 md:flex" aria-label="Main navigation">{links.map(([label, href]) => <a className="nav-link" href={href} key={label}>{label}</a>)}</nav>
      <div className="hidden md:block"><BookingLink className="button button-primary !min-h-10 !px-5">{content.navigation.book}</BookingLink></div>
      <button ref={menuButtonRef} className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}><span className={`h-px w-5 bg-current transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} /><span className={`h-px w-5 bg-current transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`} /></button>
    </div>
    <AnimatePresence>{open && <motion.nav id="mobile-navigation" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-white text-[var(--text)] md:hidden"><div className="wrap flex flex-col pb-6">{links.map(([label, href]) => <a onClick={() => setOpen(false)} className="border-t border-[var(--border)] py-4 text-sm" href={href} key={label}>{label}</a>)}<BookingLink className="button button-primary mt-3" onClick={() => setOpen(false)}>{content.navigation.book}</BookingLink></div></motion.nav>}</AnimatePresence>
  </header>;
}

export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return <motion.div className={className} initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : delay }}>{children}</motion.div>;
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return <div>{property.faqs.map((item, i) => <div className="faq-row" key={item.question}><button className="flex min-h-[76px] w-full items-center justify-between gap-4 py-5 text-left" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}><span className="font-heading text-[20px] md:text-[24px]">{item.question}</span><span className="text-xl text-[var(--accent)]">{open === i ? "−" : "+"}</span></button><AnimatePresence initial={false}>{open === i && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="max-w-2xl pb-6 pr-8 text-sm leading-7 text-[var(--muted)]">{item.answer}</p></motion.div>}</AnimatePresence></div>)}</div>;
}

export function FloatingWhatsApp({ whatsappNumber }: { whatsappNumber?: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => {
      const heroBottom = document.getElementById("hero")?.getBoundingClientRect().bottom ?? window.innerHeight;
      setVisible(heroBottom <= 90);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <a href={buildWhatsAppLink(undefined, whatsappNumber)} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className={`fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-[var(--accent)] text-white shadow-lg transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--text)] ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}><svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-current"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.16 1.6 5.97L.05 24l6.25-1.64a11.9 11.9 0 0 0 5.77 1.47h.01c6.58 0 11.93-5.35 11.93-11.93 0-3.19-1.24-6.18-3.49-8.42ZM12.08 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.71.97.99-3.62-.24-.37a9.87 9.87 0 0 1-1.52-5.26c0-5.46 4.44-9.9 9.91-9.9 2.65 0 5.14 1.03 7.01 2.9a9.84 9.84 0 0 1 2.9 7c0 5.47-4.45 9.91-9.93 9.91Zm5.44-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.3 1.27.49 1.7.62.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"/></svg></a>;
}
