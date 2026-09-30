import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { worktimeline } from "../content_option";
import SectionHead from "./SectionHead";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ease = [0.22, 1, 0.36, 1];

const now = new Date();
const nowIndex = now.getFullYear() * 12 + now.getMonth();

// "Apr 2026" → months since year 0; "Present" → the current month.
const toIndex = (s) => {
  if (/present/i.test(s)) return nowIndex;
  const [m, y] = s.trim().split(" ");
  return Number(y) * 12 + MONTHS.indexOf(m.slice(0, 3));
};

const roles = worktimeline.map((w) => {
  const [a, b] = w.date.split("–");
  const start = toIndex(a);
  const end = toIndex(b || a) + 1; // bars cover their final month
  return { ...w, start, end, current: /present/i.test(w.date) };
});

export default function Experience() {
  const [sel, setSel] = useState(0);
  const { min, max, ticks } = useMemo(() => {
    const lo = Math.min(...roles.map((r) => r.start)) - 1;
    const hi = Math.max(...roles.map((r) => r.end)) + 1;
    const t = [];
    for (let i = lo; i <= hi; i++) if (i % 3 === 0) t.push(i);
    return { min: lo, max: hi, ticks: t };
  }, []);
  const pct = (i) => ((i - min) / (max - min)) * 100;
  const role = roles[sel];

  const onKey = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      setSel((s) => (s + 1) % roles.length);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      setSel((s) => (s - 1 + roles.length) % roles.length);
    }
  };

  return (
    <section id="experience" className="section" aria-label="Experience">
      <div className="container">
        <SectionHead
          index="02"
          label="Experience"
          title="Five roles,"
          dim="several running in parallel."
          lead="Healthcare SaaS, AI market intelligence, CMS platforms and client work. Select a bar to see what I shipped there."
        />

        <div className="gantt" role="tablist" aria-label="Roles over time" onKeyDown={onKey}>
          <div className="gantt__axis" aria-hidden="true">
            {ticks.map((t) => (
              <span key={t} style={{ left: `${pct(t)}%` }}>
                {MONTHS[t % 12]} ’{String(Math.floor(t / 12)).slice(2)}
              </span>
            ))}
          </div>

          {roles.map((r, i) => (
            <button
              key={r.where + r.date}
              role="tab"
              aria-selected={sel === i}
              aria-controls="role-panel"
              tabIndex={sel === i ? 0 : -1}
              className={`gantt__row ${sel === i ? "is-active" : ""}`}
              onClick={() => setSel(i)}
              data-cursor="Select"
            >
              <span className="gantt__label">
                <strong>{r.where}</strong>
                <span>{r.jobtitle}</span>
              </span>
              <span className="gantt__track">
                <motion.span
                  className={`gantt__bar ${r.current ? "is-current" : ""}`}
                  style={{ left: `${pct(r.start)}%`, width: `${pct(r.end) - pct(r.start)}%` }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.9, ease, delay: 0.15 + i * 0.08 }}
                />
              </span>
            </button>
          ))}

          <div className="gantt__overlay" aria-hidden="true">
            <div className="gantt__now" style={{ left: `${pct(nowIndex + 0.5)}%` }}>
              <span>Now</span>
            </div>
          </div>
        </div>

        <div className="role" id="role-panel" role="tabpanel" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={sel}
              className="role__inner"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease }}
            >
              <div className="role__head">
                <span className="role__date">
                  {role.current && <span className="status__dot" aria-hidden="true" />}
                  {role.date}
                </span>
                <h3 className="role__title">{role.jobtitle}</h3>
                <p className="role__org">{role.where}</p>
                {role.certificate && (
                  <a className="text-link" href={role.certificate} target="_blank" rel="noopener noreferrer" data-cursor="Open">
                    View certificate <FiArrowUpRight aria-hidden="true" />
                  </a>
                )}
              </div>
              <div className="role__body">
                <ul className="role__points">
                  {role.points.map((pt, i) => (
                    <motion.li
                      key={pt}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, ease, delay: 0.08 + i * 0.06 }}
                    >
                      {pt}
                    </motion.li>
                  ))}
                </ul>
                <div className="chips">
                  {role.tags.map((t) => <span key={t} className="chip">{t}</span>)}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
