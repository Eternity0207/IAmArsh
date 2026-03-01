import React, { useRef, useEffect, useCallback } from 'react';

const Particles = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const dims = useRef({ w: 0, h: 0 });

  const MOUSE_RADIUS = 160;
  const CONNECT_DIST = 130;
  const MOUSE_CONNECT_DIST = 200;

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    dims.current.w = window.innerWidth;
    dims.current.h = window.innerHeight;
    canvas.width = dims.current.w * dpr;
    canvas.height = dims.current.h * dpr;
    canvas.style.width = dims.current.w + 'px';
    canvas.style.height = dims.current.h + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    resize();

    // Spawn particles — fewer since this is global
    const count = Math.min(60, Math.floor((dims.current.w * dims.current.h) / 25000));
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * dims.current.w,
      y: Math.random() * dims.current.h,
      baseSize: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.4 + 0.15,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: Math.random() * 0.015 + 0.004,
    }));

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    const onMouseLeave = () => {
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    const animate = () => {
      const { w, h } = dims.current;
      ctx.clearRect(0, 0, w, h);
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const particles = particlesRef.current;

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.phase += p.phaseSpeed;

        // Mouse repulsion — gentle push away
        const dmx = p.x - mx;
        const dmy = p.y - my;
        const mDist = Math.sqrt(dmx * dmx + dmy * dmy);
        if (mDist < MOUSE_RADIUS && mDist > 0) {
          const force = (1 - mDist / MOUSE_RADIUS) * 0.6;
          p.vx += (dmx / mDist) * force;
          p.vy += (dmy / mDist) * force;
        }

        // Damping
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Keep a gentle baseline drift
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed < 0.15) {
          p.vx += (Math.random() - 0.5) * 0.04;
          p.vy += (Math.random() - 0.5) * 0.04;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Soft wrap
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        const pulse = 0.7 + 0.3 * Math.sin(p.phase);
        const alpha = p.opacity * pulse;

        // Glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.baseSize * 5);
        grad.addColorStop(0, `rgba(212, 168, 83, ${alpha * 0.7})`);
        grad.addColorStop(0.4, `rgba(212, 168, 83, ${alpha * 0.15})`);
        grad.addColorStop(1, 'rgba(212, 168, 83, 0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.baseSize * 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.baseSize * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 235, 190, ${alpha})`;
        ctx.fill();
      }

      // Connections between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = 0.06 * (1 - dist / CONNECT_DIST);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212, 168, 83, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Mouse → particle connections (constellation highlight)
      if (mx > -9000) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_CONNECT_DIST) {
            const alpha = 0.18 * (1 - dist / MOUSE_CONNECT_DIST);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212, 168, 83, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(mx, my);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();

            // Boost particle glow near mouse
            const boost = (1 - dist / MOUSE_CONNECT_DIST) * 0.4;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.baseSize * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 235, 190, ${boost})`;
            ctx.fill();
          }
        }

        // Subtle cursor glow
        const cGrad = ctx.createRadialGradient(mx, my, 0, mx, my, 60);
        cGrad.addColorStop(0, 'rgba(212, 168, 83, 0.04)');
        cGrad.addColorStop(1, 'rgba(212, 168, 83, 0)');
        ctx.beginPath();
        ctx.arc(mx, my, 60, 0, Math.PI * 2);
        ctx.fillStyle = cGrad;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [resize]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default Particles;
