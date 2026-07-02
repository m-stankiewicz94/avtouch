import type { Dictionary } from "@/lib/i18n/config";
import styles from "./About.module.css";

export default function About({ dict }: { dict: Dictionary }) {
  return (
    <section id="o-nas" className={styles.section}>
      <div data-reveal className={styles.header}>
        <h2 className={styles.heading}>{dict.about.h}</h2>
      </div>

      <div data-reveal className={styles.body}>
        <p className={styles.paragraph}>{dict.about.p1}</p>
        <p className={styles.paragraph}>{dict.about.p2}</p>
      </div>
    </section>
  );
}
