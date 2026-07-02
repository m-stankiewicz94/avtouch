"use client";

import { useEffect } from "react";

/**
 * All imperative motion for the site, ported from the original design export.
 * Content is fully visible without this component (SSR / no-JS / reduced-motion);
 * everything here only *adds* motion. It is deliberately defensive — every
 * effect null-guards its target, so it is safe regardless of which sections
 * are on the page.
 */
export default function SiteMotion() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const cleanups: Array<() => void> = [];
    const timers: Array<ReturnType<typeof setTimeout>> = [];
    const on = (
      target: EventTarget,
      ev: string,
      fn: (e: Event) => void,
      opts?: AddEventListenerOptions
    ) => {
      target.addEventListener(ev, fn as EventListener, opts);
      cleanups.push(() => target.removeEventListener(ev, fn as EventListener, opts));
    };
    const later = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      timers.push(id);
      return id;
    };
    const teardown = () => {
      cleanups.forEach((fn) => fn());
      timers.forEach((id) => clearTimeout(id));
    };

    // Run `step` on rAF only while `el` intersects the viewport; genuinely
    // idle (no rAF churn, no layout reads) when off-screen.
    const runWhileVisible = (el: Element, step: () => void) => {
      let raf = 0;
      let running = false;
      const frame = () => {
        if (!running) return;
        step();
        raf = requestAnimationFrame(frame);
      };
      const start = () => {
        if (running) return;
        running = true;
        raf = requestAnimationFrame(frame);
      };
      const stop = () => {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      };
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) start();
          else stop();
        }
      });
      io.observe(el);
      cleanups.push(() => {
        stop();
        io.disconnect();
      });
    };

    // ---------- smooth anchors (always on) ----------
    document.querySelectorAll<HTMLAnchorElement>("[data-anchor]").forEach((a) => {
      on(a, "click", (e) => {
        const target = document.getElementById(a.getAttribute("data-anchor") || "");
        if (!target) return;
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 70,
          behavior: "smooth",
        });
      });
    });

    if (prefersReduced) return teardown;

    // ---------- hero entrance ----------
    const heroLines = [
      ...document.querySelectorAll<HTMLElement>("[data-hero-line]"),
    ];
    const heroSub = document.querySelector<HTMLElement>("[data-hero-sub]");
    heroLines.forEach((l) => {
      l.style.transform = "translateY(110%)";
      l.style.opacity = "0";
    });
    if (heroSub) {
      heroSub.style.opacity = "0";
      heroSub.style.transform = "translateY(20px)";
    }
    later(() => {
      heroLines.forEach((l, i) => {
        l.style.transition = `transform 1s cubic-bezier(.2,.7,.2,1) ${i * 120}ms, opacity .8s ease ${i * 120}ms`;
        l.style.transform = "translateY(0)";
        l.style.opacity = "1";
      });
      if (heroSub) {
        heroSub.style.transition =
          "opacity .9s ease .5s, transform .9s cubic-bezier(.2,.7,.2,1) .5s";
        heroSub.style.opacity = "1";
        heroSub.style.transform = "translateY(0)";
      }
      later(() => {
        [...heroLines, heroSub].forEach((el) => {
          if (!el) return;
          el.style.transition = "none";
          el.style.transform = "translateY(0)";
          el.style.opacity = "1";
        });
      }, 1800);
    }, 60);

    // ---------- ASCII particle field ----------
    // Cheaper cell grid on low-core devices; ~30fps draw; IO-gated on/off.
    const lowPower = (navigator.hardwareConcurrency || 8) <= 4;
    const setupAscii = (cv: HTMLCanvasElement, strength: number) => {
      const hero = cv.parentElement;
      const ctx = cv.getContext("2d");
      if (!hero || !ctx) return;
      const CELL = lowPower ? 22 : 16,
        FONT = 12;
      const CHARS = [" ", "·", ":", ";", "+", "*", "x", "#"];
      let W = 0,
        H = 0,
        cols = 0,
        rows = 0,
        dpr = 1;
      let mx = -9999,
        my = -9999,
        tmx = -9999,
        tmy = -9999;
      const resize = () => {
        const r = hero.getBoundingClientRect();
        dpr = Math.min(2, window.devicePixelRatio || 1);
        W = r.width;
        H = r.height;
        cv.width = W * dpr;
        cv.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.font = FONT + "px 'JetBrains Mono',monospace";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        cols = Math.ceil(W / CELL);
        rows = Math.ceil(H / CELL);
      };
      resize();
      on(window, "resize", resize);
      const avoid = hero.querySelector("[data-ascii-avoid]");
      on(hero, "mousemove", (e) => {
        const me = e as MouseEvent;
        if (avoid && avoid.contains(me.target as Node)) {
          tmx = -9999;
          tmy = -9999;
          return;
        }
        const r = hero.getBoundingClientRect();
        tmx = me.clientX - r.left;
        tmy = me.clientY - r.top;
      });
      on(hero, "mouseleave", () => {
        tmx = -9999;
        tmy = -9999;
      });
      let t = 0,
        ix = 0,
        iy = 0,
        skip = 0;
      const beam = hero.querySelector<HTMLElement>("[data-beam]");
      const step = () => {
        if (document.hidden) return;
        // ~30fps: draw every other frame.
        skip ^= 1;
        if (skip) return;
        t += 0.032;
        mx += (tmx - mx) * 0.14;
        my += (tmy - my) * 0.14;
        if (beam) {
          const txI = tmx < -999 ? 0 : tmx / W - 0.5,
            tyI = tmy < -999 ? 0 : tmy / H - 0.5;
          ix += (txI - ix) * 0.06;
          iy += (tyI - iy) * 0.06;
          const sway = (Math.sin(t * 0.14) * 0.5 + 0.5) * (W * 0.8) + ix * 90;
          const bob = (Math.sin(t * 0.09 + 1.6) * 0.5 + 0.5) * (H * 0.55) + iy * 46;
          const tilt = -10 + Math.sin(t * 0.2) * 2.5 + ix * 4;
          beam.style.transform =
            "translateX(" +
            sway.toFixed(1) +
            "px) translateY(" +
            (window.scrollY * 0.28 + bob).toFixed(1) +
            "px) rotate(" +
            tilt.toFixed(2) +
            "deg)";
          beam.style.opacity = (0.78 + 0.22 * Math.sin(t * 0.55)).toFixed(2);
        }
        ctx.clearRect(0, 0, W, H);
        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const x = i * CELL + CELL / 2,
              y = j * CELL + CELL / 2;
            const u = i / cols,
              v = j / rows;
            const bandCenter =
              0.52 +
              0.13 * Math.sin(t * 0.35 + u * 4.2) +
              0.07 * Math.sin(t * 0.6 - u * 7.5) -
              (u - 0.5) * 0.22;
            const band = Math.exp(-Math.pow((v - bandCenter) / 0.16, 2));
            const n =
              0.5 +
              0.5 *
                Math.sin(u * 21 + t * 1.3) *
                Math.sin(v * 17 - t * 0.9) *
                Math.sin((u + v) * 13 + t * 0.5);
            const dx = x - mx,
              dy = y - my;
            const mg = Math.exp(-(dx * dx + dy * dy) / 26000);
            let a = (band * (0.25 + 0.75 * n) + mg * 0.9) * strength;
            if (a < 0.06) continue;
            if (a > 1) a = 1;
            const ch =
              CHARS[Math.min(CHARS.length - 1, Math.floor(a * (CHARS.length - 1) + 0.5))];
            if (ch === " ") continue;
            const rC = Math.round(46 + (64 - 46) * a);
            const gC = Math.round(90 + (208 - 90) * a);
            const bC = Math.round(220 + (244 - 220) * a);
            ctx.fillStyle =
              "rgba(" + rC + "," + gC + "," + bC + "," + (0.14 + 0.55 * a).toFixed(2) + ")";
            ctx.fillText(ch, x, y);
          }
        }
      };
      runWhileVisible(cv, step);
    };
    document.querySelectorAll<HTMLCanvasElement>("[data-ascii]").forEach((cv) =>
      setupAscii(cv, parseFloat(cv.getAttribute("data-strength") || "1"))
    );

    // ---------- reveals ----------
    const revealed = new WeakSet<Element>();
    const revealEls = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    revealEls.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.9) {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
      } else {
        revealed.add(el);
      }
    });
    const checkReveals = () => {
      revealEls.forEach((el) => {
        if (revealed.has(el)) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.88 && r.bottom > 0) {
          revealed.add(el);
          el.style.transition =
            "opacity .9s cubic-bezier(.2,.6,.2,1), transform .9s cubic-bezier(.2,.6,.2,1)";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          later(() => {
            el.style.transition = "none";
          }, 1200);
        }
      });
    };

    // ---------- count-up ----------
    const counted = new WeakSet<Element>();
    const countEls = [...document.querySelectorAll<HTMLElement>("[data-count]")];
    const checkCounts = () => {
      countEls.forEach((el) => {
        if (counted.has(el)) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
          counted.add(el);
          const to = parseInt(el.getAttribute("data-count") || "0", 10);
          // Reset lazily, only once the element is actually about to animate,
          // so off-screen counters keep their SSR value (real number) for
          // crawlers / no-JS instead of showing 0.
          el.textContent = "0";
          const t0 = performance.now(),
            dur = 1400;
          let cRaf = 0;
          const tick = (now: number) => {
            const p = Math.min(1, (now - t0) / dur);
            el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
            if (p < 1) cRaf = requestAnimationFrame(tick);
          };
          cRaf = requestAnimationFrame(tick);
          cleanups.push(() => cancelAnimationFrame(cRaf));
          later(() => {
            el.textContent = String(to);
          }, dur + 300);
        }
      });
    };

    // ---------- marquee ----------
    const marquee = document.querySelector<HTMLElement>("[data-marquee]");
    if (marquee) {
      let x = 0,
        paused = false,
        half = 0;
      // Measure once (and on resize) — never read layout inside the loop.
      const measure = () => {
        half = marquee.scrollWidth / 2 + 36;
      };
      measure();
      on(window, "resize", measure);
      on(marquee, "mouseenter", () => {
        paused = true;
      });
      on(marquee, "mouseleave", () => {
        paused = false;
      });
      runWhileVisible(marquee, () => {
        if (paused || !half) return;
        x -= 0.55;
        if (-x >= half) x += half;
        marquee.style.transform = "translateX(" + x + "px)";
      });
    }

    // ---------- card glow ----------
    document.querySelectorAll<HTMLElement>("[data-glow]").forEach((card) => {
      const fx = card.querySelector<HTMLElement>("[data-glow-fx]");
      if (!fx) return;
      const ic = card.querySelector<HTMLElement>("[data-svc-icon]");
      const icBase = ic ? { color: ic.style.color, border: ic.style.borderColor } : null;
      let acc = 0,
        lx: number | null = null,
        ly: number | null = null;
      on(card, "mousemove", (e) => {
        const me = e as MouseEvent;
        const r = card.getBoundingClientRect();
        const x = me.clientX - r.left,
          y = me.clientY - r.top;
        if (lx !== null && ly !== null)
          acc += (Math.abs(x - lx) + Math.abs(y - ly)) * 0.0018;
        lx = x;
        ly = y;
        const h = Math.round(240 + 50 * Math.sin(acc));
        fx.style.background =
          "radial-gradient(460px circle at " +
          x +
          "px " +
          y +
          "px, hsla(" +
          h +
          ",80%,62%,.09), transparent 68%)";
        fx.style.opacity = "1";
        card.style.borderColor = "hsla(" + h + ",75%,62%,.35)";
        card.style.boxShadow =
          "0 20px 50px rgba(0,0,0,.3), 0 0 40px hsla(" + h + ",80%,60%,.06)";
        if (ic) {
          ic.style.color = "hsl(" + h + ",70%,72%)";
          ic.style.borderColor = "hsla(" + h + ",70%,62%,.4)";
        }
      });
      on(card, "mouseleave", () => {
        fx.style.opacity = "0";
        lx = null;
        ly = null;
        card.style.borderColor = "";
        card.style.boxShadow = "";
        if (ic && icBase) {
          ic.style.color = icBase.color;
          ic.style.borderColor = icBase.border;
        }
      });
    });

    // ---------- process rows ----------
    const nav = document.querySelector<HTMLElement>("[data-nav]");
    const procWrap = document.querySelector<HTMLElement>("[data-proc-wrap]");
    const procRows = [...document.querySelectorAll<HTMLElement>("[data-proc-step]")];
    const procState = new WeakMap<Element, boolean>();
    const origTrans = new WeakMap<Element, string>();
    const procSnap = new WeakMap<Element, ReturnType<typeof setTimeout>>();
    let procMouse = false;

    // The section is readable by default (CSS). Since motion is allowed here,
    // dim the rows imperatively so scrolling can light them up.
    procRows.forEach((row) => {
      const num = row.querySelector<HTMLElement>("[data-proc-num]");
      const title = row.querySelector<HTMLElement>("[data-proc-title]");
      const desc = row.querySelector<HTMLElement>("[data-proc-desc]");
      const chips = row.querySelector<HTMLElement>("[data-proc-chips]");
      if (num) {
        num.style.backgroundImage = "none";
        num.style.color = "rgba(255,255,255,.1)";
      }
      if (title) title.style.color = "rgba(236,238,242,.38)";
      if (desc) desc.style.color = "rgba(150,156,168,.4)";
      if (chips) {
        chips.style.opacity = "0";
        chips.style.transform = "translateY(6px)";
      }
    });

    const setProcRow = (row: HTMLElement, active: boolean) => {
      if (procState.get(row) === active) return;
      procState.set(row, active);
      const num = row.querySelector<HTMLElement>("[data-proc-num]");
      const title = row.querySelector<HTMLElement>("[data-proc-title]");
      const desc = row.querySelector<HTMLElement>("[data-proc-desc]");
      const chips = row.querySelector<HTMLElement>("[data-proc-chips]");
      const anim = [title, desc, chips].filter(Boolean) as HTMLElement[];
      anim.forEach((el) => {
        if (!origTrans.has(el)) origTrans.set(el, el.style.transition);
        el.style.transition = origTrans.get(el) || "";
      });
      if (num) {
        if (active) {
          num.style.backgroundImage = "linear-gradient(120deg,#2e77ff,#40d0f4)";
          num.style.webkitBackgroundClip = "text";
          num.style.backgroundClip = "text";
          num.style.color = "transparent";
        } else {
          num.style.backgroundImage = "none";
          num.style.color = "rgba(255,255,255,.1)";
        }
      }
      if (title) title.style.color = active ? "#eceef2" : "rgba(236,238,242,.38)";
      if (desc) desc.style.color = active ? "#969ca8" : "rgba(150,156,168,.4)";
      if (chips) {
        chips.style.opacity = active ? "1" : "0";
        chips.style.transform = active ? "translateY(0)" : "translateY(6px)";
      }
      const prev = procSnap.get(row);
      if (prev) clearTimeout(prev);
      procSnap.set(
        row,
        later(() => {
          anim.forEach((el) => {
            el.style.transition = "none";
          });
        }, 620)
      );
    };

    if (procWrap) {
      on(procWrap, "mousemove", (e) => {
        const me = e as MouseEvent;
        procMouse = true;
        procRows.forEach((row) =>
          setProcRow(row, me.clientY > row.getBoundingClientRect().top + 24)
        );
      });
    }

    // ---------- gallery + quote ----------
    const gallery = document.querySelector<HTMLElement>("[data-gallery]");
    const track = document.querySelector<HTMLElement>("[data-track]");
    const gprog = document.querySelector<HTMLElement>("[data-gallery-progress]");
    const quote = document.querySelector<HTMLElement>("[data-quote]");

    let qspans: HTMLSpanElement[] = [];
    if (quote) {
      const words = (quote.textContent || "").trim().split(/\s+/);
      quote.innerHTML = "";
      qspans = words.map((w) => {
        const s = document.createElement("span");
        s.textContent = w + " ";
        s.style.color = "rgba(236,238,242,.22)";
        quote.appendChild(s);
        return s;
      });
    }

    const applyScroll = () => {
      const y = window.scrollY;
      if (nav) {
        const active = y > 40;
        nav.style.background = active ? "rgba(5,6,10,.72)" : "transparent";
        nav.style.backdropFilter = active ? "blur(18px)" : "none";
        nav.style.borderBottomColor = active
          ? "rgba(255,255,255,.08)"
          : "rgba(255,255,255,0)";
      }
      if (!procMouse) {
        procRows.forEach((row) =>
          setProcRow(
            row,
            row.getBoundingClientRect().top + 58 < window.innerHeight * 0.75
          )
        );
      }
      if (gallery && track) {
        const r = gallery.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        const p = Math.min(1, Math.max(0, -r.top / total));
        const max = track.scrollWidth - window.innerWidth + 56;
        track.style.transform = "translateX(" + -p * Math.max(0, max) + "px)";
        if (gprog) gprog.style.width = p * 100 + "%";
      }
      if (quote && qspans.length) {
        const r = quote.getBoundingClientRect();
        const p = Math.min(
          1,
          Math.max(0, (window.innerHeight * 0.8 - r.top) / (window.innerHeight * 0.55))
        );
        const n = Math.floor(p * qspans.length);
        qspans.forEach((s, i) => {
          s.style.color = i < n ? "#eceef2" : "rgba(236,238,242,.22)";
        });
      }
      checkReveals();
      checkCounts();
    };

    // Coalesce scroll work into one rAF per frame to avoid layout thrashing.
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        applyScroll();
      });
    };
    on(window, "scroll", onScroll, { passive: true });
    on(window, "resize", onScroll);
    applyScroll();

    return teardown;
  }, []);

  return null;
}
