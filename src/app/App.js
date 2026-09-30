import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AnimatePresence, MotionConfig } from "framer-motion";
import AppRoutes from "./routes";
import CommandPalette from "../components/CommandPalette";
import Preloader, { shouldShowPreloader } from "../components/Preloader";
import { ThemeProvider } from "../hooks/useTheme";
import { SmoothScroll } from "../layout/SmoothScroll";
import { ActiveSectionProvider } from "../layout/ActiveSection";
import Nav from "../layout/Nav";
import SectionRail from "../layout/SectionRail";
import Footer from "../layout/Footer";
import Cursor from "../layout/Cursor";
import "../layout/layout.css";
import "./App.css";

export default function App() {
  const [showLoader, setShowLoader] = useState(shouldShowPreloader);
  const [ready, setReady] = useState(() => !showLoader);

  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <Router basename={process.env.PUBLIC_URL}>
          <SmoothScroll>
            <div className="backdrop" aria-hidden="true" />

            <AnimatePresence>
              {showLoader && <Preloader onReveal={() => setReady(true)} onDone={() => setShowLoader(false)} />}
            </AnimatePresence>

            {ready && (
              <ActiveSectionProvider>
                <Nav />
                <SectionRail />
                <main>
                  <AppRoutes />
                </main>
                <Footer />
                <CommandPalette />
              </ActiveSectionProvider>
            )}
            <Cursor />
          </SmoothScroll>
        </Router>
      </MotionConfig>
    </ThemeProvider>
  );
}
