import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { meta } from "../../content_option";
import HeroSection from "./components/HeroSection";
import ProjectReveal from "./components/ProjectReveal";
import FooterCTA from "./components/FooterCTA";
import "./style.css";

export const Portfolio = () => {
  return (
    <HelmetProvider>
      <div className="sp-root">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title} | Selected Work</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        <HeroSection />
        <ProjectReveal />
        <FooterCTA />
      </div>
    </HelmetProvider>
  );
};
