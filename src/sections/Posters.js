import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/* ------------------------------------------------------------------------ */
/* Nexus — services on a Kafka bus, packets flowing between them             */
/* ------------------------------------------------------------------------ */

const SERVICES = [
  { id: "ingest", x: 60, y: 60 },
  { id: "parse", x: 170, y: 60 },
  { id: "embed", x: 280, y: 60 },
  { id: "graph", x: 115, y: 240 },
  { id: "ai", x: 225, y: 240 },
  { id: "review", x: 335, y: 240 },
];
const BUS_Y = 150;

export function NexusPoster() {
  return (
    <svg className="poster poster--nexus" viewBox="0 0 400 300" role="img" aria-label="Nexus architecture: six services exchanging messages over a Kafka bus">
      <defs>
        <pattern id="nx-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" className="poster__grid" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill="url(#nx-grid)" />
      <line x1="20" y1={BUS_Y} x2="380" y2={BUS_Y} className="nx-bus" />
      <text x="24" y={BUS_Y - 8} className="poster__label">kafka</text>
      {SERVICES.map((s, i) => {
        const d = `M${s.x} ${s.y < BUS_Y ? s.y + 16 : s.y - 16} L${s.x} ${BUS_Y}`;
        return (
          <g key={s.id}>
            <path id={`nx-p-${s.id}`} d={d} className="nx-link" />
            <circle r="3" className="nx-packet">
              <animateMotion dur={`${1.6 + (i % 3) * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.35}s`} keyPoints={s.y < BUS_Y ? "0;1" : "1;0"} keyTimes="0;1" calcMode="linear">
                <mpath href={`#nx-p-${s.id}`} />
              </animateMotion>
            </circle>
            <rect x={s.x - 34} y={s.y - 16} width="68" height="32" rx="8" className={`nx-node ${s.id === "ai" ? "is-hub" : ""}`} />
            <text x={s.x} y={s.y + 4} textAnchor="middle" className="poster__node-label">{s.id}</text>
          </g>
        );
      })}
      <circle r="3.5" className="nx-packet nx-packet--bus">
        <animateMotion dur="3.2s" repeatCount="indefinite" path={`M20 ${BUS_Y} L380 ${BUS_Y}`} />
      </circle>
      <circle r="3.5" className="nx-packet nx-packet--bus">
        <animateMotion dur="3.2s" begin="1.6s" repeatCount="indefinite" path={`M380 ${BUS_Y} L20 ${BUS_Y}`} />
      </circle>
    </svg>
  );
}

/* ------------------------------------------------------------------------ */
/* Reva — plain-English command drives the cursor across a desktop          */
/* ------------------------------------------------------------------------ */

const APPS = ["files", "terminal", "spotify", "browser", "notes", "mail"];

export function RevaPoster() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-20%" });
  const reduced = useReducedMotion();
  const play = inView && !reduced;
  const loop = { duration: 4.8, repeat: Infinity, ease: [0.65, 0, 0.35, 1] };

  return (
    <div ref={ref} className="poster poster--reva" role="img" aria-label="Reva: the command 'open spotify and play focus' moves the cursor to the Spotify icon, which is detected and clicked">
      <div className="rv-window">
        <div className="rv-bar" aria-hidden="true"><span /><span /><span /></div>
        <div className="rv-desk">
          {APPS.map((a) => (
            <div key={a} className={`rv-app ${a === "spotify" ? "is-target" : ""}`}>
              <span className="rv-icon" />
              <span className="rv-name">{a}</span>
              {a === "spotify" && (
                <motion.span
                  className="rv-box"
                  animate={play ? { opacity: [0, 0, 1, 1, 0], scale: [1.2, 1.2, 1, 1, 1] } : { opacity: 1, scale: 1 }}
                  transition={{ ...loop, times: [0, 0.35, 0.45, 0.85, 1] }}
                >
                  <em>spotify · 0.97</em>
                </motion.span>
              )}
            </div>
          ))}
          <motion.svg
            className="rv-cursor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            initial={{ left: "10%", top: "82%" }}
            animate={
              play
                ? { left: ["10%", "10%", "82%", "82%", "10%"], top: ["82%", "82%", "24%", "24%", "82%"], scale: [1, 1, 1, 0.8, 1] }
                : { left: "82%", top: "24%" }
            }
            transition={{ ...loop, times: [0, 0.2, 0.55, 0.62, 1] }}
          >
            <path d="M4 2l16 10-7 1.5L9.5 21z" />
          </motion.svg>
        </div>
        <div className="rv-prompt">
          <span className="rv-prompt__caret">›</span>
          <motion.span
            className="rv-prompt__text"
            animate={play ? { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)", "inset(0 0% 0 0)", "inset(0 100% 0 0)"] } : { clipPath: "inset(0 0% 0 0)" }}
            transition={{ ...loop, times: [0, 0.2, 0.9, 1] }}
          >
            open spotify and play focus
          </motion.span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Whispr — plaintext becomes ciphertext on the wire, then plaintext again   */
/* ------------------------------------------------------------------------ */

const HEX = "0123456789abcdef";
const scramble = (len) => Array.from({ length: len }, () => HEX[Math.floor(Math.random() * 16)]).join("");

export function WhisprPoster() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-20%" });
  const reduced = useReducedMotion();
  const [cipher, setCipher] = useState("9f3a1c7e0b4d2a88");

  useEffect(() => {
    if (!inView || reduced) return undefined;
    const id = setInterval(() => setCipher(scramble(16)), 90);
    return () => clearInterval(id);
  }, [inView, reduced]);

  const play = inView && !reduced;

  return (
    <div ref={ref} className="poster poster--whispr" role="img" aria-label="Whispr: a message is encrypted with AES-256 after a Diffie-Hellman key exchange, sent as ciphertext, and decrypted by the peer">
      <div className="wh-peer">
        <span className="wh-peer__name">alice</span>
        <div className="wh-bubble">see you at 9?</div>
      </div>

      <div className="wh-wire" aria-hidden="true">
        <span className="wh-wire__line" />
        <motion.span
          className="wh-packet"
          animate={play ? { left: ["0%", "100%"] } : { left: "50%" }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        >
          {cipher}
        </motion.span>
        <span className="wh-wire__tag">AES-256 · DH · PFS</span>
      </div>

      <div className="wh-peer wh-peer--right">
        <span className="wh-peer__name">bob</span>
        <motion.div
          className="wh-bubble wh-bubble--in"
          animate={play ? { opacity: [0, 0, 1, 1, 0] } : { opacity: 1 }}
          transition={{ duration: 2.4, repeat: Infinity, times: [0, 0.85, 0.9, 0.98, 1] }}
        >
          see you at 9?
        </motion.div>
        <span className="wh-lock" aria-hidden="true">
          <svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
          verified
        </span>
      </div>
    </div>
  );
}

export const posters = { Nexus: NexusPoster, Reva: RevaPoster, Whispr: WhisprPoster };
