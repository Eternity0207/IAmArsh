import React from "react";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

/** Words slide up out of a mask, one after another, when scrolled into view. */
export function RiseText({ text, className, delay = 0 }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="rise">
          <motion.span
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease, delay: delay + i * 0.04 }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

/**
 * Consistent section header:
 *   01 ── ABOUT
 *   Title in full colour <muted continuation>        Optional lead paragraph
 */
export default function SectionHead({ index, label, title, dim, lead }) {
  const titleWords = title.split(" ").length;
  return (
    <header className="sh">
      <motion.div
        className="sh__eyebrow"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease }}
      >
        <span className="sh__index">{index}</span>
        <motion.span
          className="sh__rule"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease, delay: 0.15 }}
          aria-hidden="true"
        />
        <span>{label}</span>
      </motion.div>
      <div className="sh__row">
        <h2 className="sh__title">
          <RiseText text={title} />
          {dim && (
            <>
              {" "}
              <RiseText text={dim} className="dim" delay={titleWords * 0.04} />
            </>
          )}
        </h2>
        {lead && (
          <motion.p
            className="sh__lead"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
          >
            {lead}
          </motion.p>
        )}
      </div>
    </header>
  );
}
