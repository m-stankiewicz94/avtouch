import type { Dictionary } from "@/lib/i18n/config";
import styles from "./Hero.module.css";

export default function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section id="top" className={styles.hero}>
      <div data-beam className={styles.beam} aria-hidden="true" />
      <canvas data-ascii className={styles.ascii} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      <div className={styles.inner}>
        <h1 className={styles.headline}>
          <span className={styles.lineWrap}>
            <span data-hero-line="0" className={styles.line}>
              {dict.hero.l1}
            </span>
          </span>
          <span className={styles.lineWrap}>
            <span data-hero-line="1" className={styles.line}>
              {dict.hero.l2}
            </span>
          </span>
          <span className={styles.lineWrap}>
            <span
              data-hero-line="2"
              className={`${styles.line} ${styles.lineAccent}`}
            >
              {dict.hero.l3}
            </span>
          </span>
          <span className="sr-only">{dict.hero.kw}</span>
        </h1>

        <div data-hero-sub className={styles.sub}>
          <p className={styles.subText}>{dict.hero.sub}</p>
          <div className={styles.actions}>
            <a href="#kontakt" data-anchor="kontakt" className={styles.ctaPrimary}>
              {dict.hero.cta1}
            </a>
            <a href="#realizacje" data-anchor="realizacje" className={styles.ctaGhost}>
              {dict.hero.cta2}
            </a>
          </div>
        </div>
      </div>

      <div className={styles.scrollHint} aria-hidden="true">
        <span className={styles.scrollLabel}>{dict.hero.scrollHint}</span>
        <span className={styles.scrollLine} />
      </div>
    </section>
  );
}
