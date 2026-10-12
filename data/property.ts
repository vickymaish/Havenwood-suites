import { siteConfig } from "./site";
import { content } from "./content";

export const property = {
  name: siteConfig.propertyName,
  fullName: siteConfig.propertyName,
  location: siteConfig.location,
  seo: {
    title: `${siteConfig.propertyName} | Eldoret`,
    description: content.hero.description,
  },
  hero: content.hero,
  house: content.story,
  faqs: content.faqs,
  mapEmbedUrl: siteConfig.latitude !== null && siteConfig.longitude !== null
    ? `https://www.google.com/maps?q=${siteConfig.latitude},${siteConfig.longitude}&output=embed`
    : "",
} as const;
