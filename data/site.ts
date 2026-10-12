import type { photos } from "./photos";

export const siteConfig = {
  propertyName: "Havenwood Suites",
  city: "Eldoret",
  country: "Kenya",
  countryCode: "KE",
  location: "Eldoret, Kenya",
  locationMapQuery: "Eldoret National Polytechnic, Eldoret, Kenya",
  latitude: null,
  longitude: null,
  ownerEmail: "",
  whatsappNumber: "254116393674",
  whatsappDisplay: "+254 116 393 674",
  checkInTime: "3 pm to 4 pm",
  checkOutTime: "10 am",
  socialLinks: [] as const,
} as const;

export const bedroomOptions = [
  { bedrooms: 1, label: "1 bedroom", pricePerNightKES: 2000, maxGuests: 2 },
  { bedrooms: 2, label: "2 bedrooms", pricePerNightKES: 4000, maxGuests: 4 },
  { bedrooms: 3, label: "Entire house", pricePerNightKES: 5500, maxGuests: 6 },
] as const;

export const heroImage: (typeof photos)[number]["src"] = "/images/havenwood-lounge-wide.jpeg";
export const heroObjectPosition = { desktop: "center 52%", mobile: "center 50%" } as const;
export const nightlyPriceKES = 2000;
export const maxGuests = 6;
