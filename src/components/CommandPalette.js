import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiSearch, FiHome, FiUser, FiBriefcase, FiMail, FiSun, FiMoon, FiCopy,
  FiFileText, FiGithub, FiLinkedin, FiCode, FiBox,
} from "react-icons/fi";
import useTheme from "../hooks/useTheme";
import { contactConfig, introdata, projects, socialprofils } from "../content_option";

export const OPEN_PALETTE_EVENT = "open-command-palette";
export const openPalette = () => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));

const open = (url) => window.open(url, "_blank", "noopener,noreferrer");
// Accent-insensitive, so "resume" finds "résumé".
const fold = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function CommandPalette() {
  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState("");
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const lastFocus = useRef(null);
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  const actions = useMemo(
    () => [
      { group: "Navigate", label: "Home", icon: <FiHome />, run: () => navigate("/") },
      { group: "Navigate", label: "About & experience", icon: <FiUser />, run: () => navigate("/about") },
      { group: "Navigate", label: "Work & projects", icon: <FiBriefcase />, run: () => navigate("/portfolio") },
      { group: "Navigate", label: "Contact", icon: <FiMail />, run: () => navigate("/contact") },
      {
        group: "Actions",
        label: `Switch to ${theme === "dark" ? "light" : "dark"} mode`,
        icon: theme === "dark" ? <FiSun /> : <FiMoon />,
        keywords: "theme dark light mode",
        run: () => toggle(),
      },
      {
        group: "Actions",
        label: "Copy email address",
        icon: <FiCopy />,
        keywords: "mail contact",
        run: async () => {
          try {
            await navigator.clipboard.writeText(contactConfig.YOUR_EMAIL);
            setToast("Email copied to clipboard");
          } catch (e) {
            window.location.href = `mailto:${contactConfig.YOUR_EMAIL}`;
          }
        },
      },
      { group: "Actions", label: "Open résumé", icon: <FiFileText />, keywords: "cv resume pdf", run: () => open(introdata.resume) },
      ...projects.map((p) => ({
        group: "Projects",
        label: `${p.name} — ${p.tagline}`,
        icon: <FiBox />,
        keywords: p.tech.join(" "),
        run: () => open(p.links.live || p.links.github),
      })),
      { group: "Profiles", label: "GitHub", icon: <FiGithub />, run: () => open(socialprofils.github) },
      { group: "Profiles", label: "LinkedIn", icon: <FiLinkedin />, run: () => open(socialprofils.linkedin) },
      { group: "Profiles", label: "LeetCode", icon: <FiCode />, run: () => open(socialprofils.leetcode) },
    ],
    [navigate, theme, toggle]
  );

  const filtered = useMemo(() => {
    const q = fold(query.trim());
    if (!q) return actions;
    return actions.filter((a) => fold(`${a.group} ${a.label} ${a.keywords || ""}`).includes(q));
  }, [actions, query]);

  const close = () => setOpen(false);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      lastFocus.current = document.activeElement;
      setQuery("");
      setIndex(0);
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => inputRef.current && inputRef.current.focus());
    } else {
      document.body.style.overflow = "";
      if (lastFocus.current && lastFocus.current.focus) lastFocus.current.focus();
    }
  }, [isOpen]);

  useEffect(() => setIndex(0), [query]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const el = listRef.current && listRef.current.querySelector(`[data-index="${index}"]`);
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [index]);

  const runAt = (i) => {
    const a = filtered[i];
    if (!a) return;
    close();
    // Let the dialog start closing before navigating / toggling.
    setTimeout(() => a.run(), 60);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (i + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (i - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runAt(index);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      // The input is the only focus stop; keep focus inside the dialog.
      e.preventDefault();
    }
  };

  let lastGroup = null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="cmdk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onMouseDown={(e) => e.target === e.currentTarget && close()}
          >
            <motion.div
              className="cmdk__dialog"
              role="dialog"
              aria-modal="true"
              aria-label="Command menu"
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="cmdk__search">
                <FiSearch aria-hidden="true" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Search pages, projects, actions…"
                  aria-label="Search commands"
                  aria-controls="cmdk-list"
                  aria-activedescendant={filtered[index] ? `cmdk-item-${index}` : undefined}
                  role="combobox"
                  aria-expanded="true"
                  autoComplete="off"
                  spellCheck="false"
                />
                <kbd>esc</kbd>
              </div>

              <ul className="cmdk__list" id="cmdk-list" role="listbox" ref={listRef}>
                {filtered.length === 0 && <li className="cmdk__empty">No results for “{query}”. Try “projects” or “theme”.</li>}
                {filtered.map((a, i) => {
                  const header = a.group !== lastGroup ? a.group : null;
                  lastGroup = a.group;
                  return (
                    <React.Fragment key={a.group + a.label}>
                      {header && <li className="cmdk__group" role="presentation">{header}</li>}
                      <li
                        id={`cmdk-item-${i}`}
                        data-index={i}
                        role="option"
                        aria-selected={i === index}
                        className={`cmdk__item ${i === index ? "is-active" : ""}`}
                        onMouseMove={() => i !== index && setIndex(i)}
                        onClick={() => runAt(i)}
                      >
                        {i === index && (
                          <motion.span layoutId="cmdk-hl" className="cmdk__hl" transition={{ type: "spring", stiffness: 500, damping: 40 }} />
                        )}
                        <span className="cmdk__icon" aria-hidden="true">{a.icon}</span>
                        {a.label}
                      </li>
                    </React.Fragment>
                  );
                })}
              </ul>

              <div className="cmdk__foot" aria-hidden="true">
                <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
                <span><kbd>↵</kbd> open</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 16, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 16, x: "-50%" }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
