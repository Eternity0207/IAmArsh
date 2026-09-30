import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { FiSun, FiMoon, FiCommand, FiMenu, FiX, FiArrowRight } from "react-icons/fi";
import { introdata, sections } from "../content_option";
import useTheme from "../hooks/useTheme";
import { openPalette } from "../components/CommandPalette";
import { useSmoothScroll } from "./SmoothScroll";
import { useActiveSection } from "./ActiveSection";
import LocalTime from "./LocalTime";

const links = sections.filter((s) => s.id !== "top");

export default function Nav() {
  const { theme, toggle } = useTheme();
  const { scrollTo } = useSmoothScroll();
  const active = useActiveSection();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 24;
    if (next !== scrolled) setScrolled(next);
  });

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id) => {
    setOpen(false);
    scrollTo(id);
  };

  return (
    <header className={`nav ${scrolled || open ? "is-scrolled" : ""}`}>
      <div className="nav__inner container">
        <button className="nav__brand" onClick={() => go("top")} aria-label="Back to top">
          <span className="nav__mark" aria-hidden="true">AG</span>
          <span className="nav__name">{introdata.name}</span>
        </button>

        <nav className="nav__links" aria-label="Sections">
          {links.map((l) => (
            <button
              key={l.id}
              className={`nav__link ${active === l.id ? "is-active" : ""}`}
              onClick={() => go(l.id)}
              aria-current={active === l.id ? "true" : undefined}
            >
              {active === l.id && (
                <motion.span layoutId="nav-pill" className="nav__pill" transition={{ type: "spring", stiffness: 420, damping: 36 }} />
              )}
              {l.label}
            </button>
          ))}
        </nav>

        <div className="nav__actions">
          <span className="nav__time" title="Local time in Jodhpur">
            <span className="nav__time-dot" aria-hidden="true" /> IST <LocalTime />
          </span>
          <button className="icon-btn nav__cmdk" onClick={openPalette} aria-label="Open command menu" title="Command menu (Ctrl/⌘ K)">
            <FiCommand aria-hidden="true" />
          </button>
          <button
            className="icon-btn"
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.22 }}
                style={{ display: "grid" }}
              >
                {theme === "dark" ? <FiSun /> : <FiMoon />}
              </motion.span>
            </AnimatePresence>
          </button>
          <button
            className="icon-btn nav__menu"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="nav-sheet"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="nav-sheet"
            className="nav__sheet container"
            aria-label="Sections"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {links.map((l, i) => (
              <motion.button
                key={l.id}
                className={active === l.id ? "is-active" : ""}
                onClick={() => go(l.id)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <span className="nav__sheet-num">{String(i + 1).padStart(2, "0")}</span>
                {l.label}
                <FiArrowRight aria-hidden="true" />
              </motion.button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
