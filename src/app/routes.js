import React from "react";
import { Route, Routes } from "react-router-dom";
import Page from "../sections/Page";

// Old page URLs still work: each opens the single page at the matching section.
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Page />} />
      <Route path="/about" element={<Page section="about" />} />
      <Route path="/experience" element={<Page section="experience" />} />
      <Route path="/portfolio" element={<Page section="work" />} />
      <Route path="/work" element={<Page section="work" />} />
      <Route path="/skills" element={<Page section="skills" />} />
      <Route path="/contact" element={<Page section="contact" />} />
      <Route path="*" element={<Page />} />
    </Routes>
  );
}
