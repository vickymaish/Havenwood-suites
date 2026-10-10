import { siteConfig } from "../data/site";

export function buildWhatsAppLink(message = `Hi, I'd like to enquire about ${siteConfig.propertyName}.`, whatsappNumber: string = siteConfig.whatsappNumber) {
	return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function buildMailtoLink(subject = `Enquiry: ${siteConfig.propertyName}`, body = "") {
  return `mailto:${siteConfig.ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
