import type { Dictionary } from "@/lib/i18n/config";
import styles from "./Services.module.css";

export default function Services({ dict }: { dict: Dictionary }) {
  return (
    <section id="uslugi" className={styles.section}>
      <div data-reveal className={styles.header}>
        <h2 className={styles.heading}>{dict.services.h}</h2>
        <span className={styles.sub}>{dict.services.sub}</span>
      </div>

      <div className={styles.grid}>
        <div
          data-reveal
          data-glow
          data-svc
          data-accent="46,119,255"
          className={styles.card}
        >
          <div data-glow-fx className={styles.glowFx} />
          <div className={styles.cardInner}>
            <div data-svc-icon className={styles.icon}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4.5" width="18" height="12" rx="2"></rect>
                <path d="M12 16.5V20"></path>
                <path d="M8 20h8"></path>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>{dict.services.items[0].t}</h3>
            <p className={styles.cardDesc}>{dict.services.items[0].d}</p>
          </div>
        </div>

        <div
          data-reveal
          data-glow
          data-svc
          data-accent="64,208,244"
          className={styles.card}
        >
          <div data-glow-fx className={styles.glowFx} />
          <div className={styles.cardInner}>
            <div data-svc-icon className={styles.icon}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 7h16M4 12h16M4 17h16"></path>
                <circle cx="15" cy="7" r="2.4" fill="#0a0c12"></circle>
                <circle cx="8" cy="12" r="2.4" fill="#0a0c12"></circle>
                <circle cx="17" cy="17" r="2.4" fill="#0a0c12"></circle>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>{dict.services.items[1].t}</h3>
            <p className={styles.cardDesc}>{dict.services.items[1].d}</p>
          </div>
        </div>

        <div
          data-reveal
          data-glow
          data-svc
          data-accent="155,110,255"
          className={styles.card}
        >
          <div data-glow-fx className={styles.glowFx} />
          <div className={styles.cardInner}>
            <div data-svc-icon className={styles.icon}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3.5 10v4"></path>
                <path d="M7.75 7v10"></path>
                <path d="M12 9.5v5"></path>
                <path d="M16.25 5v14"></path>
                <path d="M20.5 10v4"></path>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>{dict.services.items[2].t}</h3>
            <p className={styles.cardDesc}>{dict.services.items[2].d}</p>
          </div>
        </div>

        <div
          data-reveal
          data-glow
          data-svc
          data-accent="61,220,160"
          className={styles.card}
        >
          <div data-glow-fx className={styles.glowFx} />
          <div className={styles.cardInner}>
            <div data-svc-icon className={styles.icon}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 11.5 12 4.5l8 7"></path>
                <path d="M6.5 10v9.5h11V10"></path>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>{dict.services.items[3].t}</h3>
            <p className={styles.cardDesc}>{dict.services.items[3].d}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
