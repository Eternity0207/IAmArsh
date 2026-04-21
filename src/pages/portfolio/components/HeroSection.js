import React from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="sp-hero">
      <div className="sp-hero__glow" aria-hidden="true" />

      <motion.div
        className="sp-hero__inner"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="sp-hero__eyebrow">Selected Work</span>
        <h1 className="sp-hero__title">
          Selected <br />
          <em>projects</em>.
        </h1>
        <p className="sp-hero__sub">
          Three focused builds across systems, AI, and developer tooling.
        </p>
      </motion.div>

      <motion.div
        className="sp-hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
      >
        <span className="sp-hero__scroll-label">Scroll to Projects</span>
        <span className="sp-hero__scroll-line" aria-hidden="true" />
      </motion.div>
    </section>
  );
}
