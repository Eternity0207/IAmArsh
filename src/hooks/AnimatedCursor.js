import React, { useEffect, useRef, useCallback } from "react";

const IsDevice = (() => {
  if (typeof navigator === "undefined") return;
  let ua = navigator.userAgent;
  return {
    any() {
      return (
        ua.match(/Android/i) ||
        ua.match(/BlackBerry/i) ||
        ua.match(/iPhone|iPad|iPod/i) ||
        ua.match(/Opera Mini/i) ||
        ua.match(/IEMobile/i) ||
        (ua.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2)
      );
    },
  };
})();

/**
 * Custom cursor layout:
 *   - dot  : tiny (6px), tracks mouse exactly — feels precise
 *   - ring : 32px, trails with slight ease — feels engineered
 *
 * Enhancements over the previous version:
 *   - Ring lerps toward the dot on a RAF loop → subtle trailing feel
 *   - Magnetic attraction: when near a hover target, ring center is nudged
 *     toward the element's center (max 8px) so the cursor "locks" onto it
 *   - Hover: ring scale capped at 1.2× + glow; dot grows to 1.2× with glow
 *   - Click: gentle 0.9× press
 */
function CursorCore({ color = "212, 168, 83" }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  // Mouse (actual pointer)
  const mouse = useRef({ x: -100, y: -100 });
  // Ring position (lerped)
  const ring = useRef({ x: -100, y: -100 });
  // Target for ring — usually mouse, but pulled toward a magnetic target
  // when hovering a clickable.
  const magnet = useRef(null); // { x, y, strength } | null

  const hovering = useRef(false);
  const clicking = useRef(false);
  const rafRef = useRef(0);

  const ringScale = () => {
    if (clicking.current) return 0.9;
    if (hovering.current) return 1.2;
    return 1;
  };

  const onMouseMove = useCallback((e) => {
    mouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseDown = useCallback(() => {
    clicking.current = true;
  }, []);

  const onMouseUp = useCallback(() => {
    clicking.current = false;
  }, []);

  // Single RAF loop drives both the dot (immediate position) and the ring
  // (lerped, with magnetic pull) — eliminates jitter from multiple transform
  // writes across handlers.
  useEffect(() => {
    const loop = () => {
      const m = mouse.current;

      // Dot: immediate
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${m.x}px, ${m.y}px) translate(-50%, -50%) scale(${
          hovering.current ? 1.2 : 1
        })`;
      }

      // Ring target — default is the mouse, optionally pulled by magnet.
      let targetX = m.x;
      let targetY = m.y;
      if (magnet.current) {
        const { x, y, strength } = magnet.current;
        targetX = m.x + (x - m.x) * strength;
        targetY = m.y + (y - m.y) * strength;
      }

      // Lerp — 0.3 = *very light* trail, almost imperceptible latency. The
      // design spec asks us to keep trailing subtle; higher values make the
      // ring feel glued to the dot (defeating the trail effect), lower
      // values introduce noticeable lag.
      ring.current.x += (targetX - ring.current.x) * 0.3;
      ring.current.y += (targetY - ring.current.y) * 0.3;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%) scale(${ringScale()})`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseDown, onMouseUp]);

  useEffect(() => {
    const clickables = document.querySelectorAll(
      'a, button, input, textarea, select, label[for], .link'
    );

    const enter = (e) => {
      hovering.current = true;
      // Set up a magnetic pull toward the element's center. Strength 0.15
      // means the ring center lerps 15% of the way from mouse to element
      // center — enough to "feel" the lock without dragging the cursor.
      const rect = e.currentTarget.getBoundingClientRect();
      magnet.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        strength: 0.1, // subtle pull, not a "grab"
      };
      if (dotRef.current) {
        dotRef.current.style.boxShadow = `0 0 12px rgba(${color}, 0.8)`;
      }
      if (ringRef.current) {
        ringRef.current.style.borderColor = `rgba(${color}, 0.9)`;
        ringRef.current.style.backgroundColor = `rgba(${color}, 0.06)`;
        ringRef.current.style.boxShadow = `0 0 24px rgba(${color}, 0.35)`;
      }
    };
    const leave = () => {
      hovering.current = false;
      magnet.current = null;
      if (dotRef.current) {
        dotRef.current.style.boxShadow = "none";
      }
      if (ringRef.current) {
        ringRef.current.style.borderColor = `rgba(${color}, 0.45)`;
        ringRef.current.style.backgroundColor = "transparent";
        ringRef.current.style.boxShadow = "none";
      }
    };

    // Update magnet target live as the element moves under the cursor (e.g.
    // during hover transforms). Without this, a slow hover on a moving
    // element would show the cursor drifting out of alignment.
    const move = (e) => {
      if (!hovering.current) return;
      const rect = e.currentTarget.getBoundingClientRect();
      magnet.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        strength: 0.1,
      };
    };

    clickables.forEach((el) => {
      el.style.cursor = "none";
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      el.addEventListener("mousemove", move);
    });

    return () => {
      clickables.forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
        el.removeEventListener("mousemove", move);
      });
    };
  }, [color]);

  document.body.style.cursor = "none";

  const dotStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: 6,
    height: 6,
    borderRadius: "50%",
    backgroundColor: `rgb(${color})`,
    pointerEvents: "none",
    zIndex: 999999,
    willChange: "transform",
    transition: "box-shadow 0.3s ease, opacity 0.15s ease",
  };

  const ringStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: `1px solid rgba(${color}, 0.45)`,
    backgroundColor: "transparent",
    pointerEvents: "none",
    zIndex: 999998,
    willChange: "transform",
    /* Transform is driven by RAF lerp — no transition on transform, or the
       trail would fight the easing. Border/glow have their own transitions. */
    transition:
      "border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease, opacity 0.15s ease",
  };

  return (
    <>
      <div ref={ringRef} style={ringStyle} />
      <div ref={dotRef} style={dotStyle} />
    </>
  );
}

function AnimatedCursor({ color, ...rest }) {
  if (typeof navigator !== "undefined" && IsDevice.any()) {
    return null;
  }
  return <CursorCore color={color} {...rest} />;
}

export default AnimatedCursor;
