import React, { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { FiArrowUpRight, FiGithub, FiFileText } from "react-icons/fi";
import { projects, caseStudies } from "../content_option";
import SectionHead from "./SectionHead";
import { posters } from "./Posters";
import useMedia from "../layout/useMedia";

function Links({ links }) {
  return (
    <div className="proj__links">
      {links.live && (
        <a className="btn btn--primary" href={links.live} target="_blank" rel="noopener noreferrer" data-cursor="Live">
          Live demo <FiArrowUpRight aria-hidden="true" />
        </a>
      )}
      {links.github && (
        <a className="btn btn--ghost" href={links.github} target="_blank" rel="noopener noreferrer" data-cursor="Code">
          <FiGithub aria-hidden="true" /> Source
        </a>
      )}
    </div>
  );
}

function StackCard({ project, index, total, progress, stacked }) {
  const Poster = posters[project.name];
  // Earlier cards settle back and dim as later ones slide over them.
  const depth = stacked ? total - 1 - index : 0;
  const scale = useTransform(progress, [index / total, 1], [1, 1 - depth * 0.05]);
  const dim = useTransform(progress, [index / total, 1], [0, depth * 0.2]);

  return (
    <div className="stack__item" style={stacked ? { top: `calc(96px + ${index * 22}px)` } : undefined}>
      <motion.article className="proj" style={{ scale }}>
        <div className="proj__copy">
          <div className="proj__head">
            <span className="proj__index">{String(index + 1).padStart(2, "0")}</span>
            <span className="proj__date">{project.date}</span>
          </div>
          <h3 className="proj__name">{project.name}</h3>
          <p className="proj__tag">{project.tagline}</p>
          <p className="proj__desc">{project.description}</p>
          <div className="chips">
            {project.tech.map((t) => <span key={t} className="chip">{t}</span>)}
          </div>
          <Links links={project.links} />
        </div>
        <div className="proj__visual">{Poster && <Poster />}</div>
        <motion.div className="proj__dim" style={{ opacity: dim }} aria-hidden="true" />
      </motion.article>
    </div>
  );
}

function CaseIndex() {
  const [hovered, setHovered] = useState(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28 });
  const sy = useSpring(y, { stiffness: 260, damping: 28 });

  return (
    <div
      className="cases"
      onPointerMove={(e) => {
        x.set(e.clientX + 24);
        y.set(e.clientY - 70);
      }}
      onPointerLeave={() => setHovered(null)}
    >
      <div className="cases__head">
        <h3>Product case studies</h3>
        <p>Scoping, strategy and roadmaps — the thinking before the code.</p>
      </div>
      <ul className="cases__list">
        {caseStudies.map((c, i) => (
          <motion.li
            key={c.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <a
              className="cases__row"
              href={c.links.study || c.links.live}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Read"
              onPointerEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
            >
              <span className="cases__num">{String(i + 1).padStart(2, "0")}</span>
              <span className="cases__name">{c.name}</span>
              <span className="cases__tag">{c.tagline}</span>
              <span className="cases__date">{c.date}</span>
              <FiArrowUpRight className="cases__arrow" aria-hidden="true" />
              <span className="cases__desc">{c.description}</span>
            </a>
            {c.links.live && c.links.study && (
              <a className="cases__live" href={c.links.live} target="_blank" rel="noopener noreferrer" data-cursor="Live">
                <FiFileText aria-hidden="true" /> Live product <FiArrowUpRight aria-hidden="true" />
              </a>
            )}
          </motion.li>
        ))}
      </ul>

      <AnimatePresence>
        {hovered !== null && (
          <motion.div
            className="cases__preview"
            style={{ left: sx, top: sy }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={hovered}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <span className="cases__preview-date">{caseStudies[hovered].date}</span>
                <strong>{caseStudies[hovered].name}</strong>
                <p>{caseStudies[hovered].description}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Work() {
  const stackRef = useRef(null);
  const stacked = useMedia("(min-width: 900px)");
  const { scrollYProgress: p } = useScroll({ target: stackRef, offset: ["start start", "end end"] });

  return (
    <section id="work" className="section" aria-label="Work">
      <div className="container">
        <SectionHead
          index="03"
          label="Work"
          title="Selected projects,"
          dim="built end to end."
          lead="Distributed systems, an AI agent for the desktop, and encrypted messaging from the socket up."
        />

        <div ref={stackRef} className="stack">
          {projects.map((proj, i) => (
            <StackCard key={proj.name} project={proj} index={i} total={projects.length} progress={p} stacked={stacked} />
          ))}
        </div>

        <CaseIndex />
      </div>
    </section>
  );
}
