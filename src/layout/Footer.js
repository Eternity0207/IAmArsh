import React from "react";
import { motion } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";
import { introdata } from "../content_option";
import { Magnetic } from "../components/motion";
import { useSmoothScroll } from "./SmoothScroll";
import LocalTime from "./LocalTime";

export default function Footer() {
  const { scrollTo } = useSmoothScroll();
  const letters = introdata.name.split("");

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__row">
          <span>© {new Date().getFullYear()} {introdata.name}. Designed & engineered by me.</span>
          <span className="footer__time"><LocalTime /> IST · {introdata.location}</span>
          <Magnetic strength={0.25}>
            <button className="btn btn--ghost btn--sm" onClick={() => scrollTo(0)} data-cursor="Top">
              Back to top <FiArrowUp aria-hidden="true" />
            </button>
          </Magnetic>
        </div>
      </div>
      <p className="footer__mark" aria-hidden="true">
        {letters.map((ch, i) => (
          <span key={i} className="rise">
            <motion.span
              initial={{ y: "100%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.035 }}
            >
              {ch === " " ? " " : ch}
            </motion.span>
          </span>
        ))}
      </p>
    </footer>
  );
}
