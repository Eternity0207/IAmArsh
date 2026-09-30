import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiArrowUpRight, FiAward } from "react-icons/fi";
import { stats, openSource, achievements } from "../content_option";
import SectionHead from "./SectionHead";

const ease = [0.22, 1, 0.36, 1];

/** Each digit spins through a full turn before landing, like an odometer. */
function RollingNumber({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const chars = String(value).split("");
  let wheel = 0;

  return (
    <span ref={ref} className="roll" aria-label={String(value)}>
      {chars.map((ch, i) => {
        if (!/\d/.test(ch)) {
          return <span key={i} className="roll__static" aria-hidden="true">{ch}</span>;
        }
        const w = wheel++;
        const target = Number(ch) + 10; // land on the second lap of 0–9
        return (
          <span key={i} className="roll__wheel" aria-hidden="true">
            <span
              className="roll__strip"
              style={{
                transform: `translateY(-${inView ? target * 5 : 0}%)`,
                transitionDelay: `${w * 0.12}s`,
              }}
            >
              {"01234567890123456789".split("").map((n, k) => <span key={k}>{n}</span>)}
            </span>
          </span>
        );
      })}
    </span>
  );
}

/** One contribution: a branch that forks off main, carries a commit, and merges back. */
function Branch({ item, index, last }) {
  return (
    <motion.li
      className="git__item"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-60px" }}
    >
      <svg className="git__graph" viewBox="0 0 48 100" preserveAspectRatio="none" aria-hidden="true">
        <line x1="10" y1="0" x2="10" y2={last ? 60 : 100} className="git__main" />
        <motion.path
          d="M10 8 C10 26, 36 22, 36 40 L36 60 C36 78, 10 74, 10 92"
          className="git__branch"
          variants={{ hidden: { pathLength: 0 }, shown: { pathLength: 1 } }}
          transition={{ duration: 1, ease, delay: 0.1 + index * 0.08 }}
        />
        <circle cx="10" cy="8" r="3.5" className="git__commit git__commit--main" />
        <motion.circle
          cx="36"
          cy="50"
          r="4.5"
          className="git__commit"
          variants={{ hidden: { scale: 0 }, shown: { scale: 1 } }}
          transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.5 + index * 0.08 }}
          style={{ transformOrigin: "36px 50px" }}
        />
      </svg>
      <motion.a
        className="git__body"
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="Open"
        variants={{ hidden: { opacity: 0, x: -10 }, shown: { opacity: 1, x: 0 } }}
        transition={{ duration: 0.6, ease, delay: 0.3 + index * 0.08 }}
      >
        <span className="git__repo">
          {item.title}
          <span className={`git__status ${/open/i.test(item.status) ? "is-open" : ""}`}>{item.status}</span>
        </span>
        <span className="git__detail">{item.detail}</span>
        <FiArrowUpRight className="git__arrow" aria-hidden="true" />
      </motion.a>
    </motion.li>
  );
}

function SpotlightCard({ children, href, delay }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const Comp = href ? motion.a : motion.div;
  return (
    <Comp
      className="spot"
      href={href}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      onPointerMove={onMove}
      data-cursor={href ? "Open" : undefined}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease, delay }}
    >
      {children}
    </Comp>
  );
}

export default function Highlights() {
  return (
    <section id="highlights" className="section" aria-label="Highlights">
      <div className="container">
        <SectionHead index="05" label="Highlights" title="Numbers, merges" dim="and a few wins." />

        <div className="stats">
          {stats.map((s) => (
            <div key={s.label} className="stats__item">
              <span className="stats__value"><RollingNumber value={s.value} /></span>
              <span className="stats__label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="hl-grid">
          <div>
            <h3 className="hl-grid__title">Open source</h3>
            <ol className="git">
              {openSource.map((o, i) => (
                <Branch key={o.title} item={o} index={i} last={i === openSource.length - 1} />
              ))}
            </ol>
          </div>
          <div>
            <h3 className="hl-grid__title">Recognition</h3>
            <div className="spots">
              {achievements.map((a, i) => (
                <SpotlightCard key={a.title} href={a.link} delay={i * 0.08}>
                  <FiAward className="spot__icon" aria-hidden="true" />
                  <span className="spot__title">{a.title}</span>
                  <span className="spot__detail">{a.detail}</span>
                  {a.date && <span className="chip">{a.date}</span>}
                </SpotlightCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
