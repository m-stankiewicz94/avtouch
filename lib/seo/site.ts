import { locales, defaultLocale } from "@/lib/i18n/config";

/**
 * Single source of truth for site-wide constants used across SEO,
 * structured data and the contact block.
 *
 * TODO(avtouch): replace every value marked PLACEHOLDER with the real one.
 */
export const SITE = {
  name: "AVtouch",
  /** PLACEHOLDER — production domain. Drives canonical URLs, sitemap and OG. */
  domain: "https://avtouch.pl",
  locales,
  defaultLocale,
  /** PLACEHOLDER — real contact inbox. */
  email: "kontakt@avtouch.pl",
  /** PLACEHOLDER — real phone number (display + tel: form). */
  phone: "+48 22 000 00 00",
  phoneHref: "+48220000000",
  city: "Warszawa",
  region: "Mazowieckie",
  country: "PL",
  /** PLACEHOLDER — 1200×630 social preview image at /public/assets. */
  ogImage: "/assets/og-default.png",
} as const;

/**
 * Search-indexing switch. Default OFF, so the staging deployment
 * (avtouch.vercel.app) stays out of search engines while it still carries
 * placeholder details. At launch on the real domain, set the env var
 * NEXT_PUBLIC_ALLOW_INDEXING=true in Vercel and redeploy.
 */
export const INDEXABLE = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
