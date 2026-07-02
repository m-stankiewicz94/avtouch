import type { Metadata } from "next";
import { SITE, INDEXABLE } from "@/lib/seo/site";
import type { Locale } from "@/lib/i18n/config";

const OG_LOCALE: Record<Locale, string> = { pl: "pl_PL", en: "en_US" };

/**
 * Builds per-locale metadata: canonical, hreflang alternates, OpenGraph and
 * Twitter cards. Called from the [locale] layout's generateMetadata.
 */
export function buildMetadata(
  locale: Locale,
  meta: { title: string; description: string; ogAlt: string }
): Metadata {
  const path = `/${locale}`;
  return {
    metadataBase: new URL(SITE.domain),
    title: meta.title,
    description: meta.description,
    applicationName: SITE.name,
    alternates: {
      canonical: path,
      languages: {
        pl: "/pl",
        en: "/en",
        "x-default": `/${SITE.defaultLocale}`,
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: meta.title,
      description: meta.description,
      url: path,
      locale: OG_LOCALE[locale],
      alternateLocale: SITE.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE[l]),
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: meta.ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [SITE.ogImage],
    },
    robots: INDEXABLE
      ? {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" },
        }
      : { index: false, follow: false },
  };
}
