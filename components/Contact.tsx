"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Dictionary } from "@/lib/i18n/config";
import { SITE } from "@/lib/seo/site";
import styles from "./Contact.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact({ dict }: { dict: Dictionary }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState<string | null>(null);

  const update =
    (key: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = e.target;
      setForm((f) => ({ ...f, [key]: value }));
      if (error) setError(null);
    };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !EMAIL_RE.test(email) || !message) {
      setError(dict.contact.invalid);
      return;
    }

    // No backend yet: hand the message to the visitor's mail client.
    // TODO(avtouch): replace with a server action / email API (e.g. Resend).
    const subject = encodeURIComponent(`${SITE.name} — ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="kontakt" className={styles.section}>
      <canvas
        data-ascii
        data-strength="0.45"
        className={styles.ascii}
        aria-hidden="true"
      />
      <div data-reveal className={styles.inner}>
        <h2 className={styles.heading}>{dict.contact.h}</h2>
        <p className={styles.sub}>{dict.contact.sub}</p>

        <form data-ascii-avoid className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.row}>
            <input
              className={styles.input}
              type="text"
              name="name"
              autoComplete="name"
              placeholder={dict.contact.phName}
              aria-label={dict.contact.phName}
              value={form.name}
              onChange={update("name")}
            />
            <input
              className={styles.input}
              type="email"
              name="email"
              autoComplete="email"
              placeholder={dict.contact.phEmail}
              aria-label={dict.contact.phEmail}
              value={form.email}
              onChange={update("email")}
            />
          </div>
          <textarea
            className={styles.textarea}
            name="message"
            rows={4}
            placeholder={dict.contact.phMsg}
            aria-label={dict.contact.phMsg}
            value={form.message}
            onChange={update("message")}
          />
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          <button type="submit" className={styles.button}>
            {dict.contact.btn}
          </button>
        </form>

        <div className={styles.meta}>
          <a href={`mailto:${SITE.email}`} className={styles.metaLink}>
            {SITE.email}
          </a>
          <a href={`tel:${SITE.phoneHref}`} className={styles.metaLink}>
            {SITE.phone}
          </a>
          <span>{dict.contact.city}</span>
        </div>
      </div>
    </section>
  );
}
