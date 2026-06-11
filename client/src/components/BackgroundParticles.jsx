import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 100;
const CONNECTION_DIST = 140;
const ORB_COUNT = 4;

export default function BackgroundParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let mouse = { x: -1000, y: -1000 };

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 2 + 0.8,
      baseVx: (Math.random() - 0.5) * 0.25,
      baseVy: (Math.random() - 0.5) * 0.25,
    }));

    const orbs = Array.from({ length: ORB_COUNT }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 160 + 100,
      hue: i * 60 + 200 + Math.random() * 40,
      pulse: Math.random() * Math.PI * 2,
    }));

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const orb of orbs) {
        orb.x += orb.vx;
        orb.y += orb.vy;
        orb.pulse += 0.005;
        const pulseR = orb.r + Math.sin(orb.pulse) * 20;

        if (orb.x < -pulseR) orb.x = canvas.width + pulseR;
        if (orb.x > canvas.width + pulseR) orb.x = -pulseR;
        if (orb.y < -pulseR) orb.y = canvas.height + pulseR;
        if (orb.y > canvas.height + pulseR) orb.y = -pulseR;

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, pulseR);
        grad.addColorStop(0, `hsla(${orb.hue}, 55%, 55%, 0.05)`);
        grad.addColorStop(0.4, `hsla(${orb.hue + 15}, 45%, 45%, 0.025)`);
        grad.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(orb.x - pulseR, orb.y - pulseR, pulseR * 2, pulseR * 2);
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180) {
          const force = (180 - dist) / 180;
          p.vx -= (dx / (dist || 1)) * force * 0.015;
          p.vy -= (dy / (dist || 1)) * force * 0.015;
        }

        p.vx += (p.baseVx - p.vx) * 0.01;
        p.vy += (p.baseVy - p.vy) * 0.01;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(77, 158, 255, 0.25)';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < CONNECTION_DIST) {
            const alpha = (1 - dist2 / CONNECTION_DIST) * 0.06;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(77, 158, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
