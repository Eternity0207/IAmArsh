import React from "react";
import { motion } from "framer-motion";

/**
 * Dark matte card with thin gold border.
 * Hover = gentle scale + soft glow.
 */
export default function ProjectCard({ project, index }) {
  return (
    <motion.article
      className="sp-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.12,
      }}
      whileHover={{ scale: 1.04 }}
    >
      <a
        href={project.link}
        className="sp-card__link"
        target={project.link?.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        aria-label={`Open ${project.name}`}
      >
        <div className="sp-card__index">{String(index + 1).padStart(2, "0")}</div>

        <div className="sp-card__node" aria-hidden="true">
          <span className="sp-card__node-dot" />
          <span className="sp-card__node-ring" />
        </div>

        <h3 className="sp-card__name">{project.name}</h3>
        <p className="sp-card__tag">{project.tagline}</p>
        <p className="sp-card__desc">{project.description}</p>

        <div className="sp-card__meta">
          <span>{project.role}</span>
          <span className="sp-card__arrow" aria-hidden="true">
            →
          </span>
        </div>

        <div className="sp-card__glow" aria-hidden="true" />
      </a>
    </motion.article>
  );
}
