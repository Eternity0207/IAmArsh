import React, { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { FiSun, FiMoon, FiMenu, FiX, FiArrowRight, FiCommand } from "react-icons/fi";
import { logotext } from "../content_option";
import useTheme from "../hooks/useTheme";
import { openPalette } from "../components/CommandPalette";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/portfolio", label: "Work" },
  { path: "/contact", label: "Contact" },
];

const Headermain = () => {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { pathname } = useLocation();
  const { scrollY } = useScroll();

  // Tuck the nav away while scrolling down; bring it back on any scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() || 0;
    setHidden(y > prev && y > 160 && !open);
  });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (path) => (path === "/" ? pathname === "/" : pathname.startsWith(path));

  return (
    <motion.header
      className="nav"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: hidden ? -96 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="nav__bar">
        <Link to="/" className="nav__logo" aria-label="Home">
          {logotext}<span>.</span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {navLinks.map((l) => (
            <NavLink key={l.path} to={l.path} end={l.path === "/"} className={`nav__link ${isActive(l.path) ? "active" : ""}`}>
              {isActive(l.path) && (
                <motion.span layoutId="nav-pill" className="nav__pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
              )}
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__actions">
          <button className="nav__cmdk" onClick={openPalette} aria-label="Open command menu" title="Command menu (Ctrl/⌘ K)">
            <FiCommand aria-hidden="true" />
            <span>K</span>
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
                transition={{ duration: 0.25 }}
                style={{ display: "grid" }}
              >
                {theme === "dark" ? <FiSun /> : <FiMoon />}
              </motion.span>
            </AnimatePresence>
          </button>
          <button
            className="icon-btn nav__menu-btn"
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
            className="nav__sheet"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map((l) => (
              <NavLink key={l.path} to={l.path} end={l.path === "/"} className={isActive(l.path) ? "active" : ""}>
                {l.label}
                <FiArrowRight aria-hidden="true" />
              </NavLink>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Headermain;
