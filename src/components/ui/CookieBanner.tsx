"use client";
import { useState, useEffect, useCallback } from 'react';

const COOKIE_KEY = 'nr-cookie-consent';

type ConsentValue = 'all' | 'essential' | null;

function getStoredConsent(): ConsentValue {
  if (typeof window === 'undefined') return null;
  const v = localStorage.getItem(COOKIE_KEY);
  if (v === 'all' || v === 'essential') return v;
  return null;
}

interface CookieBannerProps {
  visible: boolean;
}

const CookieBanner = ({ visible }: CookieBannerProps) => {
  const [show, setShow] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const stored = getStoredConsent();
    if (stored) return; // already consented
    const t = setTimeout(() => setShow(true), 400); // slight delay after loading finishes
    return () => clearTimeout(t);
  }, [visible]);

  const handleAccept = useCallback((type: 'all' | 'essential') => {
    localStorage.setItem(COOKIE_KEY, type);
    setExiting(true);
    setTimeout(() => setShow(false), 500);
  }, []);

  if (!show) return null;

  return (
    <div className={`nr-cookie-backdrop${exiting ? ' nr-cookie-exit' : ''}`}>
      <div className={`nr-cookie-banner${exiting ? ' nr-cookie-banner-exit' : ''}`}>
        {/* Decorative top accent */}
        <div className="nr-cookie-accent" />

        <div className="nr-cookie-body">
          <div className="nr-cookie-header">
            <i className="bi bi-shield-lock" />
            <span>Cookie Preferences</span>
          </div>

          <p className="nr-cookie-text">
            We use essential cookies to keep the site functional and optional analytics 
            cookies to understand how you interact with Notus Regalia. Your data stays yours.
          </p>

          <div className="nr-cookie-actions">
            <button
              className="nr-cookie-btn nr-cookie-btn-secondary"
              onClick={() => handleAccept('essential')}
            >
              Essential Only
            </button>
            <button
              className="nr-cookie-btn nr-cookie-btn-primary"
              onClick={() => handleAccept('all')}
            >
              Accept All
            </button>
          </div>

          <p className="nr-cookie-footnote">
            You can change your preferences anytime in Settings.
          </p>
        </div>
      </div>

      <style>{`
        .nr-cookie-backdrop {
          position: fixed;
          inset: 0;
          z-index: 90000;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 1.25rem;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          animation: cookieFadeIn 0.5s ease forwards;
        }
        .nr-cookie-backdrop.nr-cookie-exit {
          animation: cookieFadeOut 0.5s ease forwards;
        }

        .nr-cookie-banner {
          position: relative;
          width: 100%;
          max-width: 480px;
          border-radius: 16px;
          overflow: hidden;
          background: linear-gradient(165deg, rgba(12, 12, 18, 0.97) 0%, rgba(6, 6, 10, 0.98) 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            0 24px 80px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255, 255, 255, 0.03) inset,
            0 1px 0 rgba(255, 255, 255, 0.04) inset;
          animation: cookieSlideUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .nr-cookie-banner.nr-cookie-banner-exit {
          animation: cookieSlideDown 0.45s cubic-bezier(0.55, 0, 1, 0.45) forwards;
        }

        :root.light .nr-cookie-banner {
          background: linear-gradient(165deg, rgba(255, 255, 255, 0.97) 0%, rgba(248, 248, 252, 0.98) 100%);
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow:
            0 24px 80px rgba(0, 0, 0, 0.12),
            0 0 0 1px rgba(0, 0, 0, 0.03) inset;
        }
        :root.light .nr-cookie-backdrop {
          background: rgba(0, 0, 0, 0.15);
        }

        .nr-cookie-accent {
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #EB1143 20%, #EB1143 80%, transparent 100%);
          opacity: 0.7;
        }

        .nr-cookie-body {
          padding: 1.5rem 1.75rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .nr-cookie-header {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 0.01em;
        }
        .nr-cookie-header i {
          font-size: 1rem;
          color: #EB1143;
        }
        :root.light .nr-cookie-header {
          color: rgba(0, 0, 0, 0.85);
        }

        .nr-cookie-text {
          font-size: 0.82rem;
          font-weight: 400;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.45);
          margin: 0;
        }
        :root.light .nr-cookie-text {
          color: rgba(0, 0, 0, 0.5);
        }

        .nr-cookie-actions {
          display: flex;
          gap: 0.65rem;
          margin-top: 0.25rem;
        }

        .nr-cookie-btn {
          flex: 1;
          padding: 0.7rem 1rem;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          font-family: inherit;
        }

        .nr-cookie-btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .nr-cookie-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.85);
          border-color: rgba(255, 255, 255, 0.14);
        }
        :root.light .nr-cookie-btn-secondary {
          background: rgba(0, 0, 0, 0.04);
          color: rgba(0, 0, 0, 0.55);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        :root.light .nr-cookie-btn-secondary:hover {
          background: rgba(0, 0, 0, 0.07);
          color: rgba(0, 0, 0, 0.8);
        }

        .nr-cookie-btn-primary {
          background: #EB1143;
          color: #ffffff;
          box-shadow: 0 2px 12px rgba(235, 17, 67, 0.3);
        }
        .nr-cookie-btn-primary:hover {
          background: #d40f3c;
          box-shadow: 0 4px 20px rgba(235, 17, 67, 0.45);
          transform: translateY(-1px);
        }

        .nr-cookie-footnote {
          font-size: 0.68rem;
          color: rgba(255, 255, 255, 0.22);
          text-align: center;
          margin: 0;
        }
        :root.light .nr-cookie-footnote {
          color: rgba(0, 0, 0, 0.3);
        }

        @keyframes cookieFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cookieFadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes cookieSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes cookieSlideDown {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to   { opacity: 0; transform: translateY(30px) scale(0.97); }
        }

        @media (max-width: 480px) {
          .nr-cookie-banner { max-width: 100%; border-radius: 14px; }
          .nr-cookie-body { padding: 1.25rem 1.25rem 1rem; gap: 0.85rem; }
          .nr-cookie-actions { flex-direction: column; gap: 0.5rem; }
          .nr-cookie-btn { padding: 0.75rem 1rem; }
        }
      `}</style>
    </div>
  );
};

export default CookieBanner;
