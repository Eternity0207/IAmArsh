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
              {introdata.title.replace("I'm ", "").split(" ").map((word, i) => (
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

        {/* Services Section */}
        <section className="section home-services">
          <span className="section-label reveal">What I Do</span>
          <h2 className="section-title reveal">My Services</h2>
          <p className="section-desc reveal">
            Crafting digital experiences with precision and creativity.
          </p>

          <div className="services-grid">
            {services.map((service, i) => (
              <div
                key={i}
                className={`service-card reveal reveal-delay-${i + 1}`}
              >
                <div className="service-card__number">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__desc">{service.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </HelmetProvider>
  );
};
