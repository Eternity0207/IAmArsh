import React from "react";
import { sections } from "../content_option";
import { useActiveSection } from "./ActiveSection";
import { useSmoothScroll } from "./SmoothScroll";

/** Slim tick marks on the right edge — the active one stretches; hover shows labels. */
export default function SectionRail() {
  const active = useActiveSection();
  const { scrollTo } = useSmoothScroll();

  return (
    <nav className="rail" aria-label="Section progress">
      {sections.map((s, i) => (
        <button
          key={s.id}
          className={`rail__tick ${active === s.id ? "is-active" : ""}`}
          onClick={() => scrollTo(s.id)}
          aria-label={`Go to ${s.label}`}
          aria-current={active === s.id ? "true" : undefined}
        >
          <span className="rail__label">
            <em>{String(i).padStart(2, "0")}</em> {s.label}
          </span>
          <span className="rail__bar" aria-hidden="true" />
        </button>
      ))}
    </nav>
  );
}
