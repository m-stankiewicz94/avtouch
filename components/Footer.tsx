import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/config";
import styles from "./Footer.module.css";

export default function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className={styles.footer}>
      <Image
        src="/assets/avtouch-logo-full.svg"
        alt="AVtouch"
        width={693}
        height={486}
        className={styles.logo}
      />
      <span className={styles.copy}>{dict.footer}</span>
    </footer>
  );
}
