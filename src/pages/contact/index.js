import React, { useState } from "react";
import * as emailjs from "emailjs-com";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUpRight, FiCopy, FiCheck, FiSend } from "react-icons/fi";
import { meta, contactConfig } from "../../content_option";
import { Card, Reveal } from "../../components/ui";
import { SplitText, Magnetic } from "../../components/motion";
import { socialLinks } from "../../components/Footer";

const empty = { name: "", email: "", message: "" };

export const ContactUs = () => {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });

    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.email,
          user_name: form.name,
          to_name: contactConfig.YOUR_EMAIL,
          message: form.message,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setForm(empty);
          setStatus({ state: "success", message: "Message sent — I'll get back to you soon." });
        },
        () => {
          setStatus({ state: "error", message: `Couldn't send right now. Email me directly at ${contactConfig.YOUR_EMAIL}.` });
        }
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
    <HelmetProvider>
      <Helmet>
        <title>Contact — {meta.title}</title>
        <meta name="description" content={meta.description} />
      </Helmet>

      <div className="page container">
        <section className="page-hero">
          <Reveal as="span" className="eyebrow">Contact</Reveal>
          <h1>
            <SplitText text="Let's build" />{" "}
            <motion.span
              className="serif gradient-text"
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              style={{ display: "inline-block" }}
            >
              something.
            </motion.span>
          </h1>
          <Reveal as="p" delay={0.3}>{contactConfig.description}</Reveal>
        </section>

        <section className="section contact">
          <div className="contact__side">
            <Card className="contact__email">
              <span className="eyebrow">Email</span>
              <a href={`mailto:${contactConfig.YOUR_EMAIL}`} className="contact__address">
                {contactConfig.YOUR_EMAIL}
              </a>
              <button type="button" className="btn btn--ghost" onClick={copyEmail}>
                {copied ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />}
                {copied ? "Copied" : "Copy address"}
              </button>
            </Card>

            <Card className="contact__socials" delay={0.05}>
              <span className="eyebrow">Elsewhere</span>
              <ul>
                {socialLinks.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer">
                      <span className="contact__social-icon">{s.icon}</span>
                      {s.label}
                      <FiArrowUpRight className="contact__social-arrow" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card className="contact__form-card" delay={0.1}>
            <form className="contact__form" onSubmit={handleSubmit}>
              <div className="field-row">
                <label className="field">
                  <span>Name</span>
                  <input name="name" type="text" autoComplete="name" placeholder="Jane Doe" value={form.name} onChange={handleChange} required />
                </label>
                <label className="field">
                  <span>Email</span>
                  <input name="email" type="email" autoComplete="email" placeholder="jane@company.com" value={form.email} onChange={handleChange} required />
                </label>
              </div>
              <label className="field">
                <span>Message</span>
                <textarea name="message" rows="6" placeholder="What are you working on?" value={form.message} onChange={handleChange} required />
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
                <button className="btn btn--primary" type="submit" disabled={status.state === "loading"}>
                  {status.state === "loading" ? "Sending…" : "Send message"}
                  <FiSend aria-hidden="true" className={status.state === "loading" ? "is-flying" : ""} />
                </button>
              </Magnetic>
            </form>
          </Card>
        </section>
      </div>
    </HelmetProvider>
  );
};
