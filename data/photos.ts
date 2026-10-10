import type { Photo } from "@/lib/photos";

const photo = (id: string, src: string, alt: string, room: Photo["room"]): Photo => ({
  id, src: `/images/${src}`, alt, room,
  width: ["havenwood-entry-mat.jpeg", "havenwood-entry-slippers.jpeg", "havenwood-exterior.jpeg", "havenwood-lounge-angle.jpeg"].includes(src) ? 1280 : 960,
  height: ["havenwood-entry-mat.jpeg", "havenwood-entry-slippers.jpeg", "havenwood-exterior.jpeg", "havenwood-lounge-angle.jpeg"].includes(src) ? 960 : 1280,
  listings: [3], featured: id === "lounge", needsReview: false,
});

export const photos: Photo[] = [
  photo("lounge", "havenwood-lounge-wide.jpeg", "The Havenwood Suites lounge and seating area", "living"),
  photo("lounge-seating", "havenwood-lounge-seating.jpeg", "Comfortable lounge seating", "living"),
  photo("lounge-detail", "havenwood-lounge-detail.jpeg", "A closer view of the lounge", "living"),
  photo("bedroom", "havenwood-bedroom.jpeg", "Bedroom with crisp white linens", "bedroom"),
  photo("bathroom-entry", "havenwood-bathroom-entry.jpeg", "Bathroom entrance", "bathroom"),
  photo("kitchen", "havenwood-kitchen.jpeg", "Kitchen and cooking facilities", "kitchen"),
  photo("lounge-tv", "havenwood-lounge-tv.jpeg", "Lounge with television", "living"),
  photo("shower", "havenwood-shower.jpeg", "Shower area", "bathroom"),
  photo("dining-nook", "havenwood-dining-nook.jpeg", "Dining nook", "living"),
  photo("entry-detail", "havenwood-entry-detail.jpeg", "Welcome detail by the entry", "other"),
  photo("lounge-tv-side", "havenwood-lounge-tv-side.jpeg", "Lounge and television", "living"),
  photo("bathroom", "havenwood-bathroom.jpeg", "Bathroom with shower", "bathroom"),
  photo("entry-slippers", "havenwood-entry-slippers.jpeg", "Slippers ready for guests", "other"),
  photo("entry-mat", "havenwood-entry-mat.jpeg", "Entry mat and guest slippers", "other"),
  photo("exterior", "havenwood-exterior.jpeg", "Havenwood Suites exterior", "exterior"),
  photo("hallway", "havenwood-hallway.jpeg", "Hallway and kitchen passage", "other"),
  photo("bedroom-view", "havenwood-bedroom-view.jpeg", "Bedroom and wardrobe", "bedroom"),
  photo("lounge-angle", "havenwood-lounge-angle.jpeg", "Lounge from another angle", "living"),
  photo("lounge-wide", "havenwood-lounge-wide-2.jpeg", "Wide view of the furnished lounge", "living"),
  photo("lounge-tv-detail", "havenwood-lounge-tv-detail.jpeg", "Television and lounge wall", "living"),
  photo("dining-detail", "havenwood-dining-detail.jpeg", "Dining table and kitchen counter", "living"),
];
