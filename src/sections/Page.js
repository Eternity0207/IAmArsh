import React, { useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { introdata, meta } from "../content_option";
import { useSmoothScroll } from "../layout/SmoothScroll";
import Hero from "./Hero";
import About from "./About";
import Experience from "./Experience";
import Work from "./Work";
import Skills from "./Skills";
import Highlights from "./Highlights";
import Contact from "./Contact";
import "./sections.css";

/** The whole portfolio on one page. `section` deep-links to a section id. */
export default function Page({ section }) {
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    if (!section) return undefined;
    const t = setTimeout(() => scrollTo(section, { immediate: true }), 120);
    return () => clearTimeout(t);
  }, [section, scrollTo]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{meta.title} — {introdata.role}</title>
        <meta name="description" content={meta.description} />
      </Helmet>
      <Hero />
      <About />
      <Experience />
      <Work />
      <Skills />
      <Highlights />
      <Contact />
    </HelmetProvider>
  );
}
