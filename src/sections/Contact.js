import React, { useState } from "react";
import * as emailjs from "emailjs-com";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUpRight, FiCopy, FiCheck, FiSend } from "react-icons/fi";
import { contactConfig, introdata } from "../content_option";
import { Magnetic } from "../components/motion";
import SectionHead from "./SectionHead";
import { socialLinks } from "../layout/socials";

const empty = { name: "", email: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [copied, setCopied] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });
    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        { from_name: form.email, user_name: form.name, to_name: contactConfig.YOUR_EMAIL, message: form.message },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setForm(empty);
          setStatus({ state: "success", message: "Message sent — I'll get back to you within a day." });
        },
        () => setStatus({ state: "error", message: `Couldn't send right now. Email me directly at ${contactConfig.YOUR_EMAIL}.` })
      );
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactConfig.YOUR_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      window.location.href = `mailto:${contactConfig.YOUR_EMAIL}`;
    }
  };

  return (
    <section id="contact" className="section section--contact" aria-label="Contact">
      <div className="container">
        <SectionHead index="06" label="Contact" title="Let's build" dim="something together." lead={contactConfig.description} />

        <div className="contact">
          <div className="contact__info">
            <span className="contact__label">Email</span>
            <div className="contact__email">
              <a href={`mailto:${contactConfig.YOUR_EMAIL}`} data-cursor="Write">{contactConfig.YOUR_EMAIL}</a>
              <button type="button" className="icon-btn icon-btn--bordered" onClick={copyEmail} aria-label="Copy email address" data-cursor={copied ? "Copied" : "Copy"}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "ok" : "copy"}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{ display: "grid" }}
                  >
                    {copied ? <FiCheck /> : <FiCopy />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>

            <span className="contact__label">Elsewhere</span>
            <ul className="contact__links">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" data-cursor="Open">
                    <span className="contact__icon">{s.icon}</span>
                    {s.label}
                    <FiArrowUpRight className="contact__arrow" aria-hidden="true" />
                  </a>
                </li>
              ))}
              <li>
                <a href={introdata.resume} target="_blank" rel="noopener noreferrer" data-cursor="Open">
                  <span className="contact__icon">CV</span>
                  Résumé
                  <FiArrowUpRight className="contact__arrow" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          <form className="contact__form" onSubmit={onSubmit}>
            <div className="field-row">
              <label className="field">
                <span>Name</span>
                <input name="name" type="text" autoComplete="name" placeholder="Jane Doe" value={form.name} onChange={onChange} required />
              </label>
              <label className="field">
                <span>Email</span>
                <input name="email" type="email" autoComplete="email" placeholder="jane@company.com" value={form.email} onChange={onChange} required />
              </label>
            </div>
            <label className="field">
              <span>Message</span>
              <textarea name="message" rows="6" placeholder="What are you working on?" value={form.message} onChange={onChange} required />
            </label>

            <AnimatePresence>
              {(status.state === "success" || status.state === "error") && (
                <motion.p
                  className={`form-alert form-alert--${status.state}`}
                  role="status"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {status.message}
                </motion.p>
              )}
            </AnimatePresence>

            <Magnetic strength={0.2}>
              <button className="btn btn--primary" type="submit" disabled={status.state === "loading"} data-cursor="Send">
                {status.state === "loading" ? "Sending…" : "Send message"}
                <FiSend aria-hidden="true" className={status.state === "loading" ? "is-flying" : ""} />
              </button>
            </Magnetic>
          </form>
        </div>
      </div>
    </section>
  );
}
