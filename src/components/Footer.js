import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedinIn, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";
import { socialprofils } from "../content_option";

export const socialLinks = [
  { href: socialprofils.github, label: "GitHub", icon: <FaGithub /> },
  { href: socialprofils.linkedin, label: "LinkedIn", icon: <FaLinkedinIn /> },
  { href: socialprofils.leetcode, label: "LeetCode", icon: <SiLeetcode /> },
  { href: socialprofils.twitter, label: "X", icon: <FaXTwitter /> },
  { href: socialprofils.instagram, label: "Instagram", icon: <FaInstagram /> },
].filter((s) => s.href);

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <Link to="/contact" className="footer__mark" aria-label="Contact Arsh">arsh.</Link>
      </div>
      <div className="container footer__inner">
        <span>© {new Date().getFullYear()} Arsh Goyal · Built with React</span>
        <div className="socials">
          {socialLinks.map((s) => (
            <a key={s.label} className="icon-btn" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
