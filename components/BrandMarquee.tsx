import styles from "./BrandMarquee.module.css";

const brands = [
  "CRESTRON",
  "EXTRON",
  "BOSE",
  "SHURE",
  "QSC",
  "BARCO",
  "SAMSUNG",
  "EPSON",
  "BIAMP",
  "KRAMER",
];

export default function BrandMarquee() {
  return (
    <section className={styles.marquee}>
      <div className={styles.fadeLeft} aria-hidden="true" />
      <div className={styles.fadeRight} aria-hidden="true" />

      <div data-marquee className={styles.track}>
        <div className={styles.row}>
          {brands.map((brand) => (
            <span key={`a-${brand}`}>{brand}</span>
          ))}
        </div>
        <div className={styles.row} aria-hidden="true">
          {brands.map((brand) => (
            <span key={`b-${brand}`}>{brand}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
