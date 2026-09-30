import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { FiArrowUpRight, FiGithub, FiGitPullRequest, FiFileText } from "react-icons/fi";
import { meta, projects, caseStudies, openSource } from "../../content_option";
import { motion } from "framer-motion";
import { Card, Reveal, SectionHead } from "../../components/ui";
import { SplitText, Tilt } from "../../components/motion";

const LinkRow = ({ links }) => (
  <div className="work-links">
    {links.live && (
      <a className="text-link" href={links.live} target="_blank" rel="noopener noreferrer">
        Live <FiArrowUpRight aria-hidden="true" />
      </a>
    )}
    {links.github && (
      <a className="text-link" href={links.github} target="_blank" rel="noopener noreferrer">
        <FiGithub aria-hidden="true" /> Code
      </a>
    )}
    {links.study && (
      <a className="text-link" href={links.study} target="_blank" rel="noopener noreferrer">
        <FiFileText aria-hidden="true" /> Case study
      </a>
    )}
  </div>
);

export const Portfolio = () => (
  <HelmetProvider>
    <Helmet>
      <title>Work — {meta.title}</title>
      <meta name="description" content={meta.description} />
    </Helmet>

    <div className="page container">
      <section className="page-hero">
        <Reveal as="span" className="eyebrow">Selected work</Reveal>
        <h1>
          <SplitText text="Things I've" />{" "}
          <motion.span
            className="serif gradient-text"
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{ display: "inline-block" }}
          >
            built
          </motion.span>{" "}
          <SplitText text="& shaped." delay={0.25} />
        </h1>
        <Reveal as="p" delay={0.35}>
          Engineering projects across distributed systems, AI agents and security — plus product case studies where I owned the problem, not just the code.
        </Reveal>
      </section>

      <section className="section">
        <SectionHead index="01" eyebrow="Engineering" title="Projects" />
        <div className="projects">
          {projects.map((p, i) => (
            <Tilt key={p.name} className={p.featured ? "project--featured" : ""} max={p.featured ? 3 : 6}>
              <Card className="project" delay={i * 0.06}>
                <div className="project__head">
                  <span className="project__index">{String(i + 1).padStart(2, "0")}</span>
                  <span className="project__date">{p.date}</span>
                </div>
                <h3>{p.name}</h3>
                <p className="project__tag">{p.tagline}</p>
                <p className="muted project__desc">{p.description}</p>
                <div className="chips">
                  {p.tech.map((t) => <span key={t} className="chip">{t}</span>)}
                </div>
                <LinkRow links={p.links} />
              </Card>
            </Tilt>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHead index="02" eyebrow="Product" title="Case studies">
          Scoping, strategy and roadmaps — the thinking before the code.
        </SectionHead>
        <div className="studies">
          {caseStudies.map((c, i) => (
            <Card key={c.name} className="study" delay={i * 0.06}>
              <span className="project__date">{c.date}</span>
              <h3>{c.name}</h3>
              <p className="project__tag">{c.tagline}</p>
              <p className="muted project__desc">{c.description}</p>
              <LinkRow links={c.links} />
            </Card>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHead index="03" eyebrow="Open source" title="Upstream contributions" />
        <div className="oss">
          {openSource.map((o, i) => (
            <Card key={o.title} href={o.link} className="oss__item" delay={i * 0.04}>
              <FiGitPullRequest className="oss__icon" aria-hidden="true" />
              <div>
                <h4>{o.title}</h4>
                <p className="muted">{o.detail}</p>
              </div>
              <FiArrowUpRight className="oss__arrow" aria-hidden="true" />
            </Card>
          ))}
        </div>
      </section>
    </div>
  </HelmetProvider>
);
