import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { introdata, projects, worktimeline, stats } from "../content_option";

/**
 * A little shell session that types itself out. Commands are typed
 * character by character; their output appears line by line.
 */
export default function Terminal({ startDelay = 900 }) {
  const reduced = useReducedMotion();

  const script = useMemo(() => {
    const now = worktimeline
      .filter((w) => /present/i.test(w.date) && !/freelance/i.test(w.jobtitle))
      .map((w) => `→ ${w.jobtitle.toLowerCase()} · ${w.where}`);
    return [
      { cmd: "whoami", out: [`${introdata.name.toLowerCase()} — ${introdata.role.toLowerCase()}`] },
      { cmd: "cat now.txt", out: now },
      { cmd: "ls ~/projects", out: [projects.map((p) => `${p.name.toLowerCase()}/`).join("  ")] },
      { cmd: "leetcode --stats", out: [`${stats[1].value} solved · codechef ${stats[2].value}`] },
    ];
  }, []);

  // step = number of fully finished blocks; typed = chars of the current command shown
  const [step, setStep] = useState(reduced ? script.length : 0);
  const [typed, setTyped] = useState(0);
  const [started, setStarted] = useState(reduced);

  useEffect(() => {
    if (reduced) return undefined;
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [reduced, startDelay]);

  useEffect(() => {
    if (!started || step >= script.length) return undefined;
    const cmd = script[step].cmd;
    if (typed < cmd.length) {
      const t = setTimeout(() => setTyped((n) => n + 1), 45 + Math.random() * 45);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setStep((s) => s + 1);
      setTyped(0);
    }, 550);
    return () => clearTimeout(t);
  }, [started, step, typed, script]);

  const Prompt = () => <span className="term__prompt">~ $</span>;

  return (
    <div className="term" aria-label={`Terminal introducing ${introdata.name}`}>
      <div className="term__bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <em>arsh@iitj: ~</em>
      </div>
      <div className="term__body" aria-hidden="true">
        {script.slice(0, step).map((b) => (
          <div key={b.cmd} className="term__block">
            <div><Prompt /> {b.cmd}</div>
            {b.out.map((o, i) => (
              <motion.div
                key={o}
                className="term__out"
                initial={reduced ? false : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.08 }}
              >
                {o}
              </motion.div>
            ))}
          </div>
        ))}
        <div>
          <Prompt /> {step < script.length && script[step].cmd.slice(0, typed)}
          <span className="term__caret" />
        </div>
      </div>
      <p className="sr-only">
        {script.map((b) => `${b.cmd}: ${b.out.join(", ")}`).join(". ")}
      </p>
    </div>
  );
}
