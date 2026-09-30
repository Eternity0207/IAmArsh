import React, { createContext, useCallback, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";

const ScrollContext = createContext({ scrollTo: () => {}, lenis: { current: null } });

/**
 * Buttery inertial scrolling (Lenis) for the whole page. Falls back to native
 * scrolling for reduced-motion users. Exposes `scrollTo(target, opts)` where
 * target is a chapter id, an element, or a pixel offset.
 */
export function SmoothScroll({ children }) {
  const lenis = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const instance = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
    lenis.current = instance;
    let raf = requestAnimationFrame(function loop(time) {
      instance.raf(time);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      instance.destroy();
      lenis.current = null;
    };
  }, []);

  const scrollTo = useCallback((target, opts = {}) => {
    const el = typeof target === "string" ? document.getElementById(target) : target;
    const y = typeof target === "number" ? target : el ? el.getBoundingClientRect().top + window.scrollY : 0;
    if (lenis.current) {
      lenis.current.scrollTo(y, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4), ...opts });
    } else {
      window.scrollTo({ top: y, behavior: opts.immediate ? "instant" : "smooth" });
    }
  }, []);

  return <ScrollContext.Provider value={{ scrollTo, lenis }}>{children}</ScrollContext.Provider>;
}

export const useSmoothScroll = () => useContext(ScrollContext);
