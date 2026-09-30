import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Small dot + trailing ring. Over anything clickable the ring grows slightly
 * and picks up the accent colour; it tucks in while pressed. Fine pointers only.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState({ hover: false, down: false, hidden: true });
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 500, damping: 36, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 500, damping: 36, mass: 0.5 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const update = () => setEnabled(mq.matches && !reduced);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    document.documentElement.classList.add("has-cursor");

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target.closest
        ? e.target.closest("a, button, input, textarea, [role='tab'], [role='option'], [data-cursor]")
        : null;
      const typing = !!target && /INPUT|TEXTAREA/.test(target.tagName);
      const hover = !!target && !typing;
      setState((s) => (s.hover === hover && s.hidden === typing ? s : { ...s, hover, hidden: typing }));
    };
    const onDown = () => setState((s) => ({ ...s, down: true }));
    const onUp = () => setState((s) => ({ ...s, down: false }));
    const onLeave = () => setState((s) => ({ ...s, hidden: true }));

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = state.hover ? 40 : 26;

  return (
    <>
      {/* Zero-size anchor follows the pointer; the ring is centred on it in CSS. */}
      <motion.div
        className="cursor-anchor"
        style={{ x: rx, y: ry }}
        animate={{ scale: state.down ? 0.8 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        aria-hidden="true"
      >
        <motion.div
          className={`cursor-ring ${state.hover ? "is-hover" : ""}`}
          animate={{ width: size, height: size, opacity: state.hidden ? 0 : 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
        />
      </motion.div>
      <motion.div
        className="cursor-dot"
        style={{ x, y }}
        animate={{ opacity: state.hidden ? 0 : 1, scale: state.hover ? 0.5 : 1 }}
        transition={{ duration: 0.15 }}
        aria-hidden="true"
      />
    </>
  );
}
