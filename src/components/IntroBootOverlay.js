import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import "./IntroBootOverlay.css";

const EXIT_MS = 520;
const TOTAL_MS = 4000;
const CACHE_KEY = "introSeen_v2";
const EASE = [0.4, 0, 0.2, 1];

export default function IntroBootOverlay({ onDone }) {
  const [isExiting, setIsExiting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const branchNodes = useMemo(() => {
    const desktop = [
      { x: "50%", y: "50%" },
      { x: "35%", y: "34%" },
      { x: "65%", y: "34%" },
      { x: "28%", y: "56%" },
      { x: "72%", y: "56%" },
      { x: "44%", y: "68%" },
      { x: "56%", y: "68%" },
      { x: "20%", y: "72%" },
      { x: "80%", y: "72%" },
    ];
    const mobile = [
      { x: "50%", y: "50%" },
      { x: "36%", y: "36%" },
      { x: "64%", y: "36%" },
      { x: "30%", y: "58%" },
      { x: "70%", y: "58%" },
      { x: "50%", y: "71%" },
    ];
    return isMobile ? mobile : desktop;
  }, [isMobile]);

  useEffect(() => {
    let endTimer = 0;
    let doneTimer = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      setIsExiting(true);
      try {
        window.localStorage.setItem(CACHE_KEY, "1");
      } catch (_) {}
      doneTimer = window.setTimeout(() => onDone?.(), EXIT_MS);
    };

    endTimer = window.setTimeout(finish, TOTAL_MS);
    const skip = () => finish();
    window.addEventListener("pointerdown", skip, { passive: true });
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchstart", skip, { passive: true });

    return () => {
      window.clearTimeout(endTimer);
      window.clearTimeout(doneTimer);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
    };
  }, [onDone]);

  return (
    <div className={`intro-boot ${isExiting ? "intro-boot--exit" : ""}`}>
      <motion.div
        className="intro-boot__core"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 1, 0.9], scale: [0.5, 1.25, 1] }}
        transition={{ delay: 0.05, duration: 0.45, ease: EASE }}
      />

      <motion.svg
        className="intro-boot__network"
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.78] }}
        transition={{ delay: 0.5, duration: 3, ease: EASE }}
      >
        <motion.path
          className="intro-boot__path intro-boot__path--primary"
          d="M500,350 L350,240"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0.72] }}
          transition={{ delay: 0.5, duration: 0.35, ease: EASE }}
        />
        <motion.path
          className="intro-boot__path intro-boot__path--primary"
          d="M500,350 L650,240"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0.72] }}
          transition={{ delay: 0.62, duration: 0.35, ease: EASE }}
        />
        <motion.path
          className="intro-boot__path intro-boot__path--primary"
          d="M500,350 L280,390"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0.72] }}
          transition={{ delay: 0.74, duration: 0.36, ease: EASE }}
        />
        <motion.path
          className="intro-boot__path intro-boot__path--primary"
          d="M500,350 L720,390"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0.72] }}
          transition={{ delay: 0.86, duration: 0.36, ease: EASE }}
        />

        <motion.path
          className="intro-boot__path"
          d="M350,240 L280,390 L440,476"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.86, 0.62] }}
          transition={{ delay: 1.18, duration: 0.8, ease: EASE }}
        />
        <motion.path
          className="intro-boot__path"
          d="M650,240 L720,390 L560,476"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.86, 0.62] }}
          transition={{ delay: 1.28, duration: 0.8, ease: EASE }}
        />
        <motion.path
          className="intro-boot__path"
          d="M280,390 L200,500 L440,476"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.78, 0.54] }}
          transition={{ delay: 1.5, duration: 0.72, ease: EASE }}
        />
        <motion.path
          className="intro-boot__path"
          d="M720,390 L800,500 L560,476"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.78, 0.54] }}
          transition={{ delay: 1.6, duration: 0.72, ease: EASE }}
        />

        {!isMobile && (
          <>
            <motion.path
              className="intro-boot__path intro-boot__path--secondary"
              d="M440,476 L500,350 L560,476"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.7, 0.44] }}
              transition={{ delay: 1.88, duration: 0.66, ease: EASE }}
            />
            <motion.path
              className="intro-boot__path intro-boot__path--secondary"
              d="M280,390 H720"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.62, 0.38] }}
              transition={{ delay: 2.05, duration: 0.58, ease: EASE }}
            />
          </>
        )}
      </motion.svg>

      <div className="intro-boot__nodes" aria-hidden="true">
        {branchNodes.map((n, i) => (
          <motion.span
            key={i}
            className={`intro-boot__node ${i === 0 ? "intro-boot__node--core" : ""}`}
            style={{ left: n.x, top: n.y }}
            initial={{ opacity: 0, scale: 0.45 }}
            animate={{ opacity: [0, 1, i === 0 ? 0.92 : 0.68], scale: [0.45, 1.08, 1] }}
            transition={{
              delay: 1.0 + i * (isMobile ? 0.07 : 0.055),
              duration: 0.42,
              ease: EASE,
            }}
          />
        ))}
      </div>

      <motion.div
        className="intro-boot__organize"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.42, 0] }}
        transition={{ delay: 2.8, duration: 0.7, ease: EASE }}
      />

      <motion.div
        className="intro-boot__dissolve"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.9] }}
        transition={{ delay: 3.5, duration: 0.5, ease: EASE }}
      />
    </div>
  );
}
