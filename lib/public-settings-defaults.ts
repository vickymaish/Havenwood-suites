import { bedroomOptions, siteConfig } from "../data/site";

export type PublicSettings = {
  nightly_price_kes: number | null;
  max_guests: number;
  check_in_time: string;
  check_out_time: string;
  whatsapp_number: string;
  tagline: string;
  welcome_paragraph: string;
  bedroom_options: { bedrooms: 1 | 2 | 3; label: string; pricePerNightKES: number; maxGuests: number; description: string }[];
};

export const DEFAULT_PUBLIC_SETTINGS: PublicSettings = {
  nightly_price_kes: null,
  max_guests: 0,
  check_in_time: siteConfig.checkInTime,
  check_out_time: siteConfig.checkOutTime,
  whatsapp_number: siteConfig.whatsappNumber,
  tagline: "A private house for your stay.",
  welcome_paragraph: "Choose one, two, or all three bedrooms in a private house.",
  bedroom_options: bedroomOptions.map((option) => ({ ...option })),
};

export function resolvePublicSettings(values: ReadonlyMap<string, unknown>): PublicSettings {
  const str = (key: string, fallback: string) => typeof values.get(key) === "string" ? values.get(key) as string : fallback;
  const num = (key: string, fallback: number | null) => typeof values.get(key) === "number" ? values.get(key) as number : fallback;
  const options = DEFAULT_PUBLIC_SETTINGS.bedroom_options.map((option) => ({
    ...option,
    pricePerNightKES: num(`bedroom_${option.bedrooms}_price`, option.pricePerNightKES) ?? option.pricePerNightKES,
    maxGuests: num(`bedroom_${option.bedrooms}_guests`, option.maxGuests) ?? option.maxGuests,
  }));
  return {
    nightly_price_kes: num("nightly_price_kes", DEFAULT_PUBLIC_SETTINGS.nightly_price_kes),
    max_guests: num("max_guests", DEFAULT_PUBLIC_SETTINGS.max_guests) ?? DEFAULT_PUBLIC_SETTINGS.max_guests,
    check_in_time: str("check_in_time", DEFAULT_PUBLIC_SETTINGS.check_in_time),
    check_out_time: str("check_out_time", DEFAULT_PUBLIC_SETTINGS.check_out_time),
    whatsapp_number: DEFAULT_PUBLIC_SETTINGS.whatsapp_number,
    tagline: str("tagline", DEFAULT_PUBLIC_SETTINGS.tagline),
    welcome_paragraph: str("welcome_paragraph", DEFAULT_PUBLIC_SETTINGS.welcome_paragraph),
    bedroom_options: options,
  };
}
