import React, { useEffect, useRef, useState } from "react";

const SESSION_KEY = "preloader-seen";

export const shouldShowPreloader = () => {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return !sessionStorage.getItem(SESSION_KEY);
  } catch (e) {
    return true;
  }
};

// Timeline (seconds, after fonts are ready)
const STAGGER = 0.45; // left→right delay across the word, like it's being written
const TRAVEL = 0.95; // flight time for each dot
const HOLD = 0.5; // light sweep across the assembled mark
const BURST = 0.85; // dots scatter and the page shows through

const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const clamp01 = (t) => Math.max(0, Math.min(1, t));

const themeColors = () => {
  const css = getComputedStyle(document.documentElement);
  const light = document.documentElement.getAttribute("data-theme") === "light";
  return {
    dot: light ? "24, 24, 27" : "250, 250, 250",
    accent: css.getPropertyValue("--accent-rgb").trim() || "167, 139, 250",
  };
};

/** Rasterise the wordmark and return dot targets on a grid. */
function sampleWord(w, h) {
  const size = Math.round(Math.min(w * 0.3, h * 0.34, 230));
  const font = `700 ${size}px Geist, ui-sans-serif, system-ui, sans-serif`;
  const off = document.createElement("canvas");
  const octx = off.getContext("2d", { willReadFrequently: true });
  octx.font = font;
  if ("letterSpacing" in octx) octx.letterSpacing = `${-0.06 * size}px`;
  const word = "arsh.";
  const textW = Math.ceil(octx.measureText(word).width);
  const dotStart = octx.measureText("arsh").width;
  off.width = textW + 20;
  off.height = Math.ceil(size * 1.3);
  octx.font = font;
  if ("letterSpacing" in octx) octx.letterSpacing = `${-0.06 * size}px`;
  octx.textBaseline = "middle";
  octx.fillStyle = "#000";
  octx.fillText(word, 10, off.height / 2);

  const data = octx.getImageData(0, 0, off.width, off.height).data;
  let step = Math.max(4, Math.round(size / 30));
  let pts = [];
  for (;;) {
    pts = [];
    for (let y = 0; y < off.height; y += step) {
      for (let x = 0; x < off.width; x += step) {
        if (data[(y * off.width + x) * 4 + 3] > 140) pts.push({ x, y, accent: x - 10 > dotStart - step });
      }
    }
    if (pts.length <= 650) break;
    step += 1;
  }
  const ox = w / 2 - off.width / 2;
  const oy = h / 2 - off.height / 2 - 24;
  return { step, pts: pts.map((p) => ({ ...p, x: p.x + ox, y: p.y + oy })), left: ox, width: off.width };
}

/**
 * First-visit intro. Stray dots fly in and knit themselves into the "arsh."
 * wordmark as a connected mesh, a light sweeps across it, then it bursts
 * apart and the dots scatter into the site's constellation background.
 * The cursor pushes dots around while it runs; click or any key skips.
 */
export default function Preloader({ onReveal, onDone }) {
  const canvasRef = useRef(null);
  const skipRef = useRef(() => {});
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState("assemble"); // assemble → sweep → burst

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let raf = 0;
    let cancelled = false;
    let colors = themeColors();
    let particles = [];
    let links = [];
    let meta = null;
    let t0 = 0;
    let burstAt = Infinity;
    let revealed = false;
    let lastPct = -1;
    const pointer = { x: -9999, y: -9999 };

    const setup = () => {
      meta = sampleWord(w, h);
      particles = meta.pts.map((p) => {
        // Start scattered across (and just beyond) the viewport.
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.max(w, h) * (0.35 + Math.random() * 0.45);
        return {
          sx: w / 2 + Math.cos(angle) * radius,
          sy: h / 2 + Math.sin(angle) * radius,
          tx: p.x,
          ty: p.y,
          x: 0,
          y: 0,
          accent: p.accent,
          delay: ((p.x - meta.left) / meta.width) * STAGGER + Math.random() * 0.12,
          curve: (Math.random() - 0.5) * 160,
          r: 1 + Math.random() * 0.9,
          vx: 0,
          vy: 0,
          px: 0,
          py: 0,
        };
      });
      // Mesh edges between grid neighbours (computed once from the targets).
      const maxD = meta.step * 1.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          if (Math.abs(a.tx - b.tx) <= maxD && Math.abs(a.ty - b.ty) <= maxD && Math.random() < 0.55) {
            links.push([i, j]);
          }
        }
      }
    };

    const startBurst = (now) => {
      if (burstAt !== Infinity) return;
      burstAt = now;
      setPhase("burst");
      for (const p of particles) {
        const dx = p.x - w / 2;
        const dy = p.y - h / 2;
        const d = Math.hypot(dx, dy) || 1;
        const force = 6 + Math.random() * 10;
        p.vx = (dx / d) * force + (Math.random() - 0.5) * 6;
        p.vy = (dy / d) * force + (Math.random() - 0.5) * 6;
        p.px = p.x;
        p.py = p.y;
      }
      if (!revealed) {
        revealed = true;
        onReveal();
      }
    };

    skipRef.current = () => startBurst(performance.now());

    const frame = (now) => {
      if (cancelled) return;
      if (!t0) t0 = now;
      const t = (now - t0) / 1000;
      const assembleEnd = STAGGER + 0.12 + TRAVEL;
      const sweepEnd = assembleEnd + HOLD;

      if (t >= sweepEnd) startBurst(now);
      else if (t >= assembleEnd) setPhase((p) => (p === "assemble" ? "sweep" : p));

      ctx.clearRect(0, 0, w, h);
      const { dot, accent } = colors;
      const bursting = burstAt !== Infinity;
      const bt = bursting ? clamp01((now - burstAt) / 1000 / BURST) : 0;
      const sweepX = meta.left - 80 + clamp01((t - assembleEnd) / HOLD) * (meta.width + 160);
      let arrived = 0;

      for (const p of particles) {
        if (!bursting) {
          const k = clamp01((t - p.delay) / TRAVEL);
          const e = easeOutExpo(k);
          if (k >= 1) arrived += 1;
          // Curved flight: a sideways bow that straightens on arrival.
          const bow = Math.sin(e * Math.PI) * p.curve;
          const dx = p.tx - p.sx;
          const dy = p.ty - p.sy;
          const len = Math.hypot(dx, dy) || 1;
          p.x = p.sx + dx * e + (-dy / len) * bow;
          p.y = p.sy + dy * e + (dx / len) * bow;
        } else {
          p.px += p.vx;
          p.py += p.vy;
          p.vx *= 0.94;
          p.vy *= 0.94;
          p.x = p.px;
          p.y = p.py;
        }
        // Pointer pushes dots aside.
        const mx = p.x - pointer.x;
        const my = p.y - pointer.y;
        const md = Math.hypot(mx, my);
        if (md < 90) {
          const push = (1 - md / 90) * 22;
          p.x += (mx / (md || 1)) * push;
          p.y += (my / (md || 1)) * push;
        }
      }

      // Mesh: fades in as dots land, snaps away on burst.
      const meshAlpha = bursting ? 0.35 * (1 - clamp01(bt * 3)) : 0.35 * clamp01((t - STAGGER * 0.6) / TRAVEL);
      if (meshAlpha > 0.01) {
        ctx.lineWidth = 0.6;
        ctx.strokeStyle = `rgba(${dot}, ${meshAlpha})`;
        ctx.beginPath();
        for (const [i, j] of links) {
          const a = particles[i];
          const b = particles[j];
          if (Math.abs(a.x - b.x) > meta.step * 3 || Math.abs(a.y - b.y) > meta.step * 3) continue;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
        }
        ctx.stroke();
      }

      for (const p of particles) {
        const glow = !bursting ? Math.exp(-((p.tx - sweepX) ** 2) / (2 * 38 * 38)) : 0;
        const fade = bursting ? 1 - bt : 1;
        const useAccent = p.accent || glow > 0.25;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + glow * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${useAccent ? accent : dot}, ${fade * (0.85 + glow * 0.15)})`;
        ctx.fill();
      }

      const nextPct = bursting ? 100 : Math.round((arrived / particles.length) * 100);
      if (nextPct !== lastPct) {
        lastPct = nextPct;
        setPct(nextPct);
      }

      if (bursting && bt >= 1) {
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch (e) {
          /* ignore */
        }
        onDone();
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const onSkip = () => skipRef.current();
    const observer = new MutationObserver(() => {
      colors = themeColors();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("keydown", onSkip);

    // Wait for the display font so the mark samples correctly (but never hang).
    const fonts = document.fonts ? document.fonts.load("700 100px Geist").catch(() => {}) : Promise.resolve();
    Promise.race([fonts, new Promise((r) => setTimeout(r, 900))]).then(() => {
      if (cancelled) return;
      setup();
      raf = requestAnimationFrame(frame);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("keydown", onSkip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const caption = phase === "assemble" ? "Mapping nodes" : phase === "sweep" ? "Linking edges" : "Ready";

  return (
    <div
      className={`preloader ${phase === "burst" ? "is-leaving" : ""}`}
      role="status"
      aria-label="Loading Arsh Goyal's portfolio"
      onClick={() => skipRef.current()}
    >
      <canvas ref={canvasRef} className="preloader__canvas" aria-hidden="true" />
      <div className="preloader__foot" aria-hidden="true">
        <span className="preloader__caption">
          <span className="preloader__pulse" />
          {caption}
        </span>
        <span className="preloader__count">{String(pct).padStart(3, "0")}</span>
      </div>
      <span className="preloader__skip" aria-hidden="true">Click or tap to skip</span>
      <span className="preloader__bar" style={{ transform: `scaleX(${pct / 100})` }} aria-hidden="true" />
    </div>
  );
}
