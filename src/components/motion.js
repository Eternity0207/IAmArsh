import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

/** Reveals text word by word: each word rises out of a blur. */
export function SplitText({ text, className, delay = 0, stagger = 0.045 }) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="split-word" aria-hidden="true">
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "0.6em", opacity: 0, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease, delay: delay + i * stagger }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

/** Cycles through words with a vertical slide + blur. */
export function RotatingWord({ words, interval = 2600, className }) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return undefined;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval, reduced]);

  return (
    <span className="rotating">
      <span className="sr-only">{words.join(", ")}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[i]}
          aria-hidden="true"
          className={`rotating__word ${className || ""}`}
          initial={{ y: "70%", opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-70%", opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Counts from 0 to the numeric part of `value` when scrolled into view. */
export function CountUp({ value, duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const match = String(value).match(/^([\d.]+)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : "";
  const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0;
  const [display, setDisplay] = useState(match ? (0).toFixed(decimals) : value);

  useEffect(() => {
    if (!match || !inView) return undefined;
    if (reduced) {
      setDisplay(target.toFixed(decimals));
      return undefined;
    }
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced]);

  if (!match) return <span>{value}</span>;
  return (
    <span ref={ref} aria-label={String(value)}>
      <span aria-hidden="true">{display}{suffix}</span>
    </span>
  );
}

const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Pulls its child gently toward the cursor. */
export function Magnetic({ children, strength = 0.3 }) {
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.4 });
  const enabled = !reduced && finePointer();

  const onMove = (e) => {
    if (!enabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span className="magnetic" style={{ x, y }} onMouseMove={onMove} onMouseLeave={reset}>
      {children}
    </motion.span>
  );
}

/** Subtle 3D tilt that follows the cursor. */
export function Tilt({ children, max = 6, className }) {
  const reduced = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 180, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 180, damping: 20 });
  const enabled = !reduced && finePointer();

  const onMove = (e) => {
    if (!enabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      className={`tilt ${className || ""}`}
      style={enabled ? { rotateX: rx, rotateY: ry, transformPerspective: 1000 } : undefined}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}

/** Thin gradient bar at the top of the viewport showing scroll progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

/** Vertical line that draws itself as the container scrolls through view. */
export function ScrollLine({ targetRef }) {
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.span className="scroll-line" style={{ scaleY }} aria-hidden="true" />;
}
