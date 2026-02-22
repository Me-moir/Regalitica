"use client";
import { memo, useCallback } from 'react';
import Threads from './Threads';


const HeroSection = () => {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }, []);


  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'var(--surface-primary)',
        // Prevent layout/paint from propagating up the tree on scroll
        contain: 'layout paint',
      }}
    >
      <style jsx>{`
        @media (max-width: 768px) {
          section {
            min-height: 100svh !important;
            height: 100svh !important;
            padding: 0;
          }
        }

        @media (max-width: 768px) {
          .heroBtn {
            padding: 0.6rem 1.25rem;
            font-size: 0.8rem;
          }
        }

        .heroBtn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          background-color: var(--button-bg);
          box-shadow: var(--button-shadow);
          border: solid 1px var(--button-border);
          border-radius: 8px;
          cursor: pointer;
          color: var(--content-secondary);
          transition: all 0.3s ease;
        }

        @media (min-width: 1024px) {
          .heroBtn {
            padding: 0.75rem 2rem;
            font-size: 1rem;
          }
        }

        .heroBtn::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 10px;
          padding: 1px;
          background: radial-gradient(
            200px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(0, 255, 166, 0.8),
            rgba(255, 215, 0, 0.6),
            rgba(236, 72, 153, 0.6),
            rgba(147, 51, 234, 0.6),
            rgba(59, 130, 246, 0.5),
            transparent 70%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 0;
        }

        .heroBtn:hover::before {
          opacity: 1;
        }

        .hero-title {
          background-image: linear-gradient(135deg, #e2e8f0, #94a3b8, #cbd5e1, #64748b);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        :global(.light) .hero-title {
          background-image: none;
          -webkit-background-clip: unset;
          background-clip: unset;
          -webkit-text-fill-color: unset;
          color: #1e293b;
        }

        :global(.light) .hero-grid-base {
          background-image:
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px) !important;
        }

        :global(.light) .hero-grid-fade {
          background-image:
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px) !important;
        }

        :global(.light) .hero-mobile-overlay {
          background: linear-gradient(to top, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.4) 40%, transparent 70%) !important;
        }

        :global(.light) .hero-mobile-overlay .hero-mobile-status {
          color: rgba(0,0,0,0.4) !important;
        }

        :global(.light) .hero-mobile-overlay .hero-mobile-subtitle {
          color: rgba(0,0,0,0.5) !important;
        }

        :global(.light) .hero-mobile-overlay {
          background: linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.3) 35%, transparent 55%) !important;
        }

        :global(.light) .hero-scroll-hint span {
          color: rgba(0,0,0,0.3) !important;
        }

        :global(.light) .hero-scroll-hint svg path {
          stroke: rgba(0,0,0,0.3) !important;
        }

        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }

        .hero-scroll-hint {
          animation: scrollBounce 1.8s ease-in-out infinite;
        }

        /* --- FUTURISTIC HUD PILLBOX (TEAL) --- */
        .hud-pill {
          position: relative;
          overflow: hidden;
          padding: 6px 18px 6px 14px;
          border-radius: 999px;
          border: 1px solid rgba(14,165,164,0.28);
          background: linear-gradient(90deg, rgba(14,165,164,0.08) 0%, rgba(14,165,164,0.02) 100%);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-left: 3px solid #0ea5a4;
          box-shadow: 0 0 20px rgba(14,165,164,0.06) inset;
        }

        .hud-pill::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          transform: skewX(-20deg);
          animation: hudGlare 4s infinite linear;
        }

        @keyframes hudGlare {
          0% { left: -100%; }
          20% { left: 200%; }
          100% { left: 200%; }
        }

        .hud-dot-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 12px;
          height: 12px;
        }

        .hud-dot-core {
          width: 4px;
          height: 4px;
          background-color: #0ea5a4;
          border-radius: 50%;
          box-shadow: 0 0 8px #14b8a6, 0 0 12px #14b8a6;
          z-index: 2;
        }

        .hud-dot-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 1px solid rgba(14,165,164,0.6);
          border-radius: 50%;
          animation: radarPulse 2s infinite cubic-bezier(0.45, 0, 0.55, 1);
          z-index: 1;
        }

        @keyframes radarPulse {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }

        .hud-text {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          color: #14b8a6;
          text-shadow: 0 0 8px rgba(20,184,166,0.35);
          letter-spacing: 0.08em;
        }

        .hud-prefix {
          color: #cbd5e1;
          opacity: 0.85;
          margin-right: 0.45rem;
          animation: dataFlicker 6s infinite;
        }

        @keyframes dataFlicker {
          0%, 96%, 98%, 100% { opacity: 0.85; }
          97%, 99% { opacity: 0.25; }
        }

        @media (max-width: 640px) {
          .hud-pill { padding: 4px 10px; }
          .hud-text { font-size: 0.65rem; }
          .hud-dot-wrapper { width: 8px; height: 8px; }
        }

        /* Light mode variant: dark background but retain gold border accents */
        :global(.light) .hud-pill {
          background: rgba(0,0,0,0.9) !important;
          border: 1px solid rgba(14,165,164,0.22) !important;
          border-left: 3px solid #0ea5a4 !important;
          box-shadow: 0 0 18px rgba(14,165,164,0.06) inset !important;
        }

        :global(.light) .hud-pill::after {
          background: linear-gradient(90deg, transparent, rgba(14,165,164,0.08), transparent) !important;
        }

        :global(.light) .hud-text {
          color: #e6fffb !important;
          text-shadow: 0 0 6px rgba(14,165,164,0.08) !important;
        }

        :global(.light) .hud-prefix {
          color: rgba(236, 239, 241, 0.9) !important;
          opacity: 1 !important;
        }

        :global(.light) .hud-dot-core {
          background-color: #0ea5a4 !important;
          box-shadow: 0 0 8px #14b8a6, 0 0 12px #14b8a6 !important;
        }

        :global(.light) .hud-dot-ring {
          border-color: rgba(14,165,164,0.6) !important;
        }

      `}</style>

      {/* Faint grid background — right side, on top of threads */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full pointer-events-none hidden md:block"
        style={{
          zIndex: 4,
          // Promote to own compositor layer so it doesn't trigger repaints
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        {/* Base grid */}
        <div
          className="absolute inset-0 hero-grid-base"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        {/* Random fade patches — use transparent masks instead of black overlays */}
        <div
          className="absolute inset-0 hero-grid-fade"
          style={{
            maskImage: `
              radial-gradient(ellipse at 15% 20%, transparent 0%, white 50%),
              radial-gradient(ellipse at 75% 10%, transparent 0%, white 40%),
              radial-gradient(ellipse at 40% 60%, transparent 0%, white 55%),
              radial-gradient(ellipse at 85% 75%, transparent 0%, white 45%),
              radial-gradient(ellipse at 25% 85%, transparent 0%, white 50%),
              radial-gradient(ellipse at 60% 35%, transparent 0%, white 40%)
            `,
            maskComposite: 'intersect',
            WebkitMaskImage: `
              radial-gradient(ellipse at 15% 20%, transparent 0%, white 50%),
              radial-gradient(ellipse at 75% 10%, transparent 0%, white 40%),
              radial-gradient(ellipse at 40% 60%, transparent 0%, white 55%),
              radial-gradient(ellipse at 85% 75%, transparent 0%, white 45%),
              radial-gradient(ellipse at 25% 85%, transparent 0%, white 50%),
              radial-gradient(ellipse at 60% 35%, transparent 0%, white 40%)
            `,
            WebkitMaskComposite: 'source-in',
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Threads Background — allow pointer events so canvas can receive mouse input */}
      <div
        className="absolute inset-0"
        style={{
          width: '100%',
          height: '100%',
          zIndex: 2,
          // Allow pointer events so the WebGL canvas can receive mouse events
          pointerEvents: 'auto',
          // Own compositor layer — prevents the canvas from triggering repaints on other layers
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        <Threads
          amplitude={3.5}
          distance={0.3}
          // Re-enable mouse interaction for the threads background
          enableMouseInteraction={true}
        />
      </div>

      {/* Glass Morphism Left Panel */}
      <div
        className="absolute top-0 left-0 w-1/2 h-full hidden md:flex items-center pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(37,99,235,0.05) 50%, rgba(29,78,216,0.03) 100%)',
          // Reduced blur from 10px → 5px and removed saturate() — single biggest perf win
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          borderRight: '1px dashed var(--border-color)',
          zIndex: 3,
          // Promote to compositor layer so blur doesn't repaint siblings on scroll
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        {/* Subtle top-left glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 20% 15%, rgba(96,165,250,0.07) 0%, transparent 60%)',
          }}
        />
        {/* Subtle bottom reflection */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1/3 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(255,255,255,0.02), transparent)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 w-full px-8 lg:px-14 xl:px-20 flex flex-col gap-8" style={{ marginTop: '5vh' }}>
          {/* HUD Pill (Gold) - replaces status bar */}
          <div className="inline-flex items-center gap-2.5 pointer-events-auto hud-pill w-fit">
            <div className="hud-dot-wrapper" style={{ width: '10px', height: '10px' }}>
              <div className="hud-dot-core" style={{ width: '4px', height: '4px' }} />
              <div className="hud-dot-ring" />
            </div>
            <span className="text-xs lg:text-sm font-mono tracking-widest uppercase hud-text">
              <span className="hud-prefix">[THE MANY]</span> return to One.
            </span>
          </div>

          {/* Main Title */}
          <h1
            className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight hero-title"
          >
            Weaving continuity beyond individuality.
          </h1>

          {/* Subtitle */}
          <p
            className="text-base lg:text-lg xl:text-xl leading-relaxed max-w-xl"
            style={{ color: 'var(--content-tertiary)' }}
          >
            Notosphere exists to weave the threads that bind intelligence into a unified continuum. We design the systems through which humanity transitions beyond fragmentation and into its next form.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-4 mt-2 pointer-events-auto">
            <button
              className="heroBtn"
              onMouseMove={handleMouseMove}
            >
              View Portfolio
            </button>
            <button
              className="heroBtn"
              onMouseMove={handleMouseMove}
            >
              Convergence Index
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Content Overlay */}
      <div
        className="relative z-10 flex md:hidden flex-col justify-between w-full h-full px-5 pb-8 pt-24 pointer-events-none hero-mobile-overlay"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 35%, transparent 55%)',
          // Promote mobile overlay to its own layer too
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      >
        <div className="flex flex-col gap-5 w-full">
          {/* Mobile HUD Pill (Gold) */}
          <div className="inline-flex items-center gap-2 pointer-events-auto hud-pill w-fit" style={{ padding: '4px 12px 4px 10px' }}>
            <div className="hud-dot-wrapper" style={{ width: '8px', height: '8px' }}>
              <div className="hud-dot-core" style={{ width: '3px', height: '3px' }} />
              <div className="hud-dot-ring" />
            </div>
            <span className="text-[0.65rem] hud-text">
              <span className="hud-prefix">[THE MANY]</span> RETURN TO ONE.
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight hero-title">
            Weaving continuity beyond individuality.
          </h1>

          {/* Subtitle */}
          <p
            className="text-sm sm:text-base leading-relaxed hero-mobile-subtitle"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Notosphere exists to weave the threads that bind intelligence into a unified continuum.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-1 pointer-events-auto">
            <button className="heroBtn" onMouseMove={handleMouseMove}>
              View Portfolio
            </button>
            <button className="heroBtn" onMouseMove={handleMouseMove}>
              Convergence Index
            </button>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="flex items-center gap-3 pointer-events-auto hero-scroll-hint self-start">
          <div className="hero-scroll-arrow">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span
            className="text-xs font-mono tracking-[0.15em] uppercase"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Scroll to explore
          </span>
        </div>
      </div>


    </section>
  );
};

export default memo(HeroSection);