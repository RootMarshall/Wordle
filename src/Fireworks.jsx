import { useEffect, useRef } from 'react';

const BASE_ACCENT_COLORS = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3'];
const PARTICLE_COUNT = 80;
const BURST_COUNT = 12;

function createParticles(correctColor, presentColor) {
  const COLORS = [correctColor, presentColor, ...BASE_ACCENT_COLORS];
  const particles = [];
  for (let b = 0; b < BURST_COUNT; b++) {
    const angle = (b / BURST_COUNT) * Math.PI * 2 + Math.random() * 0.5;
    const cx = 0.5 + (Math.random() - 0.5) * 0.3;
    const cy = 0.4 + (Math.random() - 0.5) * 0.2;
    const perBurst = Math.floor(PARTICLE_COUNT / BURST_COUNT);
    for (let i = 0; i < perBurst; i++) {
      const a = angle + (Math.random() - 0.5) * 1.5;
      const speed = 0.012 + Math.random() * 0.015;
      const life = 1200 + Math.random() * 800;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed - 0.05,
        life,
        maxLife: life,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 2 + Math.random() * 3,
      });
    }
  }
  return particles;
}

export default function Fireworks({ active, correctColor = '#538d4e', presentColor = '#b59f3b' }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!active) {
      particlesRef.current = [];
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      return;
    }

    particlesRef.current = createParticles(correctColor, presentColor);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let last = performance.now();
    const tick = (now) => {
      const dt = Math.min(now - last, 50);
      last = now;
      const particles = particlesRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt * 0.06;
        p.y += p.vy * dt * 0.06;
        p.vy += 0.0002 * dt;
        p.life -= dt;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        const opacity = p.life / p.maxLife;
        const px = p.x * canvas.width;
        const py = p.y * canvas.height;
        ctx.globalAlpha = opacity;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 2;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (particles.length > 0) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [active, correctColor, presentColor]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );
}
