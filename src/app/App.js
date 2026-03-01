import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";
import withRouter from "../hooks/withRouter";
import AppRoutes from "./routes";
import Headermain from "../header";
import AnimatedCursor from "../hooks/AnimatedCursor";
import Particles from "../components/Particles";
import "./App.css";

function _ScrollToTop(props) {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return props.children;
}
const ScrollToTop = withRouter(_ScrollToTop);

export default function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Particles />
      <div className="cursor__dot">
        <AnimatedCursor
          color="212, 168, 83"
        />
      </div>
      <div className="app-layout">
        <ScrollToTop>
          <Headermain />
          <div className="main-content">
            <AppRoutes />
          </div>
        </ScrollToTop>
      </div>
    </Router>
  );
}
