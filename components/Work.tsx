import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/config";
import styles from "./Work.module.css";

// Project photos, matched to dict.work.projects by index.
const PROJECT_IMAGES = [
  "/assets/work/conference-centre.jpg",
  "/assets/work/hotel-ballroom.jpg",
  "/assets/work/bank-hq.jpg",
  "/assets/work/private-residence.jpg",
];

export default function Work({ dict }: { dict: Dictionary }) {
  return (
    <section id="realizacje" data-gallery className={styles.gallery}>
      <div className={styles.sticky}>
        <div className={styles.header}>
          <h2 className={styles.title}>{dict.work.h}</h2>
          <span className={styles.sub}>{dict.work.sub}</span>
        </div>

        <div data-track className={styles.track}>
          {dict.work.projects.map((project, i) => (
            <div key={i} className={styles.card}>
              {PROJECT_IMAGES[i] ? (
                <Image
                  src={PROJECT_IMAGES[i]}
                  alt={project.alt}
                  fill
                  sizes="(max-width: 860px) 80vw, 620px"
                  className={styles.image}
                />
              ) : (
                <div className={styles.placeholder} aria-hidden="true" />
              )}
              <div className={styles.scrim} aria-hidden="true" />
              <div className={styles.overlay}>
                <div className={styles.meta}>{project.meta}</div>
                <h3 className={styles.cardTitle}>{project.t}</h3>
                <div className={styles.cardDesc}>{project.d}</div>
              </div>
            </div>
          ))}

          <div className={styles.ctaCard}>
            <h3 className={styles.ctaTitle}>{dict.work.ctaT}</h3>
            <div className={styles.ctaDesc}>{dict.work.ctaD}</div>
            <a href="#kontakt" data-anchor="kontakt" className={styles.ctaButton}>
              {dict.work.ctaB}
            </a>
          </div>
        </div>

        <div className={styles.progressWrap}>
          <div className={styles.progressTrack}>
            <div data-gallery-progress className={styles.progressFill} />
          </div>
        </div>
      </div>
    </section>
  );
}
