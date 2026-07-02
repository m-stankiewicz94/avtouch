import type { Dictionary } from "@/lib/i18n/config";
import styles from "./Process.module.css";

export default function Process({ dict }: { dict: Dictionary }) {
  return (
    <section id="proces" className={styles.process}>
      <div data-reveal className={styles.header}>
        <h2 className={styles.title}>{dict.process.h}</h2>
        <span className={styles.sub}>{dict.process.sub}</span>
      </div>

      <div data-proc-wrap className={styles.steps}>
        {dict.process.steps.map((step, i) => (
          <div key={i} data-proc-step className={styles.step}>
            <div data-proc-num className={styles.num}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <div data-proc-title className={styles.stepTitle}>
                {step.t}
              </div>
              <div data-proc-desc className={styles.desc}>
                {step.d}
              </div>
              <div data-proc-chips className={styles.chips}>
                {step.chips.map((chip, c) => (
                  <span key={c} className={styles.chip}>
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div data-reveal className={styles.ctaWrap}>
        <a href="#kontakt" data-anchor="kontakt" className={styles.cta}>
          {dict.process.cta}
        </a>
      </div>
    </section>
  );
}
