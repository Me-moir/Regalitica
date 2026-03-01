"use client";
import { memo, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

const CYCLE_WORDS = ['Transparency.', 'Accountability.', 'Clarity.', 'Integrity.'];

function useTypingCycle(words: string[]) {
  const [display, setDisplay] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    const step = () => {
      const word = words[wordIdx];
      if (!isDeleting) {
        charIdx++;
        setDisplay(word.slice(0, charIdx));
        if (charIdx === word.length) {
          isDeleting = true;
          timeout = setTimeout(step, 2000);
        } else {
          timeout = setTimeout(step, 80);
        }
      } else {
        charIdx--;
        setDisplay(word.slice(0, charIdx));
        if (charIdx === 0) {
          isDeleting = false;
          wordIdx = (wordIdx + 1) % words.length;
          timeout = setTimeout(step, 400);
        } else {
          timeout = setTimeout(step, 50);
        }
      }
    };

    timeout = setTimeout(step, 400);
    return () => clearTimeout(timeout);
  }, [words]);

  useEffect(() => {
    const id = setInterval(() => setShowCursor(v => !v), 530);
    return () => clearInterval(id);
  }, []);

  return { display, cursor: showCursor ? '|' : '\u00A0' };
}

const InformationHero = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { display, cursor } = useTypingCycle(CYCLE_WORDS);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    let width = rect.width;
    let height = rect.height;
    canvas.width = width;
    canvas.height = height;

    let animationId: number;
    let mouseX = -1000;
    let mouseY = -1000;

    const createNode = (): Node => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 1,
    });

    const nodes: Node[] = Array.from({ length: 80 }, createNode);

    const handleMouseMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      mouseX = e.clientX - r.left;
      mouseY = e.clientY - r.top;
    };
    const handleMouseLeave = () => { mouseX = -1000; mouseY = -1000; };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    const ro = new ResizeObserver(() => {
      const r = container.getBoundingClientRect();
      width = r.width;
      height = r.height;
      canvas.width = width;
      canvas.height = height;
    });
    ro.observe(container);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (const node of nodes) {
        const dx = node.x - mouseX;
        const dy = node.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          const force = ((100 - dist) / 100) * 0.02;
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;
        }
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.99;
        node.vy *= 0.99;
        node.vx += (Math.random() - 0.5) * 0.01;
        node.vy += (Math.random() - 0.5) * 0.01;
        if (node.x < 0 || node.x > width) { node.vx *= -1; node.x = Math.max(0, Math.min(width, node.x)); }
        if (node.y < 0 || node.y > height) { node.vy *= -1; node.y = Math.max(0, Math.min(height, node.y)); }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.globalAlpha = (1 - dist / 150) * 0.5;
            ctx.strokeStyle = 'rgba(136, 196, 255, 0.15)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      for (const node of nodes) {
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 4);
        gradient.addColorStop(0, 'rgba(136, 196, 255, 0.3)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(136, 196, 255, 1)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      ro.disconnect();
    };
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '420px', contain: 'layout paint' }}
    >
      {/* Canvas background — z-index 1 so content sits above it */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden"
        style={{ background: '#0a0a0a', zIndex: 1 }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.08) 0%, transparent 60%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(10,10,10,0.8) 100%)',
          }}
        />
      </div>

      {/* Content — z-index 10 so it sits above all canvas layers */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ zIndex: 10, paddingTop: '72px' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <h1
            className="select-none text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl"
            style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #b0b0b0 40%, #8a8a8a 70%, #a0a0a0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.35em',
            }}
          >
            INFORMATION HUB
          </h1>

          <p
            className="select-none font-mono text-xs tracking-[0.15em] sm:text-sm"
            style={{ color: 'rgba(180,180,190,0.7)' }}
          >
            Built for{' '}
            <span style={{ color: 'rgba(220,220,230,0.9)' }}>
              {display}
            </span>
            <span
              className="inline-block w-[2px] align-middle"
              style={{ color: 'rgba(220,220,230,0.7)' }}
            >
              {cursor}
            </span>
          </p>
        </motion.div>
      </div>

      {/* Bottom fade removed to avoid unwanted white gradient */}
    </section>
  );
});

InformationHero.displayName = 'InformationHero';
export default InformationHero;