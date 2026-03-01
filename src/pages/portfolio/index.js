import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { dataportfolio, meta } from "../../content_option";
import useScrollReveal from "../../hooks/useScrollReveal";

export const Portfolio = () => {
  const revealRef = useScrollReveal();

  return (
    <HelmetProvider>
      <div ref={revealRef}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title} | Portfolio</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        {/* Header */}
        <section className="section portfolio-header">
          <span className="portfolio-header__label reveal">My Work</span>
          <h1 className="portfolio-header__title reveal reveal-delay-1">
            Recent <span>Projects</span>
          </h1>
          <p className="portfolio-header__desc reveal reveal-delay-2">
            A selection of projects I've worked on, showcasing my skills in web
            development and design.
          </p>
        </section>

        {/* Portfolio Grid */}
        <section className="section">
          <div className="portfolio-grid">
            {dataportfolio.map((project, i) => (
              <div
                key={i}
                className={`portfolio-card reveal-scale reveal-delay-${(i % 3) + 1}`}
              >
                <div className="portfolio-card__image">
                  <img src={project.img} alt={project.description} />
                  <div className="portfolio-card__overlay">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Project
                    </a>
                  </div>
                </div>
                <div className="portfolio-card__info">
                  <h3 className="portfolio-card__title">
                    {project.description}
                  </h3>
                  <p className="portfolio-card__desc">Web Development</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </HelmetProvider>
  );
};
