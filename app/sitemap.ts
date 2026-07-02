import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return SITE.locales.map((locale) => ({
    url: `${SITE.domain}/${locale}`,
    lastModified,
    changeFrequency: "monthly",
    priority: locale === SITE.defaultLocale ? 1 : 0.9,
    alternates: {
      languages: {
        pl: `${SITE.domain}/pl`,
        en: `${SITE.domain}/en`,
        "x-default": `${SITE.domain}/${SITE.defaultLocale}`,
      },
    },
  }));
}
