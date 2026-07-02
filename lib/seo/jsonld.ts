import { SITE } from "@/lib/seo/site";
import type { Locale } from "@/lib/i18n/config";

/**
 * ProfessionalService / LocalBusiness structured data — makes AVtouch
 * eligible for local + rich results. Street address is intentionally
 * omitted until confirmed; locality + country are enough for local SEO.
 */
export function businessJsonLd(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE.domain}/#business`,
    name: SITE.name,
    url: `${SITE.domain}/${locale}`,
    image: `${SITE.domain}${SITE.ogImage}`,
    telephone: SITE.phone,
    email: SITE.email,
    description,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      addressCountry: SITE.country,
    },
    areaServed: { "@type": "Country", name: "Poland" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: locale === "pl" ? "Usługi AVtouch" : "AVtouch services",
      itemListElement: [
        "Audio-visual systems integration",
        "Conference room AV",
        "Control systems (Crestron, Extron, KNX)",
        "Sound systems and digital signage",
        "Smart home and home cinema",
      ].map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service },
      })),
    },
    knowsLanguage: ["pl", "en"],
    priceRange: "$$$",
    slogan: locale === "pl" ? "Słychać. Widać. Działa." : "Hear it. See it. It works.",
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.domain}/#website`,
    name: SITE.name,
    url: `${SITE.domain}/${locale}`,
    inLanguage: locale,
    publisher: { "@id": `${SITE.domain}/#business` },
  };
}
