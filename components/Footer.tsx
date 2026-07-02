import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/config";
import styles from "./Footer.module.css";

export default function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className={styles.footer}>
      <Image
        src="/assets/avtouch-logo.png"
        alt="AVtouch"
        width={1169}
        height={205}
        className={styles.logo}
      />
      <span className={styles.copy}>{dict.footer}</span>
    </footer>
  );
}
