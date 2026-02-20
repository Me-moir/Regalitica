"use client";
import React, { useRef, useCallback } from "react";

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

interface CardSpotlightProps {
  children: React.ReactNode;
  className?: string;
}

export function CardSpotlight({ children, className }: CardSpotlightProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);
  }, []);

  const handleLeave = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty('--mouse-x', `50%`);
    el.style.setProperty('--mouse-y', `50%`);
  }, []);

  return (
    <>
      <style>{`
        .uiverse-card { position: relative; box-sizing: border-box; }
        .uiverse-card-border::before {
          content: '';
          position: absolute; inset: 0; padding: 1px; border-radius: 1rem;
          pointer-events: none; z-index: 1; opacity: 0;
          background: radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 166, 0.8), rgba(255, 215, 0, 0.6), rgba(236, 72, 153, 0.6), rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.5), transparent 70%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .uiverse-card:hover .uiverse-card-border::before { opacity: 1; }

        /* Inner content hover scale */
        .uiverse-card-inner {
          transition: transform 0.28s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.28s ease;
          transform-origin: center;
          will-change: transform;
        }
        .uiverse-card:hover .uiverse-card-inner {
          transform: scale(1.08);
        }

        /* Light mode overrides: do not modify dark-mode defaults above. */
        html.light .uiverse-card {
          background: var(--gradient-card) !important;
          border: 1px solid #d1d5db !important;
          box-shadow: 0 8px 24px rgba(16,24,40,0.06), 0 2px 6px rgba(16,24,40,0.04) !important;
        }
        /* Lighter overlay colors for light theme */
        html.light .uiverse-card-border::before {
          background: radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 150, 100, 0.55), rgba(250, 200, 90, 0.45), rgba(220, 90, 140, 0.35), rgba(120, 70, 200, 0.32), rgba(40, 110, 220, 0.32), transparent 70%) !important;
          -webkit-mask-composite: xor; mask-composite: exclude;
        }

        /* Light mode font & element color overrides inside the card */
        html.light .uiverse-card-inner {
          color: var(--content-primary) !important;
        }
        html.light .uiverse-card-inner p {
          color: var(--content-primary) !important;
        }
        /* secondary paragraph (purpose) — only adjust color in light mode, keep size/margins consistent */
        html.light .uiverse-card-inner p + p {
          color: var(--content-muted) !important;
        }
        html.light .uiverse-card-inner hr {
          background: #d1d5db !important;
          height: 1px !important;
          border: none !important;
          width: 75% !important;
          margin: 0 !important;
        }
        /* Recolor inline SVG logos to match light text color */
        html.light .uiverse-card-inner svg {
          stroke: currentColor !important;
          fill: none !important;
          opacity: 0.95 !important;
        }
        /* Logo pill adjustments for light background */
        html.light .uiverse-card-inner > div:first-child {
          background: #ffffff !important;
          border: 1px solid #e6e6e6 !important;
        }
      `}</style>

      <div
        ref={rootRef}
        className={cn('uiverse-card', className)}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          padding: "3rem 2rem",
          width: "100%",
          height: "460px",
          backgroundColor: "hsla(240, 15%, 5%, 1)",
          backgroundImage: `
            radial-gradient(at 88% 40%, hsla(240, 15%, 5%, 1) 0px, transparent 85%),
            radial-gradient(at 49% 30%, hsla(240, 15%, 5%, 1) 0px, transparent 85%),
            radial-gradient(at 14% 26%, hsla(240, 15%, 5%, 1) 0px, transparent 85%),
            radial-gradient(at 0% 100%,  rgba(147,51,234,0.45)  0px, transparent 80%),
            radial-gradient(at 100% 100%,rgba(59,130,246,0.4)   0px, transparent 80%),
            radial-gradient(at 50% 100%, rgba(220,38,38,0.3)    0px, transparent 70%)
          `,
          borderRadius: "1rem",
          boxShadow: "0px -16px 24px 0px rgba(255, 255, 255, 0.06) inset",
        }}
      >
        {/* Gradient border overlay */}
        <div
          className="uiverse-card-border"
          style={{
            pointerEvents: "none",
            position: "absolute",
            inset: 0,
            zIndex: 0,
            borderRadius: "1rem",
          }}
        />

        <div className="uiverse-card-inner" style={{ zIndex: 2, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '0.5rem 0' }}>
          {children}
        </div>
      </div>
    </>
  );
}