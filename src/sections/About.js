import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { manifesto, dataabout } from "../content_option";
import SectionHead from "./SectionHead";
import IdBadge from "./IdBadge";

// "*IIT Jodhpur*" marks words that get the accent colour once lit.
const tokens = manifesto
  .split(/(\*[^*]+\*)/)
  .filter(Boolean)
  .flatMap((chunk) => {
    const hl = chunk.startsWith("*");
    return chunk
      .replace(/\*/g, "")
      .split(" ")
      .filter(Boolean)
      .map((text) => ({ text, hl }));
  });

function Word({ progress, range, hl, children }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span className={`about__word ${hl ? "is-hl" : ""}`} style={{ opacity }}>
      {children}
    </motion.span>
  );
}

export default function About() {
  const textRef = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: textRef, offset: ["start 85%", "end 55%"] });
  const n = tokens.length;

  return (
    <section id="about" className="section" aria-label="About">
      <div className="container">
        <SectionHead index="01" label="About" title="Engineer first," dim="product-minded always." />

        <div className="about">
          <div className="about__copy">
            <p ref={textRef} className="about__text">
              <span className="sr-only">{tokens.map((t) => t.text).join(" ")}</span>
              <span aria-hidden="true">
                {tokens.map((t, i) => (
                  <React.Fragment key={i}>
                    <Word progress={p} range={[i / n, Math.min(1, (i + 2) / n)]} hl={t.hl}>
                      {t.text}
                    </Word>{" "}
                  </React.Fragment>
                ))}
              </span>
            </p>

            <p className="about__body">{dataabout.aboutme[1]}</p>

            <ul className="about__facts">
              <li><span>Degree</span>{dataabout.education.degree}</li>
              <li><span>Institute</span>IIT Jodhpur</li>
              <li><span>Grade</span>{dataabout.education.grade}</li>
              <li><span>Since</span>{dataabout.education.date.replace(" – Present", "")}</li>
            </ul>
          </div>

          <IdBadge />
        </div>
      </div>
    </section>
  );
}
