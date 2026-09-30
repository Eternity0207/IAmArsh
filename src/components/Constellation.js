import { useEffect, useRef } from "react";

const LINK_DIST = 110; // max distance between two dots for a link
const POINTER_RADIUS = 190; // links only appear inside this radius of the pointer
const POINTER_LINK = 160; // dot → pointer link distance

const readColors = () => {
  const css = getComputedStyle(document.documentElement);
  const light = document.documentElement.getAttribute("data-theme") === "light";
  return {
    dot: light ? "31, 30, 29" : "240, 237, 230",
    accent: css.getPropertyValue("--accent-rgb").trim() || "224, 138, 99",
    dotAlpha: light ? 0.3 : 0.4,
  };
};

/**
 * Drifting dots that knit into a constellation around the pointer. Sized to
 * its parent (the hero) and fully paused whenever that area is off-screen or
 * the tab is hidden, so it costs nothing while you read the rest of the page.
 */
export default function Constellation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let colors = readColors();
    let w = 0;
    let h = 0;
    let dots = [];
    let raf = 0;
    let visible = true;
    let running = false;
    const pointer = { x: -9999, y: -9999, strength: 0, target: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = host.clientWidth;
      h = host.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(80, Math.round((w * h) / 17000));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.1 + 0.5,
      }));
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pointer.strength += (pointer.target - pointer.strength) * 0.1;
      const { dot, accent, dotAlpha } = colors;
      const near = [];

      ctx.fillStyle = `rgba(${dot}, ${dotAlpha})`;
      ctx.beginPath();
      for (const d of dots) {
        if (!reduced) {
          d.x += d.vx;
          d.y += d.vy;
          if (d.x < -10) d.x = w + 10;
          else if (d.x > w + 10) d.x = -10;
          if (d.y < -10) d.y = h + 10;
          else if (d.y > h + 10) d.y = -10;
        }
        let x = d.x;
        let y = d.y;
        if (pointer.strength > 0.01) {
          const dx = pointer.x - x;
          const dy = pointer.y - y;
          const dist = Math.hypot(dx, dy);
          if (dist < POINTER_RADIUS) {
            const pull = (1 - dist / POINTER_RADIUS) * 12 * pointer.strength;
            x += (dx / (dist || 1)) * pull;
            y += (dy / (dist || 1)) * pull;
            near.push({ x, y, dist });
          }
        }
        ctx.moveTo(x + d.r, y);
        ctx.arc(x, y, d.r, 0, Math.PI * 2);
      }
      ctx.fill();

      if (near.length) {
        ctx.lineWidth = 0.7;
        for (let i = 0; i < near.length; i++) {
          const a = near[i];
          for (let j = i + 1; j < near.length; j++) {
            const b = near[j];
            const dd = Math.hypot(a.x - b.x, a.y - b.y);
            if (dd < LINK_DIST) {
              const fade = Math.min(1 - a.dist / POINTER_RADIUS, 1 - b.dist / POINTER_RADIUS);
              ctx.strokeStyle = `rgba(${accent}, ${(1 - dd / LINK_DIST) * fade * 0.6 * pointer.strength})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
          if (a.dist < POINTER_LINK) {
            ctx.strokeStyle = `rgba(${accent}, ${(1 - a.dist / POINTER_LINK) * 0.45 * pointer.strength})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }
    };

    const loop = () => {
      if (!running) return;
      draw();
      raf = requestAnimationFrame(loop);
    };

    const setRunning = () => {
      const should = visible && !document.hidden && !reduced;
      if (should === running) return;
      running = should;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      const inside = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= w && pointer.y <= h;
      pointer.target = inside ? 1 : 0;
      if (reduced) draw();
    };
    const onUp = (e) => {
      if (e.pointerType !== "mouse") pointer.target = 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      setRunning();
    });
    io.observe(host);
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    const themeObserver = new MutationObserver(() => {
      colors = readColors();
      draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("visibilitychange", setRunning);
    resize();
    setRunning();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("visibilitychange", setRunning);
    };
  }, []);

  return <canvas ref={canvasRef} className="constellation" aria-hidden="true" />;
}
