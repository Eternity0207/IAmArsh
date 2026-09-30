import React, { useRef } from "react";
import { motion } from "framer-motion";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { FiArrowUpRight, FiAward } from "react-icons/fi";
import { dataabout, meta, worktimeline, skills, achievements, introdata } from "../../content_option";
import { Card, Reveal, SectionHead, ExtLink } from "../../components/ui";
import { SplitText, ScrollLine, Magnetic } from "../../components/motion";
import SkillsExplorer from "../../components/SkillsExplorer";

export const About = () => {
  const { education } = dataabout;
  const timelineRef = useRef(null);
  const [lead, rest] = dataabout.title.split(",");

  return (
    <HelmetProvider>
      <Helmet>
        <title>About — {meta.title}</title>
        <meta name="description" content={meta.description} />
      </Helmet>

      <div className="page container">
        <section className="page-hero">
          <Reveal as="span" className="eyebrow">About</Reveal>
          <h1>
            <SplitText text={`${lead},`} />
            <br />
            <motion.span
              className="serif gradient-text"
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              style={{ display: "inline-block" }}
            >
              {rest.trim()}
            </motion.span>
          </h1>
        </section>

        <section className="about-intro">
          <Reveal className="about-intro__text">
            {dataabout.aboutme.map((p, i) => <p key={i}>{p}</p>)}
            <div className="hero__actions">
              <Magnetic>
                <a href={introdata.resume} className="btn btn--primary" target="_blank" rel="noopener noreferrer">
                  Download résumé <FiArrowUpRight className="arrow" aria-hidden="true" />
                </a>
              </Magnetic>
            </div>
          </Reveal>

          <Card className="edu" delay={0.1}>
            <span className="eyebrow">Education</span>
            <h3>{education.school}</h3>
            <p className="muted">{education.degree}</p>
            <div className="edu__meta">
              <span className="chip">{education.date}</span>
              <span className="chip">{education.grade}</span>
            </div>
          </Card>
        </section>

        <section className="section split">
          <div className="split__head">
            <SectionHead index="01" eyebrow="Experience" title="Where I've worked">
              Five roles across healthcare SaaS, AI market intelligence, CMS platforms and client work.
            </SectionHead>
          </div>
          <ol className="timeline" ref={timelineRef}>
            <ScrollLine targetRef={timelineRef} />
            {worktimeline.map((item, i) => {
              const isCurrent = /present/i.test(item.date);
              return (
                <Reveal as="li" key={item.where + item.date} className="timeline__item" delay={i * 0.04}>
                  <span className={`timeline__dot ${isCurrent ? "is-current" : ""}`} aria-hidden="true" />
                  <div className="timeline__date">{item.date}</div>
                  <div className="timeline__body">
                    <h3>{item.jobtitle}</h3>
                    <p className="timeline__org">{item.where}</p>
                    <ul className="timeline__points">
                      {item.points.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                    <div className="timeline__foot">
                      <div className="chips">
                        {item.tags.map((t) => <span key={t} className="chip">{t}</span>)}
                      </div>
                      {item.certificate && <ExtLink href={item.certificate}>Certificate</ExtLink>}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </section>

        <section className="section">
          <SectionHead index="02" eyebrow="Skills" title="What I work with">
            All {skills.reduce((n, s) => n + s.items.length, 0)} of them, grouped by area. Pick one to see where it shows up in my work.
          </SectionHead>
          <Card className="toolbox">
            <SkillsExplorer />
          </Card>
        </section>

        <section className="section">
          <SectionHead index="03" eyebrow="Highlights" title="Achievements" />
          <div className="achievements">
            {achievements.map((a, i) => (
              <Card key={a.title} href={a.link} className="achievement" delay={i * 0.05}>
                <FiAward className="achievement__icon" aria-hidden="true" />
                <h4>{a.title}</h4>
                <p className="muted">{a.detail}</p>
                {a.date && <span className="chip">{a.date}</span>}
              </Card>
            ))}
          </div>
        </section>
      </div>
    </HelmetProvider>
  );
};
