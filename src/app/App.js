import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig } from "framer-motion";
import AppRoutes from "./routes";
import Headermain from "../header";
import Footer from "../components/Footer";
import CommandPalette from "../components/CommandPalette";
import Constellation from "../components/Constellation";
import Preloader, { shouldShowPreloader } from "../components/Preloader";
import { ScrollProgress } from "../components/motion";
import { ThemeProvider } from "../hooks/useTheme";
import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

export default function App() {
  const [showLoader, setShowLoader] = useState(shouldShowPreloader);
  const [ready, setReady] = useState(() => !showLoader);

  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <Router basename={process.env.PUBLIC_URL}>
          <ScrollToTop />
          <div className="backdrop" aria-hidden="true">
            <div className="backdrop__aurora" />
            <div className="backdrop__grid" />
            <Constellation />
          </div>

          <AnimatePresence>
            {showLoader && <Preloader onReveal={() => setReady(true)} onDone={() => setShowLoader(false)} />}
          </AnimatePresence>

          {ready && (
            <>
              <ScrollProgress />
              <Headermain />
              <main>
                <AppRoutes />
              </main>
              <Footer />
              <CommandPalette />
            </>
          )}
        </Router>
      </MotionConfig>
    </ThemeProvider>
  );
}
