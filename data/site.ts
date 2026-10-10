import type { photos } from "./photos";

export const siteConfig = {
  propertyName: "Havenwood Suites",
  location: "Eldoret, Kenya",
  ownerEmail: "64holidayhomesandbnb@gmail.com",
  whatsappNumber: "254711884316",
  whatsappDisplay: "+254 711 884 316",
} as const;

export const nightlyPriceKES = 7500;
export const maxGuests = 6;
// Retain the legacy enum expected by stored enquiries while presenting one stay and one rate.
export const bedroomOptions = [
  { bedrooms: 1, label: "Havenwood Suites", pricePerNightKES: nightlyPriceKES, maxGuests, description: "A private furnished apartment for your stay." },
  { bedrooms: 2, label: "Havenwood Suites", pricePerNightKES: nightlyPriceKES, maxGuests, description: "A private furnished apartment for your stay." },
  { bedrooms: 3, label: "Havenwood Suites", pricePerNightKES: nightlyPriceKES, maxGuests, description: "A private furnished apartment for your stay." },
] as const;

export const heroImage: (typeof photos)[number]["src"] = "/images/havenwood-lounge-wide.jpeg";
export const heroObjectPosition = { desktop: "center 52%", mobile: "center 50%" } as const;
