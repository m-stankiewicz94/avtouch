import type { Dictionary } from "@/lib/i18n/config";
import styles from "./Stats.module.css";

export default function Stats({ dict }: { dict: Dictionary }) {
  return (
    <section className={styles.grid}>
      <div data-reveal className={styles.cell}>
        <div className={styles.number}>
          <span data-count="250">250</span>+
        </div>
        <div className={styles.label}>{dict.stats.s1}</div>
      </div>

      <div data-reveal className={styles.cell}>
        <div className={styles.number}>
          <span data-count="15">15</span>{" "}
          <span className={styles.unit}>{dict.stats.s2Unit}</span>
        </div>
        <div className={styles.label}>{dict.stats.s2}</div>
      </div>

      <div data-reveal className={styles.cell}>
        <div className={styles.number}>24/7</div>
        <div className={styles.label}>{dict.stats.s3}</div>
      </div>

      <div data-reveal className={styles.cell}>
        <div className={styles.number}>
          <span data-count="48">48</span> h
        </div>
        <div className={styles.label}>{dict.stats.s4}</div>
      </div>
    </section>
  );
}
