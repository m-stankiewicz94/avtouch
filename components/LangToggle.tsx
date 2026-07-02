"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import styles from "./LangToggle.module.css";

export default function LangToggle({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname() || `/${locale}`;

  const swapLocale = (target: Locale) => {
    const segments = pathname.split("/");
    // segments[0] is "" (leading slash); segments[1] is the locale.
    if (segments.length > 1) segments[1] = target;
    const next = segments.join("/");
    return next || `/${target}`;
  };

  return (
    <div className={styles.toggle} role="group" aria-label={label}>
      {locales.map((l, i) => (
        <span key={l}>
          {i > 0 && <span className={styles.sep}> / </span>}
          <Link
            href={swapLocale(l)}
            hrefLang={l}
            aria-current={l === locale ? "true" : undefined}
            className={l === locale ? styles.active : styles.inactive}
          >
            {l.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}
