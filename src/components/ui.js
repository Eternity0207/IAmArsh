import React from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

const ease = [0.22, 1, 0.36, 1];

/** Fades + lifts its children into view once. */
export function Reveal({ children, delay = 0, as = "div", className, ...rest }) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Bordered surface with a glow that follows the cursor. */
export function Card({ children, className = "", href, style, delay = 0 }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const external = href && /^https?:/.test(href);
  const props = {
    className: `card ${href ? "card--link" : ""} ${className}`,
    onMouseMove: onMove,
    style,
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, ease, delay },
  };
  if (href) {
    return (
      <motion.a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} {...props}>
        {children}
      </motion.a>
    );
  }
  return <motion.div {...props}>{children}</motion.div>;
}

export function SectionHead({ index, eyebrow, title, children }) {
  return (
    <Reveal className="section-head">
      <div className="section-head__top">
        {index && <span className="section-head__num">{index}</span>}
        <span className="eyebrow">{eyebrow}</span>
        <motion.span
          className="section-head__rule"
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease, delay: 0.2 }}
        />
      </div>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </Reveal>
  );
}

export function ExtLink({ href, children }) {
  return (
    <a className="text-link" href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <FiArrowUpRight aria-hidden="true" />
    </a>
  );
}
