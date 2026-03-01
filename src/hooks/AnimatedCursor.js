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

function CursorCore({ color = "212, 168, 83" }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);
  const clicking = useRef(false);

  const onMouseMove = useCallback((e) => {
    mouse.current = { x: e.clientX, y: e.clientY };
    if (dotRef.current) {
      dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    }
    if (ringRef.current) {
      ringRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) scale(${
        clicking.current ? 0.7 : hovering.current ? 2.2 : 1
      })`;
    }
  }, []);

  const onMouseDown = useCallback(() => {
    clicking.current = true;
    if (ringRef.current) {
      ringRef.current.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px) translate(-50%, -50%) scale(0.7)`;
    }
  }, []);

  const onMouseUp = useCallback(() => {
    clicking.current = false;
    if (ringRef.current) {
      ringRef.current.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px) translate(-50%, -50%) scale(${
        hovering.current ? 2.2 : 1
      })`;
    }
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

    const enter = () => {
      hovering.current = true;
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px) translate(-50%, -50%) scale(2.2)`;
        ringRef.current.style.borderColor = `rgba(${color}, 0.6)`;
        ringRef.current.style.backgroundColor = `rgba(${color}, 0.08)`;
      }
    };
    const leave = () => {
      hovering.current = false;
      if (dotRef.current) dotRef.current.style.opacity = "1";
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px) translate(-50%, -50%) scale(1)`;
        ringRef.current.style.borderColor = `rgba(${color}, 0.5)`;
        ringRef.current.style.backgroundColor = "transparent";
      }
    };

    clickables.forEach((el) => {
      el.style.cursor = "none";
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });

    return () => {
      clickables.forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, [color]);

  document.body.style.cursor = "none";

  const dotStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: `rgb(${color})`,
    pointerEvents: "none",
    zIndex: 999999,
    willChange: "transform",
    transition: "opacity 0.15s ease",
  };

  const ringStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: 46,
    height: 46,
    borderRadius: "50%",
    border: `2px solid rgba(${color}, 0.5)`,
    backgroundColor: "transparent",
    pointerEvents: "none",
    zIndex: 999998,
    willChange: "transform",
    transition:
      "transform 0.18s cubic-bezier(0.25, 0.1, 0.25, 1), border-color 0.25s ease, background-color 0.25s ease, opacity 0.15s ease",
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
