import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { introdata } from "../content_option";

const SESSION_KEY = "preloader-seen";
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*+=/<>0123456789";
const STEPS = ["Fetching projects", "Compiling experience", "Linking skills", "Ready"];
const COLUMNS = 5;
const ease = [0.76, 0, 0.24, 1];

export const shouldShowPreloader = () => {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return !sessionStorage.getItem(SESSION_KEY);
  } catch (e) {
    return true;
  }
};

/** Each character cycles random glyphs, then locks in left → right. */
function useDecode(text, duration = 1200, delay = 200) {
  const [out, setOut] = useState(() => text.replace(/\S/g, " "));
  useEffect(() => {
    let raf = 0;
    const start = performance.now() + delay;
    const tick = (now) => {
      const t = Math.max(0, now - start) / duration;
      const locked = Math.floor(t * text.length);
      setOut(
        text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < locked) return ch;
            if (now < start + i * 18) return " ";
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );
      if (locked < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, duration, delay]);
  return out;
}

/** Three rolling digit wheels, like an odometer. */
function Odometer({ value }) {
  const digits = String(value).padStart(3, "0").split("");
  return (
    <span className="odo" aria-hidden="true">
      {digits.map((d, i) => (
        <span key={i} className="odo__wheel">
          <span className="odo__strip" style={{ transform: `translateY(-${Number(d) * 10}%)` }}>
            {"0123456789".split("").map((n) => <span key={n}>{n}</span>)}
          </span>
        </span>
      ))}
    </span>
  );
}

/**
 * First-visit intro: the name decodes from scrambled glyphs, a counter rolls
 * to 100 while status lines tick over, then five columns lift away in a
 * staggered wipe to reveal the page. Click or any key skips ahead.
 */
export default function Preloader({ onReveal, onDone }) {
  const name = useDecode(introdata.name.toUpperCase(), 1100, 250);
  const [count, setCount] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const doneCount = useRef(0);
  const leaveRef = useRef(() => {});

  const step = STEPS[Math.min(STEPS.length - 1, Math.floor((count / 100) * (STEPS.length - 1) + 0.001))];

  useEffect(() => {
    let cancelled = false;
    const leave = () => {
      if (cancelled) return;
      setLeaving((was) => {
        if (!was) onReveal();
        return true;
      });
    };
    leaveRef.current = leave;

    const counter = animate(0, 100, {
      duration: 1.9,
      ease: [0.45, 0, 0.2, 1],
      onUpdate: (v) => setCount(Math.round(v)),
    });
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    Promise.all([counter, fonts]).then(() => setTimeout(leave, 250));

    const onKey = () => leave();
    window.addEventListener("keydown", onKey);
    return () => {
      cancelled = true;
      counter.stop();
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onColumnDone = () => {
    doneCount.current += 1;
    if (doneCount.current < COLUMNS) return;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch (e) {
      /* ignore */
    }
    onDone();
  };

  return (
    <div className="pl" role="status" aria-label="Loading" onClick={() => leaveRef.current()}>
      <div className="pl__cols" aria-hidden="true">
        {Array.from({ length: COLUMNS }, (_, i) => (
          <motion.span
            key={i}
            className="pl__col"
            initial={{ y: "0%" }}
            animate={{ y: leaving ? "-100%" : "0%" }}
            transition={{ duration: 0.8, ease, delay: leaving ? 0.15 + i * 0.06 : 0 }}
            onAnimationComplete={() => leaving && onColumnDone()}
          />
        ))}
      </div>

      <motion.div
        className="pl__content"
        animate={{ opacity: leaving ? 0 : 1, y: leaving ? -24 : 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 1, 1] }}
      >
        <div className="pl__top">
          <span>Portfolio — {new Date().getFullYear()}</span>
          <span>{introdata.location}</span>
        </div>

        <div className="pl__center">
          <p className="pl__name" aria-label={introdata.name}>{name}</p>
          <motion.p
            className="pl__role"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            {introdata.role}
          </motion.p>
        </div>

        <div className="pl__bottom">
          <div className="pl__step" aria-hidden="true">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={step}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === "Ready" ? "Ready" : `${step}…`}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="pl__count">
            <Odometer value={count} />
            <span className="pl__pct">%</span>
          </div>
        </div>
        <span className="pl__bar" style={{ transform: `scaleX(${count / 100})` }} aria-hidden="true" />
      </motion.div>
    </div>
  );
}
