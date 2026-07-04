import type { Dictionary } from "@/lib/i18n/config";
import styles from "./MoreThanAv.module.css";

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

// One icon + brand accent per tile, in the same visual language as Services.
const TILES = [
  {
    accent: "46,119,255",
    icon: (
      <svg {...iconProps}>
        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
      </svg>
    ),
  },
  {
    accent: "61,220,160",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="3.6" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.1 5.1l1.4 1.4M17.5 17.5l1.4 1.4M18.9 5.1l-1.4 1.4M6.5 17.5l-1.4 1.4" />
      </svg>
    ),
  },
  {
    accent: "155,110,255",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 9.5h18M8.8 12.8 7.2 14.4l1.6 1.6M13.4 12.3 11.4 16.6" />
      </svg>
    ),
  },
];

export default function MoreThanAv({ dict }: { dict: Dictionary }) {
  return (
    <section id="wiecej" className={styles.section}>
      <div data-reveal className={styles.header}>
        <h2 className={styles.heading}>{dict.more.h}</h2>
        <p className={styles.sub}>{dict.more.sub}</p>
      </div>

      <div className={styles.grid}>
        {dict.more.items.map((item, i) => (
          <div
            key={i}
            data-reveal
            data-glow
            data-svc
            data-accent={TILES[i]?.accent}
            className={styles.card}
          >
            <div data-glow-fx className={styles.glowFx} />
            <div className={styles.cardInner}>
              <div data-svc-icon className={styles.icon}>
                {TILES[i]?.icon}
              </div>
              <h3 className={styles.cardTitle}>{item.t}</h3>
              <p className={styles.cardDesc}>{item.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
