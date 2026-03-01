import React, { useState } from "react";
import * as emailjs from "emailjs-com";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { meta, contactConfig } from "../../content_option";
import { HiOutlineEnvelope } from "react-icons/hi2";
import useScrollReveal from "../../hooks/useScrollReveal";

export const ContactUs = () => {
  const revealRef = useScrollReveal();
  const [formData, setFormdata] = useState({
    email: "",
    name: "",
    message: "",
    loading: false,
    show: false,
    alertmessage: "",
    variant: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormdata({ ...formData, loading: true });

    const templateParams = {
      from_name: formData.email,
      user_name: formData.name,
      to_name: contactConfig.YOUR_EMAIL,
      message: formData.message,
    };

    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        (result) => {
          setFormdata({
            loading: false,
            alertmessage: "Your message has been delivered to Arsh! Thank you.",
            variant: "success",
            name: "",
            email: "",
            message: "",
            show: true,
          });
        },
        (error) => {
          setFormdata({
            ...formData,
            alertmessage: `Failed to send your message. Please try again later.`,
            variant: "error",
            show: true,
            loading: false,
          });
        }
      );
  };

  const handleChange = (e) => {
    setFormdata({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <HelmetProvider>
      <div ref={revealRef}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title} | Contact</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        {/* Header */}
        <section className="section contact-header">
          <span className="contact-header__label reveal">Get In Touch</span>
          <h1 className="contact-header__title reveal reveal-delay-1">
            Let's <span>Talk</span>
          </h1>
        </section>

        {/* Contact Content */}
        <section className="section">
          {formData.show && (
            <div
              className={`contact-alert ${formData.variant} reveal`}
              style={{ marginBottom: '30px' }}
            >
              {formData.alertmessage}
            </div>
          )}

          <div className="contact-content">
            {/* Info Side */}
            <div className="contact-info">
              <div className="contact-info__item reveal reveal-delay-1">
                <div className="contact-info__icon">
                  <HiOutlineEnvelope />
                </div>
                <div className="contact-info__label">Email</div>
                <div className="contact-info__value">
                  <a href={`mailto:${contactConfig.YOUR_EMAIL}`}>
                    {contactConfig.YOUR_EMAIL}
                  </a>
                </div>
              </div>

              <div className="contact-info__desc reveal reveal-delay-2">
                <p>
                  Need some help? Whether you have questions, need support, or
                  just want to say hello, feel free to reach out. Fill out the
                  form and I'll get back to you as soon as possible!
                </p>
              </div>
            </div>

            {/* Form Side */}
            <form className="contact-form reveal-right" onSubmit={handleSubmit}>
              <div className="contact-form__row">
                <input
                  className="contact-form__input"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name || ""}
                  type="text"
                  required
                  onChange={handleChange}
                />
                <input
                  className="contact-form__input"
                  name="email"
                  placeholder="Your Email"
                  type="email"
                  value={formData.email || ""}
                  required
                  onChange={handleChange}
                />
              </div>
              <textarea
                className="contact-form__textarea"
                name="message"
                placeholder="Your Message"
                rows="5"
                value={formData.message || ""}
                onChange={handleChange}
                required
              />
              <div>
                <button className="btn-primary-custom" type="submit">
                  {formData.loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </section>

        {formData.loading && <div className="loading-bar" />}
      </div>
    </HelmetProvider>
  );
};
