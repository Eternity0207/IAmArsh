import React, { createContext, useContext, useEffect, useState } from "react";
import { sections } from "../content_option";

const ActiveContext = createContext(sections[0].id);

/** Tracks which section currently owns the middle band of the viewport. */
export function ActiveSectionProvider({ children }) {
  const [active, setActive] = useState(sections[0].id);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return <ActiveContext.Provider value={active}>{children}</ActiveContext.Provider>;
}

export const useActiveSection = () => useContext(ActiveContext);
