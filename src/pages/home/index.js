import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Typewriter from "typewriter-effect";
import { introdata, meta, services } from "../../content_option";
import { Link } from "react-router-dom";
import useScrollReveal from "../../hooks/useScrollReveal";

export const Home = () => {
  const revealRef = useScrollReveal();

  return (
    <HelmetProvider>
      <div ref={revealRef}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title} | Home</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        {/* Hero Section */}
        <section className="home-hero">
          <div className="home-hero__content">
            <div className="home-hero__greeting reveal reveal-delay-1">
              Hello, I'm
            </div>
            <h1 className="home-hero__title reveal reveal-delay-2">
              {introdata.title
                .replace("I'm ", "")
                .split(" ")
                .map((word, i) => (
                  <React.Fragment key={i}>
                    {i === 0 ? <span>{word}</span> : ` ${word}`}
                  </React.Fragment>
                ))}
            </h1>
            <div className="home-hero__typewriter reveal reveal-delay-3">
              <Typewriter
                options={{
                  strings: [
                    introdata.animated.first,
                    introdata.animated.second,
                    introdata.animated.third,
                  ],
                  autoStart: true,
                  loop: true,
                  deleteSpeed: 10,
                }}
              />
            </div>
            <p className="home-hero__desc reveal reveal-delay-4">
              {introdata.description}
            </p>
            <div className="home-hero__actions reveal reveal-delay-5">
              <Link to="/portfolio" className="btn-primary-custom">
                View Portfolio
              </Link>
              <Link to="/contact" className="btn-outline-custom">
                Get In Touch
              </Link>
            </div>
          </div>

          <div className="scroll-indicator">
            <div className="scroll-indicator__mouse" />
            <span className="scroll-indicator__text">Scroll</span>
          </div>
        </section>

        {/* Services — clean grid, four technical domains */}
        <section className="section home-services">
          <div className="home-services__inner">
            <span className="section-label reveal">What I Build</span>
            <h2 className="section-title reveal">Systems, not pages.</h2>
            <p className="section-desc reveal">
              I work on the layer beneath the interface — backend infrastructure,
              AI integrations, and the tooling engineers actually use.
            </p>

            <div className="home-services__grid">
              {services.map((service, i) => (
                <div
                  key={i}
                  className={`svc-card reveal reveal-delay-${i + 1}`}
                >
                  <div className="svc-card__head">
                    <span className="svc-card__index">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="svc-card__marker" aria-hidden="true" />
                  </div>
                  <h3 className="svc-card__title">{service.title}</h3>
                  <p className="svc-card__desc">{service.description}</p>
                  {service.tech && (
                    <ul className="svc-card__tech">
                      {service.tech.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </HelmetProvider>
  );
};
