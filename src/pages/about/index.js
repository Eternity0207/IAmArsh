import React, { useEffect, useRef } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  dataabout,
  meta,
  worktimeline,
  skills,
} from "../../content_option";
import useScrollReveal from "../../hooks/useScrollReveal";

export const About = () => {
  const revealRef = useScrollReveal();
  const skillsRef = useRef(null);
  const pageRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll(".skill-bar__fill");
            bars.forEach((bar) => {
              bar.style.width = bar.dataset.width;
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (skillsRef.current) {
      observer.observe(skillsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Skeleton-system: briefly show a "system initializing" state on mount,
  // then fade to the stable layout. CSS does the heavy lifting via the
  // `is-building` class — JS just toggles it once.
  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    // Respect reduced-motion users: skip the intro animation entirely.
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    el.classList.add("is-building");
    const t = setTimeout(() => el.classList.remove("is-building"), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <HelmetProvider>
      <div ref={(node) => { revealRef.current = node; pageRef.current = node; }} className="about-page">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title} | About</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        {/* Header */}
        <section className="section about-header">
          <span className="about-header__label reveal">About Me</span>
          <h1 className="about-header__title reveal reveal-delay-1">
            Who <span>Am</span> I?
          </h1>
        </section>

        {/* About Introduction */}
        <section className="section">
          <div className="about-intro">
            {/* Skeleton frame — draws corner/edge lines on mount */}
            <span className="about-intro__frame" aria-hidden="true" />
            <div className="about-intro__text reveal-left">
              <h3>{dataabout.title}</h3>
              <p>{dataabout.aboutme}</p>
            </div>

            <div className="about-intro__info reveal-right">
              <div className="about-info-item">
                <div className="about-info-item__label">Name</div>
                <div className="about-info-item__value">Arsh Goyal</div>
              </div>
              <div className="about-info-item">
                <div className="about-info-item__label">Education</div>
                <div className="about-info-item__value">IIT Jodhpur</div>
              </div>
              <div className="about-info-item">
                <div className="about-info-item__label">Email</div>
                <div className="about-info-item__value">iamarsh0207@gmail.com</div>
              </div>
              <div className="about-info-item">
                <div className="about-info-item__label">Location</div>
                <div className="about-info-item__value">India</div>
              </div>
            </div>
          </div>
        </section>

        {/* Work Timeline */}
        <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <span className="section-label reveal">Experience</span>
          <h2 className="section-title reveal">Work Timeline</h2>

          <div className="timeline" style={{ marginTop: '40px' }}>
            {worktimeline.map((item, i) => {
              const isCurrent = /present/i.test(item.date);
              return (
                <div
                  key={i}
                  className={`timeline-item reveal reveal-delay-${i + 1} ${
                    isCurrent ? "timeline-item--current" : ""
                  }`}
                >
                  <div className="timeline-item__date">
                    {item.date}
                    {isCurrent && <span className="timeline-item__pulse" aria-hidden="true" />}
                  </div>
                  <h4 className="timeline-item__title">{item.jobtitle}</h4>
                  <p className="timeline-item__subtitle">{item.where}</p>
                  {item.description && (
                    <p className="timeline-item__desc">{item.description}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Skills */}
        <section className="section" ref={skillsRef}>
          <span className="section-label reveal">Expertise</span>
          <h2 className="section-title reveal">My Skills</h2>

          <div className="skills-grid" style={{ marginTop: '40px' }}>
            {skills.map((skill, i) => (
              <div key={i} className={`skill-item reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="skill-item__header">
                  <span className="skill-item__name">{skill.name}</span>
                  <span className="skill-item__value">{skill.value}%</span>
                </div>
                <div className="skill-bar">
                  <div
                    className="skill-bar__fill"
                    data-width={`${skill.value}%`}
                    style={{ width: 0 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </HelmetProvider>
  );
};
