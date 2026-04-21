import React from "react";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

const PROJECTS = [
  {
    name: "Whispr",
    tagline: "Local client–server–client architecture.",
    description:
      "A fully local messaging system where two clients communicate through a lightweight relay running on the same machine. Focused on the interaction flow itself — presence, session handoff, and message transport — without the weight of cloud infrastructure.",
    role: "Systems · Networking",
    link: "#",
  },
  {
    name: "Nexus",
    tagline: "Understand complex codebases & PRs.",
    description:
      "A graph-based tool for navigating large-scale systems. Parses repositories and pull requests into node-and-edge structures so you can see how files, modules and changes relate — built for reading code the way it actually lives.",
    role: "Developer Tools · Visualization",
    link: "#",
  },
  {
    name: "Reva",
    tagline: "An OS-level AI assistant.",
    description:
      "A Jarvis-style system that sits at the OS layer, controlling workflows and orchestrating system-level operations. Voice and intent in, composed actions out — files, apps, automations, all routed through a single reasoning layer.",
    role: "AI · OS Integration",
    link: "#",
  },
];

export default function ProjectReveal() {
  return (
    <section className="sp-reveal">
      <motion.div
        className="sp-reveal__heading"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="sp-reveal__eyebrow">The Nodes</span>
        <h2 className="sp-reveal__title">
          Three components of <br />
          the same system.
        </h2>
        <p className="sp-reveal__desc">
          Each project is a node — distinct in purpose, connected in philosophy.
          Tap one to open its case study.
        </p>
      </motion.div>

      {/* Subtle connective line behind the cards */}
      <div className="sp-reveal__line" aria-hidden="true" />

      <div className="sp-reveal__grid">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.name} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
