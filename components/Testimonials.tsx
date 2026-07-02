import type { Dictionary } from "@/lib/i18n/config";
import styles from "./Testimonials.module.css";

export default function Testimonials({ dict }: { dict: Dictionary }) {
  return (
    <section id="opinie" className={styles.section} aria-labelledby="opinie-heading">
      <h2 id="opinie-heading" className="sr-only">
        {dict.testimonials.heading}
      </h2>
      <blockquote data-quote className={styles.quote}>
        {dict.testimonials.quote}
      </blockquote>
      <cite className={styles.quoteBy}>{dict.testimonials.quoteBy}</cite>

      <div className={styles.grid}>
        {dict.testimonials.cards.map((card, i) => (
          <blockquote key={i} data-reveal className={styles.card}>
            <p className={styles.cardQuote}>{card.q}</p>
            <cite className={styles.cardBy}>{card.by}</cite>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
