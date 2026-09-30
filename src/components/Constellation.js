import { useEffect, useRef } from "react";

const LINK_DIST = 120; // max distance between two dots for a link
const POINTER_RADIUS = 200; // links only appear inside this radius of the pointer
const POINTER_LINK = 170; // dot → pointer link distance

const readColors = () => {
  const css = getComputedStyle(document.documentElement);
  const light = document.documentElement.getAttribute("data-theme") === "light";
  return {
    dot: light ? "24, 24, 27" : "250, 250, 250",
    accent: css.getPropertyValue("--accent-rgb").trim() || "167, 139, 250",
    dotAlpha: light ? 0.32 : 0.45,
  };
};

/**
 * Full-viewport canvas of slowly drifting dots. Near the pointer the dots
 * link up into a constellation and lean gently toward it.
 */
export default function Constellation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let colors = readColors();
    let w = 0;
    let h = 0;
    let dots = [];
    let raf = 0;
    let running = true;
    const pointer = { x: -9999, y: -9999, strength: 0, target: 0 };

    const spawn = () => {
      const count = Math.min(120, Math.round((w * h) / 13000));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.2 + 0.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.004 + Math.random() * 0.01,
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawn();
      if (reduced) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      pointer.strength += (pointer.target - pointer.strength) * 0.08;
      const { dot, accent, dotAlpha } = colors;
      const near = [];

      for (const d of dots) {
        if (!reduced) {
          d.x += d.vx;
          d.y += d.vy;
          d.phase += d.speed;
          if (d.x < -10) d.x = w + 10;
          if (d.x > w + 10) d.x = -10;
          if (d.y < -10) d.y = h + 10;
          if (d.y > h + 10) d.y = -10;
        }

        const dx = pointer.x - d.x;
        const dy = pointer.y - d.y;
        const dist = Math.hypot(dx, dy);
        let ox = 0;
        let oy = 0;
        if (dist < POINTER_RADIUS && pointer.strength > 0.01) {
          // Lean toward the pointer, strongest at mid-range.
          const pull = (1 - dist / POINTER_RADIUS) * 14 * pointer.strength;
          ox = (dx / (dist || 1)) * pull;
          oy = (dy / (dist || 1)) * pull;
          near.push({ x: d.x + ox, y: d.y + oy, dist });
        }

        const twinkle = 0.55 + Math.sin(d.phase) * 0.45;
        ctx.beginPath();
        ctx.arc(d.x + ox, d.y + oy, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dot}, ${dotAlpha * twinkle})`;
        ctx.fill();
      }

      if (near.length) {
        ctx.lineWidth = 0.7;
        for (let i = 0; i < near.length; i++) {
          const a = near[i];
          const fadeA = 1 - a.dist / POINTER_RADIUS;
          for (let j = i + 1; j < near.length; j++) {
            const b = near[j];
            const dd = Math.hypot(a.x - b.x, a.y - b.y);
            if (dd < LINK_DIST) {
              const fade = Math.min(fadeA, 1 - b.dist / POINTER_RADIUS);
              ctx.strokeStyle = `rgba(${accent}, ${(1 - dd / LINK_DIST) * fade * 0.55 * pointer.strength})`;
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
        // Soft glow at the pointer itself.
        const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 6);
        g.addColorStop(0, `rgba(${accent}, ${0.7 * pointer.strength})`);
        g.addColorStop(1, `rgba(${accent}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      if (!running) return;
      draw();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.target = 1;
      if (reduced) draw();
    };
    const onLeave = () => {
      pointer.target = 0;
    };
    const onTouchEnd = (e) => {
      // Let the constellation fade out after a tap/drag on touch screens.
      if (e.pointerType !== "mouse") pointer.target = 0;
    };
    const onVisibility = () => {
      running = !document.hidden && !reduced;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(loop);
    };

    const themeObserver = new MutationObserver(() => {
      colors = readColors();
      if (reduced) draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("pointerup", onTouchEnd, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    if (reduced) {
      running = false;
      draw();
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerup", onTouchEnd);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="constellation" aria-hidden="true" />;
}
