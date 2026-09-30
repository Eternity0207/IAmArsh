import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiArrowRight, FiMapPin, FiGitPullRequest } from "react-icons/fi";
import { introdata, meta, stats, projects, worktimeline, skills, openSource } from "../../content_option";
import { Card, Reveal, SectionHead } from "../../components/ui";
import { SplitText, RotatingWord, CountUp, Magnetic, Tilt } from "../../components/motion";
import SkillsExplorer from "../../components/SkillsExplorer";
import Terminal from "../../components/Terminal";

const ease = [0.22, 1, 0.36, 1];
const rise = (delay) => ({
  initial: { opacity: 0, y: 16, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease, delay },
});

function NodeGraph() {
  // Tiny decorative service graph for the Nexus card.
  const nodes = [
    [40, 60], [130, 30], [130, 95], [220, 60], [300, 25], [300, 100], [380, 62],
  ];
  const edges = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6]];
  return (
    <svg className="node-graph" viewBox="0 0 420 125" aria-hidden="true">
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease, delay: 0.2 + i * 0.08 }}
        />
      ))}
      {nodes.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x} cy={y} r={i === 3 ? 7 : 5}
          className={i === 3 ? "hub" : ""}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.1 + i * 0.07 }}
          style={{ animationDelay: `${i * 0.3}s`, transformOrigin: `${x}px ${y}px` }}
        />
      ))}
    </svg>
  );
}

function Marquee({ items, reverse }) {
  return (
    <div className={`marquee__row ${reverse ? "is-reverse" : ""}`}>
      <div className="marquee__track">
        {[...items, ...items].map((t, i) => (
          <span key={i} aria-hidden={i >= items.length}>{t}</span>
        ))}
      </div>
    </div>
  );
}

export const Home = () => {
  const current = worktimeline.filter((w) => /present/i.test(w.date) && !/freelance/i.test(w.jobtitle));
  const featured = projects.find((p) => p.featured) || projects[0];
  const allSkills = skills.flatMap((s) => s.items);
  const half = Math.ceil(allSkills.length / 2);

  const onHeroMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--hx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--hy", `${e.clientY - r.top}px`);
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>{meta.title} — {introdata.role}</title>
        <meta name="description" content={meta.description} />
      </Helmet>

      <section className="hero" onMouseMove={onHeroMove}>
        <div className="hero__spot" aria-hidden="true" />
        <div className="container hero__grid">
          <div className="hero__copy">
            <motion.div {...rise(0)}>
              <span className="status">
                <span className="status__dot" aria-hidden="true" />
                {introdata.status}
              </span>
            </motion.div>

            <h1 className="hero__title">
              <SplitText text={introdata.headline} delay={0.1} />
              <br />
              <motion.span className="hero__rotating" {...rise(0.3)}>
                <RotatingWord words={introdata.rotating} className="serif gradient-text" />
              </motion.span>
              <br />
              <SplitText text={introdata.headlineEnd} delay={0.4} />
            </h1>

            <motion.p className="hero__desc" {...rise(0.55)}>
              Hi, I'm <strong>{introdata.name}</strong>. {introdata.description}
            </motion.p>

            <motion.div className="hero__actions" {...rise(0.65)}>
              <Magnetic>
                <Link to="/portfolio" className="btn btn--primary">
                  See my work <FiArrowRight aria-hidden="true" />
                </Link>
              </Magnetic>
              <Magnetic>
                <a href={introdata.resume} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                  Résumé <FiArrowUpRight className="arrow" aria-hidden="true" />
                </a>
              </Magnetic>
            </motion.div>

            <motion.p className="hero__meta" {...rise(0.75)}>
              <FiMapPin aria-hidden="true" /> {introdata.location} · IIT Jodhpur '28
              <span className="hero__kbd">Press <kbd>Ctrl</kbd>/<kbd>⌘</kbd> <kbd>K</kbd> to jump anywhere</span>
            </motion.p>
          </div>

          <motion.div
            className="hero__side"
            initial={{ opacity: 0, y: 30, rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1, ease, delay: 0.45 }}
          >
            <Tilt max={5}>
              <Terminal startDelay={1100} />
            </Tilt>
            <motion.div
              className="hero__badge"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="hero__badge-num">{stats[3].value}</span>
              <span>{stats[3].label.toLowerCase()}</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="marquee" aria-label={`Technologies: ${allSkills.join(", ")}`}>
        <Marquee items={allSkills.slice(0, half)} />
        <Marquee items={allSkills.slice(half)} reverse />
      </div>

      <section className="section container">
        <SectionHead index="01" eyebrow="Snapshot" title={<>The short <span className="serif gradient-text">version.</span></>} />
        <div className="bento">
          <Card className="bento__stats">
            {stats.map((s) => (
              <div key={s.label} className="stat">
                <span className="stat__value"><CountUp value={s.value} /></span>
                <span className="stat__label">{s.label}</span>
              </div>
            ))}
          </Card>

          <div className="bento__featured">
            <Tilt>
              <Card href={featured.links.github} delay={0.05}>
                <div className="bento__row">
                  <span className="eyebrow">Featured project</span>
                  <FiArrowUpRight className="bento__arrow" aria-hidden="true" />
                </div>
                <NodeGraph />
                <h3>{featured.name}</h3>
                <p className="muted">{featured.tagline} — Kafka microservices + a RAG pipeline over Neo4j & ChromaDB that reviews any Git repo.</p>
                <div className="chips">
                  {featured.tech.map((t) => <span key={t} className="chip">{t}</span>)}
                </div>
              </Card>
            </Tilt>
          </div>

          <Card className="bento__now" delay={0.1}>
            <span className="eyebrow">Right now</span>
            <ul className="now-list">
              {current.map((w, i) => (
                <motion.li
                  key={w.where + w.jobtitle}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease, delay: 0.2 + i * 0.1 }}
                >
                  <span className="now-list__role">{w.jobtitle}</span>
                  <span className="now-list__org">{w.where}</span>
                </motion.li>
              ))}
            </ul>
            <Link to="/about" className="text-link">
              Full experience <FiArrowRight aria-hidden="true" />
            </Link>
          </Card>

          <Card className="bento__oss" href="https://github.com/Eternity0207" delay={0.15}>
            <div className="bento__row">
              <span className="eyebrow">Open source</span>
              <FiArrowUpRight className="bento__arrow" aria-hidden="true" />
            </div>
            <ul className="oss-mini">
              {openSource.slice(0, 3).map((o) => (
                <li key={o.title}>
                  <FiGitPullRequest aria-hidden="true" />
                  <span><strong>{o.title}</strong> — {o.detail}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <section className="section container">
        <SectionHead index="02" eyebrow="Toolbox" title={<>Every skill, <span className="serif gradient-text">connected</span> to real work.</>}>
          {allSkills.length} tools across {skills.length} areas. Tap one to see the projects and roles where I've used it.
        </SectionHead>
        <Card className="toolbox">
          <SkillsExplorer />
        </Card>
      </section>

      <section className="section container">
        <Reveal className="cta">
          <h2>
            Have something worth <span className="serif gradient-text">building?</span>
          </h2>
          <p className="muted">Internships, freelance projects, or just a good problem — I'm listening.</p>
          <div className="hero__actions">
            <Magnetic>
              <Link to="/contact" className="btn btn--primary">
                Get in touch <FiArrowRight aria-hidden="true" />
              </Link>
            </Magnetic>
            <Link to="/about" className="btn btn--ghost">More about me</Link>
          </div>
        </Reveal>
      </section>
    </HelmetProvider>
  );
};
