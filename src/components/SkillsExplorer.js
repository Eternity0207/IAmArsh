import React, { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { FiArrowUpRight, FiCornerDownRight } from "react-icons/fi";
import { skills, projects, worktimeline, openSource, caseStudies } from "../content_option";

const ease = [0.22, 1, 0.36, 1];

// Everything a skill could show up in, flattened to { kind, title, sub, tags, text, link }.
const sources = [
  ...projects.map((p) => ({
    kind: "Project",
    title: p.name,
    sub: p.tagline,
    tags: p.tech,
    text: `${p.tagline} ${p.description}`,
    link: p.links.live || p.links.github,
  })),
  ...worktimeline.map((w) => ({
    kind: "Experience",
    title: w.where,
    sub: w.jobtitle,
    tags: w.tags,
    text: w.points.join(" "),
    link: null,
  })),
  ...openSource.map((o) => ({ kind: "Open source", title: o.title, sub: o.detail, tags: [], text: o.detail, link: o.link })),
  ...caseStudies.map((c) => ({ kind: "Case study", title: c.name, sub: c.tagline, tags: [], text: c.description, link: c.links.study })),
];

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// "AWS (S3 · EC2 · Lambda)" -> ["AWS"], "C / C++" -> ["C", "C++"]
const keywordsFor = (skill) =>
  skill
    .replace(/\(.*?\)/g, "")
    .split(/\s[/·&]\s/)
    .map((k) => k.trim())
    .filter(Boolean);

const usageFor = (skill) => {
  const kws = keywordsFor(skill);
  return sources.filter((src) =>
    kws.some((kw) => {
      if (src.tags.some((t) => t.toLowerCase() === kw.toLowerCase())) return true;
      if (kw.length < 3) return false;
      return new RegExp(`(^|[^\\w])${escape(kw)}($|[^\\w+])`, "i").test(src.text);
    })
  );
};

export default function SkillsExplorer() {
  const [tab, setTab] = useState("All");
  const [active, setActive] = useState(null);

  const tabs = useMemo(() => ["All", ...skills.map((s) => s.group)], []);
  const visible = useMemo(
    () =>
      tab === "All"
        ? skills.flatMap((s) => s.items)
        : skills.find((s) => s.group === tab).items,
    [tab]
  );
  const usage = useMemo(() => (active ? usageFor(active) : []), [active]);
  const total = skills.reduce((n, s) => n + s.items.length, 0);

  return (
    <div className="skx">
      <LayoutGroup id="skx-tabs">
        <div className="skx__tabs" role="tablist" aria-label="Skill categories">
          {tabs.map((t) => {
            const count = t === "All" ? total : skills.find((s) => s.group === t).items.length;
            const selected = tab === t;
            return (
              <button
                key={t}
                role="tab"
                aria-selected={selected}
                className={`skx__tab ${selected ? "is-active" : ""}`}
                onClick={() => {
                  setTab(t);
                  setActive(null);
                }}
              >
                {selected && (
                  <motion.span layoutId="skx-pill" className="skx__tab-pill" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
                )}
                {t}
                <span className="skx__count">{count}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <motion.div layout className="skx__chips" role="tabpanel">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((s, i) => (
            <motion.button
              layout
              key={s}
              className={`skx__chip ${active === s ? "is-active" : ""}`}
              aria-pressed={active === s}
              onClick={() => setActive(active === s ? null : s)}
              initial={{ opacity: 0, scale: 0.85, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.85, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease, delay: Math.min(i * 0.015, 0.3) }}
              whileTap={{ scale: 0.95 }}
            >
              {s}
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="skx__panel" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {!active ? (
            <motion.p
              key="hint"
              className="skx__hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiCornerDownRight aria-hidden="true" /> Pick any skill to see where I've actually used it.
            </motion.p>
          ) : (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease }}
            >
              <p className="skx__panel-title">
                <strong>{active}</strong>
                {usage.length ? ` — shows up in ${usage.length} place${usage.length > 1 ? "s" : ""}` : " — part of my everyday toolkit"}
              </p>
              {usage.length > 0 && (
                <ul className="skx__usage">
                  {usage.map((u, i) => {
                    const Inner = (
                      <>
                        <span className="skx__kind">{u.kind}</span>
                        <span className="skx__usage-title">{u.title}</span>
                        <span className="skx__usage-sub">{u.sub}</span>
                        {u.link && <FiArrowUpRight className="skx__usage-arrow" aria-hidden="true" />}
                      </>
                    );
                    return (
                      <motion.li
                        key={u.kind + u.title + u.sub}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, ease, delay: i * 0.04 }}
                      >
                        {u.link ? (
                          <a href={u.link} target="_blank" rel="noopener noreferrer">{Inner}</a>
                        ) : (
                          <div>{Inner}</div>
                        )}
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
