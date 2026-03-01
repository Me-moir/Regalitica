"use client";
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

interface MicropageLayoutProps {
  title: string;
  subtitle: string;
  eyebrow: string;
  children: React.ReactNode;
  parentTab?: string;
  parentSubtab?: string;
}

export default function MicropageLayout({
  title,
  subtitle,
  eyebrow,
  children,
  parentTab,
  parentSubtab,
}: MicropageLayoutProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const root = document.documentElement;
    setTheme(root.classList.contains('light') ? 'light' : 'dark');
    const obs = new MutationObserver(() => {
      setTheme(root.classList.contains('light') ? 'light' : 'dark');
    });
    obs.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    root.classList.toggle('light');
    root.classList.toggle('dark');
  }, []);

  const goBack = useCallback(() => {
    const url = new URL(window.location.origin);
    if (parentTab) url.searchParams.set('tab', parentTab);
    window.location.href = url.toString();
  }, [parentTab]);

  return (
    <>
      <style>{`
        @keyframes mpEyepulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(227,27,84,.5); }
          50%       { opacity: .7; box-shadow: 0 0 0 5px rgba(227,27,84,0); }
        }
        @keyframes mpFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mpOrbit {
          0%   { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        .mp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 60;
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          transition: background 0.3s ease;
        }
        :root.dark .mp-nav,
        :root .mp-nav {
          background: linear-gradient(160deg, #0a0a0f 0%, #0d0d14 60%, #080810 100%);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 12px 48px rgba(0,0,0,0.4);
        }
        :root.light .mp-nav {
          background: linear-gradient(to bottom, #f8fafc 0%, #eef2f6 60%);
          border-bottom: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
        }
        .mp-logo-btn {
          display: flex; align-items: center; gap: 12px;
          border: none; background: transparent; padding: 0; cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.34,1.18,0.64,1);
        }
        .mp-logo-btn:hover { transform: scale(1.05); }
        .mp-logo-icon {
          width: 38px; height: 38px; border-radius: 8px;
          background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 60%, #111 100%);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          box-shadow: 0 0 14px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08);
          overflow: hidden;
        }
        .mp-back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: ui-monospace, Menlo, monospace;
          font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase;
          border: 1px solid var(--border-color); border-radius: 6px;
          padding: 6px 12px; cursor: pointer; transition: all 0.2s ease;
          background: var(--surface-secondary); color: var(--content-faint);
        }
        .mp-back-btn:hover {
          background: var(--hover-bg-strong);
          color: var(--content-primary);
          border-color: rgba(227,27,84,0.3);
        }
        .mp-theme-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 8px;
          border: 1px solid var(--border-color); background: var(--surface-secondary);
          color: var(--content-faint); cursor: pointer; transition: all 0.2s ease;
          font-size: 0.85rem;
        }
        .mp-theme-btn:hover {
          color: var(--content-primary);
          border-color: rgba(227,27,84,0.3);
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: 'var(--surface-primary)', color: 'var(--content-primary)' }}>
        {/* Navbar */}
        <nav className="mp-nav">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', maxWidth: 1400, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <button className="mp-logo-btn" onClick={goBack} title="Back to Notus Regalia">
                <div className="mp-logo-icon">
                  <Image src="/assets/notus-regalia-logo.svg" alt="Logo" width={24} height={24} />
                </div>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--content-primary)', lineHeight: 1 }}>
                  Notus Regalia
                </span>
              </button>

              <span style={{ width: 1, height: 20, background: 'var(--border-color)', flexShrink: 0 }} />

              <span style={{
                fontFamily: 'ui-monospace, Menlo, monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#E31B54',
                fontWeight: 700,
              }}>
                {eyebrow}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button className="mp-theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
                <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'}`} />
              </button>
              <button className="mp-back-btn" onClick={goBack}>
                <i className="bi bi-arrow-left" style={{ fontSize: '0.7rem' }} />
                Back
              </button>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <div style={{ paddingTop: '120px', textAlign: 'center', paddingBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            fontFamily: 'ui-monospace, Menlo, monospace',
            fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase',
            fontWeight: 700, color: '#E31B54', marginBottom: '1.25rem',
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%', background: '#E31B54',
              animation: 'mpEyepulse 2s ease-in-out infinite',
            }} />
            {eyebrow}
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700,
            letterSpacing: '-0.03em', lineHeight: 1.1,
            background: 'var(--text-gradient)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', marginBottom: '1rem',
          }}>
            {title}
          </h1>

          <p style={{
            fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--content-muted)',
            maxWidth: 600, margin: '0 auto 2rem',
          }}>
            {subtitle}
          </p>

          <div style={{
            width: 48, height: 2, background: '#E31B54', borderRadius: 999,
            boxShadow: '0 0 8px rgba(227,27,84,0.5)', margin: '0 auto',
          }} />
        </div>

        {/* Content */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 6rem', animation: 'mpFadeIn 0.6s ease 0.2s both' }}>
          {children}
        </div>

        {/* Footer */}
        <footer style={{
          borderTop: '1px dashed var(--border-dashed)',
          padding: '2rem 24px', textAlign: 'center',
        }}>
          <span style={{
            fontFamily: 'ui-monospace, Menlo, monospace',
            fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'var(--content-faint)',
          }}>
            © Notus Regalia — All Rights Reserved
          </span>
        </footer>
      </div>
    </>
  );
}
