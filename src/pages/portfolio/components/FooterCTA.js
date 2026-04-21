import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function FooterCTA() {
  return (
    <section className="sp-footer">
      <motion.div
        className="sp-footer__inner"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="sp-footer__eyebrow">End of Sequence</span>
        <h2 className="sp-footer__title">
          The system rests. <br />
          Until the next one begins.
        </h2>

        <div className="sp-footer__actions">
          <Link to="/contact" className="sp-footer__cta sp-footer__cta--primary">
            <span>Start a Project</span>
            <span className="sp-footer__arrow" aria-hidden="true">
              →
            </span>
          </Link>
          <a
            href="https://github.com/Eternity0207"
            target="_blank"
            rel="noopener noreferrer"
            className="sp-footer__cta sp-footer__cta--ghost"
          >
            <span>Explore More</span>
            <span className="sp-footer__arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </motion.div>

      <div className="sp-footer__fade" aria-hidden="true" />
    </section>
  );
}
