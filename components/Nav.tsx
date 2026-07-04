import Image from "next/image";
import LangToggle from "@/components/LangToggle";
import type { Dictionary, Locale } from "@/lib/i18n/config";
import styles from "./Nav.module.css";

export default function Nav({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <header data-nav className={styles.nav}>
      <a href="#top" data-anchor="top" className={styles.logo} aria-label="AVtouch">
        <Image
          src="/assets/avtouch-logo-mark.svg"
          alt="AVtouch"
          width={693}
          height={322}
          priority
          className={styles.logoMark}
        />
        <Image
          src="/assets/avtouch-logo-text.svg"
          alt=""
          width={619}
          height={75}
          priority
          aria-hidden="true"
          className={styles.logoText}
        />
      </a>
      <nav className={styles.links} aria-label={dict.nav.primary}>
        <a href="#uslugi" data-anchor="uslugi" className={styles.link}>
          {dict.nav.services}
        </a>
        <a href="#realizacje" data-anchor="realizacje" className={styles.link}>
          {dict.nav.work}
        </a>
        <a href="#kontakt" data-anchor="kontakt" className={styles.link}>
          {dict.nav.contact}
        </a>
        <LangToggle locale={locale} label={dict.nav.language} />
        <a href="#kontakt" data-anchor="kontakt" className={styles.cta}>
          {dict.nav.cta}
        </a>
      </nav>
    </header>
  );
}
