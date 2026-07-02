export const locales = ["pl", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pl";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Shape of a translation file. pl.json and en.json must both satisfy this.
 * Grouped by section so components read `dict.hero.l1` etc.
 */
export interface Dictionary {
  meta: { title: string; description: string; ogAlt: string };
  nav: {
    services: string;
    work: string;
    voices: string;
    contact: string;
    cta: string;
    primary: string;
    language: string;
  };
  hero: {
    l1: string;
    l2: string;
    l3: string;
    sub: string;
    cta1: string;
    cta2: string;
    scrollHint: string;
    kw: string;
  };
  about: { h: string; p1: string; p2: string };
  stats: { s1: string; s2Unit: string; s2: string; s3: string; s4: string };
  services: { h: string; sub: string; items: { t: string; d: string }[] };
  process: {
    h: string;
    sub: string;
    cta: string;
    steps: { t: string; d: string; chips: string[] }[];
  };
  work: {
    h: string;
    sub: string;
    ctaT: string;
    ctaD: string;
    ctaB: string;
    projects: { meta: string; t: string; d: string; alt: string }[];
  };
  testimonials: {
    heading: string;
    quote: string;
    quoteBy: string;
    cards: { q: string; by: string }[];
  };
  contact: {
    h: string;
    sub: string;
    phName: string;
    phEmail: string;
    phMsg: string;
    btn: string;
    city: string;
    sending: string;
    success: string;
    error: string;
    invalid: string;
  };
  footer: string;
}
