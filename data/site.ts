import type { photos } from "./photos";

export const siteConfig = {
  propertyName: "Havenwood Suites",
  city: "Eldoret",
  country: "Kenya",
  countryCode: "KE",
  location: "Eldoret, Kenya",
  locationAddress: "TODO: confirm the property address in Eldoret",
  nearbyPlaces: "TODO: confirm nearby places",
  locationMapQuery: "TODO: replace with the confirmed property address or map pin",
  ownerEmail: "TODO: add the client's owner email",
  whatsappNumber: "254116393674",
  whatsappDisplay: "+254 116 393 674",
  checkInTime: "TODO: confirm check-in time",
  checkOutTime: "TODO: confirm check-out time",
  googleReviewUrl: "TODO: add Google review URL",
  socialLinks: [] as const,
} as const;

// Prices and guest limits intentionally remain zero until the owner confirms them.
export const bedroomOptions = [
  { bedrooms: 1, label: "1 bedroom", pricePerNightKES: 0, maxGuests: 0, description: "The whole house is private to you; two bedrooms stay locked." },
  { bedrooms: 2, label: "2 bedrooms", pricePerNightKES: 0, maxGuests: 0, description: "The whole house is private to you; one bedroom stays locked." },
  { bedrooms: 3, label: "Entire house", pricePerNightKES: 0, maxGuests: 0, description: "The whole three-bedroom house is private to you." },
] as const;

export const heroImage: (typeof photos)[number]["src"] = "/images/havenwood-lounge-wide.jpeg";
export const heroObjectPosition = { desktop: "center 52%", mobile: "center 50%" } as const;
export const nightlyPriceKES = 0;
export const maxGuests = 0;
