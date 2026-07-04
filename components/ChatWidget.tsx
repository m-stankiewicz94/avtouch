"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n/config";
import styles from "./ChatWidget.module.css";

type ChatMessage = { role: "user" | "assistant"; text: string };

export default function ChatWidget({ dict }: { dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [remaining, setRemaining] = useState<string[]>(dict.chat.suggestions);
  const [suggestionsOff, setSuggestionsOff] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", text: dict.chat.welcome }]);
    }
    if (open) inputRef.current?.focus();
  }, [open, messages.length, dict.chat.welcome]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  const lastMessage = messages[messages.length - 1];
  const showTyping = busy && (!lastMessage || lastMessage.text !== "" || lastMessage.role === "user");
  const showSuggestions =
    open && !busy && !suggestionsOff && remaining.length > 0;

  async function sendText(raw: string, fromSuggestion = false) {
    const text = raw.trim();
    if (!text || busy) return;
    if (fromSuggestion) {
      // Zużyj kliknięte pytanie — reszta pokaże się pod odpowiedzią bota.
      setRemaining((prev) => prev.filter((s) => s !== text));
    } else {
      // Ręcznie wpisana wiadomość trwale wyłącza podpowiedzi w tej rozmowie.
      setSuggestionsOff(true);
    }
    const history: ChatMessage[] = [...messages, { role: "user", text }];
    setMessages(history);
    setInput("");
    setBusy(true);
    try {
      // The opening welcome line is UI-only — the API expects the first
      // turn to come from the user.
      const payload = history
        .filter((m, i) => !(i === 0 && m.role === "assistant"))
        .map((m) => ({ role: m.role, content: m.text }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });
      if (!res.ok || !res.body) throw new Error("chat request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let received = "";
      setMessages((prev) => [...prev, { role: "assistant", text: "" }]);
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        received += decoder.decode(value, { stream: true });
        const snapshot = received;
        setMessages((prev) => {
          const next = prev.slice();
          next[next.length - 1] = { role: "assistant", text: snapshot };
          return next;
        });
      }
      if (received.trim() === "") throw new Error("empty response");
    } catch {
      setMessages((prev) => {
        const next = prev.filter(
          (m, i) => !(i === prev.length - 1 && m.role === "assistant" && m.text === "")
        );
        return [...next, { role: "assistant", text: dict.chat.error }];
      });
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className={styles.root}>
      {open && (
        <div className={styles.panel} role="dialog" aria-label={dict.chat.title}>
          <div className={styles.header}>
            <span className={styles.headerDot} aria-hidden="true" />
            <span className={styles.headerTitle}>{dict.chat.title}</span>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setOpen(false)}
              aria-label={dict.chat.close}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M2 2l10 10M12 2L2 12" />
              </svg>
            </button>
          </div>

          <div ref={listRef} className={styles.messages}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? styles.msgUser : styles.msgBot}
              >
                {m.text}
              </div>
            ))}
            {showSuggestions && (
              <div className={styles.suggestions}>
                {remaining.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={styles.suggestion}
                    onClick={() => void sendText(s, true)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {showTyping && (
              <div className={styles.typing} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            )}
          </div>

          <form
            className={styles.inputRow}
            onSubmit={(e) => {
              e.preventDefault();
              void sendText(input);
            }}
          >
            <input
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={dict.chat.placeholder}
              maxLength={2000}
              disabled={busy}
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={busy || input.trim() === ""}
              aria-label={dict.chat.send}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 1.5 7 9M14.5 1.5 9.8 14.5 7 9 1.5 6.2 14.5 1.5Z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className={styles.fab}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? dict.chat.close : dict.chat.open}
        aria-expanded={open}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 4l12 12M16 4L4 16" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
          </svg>
        )}
      </button>
    </div>
  );
}
