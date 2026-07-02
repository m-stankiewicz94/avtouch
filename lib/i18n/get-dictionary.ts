import type { Dictionary, Locale } from "@/lib/i18n/config";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  pl: () =>
    import("@/lib/i18n/dictionaries/pl.json").then(
      (m) => m.default as unknown as Dictionary
    ),
  en: () =>
    import("@/lib/i18n/dictionaries/en.json").then(
      (m) => m.default as unknown as Dictionary
    ),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return (dictionaries[locale] ?? dictionaries.pl)();
}
