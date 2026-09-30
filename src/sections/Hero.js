import React, { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";
import { introdata, worktimeline, dataabout } from "../content_option";
import Constellation from "../components/Constellation";
import { Magnetic } from "../components/motion";
import { useSmoothScroll } from "../layout/SmoothScroll";
import LocalTime from "../layout/LocalTime";

const ease = [0.22, 1, 0.36, 1];
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%&*@!?/<>{}";
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

const HOLD = 260; // every letter is scrambled at least this long
const STAGGER = 70; // then letters settle one by one, left → right
const FLIP = 55; // how often a scrambling letter picks a new glyph

/**
 * A word whose letters rise in on mount. On hover every letter flips through
 * random characters, then settles back to the real letter in sequence. The
 * glyphs are drawn over the (hidden) real letter, so the word never reflows.
 */
function ScrambleWord({ word, delay }) {
  const letters = useMemo(() => word.split(""), [word]);
  const [glyphs, setGlyphs] = useState(() => letters.map(() => null));
  const busy = useRef(false);

  const scramble = useCallback(() => {
    if (busy.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    busy.current = true;
    const start = performance.now();
    let lastFlip = -Infinity;

    const tick = (now) => {
      const t = now - start;
      const flip = now - lastFlip >= FLIP;
      if (flip) lastFlip = now;
      setGlyphs((prev) =>
        prev.map((g, i) => {
          if (t >= HOLD + i * STAGGER) return null;
          return flip || g === null ? randomGlyph() : g;
        })
      );
      if (t < HOLD + letters.length * STAGGER) requestAnimationFrame(tick);
      else {
        setGlyphs(letters.map(() => null));
        busy.current = false;
      }
    };
    requestAnimationFrame(tick);
  }, [letters]);

  return (
    <span className="hero__word" onPointerEnter={scramble} aria-hidden="true">
      {letters.map((ch, i) => (
        <span key={i} className="rise">
          <motion.span
            initial={{ y: "105%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1, ease, delay: delay + i * 0.045 }}
          >
            <span className={`hero__ch ${glyphs[i] ? "is-scrambling" : ""}`}>
              <span className="hero__ch-base">{ch}</span>
              {glyphs[i] && <span className="hero__ch-glyph">{glyphs[i]}</span>}
            </span>
          </motion.span>
        </span>
      ))}
    </span>
  );
}

const fade = (delay) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease, delay },
});

export default function Hero() {
  const { scrollTo } = useSmoothScroll();
  const current = worktimeline.find((w) => /present/i.test(w.date) && !/freelance/i.test(w.jobtitle));
  const [first, last] = introdata.name.split(" ");

  const meta = [
    { label: "Currently", value: current ? `${current.jobtitle}, ${current.where}` : introdata.status },
    { label: "Education", value: `${dataabout.education.degree}, IIT Jodhpur` },
    { label: "Focus", value: "Backend · AI systems · Product" },
    { label: "Local time", value: <><LocalTime /> IST · {introdata.location}</> },
  ];

  return (
    <section id="top" className="hero" aria-label="Introduction">
      <Constellation />
      <div className="hero__inner container">
        <motion.div className="hero__top" {...fade(0.1)}>
          <span className="pill">
            <span className="status__dot" aria-hidden="true" /> Open to internships & freelance work
          </span>
          <span className="hero__role">{introdata.role}</span>
        </motion.div>

        <h1 className="hero__name">
          <span className="sr-only">{introdata.name}</span>
          <ScrambleWord word={first} delay={0.15} />{" "}
          <ScrambleWord word={last} delay={0.35} />
        </h1>

        <div className="hero__row">
          <motion.p className="hero__lead" {...fade(0.55)}>
            {introdata.lead}
          </motion.p>
          <motion.div className="hero__ctas" {...fade(0.65)}>
            <Magnetic>
              <button className="btn btn--primary" onClick={() => scrollTo("work")} data-cursor="View">
                View selected work <FiArrowDown aria-hidden="true" />
              </button>
            </Magnetic>
            <Magnetic>
              <a className="btn btn--ghost" href={introdata.resume} target="_blank" rel="noopener noreferrer" data-cursor="Open">
                Résumé <FiArrowUpRight aria-hidden="true" />
              </a>
            </Magnetic>
          </motion.div>
        </div>

        <dl className="hero__meta">
          {meta.map((m, i) => (
            <motion.div key={m.label} className="hero__meta-item" {...fade(0.75 + i * 0.07)}>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
