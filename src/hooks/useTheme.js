import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "theme";
const META_COLORS = { dark: "#131211", light: "#f4f1ea" };

const readStored = () => {
  try {
    const t = localStorage.getItem(STORAGE_KEY);
    return t === "light" || t === "dark" ? t : null;
  } catch (e) {
    return null;
  }
};

const systemTheme = () =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", META_COLORS[theme]);
};

const ThemeContext = createContext(null);

/**
 * Theme state backed by <html data-theme>. The inline script in
 * public/index.html sets the initial value before paint; this provider keeps
 * it in sync, follows the OS until the user picks explicitly, and animates
 * the switch with a circular View Transition where supported.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || readStored() || systemTheme()
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      if (!readStored()) setTheme(mq.matches ? "light" : "dark");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(
    (event) => {
      const next = theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        /* storage unavailable — theme still switches for this visit */
      }

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!document.startViewTransition || reduced) {
        setTheme(next);
        return;
      }

      // Keyboard-triggered clicks report 0,0 — fall back to the top-right corner.
      const hasPoint = event && (event.clientX || event.clientY);
      const x = hasPoint ? event.clientX : window.innerWidth - 40;
      const y = hasPoint ? event.clientY : 40;
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

      const transition = document.startViewTransition(() => {
        applyTheme(next);
        setTheme(next);
      });
      transition.ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: 550, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" }
        );
      });
    },
    [theme]
  );

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export default function useTheme() {
  return useContext(ThemeContext);
}
