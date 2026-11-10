import type { Photo } from "@/lib/photos";
import { siteConfig } from "./site";

const photo = (id: string, src: string, alt: string, room: Photo["room"], listings: Photo["listings"] = [1, 2, 3]): Photo => ({
  id, src: `/images/${src}`, alt, room,
  width: ["havenwood-entry-mat.jpeg", "havenwood-entry-slippers.jpeg", "havenwood-exterior.jpeg", "havenwood-lounge-angle.jpeg"].includes(src) ? 1280 : 960,
  height: ["havenwood-entry-mat.jpeg", "havenwood-entry-slippers.jpeg", "havenwood-exterior.jpeg", "havenwood-lounge-angle.jpeg"].includes(src) ? 960 : 1280,
  listings, featured: id === "lounge", needsReview: false, needsNewPhoto: false,
});

export const photos: Photo[] = [
  photo("lounge", "havenwood-lounge-wide.jpeg", `The ${siteConfig.propertyName} lounge and seating area`, "living"),
  photo("lounge-seating", "havenwood-lounge-seating.jpeg", "Comfortable lounge seating", "living"),
  photo("lounge-detail", "havenwood-lounge-detail.jpeg", "A closer view of the lounge", "living"),
  photo("green-lounge-wide", "havenwood-green-lounge-wide.jpeg", "Lounge with a white sectional sofa and wall posters", "living"),
  photo("green-lounge-sofa", "havenwood-green-lounge-sofa.jpeg", "Sectional sofa and wooden coffee table", "living"),
  photo("green-lounge-lights", "havenwood-green-lounge-lights.jpeg", "Lounge with ceiling lights and pendant lamp", "living"),
  photo("green-lounge-window", "havenwood-green-lounge-window.jpeg", "Lounge curtains and television unit", "living"),
  photo("bedroom", "havenwood-bedroom.jpeg", "Bedroom with crisp white linens", "bedroom"),
  photo("green-bedroom", "havenwood-green-bedroom.jpeg", "Bedroom with a double bed and white linen", "bedroom"),
  photo("green-bedroom-side", "havenwood-green-bedroom-side.jpeg", "Bedroom viewed from the side", "bedroom"),
  photo("green-bedroom-doorway", "havenwood-green-bedroom-doorway.jpeg", "Bedroom viewed through the doorway", "bedroom"),
  photo("green-bed-detail", "havenwood-green-bed-detail.jpeg", "Bed with towel art", "bedroom"),
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
  photo("exterior", "havenwood-exterior.jpeg", `${siteConfig.propertyName} exterior`, "exterior"),
  photo("hallway", "havenwood-hallway.jpeg", "Hallway and kitchen passage", "other"),
  photo("livingroom-view", "havenwood-livingroom-view.jpeg", "Living room and television", "living"),
  photo("lounge-angle", "havenwood-lounge-angle.jpeg", "Lounge from another angle", "living"),
  photo("lounge-wide", "havenwood-lounge-wide-2.jpeg", "Wide view of the furnished lounge", "living"),
  photo("dining-detail", "havenwood-dining-detail.jpeg", "Dining table and kitchen counter", "living"),
  photo("kitchen-counter", "havenwood-kitchen-counter.jpeg", "Kitchen counter", "kitchen", [2]),
  photo("bedroom-2", "havenwood-bedroom2.jpeg", "Second bedroom", "bedroom", [3]),
];
