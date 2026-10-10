import { siteConfig } from "./site";

export const content = {
  story: {
    eyebrow: `${siteConfig.propertyName.toUpperCase()} · ${siteConfig.city.toUpperCase()}`,
    title: "A private house for your stay.",
    description: "Choose one, two, or all three bedrooms. The house remains private to your group, and any unused bedrooms stay locked.",
  },
  spaces: [
    { title: "Living room", description: "TODO: confirm living room details." },
    { title: "Bedrooms", description: "Three bedrooms are available to book as one, two, or all three rooms." },
    { title: "Kitchen", description: "TODO: confirm kitchen facilities." },
    { title: "Bathroom", description: "TODO: confirm bathroom details." },
  ],
  whyStay: [
    "The whole house is private to your group.",
    "Choose one, two, or all three bedrooms.",
    "Unused bedrooms remain locked.",
    `Located in ${siteConfig.location}.`,
  ],
  amenities: ["TODO: confirm amenities with the owner."],
  location: {
    title: `Stay in ${siteConfig.city}`,
    description: "TODO: confirm the street address and nearby directions with the owner.",
  },
  houseRules: ["TODO: confirm house rules with the owner."],
  faqs: [
    { question: "What are the check-in and check-out times?", answer: siteConfig.checkInTime.startsWith("TODO") ? "TODO: confirm check-in and check-out times with the owner." : `Check-in: ${siteConfig.checkInTime}. Check-out: ${siteConfig.checkOutTime}.` },
    { question: "Is parking available?", answer: "TODO: confirm parking with the owner." },
    { question: "Is Wi-Fi available?", answer: "TODO: confirm Wi-Fi availability and details with the owner." },
    { question: "What is the cancellation policy?", answer: "TODO: confirm the cancellation policy with the owner." },
    { question: "How does payment work?", answer: "TODO: confirm payment methods, deposit requirements, and payment instructions with the owner." },
    { question: "How does booking work?", answer: "Send an enquiry with your dates, guest count, and bedroom choice. The owner will confirm availability and the price." },
  ],
} as const;
