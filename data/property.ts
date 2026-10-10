import { siteConfig } from "./site";
import { content } from "./content";

export const property = {
  name: siteConfig.propertyName,
  fullName: siteConfig.propertyName,
  location: siteConfig.location,
  seo: {
    title: `${siteConfig.propertyName} | Three-Bedroom House in ${siteConfig.city}`,
    description: `A private three-bedroom house in ${siteConfig.city}, bookable as one, two, or three bedrooms.`,
  },
  hero: {
    eyebrow: `${siteConfig.city.toUpperCase()} · ${siteConfig.country.toUpperCase()}`,
    title: "A private house for your stay.",
    description: "Choose one, two, or all three bedrooms. The house remains private to your group.",
  },
  house: content.story,
  locationDescription: content.location.description,
  amenities: content.amenities,
  houseRules: content.houseRules,
  faqs: content.faqs,
  mapEmbedUrl: "",
} as const;
