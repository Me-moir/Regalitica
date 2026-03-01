"use client";
import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  duration?: number;
  onComplete: () => void;
}

const LoadingScreen = ({ duration = 3000, onComplete }: LoadingScreenProps) => {
  const [phase, setPhase] = useState<'filling' | 'done'>('filling');

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('done');
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    if (phase === 'done') {
      const exit = setTimeout(onComplete, 600); // allow fade-out
      return () => clearTimeout(exit);
    }
  }, [phase, onComplete]);

  return (
    <div
      className={`nr-loading-screen${phase === 'done' ? ' nr-loading-exit' : ''}`}
      aria-hidden={phase === 'done'}
    >
      <div className="nr-loading-content">
        <h1 className="nr-loading-title" aria-label="Notus Regalia">
          <span className="nr-loading-text">Notus</span>
          {' '}
          <span className="nr-loading-text nr-loading-accent">Regalia</span>
        </h1>
        <div className="nr-loading-tagline">Beyond Perception. Beyond Form. Beyond Fate.</div>
      </div>

      <style>{`
        .nr-loading-screen {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(160deg, #000000 0%, #050508 40%, #020204 100%);
          transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1;
        }
        .nr-loading-screen.nr-loading-exit {
          opacity: 0;
          pointer-events: none;
        }

        .nr-loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          user-select: none;
        }

        .nr-loading-title {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: clamp(2rem, 6vw, 4rem);
          font-weight: 300;
          letter-spacing: 0.06em;
          color: transparent;
          position: relative;
          display: inline-flex;
          gap: 0.35em;
        }

        .nr-loading-text {
          position: relative;
          /* Dark base text — barely visible */
          color: rgba(255, 255, 255, 0.06);
          display: inline-block;
        }

        /* Pseudo-element that fills the text from left to right */
        .nr-loading-text::before {
          content: attr(data-fill) '';
          position: absolute;
          inset: 0;
          color: rgba(255, 255, 255, 0.85);
          -webkit-background-clip: text;
          clip-path: inset(0 100% 0 0);
          animation: textFillLTR ${duration || 3000}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        /* First word: "Notus" */
        .nr-loading-text:not(.nr-loading-accent)::before {
          content: 'Notus';
          animation-delay: 0.2s;
        }

        /* Second word: "Regalia" in crimson */
        .nr-loading-accent::before {
          content: 'Regalia';
          color: #EB1143;
          animation-delay: 0.35s;
        }

        @keyframes textFillLTR {
          0%   { clip-path: inset(0 100% 0 0); }
          100% { clip-path: inset(0 0% 0 0); }
        }

        .nr-loading-tagline {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: clamp(0.65rem, 1.5vw, 0.85rem);
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0);
          animation: taglineFade ${duration || 3000}ms ease forwards;
          animation-delay: 0.8s;
        }

        @keyframes taglineFade {
          0%   { color: rgba(255, 255, 255, 0); }
          40%  { color: rgba(255, 255, 255, 0.15); }
          100% { color: rgba(255, 255, 255, 0.25); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
