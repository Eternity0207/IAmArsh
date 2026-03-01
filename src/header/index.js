import React, { useState, useEffect } from "react";
import "./style.css";
import { Link, useLocation } from "react-router-dom";
import { logotext, socialprofils } from "../content_option";
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineBriefcase,
  HiOutlineEnvelope,
} from "react-icons/hi2";
import { BsSun, BsMoon } from "react-icons/bs";

const Headermain = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home", icon: <HiOutlineHome /> },
    { path: "/about", label: "About", icon: <HiOutlineUser /> },
    { path: "/portfolio", label: "Portfolio", icon: <HiOutlineBriefcase /> },
    { path: "/contact", label: "Contact", icon: <HiOutlineEnvelope /> },
  ];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleNavClick = () => {
    setIsOpen(false);
    document.body.classList.remove("ovhidden");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.classList.toggle("ovhidden");
  };

  return (
    <>
      {/* Mobile header bar */}
      <div className="mobile-header">
        <Link to="/" className="logo-text" onClick={handleNavClick}>
          <span>I</span>Am<span>A</span>rsh
        </Link>
        <button className="hamburger-btn" onClick={toggleMenu}>
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className={`mobile-overlay ${isOpen ? "active" : ""}`}
        onClick={handleNavClick}
      />

      {/* Left Sidebar */}
      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        <div className="sidebar__logo">
          <div className="sidebar__logo-text">
            <span>I</span>Am<span>A</span>rsh
          </div>
          <div className="sidebar__logo-subtitle">Full Stack Developer</div>
        </div>

        <nav className="sidebar__nav">
          <ul className="sidebar__nav-list">
            {navLinks.map((link) => (
              <li key={link.path} className="sidebar__nav-item">
                <Link
                  to={link.path}
                  className={`sidebar__nav-link ${
                    location.pathname === link.path ? "active" : ""
                  }`}
                  onClick={handleNavClick}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__social">
            {socialprofils.github && (
              <a href={socialprofils.github} target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </a>
            )}
            {socialprofils.linkedin && (
              <a href={socialprofils.linkedin} target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
            )}
            {socialprofils.instagram && (
              <a href={socialprofils.instagram} target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
            )}
            {socialprofils.twitter && (
              <a href={socialprofils.twitter} target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
            )}
          </div>

          <button className="sidebar__theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? <BsSun /> : <BsMoon />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Headermain;
