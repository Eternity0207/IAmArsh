import React from "react";
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
