"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { content } from "@/data/content";
import { getUniquePhotos, type Photo } from "@/lib/photos";
import { Reveal } from "@/components/site";

const featuredPhotoIds = [
  "lounge",
  "bedroom-daylight",
  "lounge-detail",
  "bedroom-single",
  "kitchenette",
];

export default function Gallery() {
  const photos = getUniquePhotos();
  const [active, setActive] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const preview = featuredPhotoIds
    .map((id) => photos.find((photo) => photo.id === id))
    .filter((photo): photo is Photo => photo !== undefined);
  const close = useCallback(() => setActive(null), []);
  const move = useCallback(
    (direction: number) =>
      setActive((current) =>
        current === null || photos.length === 0
          ? null
          : (current + direction + photos.length) % photos.length,
      ),
    [photos.length],
  );
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (active === null) return;
    const previous = document.activeElement as HTMLElement | null;
    document.querySelector<HTMLElement>(".lightbox-backdrop button")?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
      if (event.key !== "Tab") return;
      const controls = [...document.querySelectorAll<HTMLElement>(".lightbox-backdrop button")];
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", keydown);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [active, close, move]);

  return (
    <section id="gallery" className="section-pad wrap">
      <Reveal>
        <p className="eyebrow text-[var(--accent)]">A CLOSER LOOK</p>
        <h2 className="font-heading mt-3 text-[clamp(2.25rem,4.5vw,4rem)] font-semibold">
          {content.gallery.title}
        </h2>
      </Reveal>
      <div className="mt-8 grid auto-rows-[145px] grid-cols-2 gap-3 md:auto-rows-[180px] md:grid-cols-4 md:gap-4">
        {preview.map((photo, index) => (
          <button
            key={photo.src}
            aria-label={`Open image: ${photo.alt}`}
            onClick={() =>
              setActive(photos.findIndex((item) => item.src === photo.src))
            }
            className={`photo group relative overflow-hidden rounded-[var(--radius-card)] ${
              index === 0
                ? "col-span-2 row-span-2"
                : "col-span-1 row-span-1"
            }`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              loading="lazy"
              sizes={index === 0 ? "(max-width: 767px) 100vw, 50vw" : "(max-width: 767px) 50vw, 25vw"}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>
      {photos.length > preview.length && (
        <button onClick={() => setActive(0)} className="button button-outline mt-7">
          {content.gallery.viewAll}
        </button>
      )}
      <AnimatePresence>
        {active !== null && photos[active] && (
          <motion.div
            className="lightbox-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label="Photo gallery"
            onClick={close}
            onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
            onTouchEnd={(event) => {
              if (
                touchStart !== null &&
                Math.abs(event.changedTouches[0].clientX - touchStart) > 45
              ) {
                move(event.changedTouches[0].clientX < touchStart ? 1 : -1);
              }
              setTouchStart(null);
            }}
          >
            <button
              onClick={close}
              aria-label="Close gallery"
              className="absolute right-5 top-5 z-10 grid h-12 w-12 place-items-center text-3xl text-white"
            >
              ×
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                move(-1);
              }}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center text-3xl text-white md:left-8"
            >
              ‹
            </button>
            <figure
              className="relative flex h-full w-full max-w-6xl flex-col items-center justify-center"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative h-[78vh] w-full">
                <Image
                  src={photos[active].src}
                  alt={photos[active].alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>
              <figcaption className="mt-4 text-xs tracking-wide text-white/75">
                {photos[active].alt}
                <span className="ml-3">
                  {active + 1} / {photos.length}
                </span>
              </figcaption>
            </figure>
            <button
              onClick={(event) => {
                event.stopPropagation();
                move(1);
              }}
              aria-label="Next image"
              className="absolute right-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center text-3xl text-white md:right-8"
            >
              ›
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
