import React from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { introdata, dataabout } from "../content_option";

/**
 * A conference-style ID badge hanging from a lanyard. It sways on its own,
 * tilts toward the pointer in 3D, and a holographic sheen tracks the cursor.
 */
export default function IdBadge() {
  const reduced = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 160, damping: 18, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [12, -12]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-14, 14]), spring);
  const sheenX = useTransform(px, [0, 1], ["0%", "100%"]);
  const sheenY = useTransform(py, [0, 1], ["0%", "100%"]);
  const sheen = useMotionTemplate`radial-gradient(circle at ${sheenX} ${sheenY}, rgba(255,255,255,0.35), transparent 45%)`;

  const onMove = (e) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className="badge-scene" aria-label={`ID badge: ${introdata.name}, ${dataabout.education.degree}, IIT Jodhpur`} role="img">
      <div className="badge-sway">
        <span className="badge-strap" aria-hidden="true" />
        <motion.div
          className="badge"
          style={{ rotateX, rotateY, transformPerspective: 900 }}
          onPointerMove={onMove}
          onPointerLeave={reset}
          initial={{ y: -60, opacity: 0, rotate: -8 }}
          whileInView={{ y: 0, opacity: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 120, damping: 12, mass: 0.9 }}
          data-cursor="Tilt"
        >
          <span className="badge__clip" aria-hidden="true" />
          <div className="badge__head" aria-hidden="true">
            <span>IIT Jodhpur</span>
            <span className="badge__chip" />
          </div>
          <div className="badge__photo" aria-hidden="true">
            <span>AG</span>
          </div>
          <div className="badge__name" aria-hidden="true">{introdata.name}</div>
          <div className="badge__role" aria-hidden="true">{introdata.role}</div>
          <dl className="badge__fields" aria-hidden="true">
            <div><dt>Program</dt><dd>B.Tech · EE</dd></div>
            <div><dt>Batch</dt><dd>2024 – 28</dd></div>
            <div><dt>CGPA</dt><dd>{dataabout.education.grade.replace("CGPA ", "").replace(" / 10", "")}</dd></div>
            <div><dt>Based</dt><dd>Jodhpur</dd></div>
          </dl>
          <div className="badge__foot" aria-hidden="true">
            <span className="badge__barcode" />
            <span className="badge__id">IITJ · EE · 2024</span>
          </div>
          <motion.span className="badge__sheen" style={{ background: sheen }} aria-hidden="true" />
        </motion.div>
      </div>
    </div>
  );
}
