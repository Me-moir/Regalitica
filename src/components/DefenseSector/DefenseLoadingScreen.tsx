"use client";
import { useState, useEffect } from 'react';

interface DefenseLoadingScreenProps {
  duration?: number;
  onComplete: () => void;
}

const DefenseLoadingScreen = ({ duration = 3000, onComplete }: DefenseLoadingScreenProps) => {
  const [phase, setPhase] = useState<'filling' | 'done'>('filling');

  useEffect(() => {
    const timer = setTimeout(() => setPhase('done'), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    if (phase === 'done') {
      const exit = setTimeout(onComplete, 600);
      return () => clearTimeout(exit);
    }
  }, [phase, onComplete]);

  const dur = duration || 3000;

  return (
    <div
      className={`df-loading-screen${phase === 'done' ? ' df-loading-exit' : ''}`}
      aria-hidden={phase === 'done'}
    >
      <div className="df-loading-content">
        <h1 className="df-loading-title" aria-label="Notus Regalia Defense Systems">
          <span className="df-loading-text">Notus</span>
          {' '}
          <span className="df-loading-text df-loading-accent">Regalia</span>
        </h1>
        <div className="df-loading-divider" />
        <div className="df-loading-subtitle">Defense Systems</div>
      </div>

      <style>{`
        .df-loading-screen {
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
        .df-loading-screen.df-loading-exit {
          opacity: 0;
          pointer-events: none;
        }

        .df-loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          user-select: none;
        }

        .df-loading-title {
          font-family: 'Inter', system-ui, sans-serif;
          font-size: clamp(2rem, 6vw, 4rem);
          font-weight: 300;
          letter-spacing: 0.06em;
          color: transparent;
          position: relative;
          display: inline-flex;
          gap: 0.35em;
        }

        .df-loading-text {
          position: relative;
          color: rgba(255, 255, 255, 0.06);
          display: inline-block;
        }

        .df-loading-text::before {
          content: '';
          position: absolute;
          inset: 0;
          color: rgba(255, 255, 255, 0.85);
          -webkit-background-clip: text;
          clip-path: inset(0 100% 0 0);
          animation: dfTextFillLTR ${dur}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .df-loading-text:not(.df-loading-accent)::before {
          content: 'Notus';
          animation-delay: 0.2s;
        }

        .df-loading-accent::before {
          content: 'Regalia';
          color: #EB1143;
          animation-delay: 0.35s;
        }

        @keyframes dfTextFillLTR {
          0%   { clip-path: inset(0 100% 0 0); }
          100% { clip-path: inset(0 0% 0 0); }
        }

        .df-loading-divider {
          width: 48px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(227, 27, 84, 0.6), transparent);
          animation: dfDividerFade ${dur}ms ease forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }

        @keyframes dfDividerFade {
          0%   { opacity: 0; width: 0; }
          50%  { opacity: 1; width: 48px; }
          100% { opacity: 0.6; width: 48px; }
        }

        .df-loading-subtitle {
          font-family: ui-monospace, Menlo, monospace;
          font-size: clamp(0.55rem, 1.2vw, 0.72rem);
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(227, 27, 84, 0);
          animation: dfSubFade ${dur}ms ease forwards;
          animation-delay: 0.7s;
        }

        @keyframes dfSubFade {
          0%   { color: rgba(227, 27, 84, 0); }
          40%  { color: rgba(227, 27, 84, 0.45); }
          100% { color: rgba(227, 27, 84, 0.7); }
        }
      `}</style>
    </div>
  );
};

export default DefenseLoadingScreen;
