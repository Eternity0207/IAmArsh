import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook that adds scroll-reveal animations
 * Observes elements with classes: reveal, reveal-left, reveal-right, reveal-scale
 * Adds 'revealed' class when they enter the viewport
 */
const useScrollReveal = () => {
  const containerRef = useRef(null);

  const setupObserver = useCallback(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const animatedElements = containerRef.current.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    );

    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Small delay so DOM is rendered
    const timer = setTimeout(setupObserver, 100);
    return () => clearTimeout(timer);
  }, [setupObserver]);

  return containerRef;
};

export default useScrollReveal;
