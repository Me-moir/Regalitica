"use client";
import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  type Investor,
  type CapitalPhase,
  CAPITAL_PHASES,
  CAPITAL_STATS,
  INVESTOR_TYPE_COLORS,
} from '@/data/Discover-data';

function springPress(el: Element) {
  el.classList.remove('sc-tab-pressed');
  void (el as HTMLElement).offsetWidth;
  el.classList.add('sc-tab-pressed');
  const cleanup = () => {
    el.classList.remove('sc-tab-pressed');
    el.removeEventListener('animationend', cleanup);
  };
  el.addEventListener('animationend', cleanup);
}

function LogoPlaceholder({ name }: { name: string }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className="sc-logo-placeholder" style={{
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'ui-monospace, Menlo, monospace',
      fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
      fontWeight: 700, letterSpacing: '-0.02em', userSelect: 'none',
    }}>
      {initials}
    </div>
  );
}

function EmailCopyButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const doCopy = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(email).then(doCopy).catch(() => {
        // fallback for mobile / insecure context
        fallbackCopy(email);
        doCopy();
      });
    } else {
      fallbackCopy(email);
      doCopy();
    }
  }, [email]);
  return (
    <span onClick={handleClick} className="sc-email-copy" title="Click to copy">
      <span className={`sc-email-text${copied ? ' sc-email-hidden' : ''}`}>{email}</span>
      <span className={`sc-email-copied${copied ? ' sc-email-copied-visible' : ''}`}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
        Copied to clipboard
      </span>
    </span>
  );
}

function fallbackCopy(text: string) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  ta.style.top = '-9999px';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try { document.execCommand('copy'); } catch { /* noop */ }
  document.body.removeChild(ta);
}

function DisclosureTooltip() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calcPos = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setTooltipPos({
      top: rect.top + window.scrollY - 10,
      left: rect.left + rect.width / 2,
    });
  }, []);

  const openTooltip = useCallback(() => {
    calcPos();
    setVisible(true);
    setActive(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setActive(false);
    }, 5000);
  }, [calcPos]);

  const closeTooltip = useCallback(() => {
    setVisible(false);
    setActive(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) closeTooltip();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [visible, closeTooltip]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    top: tooltipPos.top,
    left: tooltipPos.left,
    transform: visible ? 'translate(-50%, calc(-100% - 10px))' : 'translate(-50%, calc(-100% - 4px))',
  };

  return (
    <span
      ref={ref}
      className="sc-disclosure-wrap"
      onMouseEnter={() => { calcPos(); if (!active) setVisible(true); }}
      onMouseLeave={() => { if (!active) setVisible(false); }}
      onClick={() => { active ? closeTooltip() : openTooltip(); }}
    >
      <span className={`sc-disclosure-badge${active ? ' sc-disclosure-badge-active' : ''}`}>
        <i className="bi bi-info-square sc-disclosure-icon" />
        <span className="sc-disclosure-label">Disclosure Agreement</span>
      </span>
      <span className={`sc-disclosure-tooltip${visible ? ' sc-disclosure-tooltip-visible' : ''}`} style={tooltipStyle}>
        <span className="sc-disclosure-arrow" />
        All investor names, logos, and related information are disclosed with prior written consent and in accordance with governing agreements and applicable confidentiality obligations.
        {' '}Refer to the{' '}
        <a href="#" className="sc-disclosure-link" onClick={e => e.stopPropagation()}>Disclosure</a>
        {' '}section under Information Tab to learn more.
      </span>
    </span>
  );
}

function InvestorModal({ investor, onClose }: { investor: Investor; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const color = '#E31B54';

  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) return null;

  const stats = [
    { val: investor.year,                lab: 'Year'      },
    { val: investor.roundName,           lab: 'Round'     },
    { val: investor.investmentStructure, lab: 'Structure' },
  ];

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', boxSizing: 'border-box',
        background: 'rgba(0,0,0,0.82)',
        backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="sc-modal-outer"
        onMouseMove={e => {
          const el = e.currentTarget;
          const rect = el.getBoundingClientRect();
          el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
          el.style.setProperty('--my', `${e.clientY - rect.top}px`);
        }}
        style={{ position: 'relative', width: '100%', maxWidth: '620px', maxHeight: '88vh', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}
      >
        <div className="sc-modal-gradient-border" />
        <div
          className="sc-modal-panel"
          style={{
            position: 'relative', display: 'flex', flexDirection: 'column',
            width: '100%', flex: 1, minHeight: 0, borderRadius: '16px', overflow: 'hidden',
            background: '#0d0d1a',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)',
          }}
        >
          {/* ── Logo header ── */}
          <div
            className="sc-modal-logo-header"
            style={{
              position: 'relative', flexShrink: 0, height: '160px',
              background: 'linear-gradient(170deg, #0e0e1c 0%, #160c14 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden', display: 'flex', alignItems: 'center',
              justifyContent: 'flex-start', padding: '0 2rem',
            }}
          >
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
              backgroundSize: '22px 22px', opacity: 0.7, pointerEvents: 'none',
            }} />
            <div style={{
              position: 'relative', zIndex: 2,
              width: '88px', height: '88px', borderRadius: '16px',
              border: `1px solid rgba(255,255,255,0.06)`,
              overflow: 'hidden', background: 'transparent', boxShadow: 'none',
            }}>
              {investor.logo
                ? <img src={investor.logo} alt={investor.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }} />
                : <LogoPlaceholder name={investor.name} />}
            </div>
            <div
              className="sc-tab-border"
              style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 4 }}
              onPointerDown={e => springPress(e.currentTarget)}
            >
              <div className="sc-tab-item">
                <button className="sc-tab-btn sc-modal-btn sc-close-btn" onClick={onClose} aria-label="Close">
                  <span className="sc-close-full">Close</span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ marginLeft: '4px', opacity: 0.6 }}>
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ── Body ── */}
          <div
            className="sc-modal-info"
            style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '2.25rem 2.5rem 2rem 2rem', overflowY: 'auto', minWidth: 0 }}
          >
            {/* Eyebrow */}
            <div className="sc-modal-eyebrow">
              <span className="sc-modal-eyebrow-dot" />{investor.phaseLabel}
            </div>

            {/* Name — gradient text scoped to this element only */}
            <h2 className="sc-modal-name">{investor.name}</h2>

            {/* Type — must reset -webkit-text-fill-color inherited from .sc-modal-name */}
            <p className="sc-modal-type" style={{ color }}>{investor.type}</p>

            {/* Structure tag */}
            <span className="sc-modal-role-tag">{investor.investmentStructure}</span>

            {/* Divider */}
            <div className="sc-modal-divider" />

            {/* ── Stat row ── */}
            <div className="sc-modal-stats">
              {stats.map((s, i) => (
                <React.Fragment key={s.lab}>
                  {i > 0 && <div className="sc-modal-stat-sep" />}
                  <div className="sc-modal-stat-cell">
                    <span className="sc-modal-stat-val">{s.val}</span>
                    <span className="sc-modal-stat-lab">{s.lab}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* About */}
            <div className="sc-modal-section">
              <span className="sc-modal-section-label">About</span>
              <p className="sc-modal-bio">{investor.description}</p>
            </div>

            {/* Strategic Impact */}
            <div className="sc-modal-section">
              <span className="sc-modal-section-label">Strategic Impact</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {investor.strategicImpact.map(impact => (
                  <div key={impact} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="sc-modal-impact-diamond" style={{ background: color }} />
                    <span className="sc-modal-impact-text">{impact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="sc-modal-footer">
              <div className="sc-tab-border" onPointerDown={e => springPress(e.currentTarget)}>
                <div className="sc-tab-item">
                  <a
                    href={investor.link && investor.link !== '#' ? investor.link : '#'}
                    target={investor.link && investor.link !== '#' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="sc-tab-btn sc-modal-btn"
                    style={{ textDecoration: 'none' }}
                  >
                    Learn More
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13" style={{ marginLeft: '4px' }}>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

const InvestorCard = memo(({ investor, index, onExpand }: { investor: Investor; index: number; onExpand: (inv: Investor) => void }) => {
  const color = '#E31B54';
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };
  return (
    <div
      className="ic-outer"
      style={{ animationDelay: `${index * 80}ms` }}
      onMouseMove={handleMouseMove}
      onClick={() => onExpand(investor)}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onExpand(investor); }}
    >
      <div className="ic-gradient-border" />
      <div className="ic-inner">
        <div className="ic-logo-wrap" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="ic-logo-inner">
            {investor.logo
              ? <img src={investor.logo} alt={investor.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '14px' }} />
              : <LogoPlaceholder name={investor.name} />}
          </div>
          <span className="ic-phase-badge" style={{ color, borderColor: `${color}35` }}>{investor.year}</span>
        </div>
        <div className="ic-info">
          <h3 className="ic-name">{investor.name}</h3>
          <p className="ic-type" style={{ color }}>{investor.type}</p>
          <span className="ic-structure">{investor.investmentStructure}</span>
        </div>
        <div className="ic-footer">
          <div
            className="sc-tab-border"
            onClick={e => e.stopPropagation()}
            style={{ marginLeft: 'auto' }}
            onPointerDown={e => { e.stopPropagation(); springPress(e.currentTarget); }}
          >
            <div className="sc-tab-item">
              <button className="sc-tab-btn ic-btn" onClick={() => onExpand(investor)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                  <path d="M15 3h6m0 0v6m0-6-7 7M9 21H3m0 0v-6m0 6 7-7" />
                </svg>
                Expand
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
InvestorCard.displayName = 'InvestorCard';

function ComingSoonBlock({ phase }: { phase: CapitalPhase }) {
  return (
    <div className="sc-coming-soon-block">
      <div className="sc-coming-soon-grid-overlay" />
      <span className="sc-coming-soon-label">Not Yet Open</span>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className="sc-coming-soon-dot" />
        <span className="sc-coming-soon-text">
          Coming Soon{phase.comingSoonDate ? ` — ${phase.comingSoonDate}` : ''}
        </span>
      </div>
      <p className="sc-contact-line">
        To learn more, contact us at{' '}<EmailCopyButton email="partners@notus-regalia.com" />
      </p>
    </div>
  );
}

const StrategicCapital = () => {
  const [activeInvestor, setActiveInvestor] = useState<Investor | null>(null);
  const handleExpand = useCallback((inv: Investor) => setActiveInvestor(inv), []);
  const handleClose  = useCallback(() => setActiveInvestor(null), []);

  return (
    <>
      <style>{`
        /* ── Keyframes ── */
        @keyframes sc-orbit {
          0%   { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        @keyframes sc-epulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(227,27,84,.5); }
          50%       { opacity: .7; box-shadow: 0 0 0 5px rgba(227,27,84,0); }
        }
        @keyframes sc-card-in {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sc-phase-in {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes scTabPress {
          0%   { transform: scale(1); }
          15%  { transform: scale(0.96); }
          50%  { transform: scale(1.02); }
          72%  { transform: scale(0.992); }
          88%  { transform: scale(1.004); }
          100% { transform: scale(1); }
        }
        @keyframes sc-modal-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes sc-modal-panel-in {
          from {
            opacity: 0;
            transform: scale(0.94) translateY(16px);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0px);
          }
        }

        /* ── Tab spring press ── */
        .sc-tab-pressed {
          animation: scTabPress 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
          transform-origin: center !important;
        }

        /* ── Tab border / item / btn ── */
        .sc-tab-border {
          display: inline-flex; flex-shrink: 0; border-radius: 10.5px; padding: 1px;
          position: relative; background: transparent; transform-origin: center;
        }
        .sc-tab-border::before {
          content: ''; position: absolute; inset: 0; border-radius: 10.5px;
          background: linear-gradient(90deg,
            rgba(0,255,166,0.0) 0%, rgba(0,255,166,0.9) 15%, rgba(255,215,0,0.7) 30%,
            rgba(236,72,153,0.7) 45%, rgba(147,51,234,0.7) 60%, rgba(59,130,246,0.6) 75%,
            rgba(0,255,166,0.0) 90%);
          background-size: 200% 100%; animation: sc-orbit 3s linear infinite;
          opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
        }
        .sc-tab-border:hover::before { opacity: 1; }
        .sc-tab-item {
          display: inline-flex; align-items: stretch; border-radius: 9.5px; overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 var(--glass-inset-top, rgba(255,255,255,0.06));
          transition: box-shadow 0.2s ease; flex-shrink: 0;
          background: var(--navbar-bg, #0f0f0f); position: relative; z-index: 1;
        }
        .sc-tab-border:hover .sc-tab-item {
          box-shadow: 0 4px 14px rgba(0,0,0,0.26), inset 0 1px 0 var(--glass-inset-top, rgba(255,255,255,0.06));
        }
        .sc-tab-btn {
          display: inline-flex; align-items: center; gap: 6px; border: none; background: transparent; cursor: pointer;
          font-weight: 500; letter-spacing: 0.01em; color: var(--content-faint, rgba(255,255,255,0.4));
          padding: 8px 14px; font-size: 0.88rem; line-height: 1;
          transition: color 0.15s ease; user-select: none; white-space: nowrap;
        }
        .sc-tab-btn:hover { color: var(--content-primary, #f1f5f9); }
        .ic-btn        { padding: 12px 18px !important; font-size: 0.93rem !important; font-weight: 600 !important; }
        .sc-modal-btn  { padding: 12px 20px !important; font-size: 0.93rem !important; font-weight: 600 !important; }

        /* ── Section root ── */
        .sc-root {
          position: relative; background: var(--gradient-section); color: var(--content-primary);
          border-top: 1px dashed var(--border-dashed); border-bottom: 1px dashed var(--border-dashed);
        }
        .sc-root::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: linear-gradient(to bottom, transparent, black 4%, black 96%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 4%, black 96%, transparent);
        }

        /* ── Hero ── */
        .sc-hero {
          display: grid; grid-template-columns: 1fr; gap: 3rem;
          padding: 5rem 2rem 4rem; position: relative; z-index: 1;
        }
        @media(min-width: 640px)  { .sc-hero { padding-left: 4rem; padding-right: 4rem; } }
        @media(min-width: 768px)  { .sc-hero { grid-template-columns: 1fr auto; gap: 4rem; align-items: center; padding: 6rem 6rem 5rem; } }
        @media(min-width: 1024px) { .sc-hero { padding-left: 6rem; padding-right: 6rem; } }
        @media(min-width: 1280px) { .sc-hero { padding-left: 8rem; padding-right: 8rem; } }
        @media(min-width: 1536px) { .sc-hero { padding-left: 12rem; padding-right: 12rem; } }
        @media(min-width: 1920px) { .sc-hero { padding-left: 16rem; padding-right: 16rem; } }
        .sc-hero-left { display: flex; flex-direction: column; }

        .sc-eyebrow {
          display: inline-flex; align-items: center; gap: .5rem; font-size: .65rem;
          font-family: ui-monospace, Menlo, monospace; text-transform: uppercase; letter-spacing: .22em;
          font-weight: 700; color: #E31B54; margin-bottom: 1rem;
        }
        .sc-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #E31B54; flex-shrink: 0;
          animation: sc-epulse 2s ease-in-out infinite;
        }
        .sc-heading {
          font-size: clamp(1.75rem, 4vw, 2.75rem); font-weight: 700; letter-spacing: -.02em; line-height: 1.15;
          background: var(--text-gradient, linear-gradient(135deg, #f1f5f9 0%, rgba(241,245,249,.7) 100%));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          margin-bottom: 1rem;
        }
        .sc-disclosure-row {
          display: flex; align-items: center; margin-bottom: 1rem;
        }
        .sc-sub { font-size: .9rem; line-height: 2; color: var(--content-muted); }
        @media(min-width: 640px) { .sc-sub { font-size: 1.2rem; } }

        /* ── Disclosure badge ── */
        .sc-disclosure-wrap {
          position: relative; display: inline-flex; align-items: center; cursor: pointer; flex-shrink: 0;
        }
        .sc-disclosure-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px 4px 8px; border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .sc-disclosure-wrap:hover .sc-disclosure-badge,
        .sc-disclosure-badge-active {
          background: #C81040 !important; border-color: #E31B54 !important;
          box-shadow: 0 0 18px rgba(227,27,84,0.45), 0 2px 8px rgba(0,0,0,0.4) !important;
        }
        .sc-disclosure-icon {
          font-size: 0.85rem; line-height: 1;
          color: rgba(255,255,255,0.3); -webkit-text-fill-color: rgba(255,255,255,0.3);
          transition: color 0.2s ease, -webkit-text-fill-color 0.2s ease;
        }
        .sc-disclosure-wrap:hover .sc-disclosure-icon,
        .sc-disclosure-badge-active .sc-disclosure-icon {
          color: #fff !important; -webkit-text-fill-color: #fff !important;
        }
        .sc-disclosure-label {
          font-family: ui-monospace, Menlo, monospace; font-size: 9px;
          text-transform: uppercase; letter-spacing: 0.18em; font-weight: 700;
          color: rgba(255,255,255,0.3); -webkit-text-fill-color: rgba(255,255,255,0.3);
          background: none; background-clip: unset; -webkit-background-clip: unset;
          transition: color 0.2s ease, -webkit-text-fill-color 0.2s ease; white-space: nowrap;
        }
        .sc-disclosure-wrap:hover .sc-disclosure-label,
        .sc-disclosure-badge-active .sc-disclosure-label {
          color: #fff !important; -webkit-text-fill-color: #fff !important;
        }

        /* Tooltip */
        .sc-disclosure-tooltip {
          position: fixed; width: 300px; padding: 14px 16px;
          background: linear-gradient(160deg, #050508 0%, #09090f 50%, #0d0509 100%);
          border: 1px solid rgba(227,27,84,0.5); border-radius: 10px;
          font-size: 12px; line-height: 1.7;
          color: rgba(255,255,255,0.65); -webkit-text-fill-color: rgba(255,255,255,0.65);
          background-clip: unset; -webkit-background-clip: unset;
          font-weight: 400; font-family: inherit; letter-spacing: 0;
          box-shadow: 0 20px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(227,27,84,0.1), 0 0 32px rgba(227,27,84,0.1);
          pointer-events: none; opacity: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
          z-index: 99999; text-transform: none; white-space: normal; text-align: justify;
        }
        .sc-disclosure-tooltip-visible { opacity: 1; pointer-events: auto; }
        .sc-disclosure-arrow {
          position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%) rotate(45deg);
          width: 8px; height: 8px; background: #050508;
          border-right: 1px solid rgba(227,27,84,0.5); border-bottom: 1px solid rgba(227,27,84,0.5);
        }
        .sc-disclosure-link {
          color: #E31B54; -webkit-text-fill-color: #E31B54;
          text-decoration: underline; text-underline-offset: 2px;
          text-decoration-color: rgba(227,27,84,0.5); font-weight: 600; cursor: pointer;
          transition: text-decoration-color 0.15s ease, color 0.15s ease;
        }
        .sc-disclosure-link:hover {
          color: #ff3366; -webkit-text-fill-color: #ff3366;
          text-decoration-color: rgba(255,51,102,0.8);
        }

        /* ── Hero stats box ── */
        .sc-stats-box {
          border: 1px dashed var(--border-dashed); display: grid; grid-template-columns: repeat(3, 1fr);
          min-width: 480px; position: relative; align-self: center;
        }
        @media(max-width: 767px) { .sc-stats-box { min-width: 0; width: 100%; } }
        .sc-stats-box::before, .sc-stats-box::after {
          content: ''; position: absolute; left: 0; right: 0; height: 2px;
          background: #E31B54; box-shadow: 0 0 10px rgba(227,27,84,.5);
        }
        .sc-stats-box::before { top: -2px; }
        .sc-stats-box::after  { bottom: -2px; }
        .sc-stat-cell {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 2.5rem 2rem; border-right: 1px dashed var(--border-dashed); gap: .6rem;
        }
        .sc-stat-cell:last-child { border-right: none; }
        .sc-stat-value {
          font-family: ui-monospace, Menlo, monospace; font-size: clamp(1.6rem, 2.5vw, 2.2rem);
          font-weight: 700; line-height: 1; letter-spacing: -.04em; color: var(--content-primary);
        }
        .sc-stat-value.accent { color: #E31B54; }
        .sc-stat-label {
          font-size: .65rem; text-transform: uppercase; letter-spacing: .18em;
          color: rgba(255,255,255,.3); font-family: ui-monospace, Menlo, monospace; text-align: center;
        }

        /* ── Body / phases ── */
        .sc-body { position: relative; z-index: 1; padding: 3rem 2rem 6rem; }
        @media(min-width: 640px)  { .sc-body { padding-left: 4rem; padding-right: 4rem; } }
        @media(min-width: 768px)  { .sc-body { padding: 3rem 6rem 6rem; } }
        @media(min-width: 1024px) { .sc-body { padding-left: 6rem; padding-right: 6rem; } }
        @media(min-width: 1280px) { .sc-body { padding-left: 8rem; padding-right: 8rem; } }
        @media(min-width: 1536px) { .sc-body { padding-left: 12rem; padding-right: 12rem; } }
        @media(min-width: 1920px) { .sc-body { padding-left: 16rem; padding-right: 16rem; } }

        .sc-phase-block { margin-bottom: 4rem; animation: sc-phase-in 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .sc-phase-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 0.75rem; }
        @media(max-width: 767px) { .sc-phase-header { gap: 0.75rem; } }
        .sc-phase-title {
          font-size: clamp(1.1rem, 2.5vw, 1.5rem); font-weight: 300;
          letter-spacing: -0.02em; color: var(--content-primary); white-space: nowrap;
        }
        @media(max-width: 767px) {
          .sc-phase-title { white-space: normal; word-break: break-word; min-width: 0; flex-shrink: 1; }
        }
        .sc-phase-title-accent { color: #E31B54; }
        .sc-phase-live-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #E31B54; flex-shrink: 0;
          animation: sc-epulse 2s ease-in-out infinite;
        }
        .sc-phase-line {
          flex: 1; height: 1px;
          background: linear-gradient(to right, rgba(227,27,84,0.3), rgba(255,255,255,0.06) 40%, transparent);
        }
        .sc-phase-coming-tag {
          font-family: ui-monospace, Menlo, monospace; font-size: 9px; text-transform: uppercase;
          letter-spacing: 0.18em; color: rgba(255,255,255,0.4); white-space: nowrap;
          border: 1px solid rgba(255,255,255,0.15); padding: 4px 10px; border-radius: 3px;
        }
        .sc-phase-desc { font-size: .9rem; line-height: 2; color: var(--content-muted); margin-bottom: 2rem; max-width: 100%; }

        /* ── Investor card grid ── */
        .ic-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.75rem; }
        @media(max-width: 1023px) { .ic-grid { grid-template-columns: repeat(3, 1fr); } }
        @media(max-width: 767px)  { .ic-grid { grid-template-columns: repeat(2, 1fr); gap: 1.25rem; } }

        .ic-outer {
          position: relative; border-radius: .75rem;
          border: 1px solid var(--border-color, rgba(255,255,255,.08));
          padding: 1px; animation: sc-card-in .5s cubic-bezier(.22,1,.36,1) both;
          transition: transform .3s ease, box-shadow .3s ease; overflow: hidden; cursor: pointer;
        }
        .ic-outer:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,.5); }
        .ic-gradient-border {
          position: absolute; inset: 0; border-radius: .75rem; padding: 1px;
          opacity: 0; transition: opacity .4s ease; pointer-events: none; z-index: 1;
          background: radial-gradient(400px circle at var(--mx,50%) var(--my,50%),
            rgba(0,255,166,.8), rgba(255,215,0,.6), rgba(236,72,153,.6),
            rgba(147,51,234,.6), rgba(59,130,246,.5), transparent 70%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
        }
        .ic-outer:hover .ic-gradient-border { opacity: 1; }
        .ic-inner {
          position: relative; z-index: 2; display: flex; flex-direction: column;
          border-radius: calc(.75rem - 1px); overflow: hidden;
          background: var(--gradient-card, #0f0f1a);
          border: .75px solid var(--border-subtle, rgba(255,255,255,.05)); height: 100%;
        }
        .ic-logo-wrap {
          position: relative; width: 100%; padding-bottom: 100%;
          background: linear-gradient(170deg, #0e0e1c 0%, #160c14 100%); overflow: hidden; flex-shrink: 0;
        }
        .ic-logo-inner { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
        .ic-phase-badge {
          position: absolute; top: .75rem; left: .75rem; z-index: 3;
          font-family: ui-monospace, Menlo, monospace; font-size: .5rem; letter-spacing: .16em; text-transform: uppercase;
          color: rgba(255,255,255,1); background: rgba(0,0,0,0.72); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.22); padding: 4px 9px; border-radius: 4px;
        }
        :root.light .ic-phase-badge { color: #0f172a; background: rgba(255,255,255,0.92); border: 1px solid rgba(0,0,0,0.15); }
        .ic-info { padding: 1.75rem 1.5rem 1.25rem; display: flex; flex-direction: column; gap: .65rem; border-top: 1px solid rgba(255,255,255,.05); }
        .ic-name { font-size: 1.2rem; font-weight: 700; color: var(--content-primary); letter-spacing: -.02em; line-height: 1.2; margin: 0; transition: transform .3s; }
        .ic-outer:hover .ic-name { transform: translateY(-1px); }
        .ic-type { font-size: .75rem; font-weight: 700; font-family: ui-monospace, Menlo, monospace; text-transform: uppercase; letter-spacing: .12em; margin: 0; transition: transform .3s; }
        .ic-outer:hover .ic-type { transform: translateY(-1px); }
        .ic-structure { font-size: .7rem; font-family: ui-monospace, Menlo, monospace; text-transform: uppercase; letter-spacing: .1em; color: rgba(255,255,255,.22); transition: transform .3s; }
        .ic-outer:hover .ic-structure { transform: translateY(-1px); }
        .ic-footer { display: flex; align-items: center; gap: .75rem; padding: 1rem 1.25rem 1.25rem; border-top: 1px solid rgba(255,255,255,.04); margin-top: auto; transition: border-color .3s; }
        .ic-outer:hover .ic-footer { border-color: rgba(255,255,255,.08); }

        /* ── Mobile investor cards: match founder card sizes ── */
        @media(max-width:767px){
          .ic-info{padding:1rem 0.85rem 0.75rem;gap:.4rem;}
          .ic-name{font-size:0.9rem;}
          .ic-type{font-size:.6rem;letter-spacing:.08em;}
          .ic-structure{font-size:.55rem;}
          .ic-phase-badge{font-size:.42rem;padding:3px 6px;top:.5rem;left:.5rem;}
          .ic-footer{padding:0.6rem 0.75rem 0.75rem;gap:.5rem;}
          .ic-btn{padding:8px 10px !important;font-size:0.75rem !important;}
        }

        /* ── Modal shell ── */
        .sc-modal-overlay {
          animation: sc-modal-overlay-in 0.2s ease both;
        }
        .sc-modal-outer {
          position: relative; width: 100%; max-width: 620px; max-height: 88vh; border-radius: 16px;
          display: flex; flex-direction: column;
          transform-origin: center bottom;
          animation: sc-modal-panel-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .sc-modal-gradient-border {
          position: absolute; inset: 0; border-radius: 16px; padding: 1px;
          opacity: 0; transition: opacity .4s ease; pointer-events: none; z-index: 10;
          background: radial-gradient(600px circle at var(--mx,50%) var(--my,50%),
            rgba(0,255,166,.7), rgba(255,215,0,.5), rgba(236,72,153,.5),
            rgba(147,51,234,.5), rgba(59,130,246,.4), transparent 65%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
        }
        .sc-modal-outer:hover .sc-modal-gradient-border { opacity: 1; }

        /* ── Modal eyebrow ── */
        .sc-modal-eyebrow {
          display: flex; align-items: center; gap: 8px;
          font-family: ui-monospace, Menlo, monospace; font-size: 10px;
          letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700;
          color: rgba(255,255,255,0.30);
          -webkit-text-fill-color: rgba(255,255,255,0.30);
          background: none; background-clip: unset; -webkit-background-clip: unset;
          margin-bottom: 16px;
        }
        .sc-modal-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #E31B54; flex-shrink: 0;
        }

        /* ── Modal name (gradient-clip scoped to this element only) ── */
        .sc-modal-name {
          font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 700;
          letter-spacing: -0.03em; line-height: 1.1;
          background: linear-gradient(135deg, #f1f5f9 0%, rgba(241,245,249,0.6) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        /* ── Modal type ── reset fill so the inline color prop is visible ── */
        .sc-modal-type {
          font-family: ui-monospace, Menlo, monospace; font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.14em; margin: 10px 0 0;
          -webkit-text-fill-color: unset;
          background: none; background-clip: unset; -webkit-background-clip: unset;
        }

        .sc-modal-role-tag {
          display: inline-block; margin-top: 14px;
          font-family: ui-monospace, Menlo, monospace; font-size: 10px;
          text-transform: uppercase; letter-spacing: 0.12em;
          color: rgba(255,255,255,0.30);
          -webkit-text-fill-color: rgba(255,255,255,0.30);
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
          padding: 4px 12px; border-radius: 4px; align-self: flex-start;
        }

        .sc-modal-divider {
          width: 100%; height: 1px; margin: 24px 0;
          background: linear-gradient(90deg, rgba(227,27,84,0.3), rgba(255,255,255,0.06) 50%, transparent);
        }

        .sc-modal-stats {
          display: flex; align-items: stretch; flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.07); border-radius: 10px;
          overflow: hidden; margin-bottom: 24px; background: rgba(255,255,255,0.02);
          height: 80px;
        }
        .sc-modal-stat-sep {
          width: 1px; flex-shrink: 0; background: rgba(255,255,255,0.07);
        }
        .sc-modal-stat-cell {
          flex: 1 1 0; min-width: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 0 10px;
          gap: 5px;
        }
        .sc-modal-stat-val {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 12px; font-weight: 700; letter-spacing: -0.01em;
          text-align: center; line-height: 1.3;
          white-space: normal; overflow-wrap: break-word; word-break: break-word;
          width: 100%;
          color: #f1f5f9; -webkit-text-fill-color: #f1f5f9;
          background: none; background-clip: unset; -webkit-background-clip: unset;
        }
        .sc-modal-stat-lab {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 9px; text-transform: uppercase; letter-spacing: 0.16em;
          text-align: center; white-space: nowrap;
          color: rgba(255,255,255,0.25); -webkit-text-fill-color: rgba(255,255,255,0.25);
          background: none; background-clip: unset; -webkit-background-clip: unset;
        }

        /* ── Modal sections ── */
        .sc-modal-section { margin-bottom: 24px; }
        .sc-modal-section-label {
          display: block; font-family: ui-monospace, Menlo, monospace; font-size: 9px;
          text-transform: uppercase; letter-spacing: 0.22em;
          color: rgba(255,255,255,0.25);
          -webkit-text-fill-color: rgba(255,255,255,0.25);
          background: none; background-clip: unset; -webkit-background-clip: unset;
          margin-bottom: 10px;
        }
        .sc-modal-bio {
          font-size: 14px; line-height: 1.85;
          color: rgba(255,255,255,0.55);
          -webkit-text-fill-color: rgba(255,255,255,0.55);
          background: none; background-clip: unset; -webkit-background-clip: unset;
          margin: 0;
        }
        .sc-modal-impact-diamond {
          width: 6px; height: 6px; border-radius: 1px; flex-shrink: 0; transform: rotate(45deg);
        }
        .sc-modal-impact-text {
          font-size: 13px; line-height: 1.4;
          color: rgba(255,255,255,0.5);
          -webkit-text-fill-color: rgba(255,255,255,0.5);
          background: none; background-clip: unset; -webkit-background-clip: unset;
        }
        .sc-modal-footer {
          display: flex; align-items: center; padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.07); margin-top: auto;
        }

        /* ── Coming soon ── */
        .sc-coming-soon-block {
          display: flex; flex-direction: column; align-items: flex-start; gap: 0.75rem;
          padding: 2.5rem 2rem;
          border: 1px dashed var(--border-dashed, rgba(255,255,255,0.1));
          border-radius: 12px; background: rgba(255,255,255,0.01);
          position: relative; overflow: hidden;
        }
        .sc-coming-soon-grid-overlay {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px);
          background-size: 24px 24px; opacity: 0.5;
        }
        .sc-coming-soon-label {
          position: relative; z-index: 1;
          font-family: ui-monospace, Menlo, monospace; font-size: 9px;
          text-transform: uppercase; letter-spacing: 0.22em; font-weight: 700;
          color: rgba(255,255,255,0.35);
        }
        .sc-coming-soon-dot {
          width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.25);
          animation: sc-epulse 3s ease-in-out infinite; flex-shrink: 0;
        }
        .sc-coming-soon-text {
          font-family: ui-monospace, Menlo, monospace; font-size: 10px;
          letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.35);
        }
        .sc-contact-line {
          position: relative; z-index: 1; font-size: 13px; margin: 0; line-height: 1.6;
          color: rgba(255,255,255,0.25);
        }

        /* ── Email copy ── */
        .sc-email-copy { position: relative; display: inline-flex; align-items: center; color: #E31B54; cursor: pointer; opacity: 0.85; }
        .sc-email-text {
          display: inline-block; background-image: linear-gradient(#E31B54, #E31B54);
          background-size: 0% 1px; background-repeat: no-repeat; background-position: left bottom;
          transition: background-size 0.3s ease, opacity 0.15s ease; white-space: nowrap;
        }
        .sc-email-copy:hover .sc-email-text { background-size: 100% 1px; }
        .sc-email-text.sc-email-hidden { opacity: 0; pointer-events: none; }
        .sc-email-copied {
          position: absolute; left: 0; top: 50%; transform: translateY(-50%);
          display: inline-flex; align-items: center; color: #10b981; font-size: 12px; font-weight: 600;
          opacity: 0; transition: opacity 0.15s ease; white-space: nowrap; pointer-events: none;
        }
        .sc-email-copied.sc-email-copied-visible { opacity: 1; }

        /* ════════ LIGHT MODE ════════ */
        :root.light .sc-root::before { display: none; }
        :root.light .sc-stat-label   { color: rgba(0,0,0,.3); }
        :root.light .sc-stat-value   { color: #0f172a; }
        :root.light .sc-phase-title  { color: #0f172a; }
        :root.light .sc-phase-desc   { color: #64748b; }
        :root.light .sc-phase-coming-tag { color: rgba(0,0,0,.5); border-color: rgba(0,0,0,.2); }
        :root.light .sc-phase-line   { background: linear-gradient(to right, rgba(227,27,84,0.3), rgba(0,0,0,0.06) 40%, transparent); }
        :root.light .ic-outer  { border: 1.5px solid rgba(0,0,0,.14); }
        :root.light .ic-outer:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(0,0,0,.10); }
        :root.light .ic-inner  { background: #ffffff; border: none; }
        :root.light .ic-name   { color: #0f172a; }
        :root.light .ic-structure { color: rgba(0,0,0,.4); }
        :root.light .ic-logo-wrap { background: linear-gradient(170deg, #e2e8f0 0%, #cbd5e1 100%); }
        .sc-logo-placeholder {
          background: linear-gradient(135deg, #080808 0%, #050505 100%);
          color: rgba(180,195,220,0.5);
        }
        :root.light .sc-logo-placeholder {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%) !important;
          color: rgba(15,23,42,0.4) !important;
        }
        :root.light .ic-info   { border-top: 1px solid rgba(0,0,0,.07); }
        :root.light .ic-footer { border-top: 1px solid rgba(0,0,0,.07); }
        :root.light .ic-outer:hover .ic-footer { border-color: rgba(0,0,0,.1); }
        :root.light .sc-tab-item {
          background: #ffffff;
          box-shadow: 0 2px 6px rgba(0,0,0,.10), 0 4px 16px rgba(0,0,0,.07), inset 0 1px 0 rgba(255,255,255,1);
          outline: 1px solid rgba(0,0,0,.11);
        }
        :root.light .sc-tab-border:hover .sc-tab-item {
          box-shadow: 0 4px 12px rgba(0,0,0,.14), 0 8px 24px rgba(0,0,0,.09), inset 0 1px 0 rgba(255,255,255,1);
          outline: 1px solid rgba(0,0,0,.15);
        }
        :root.light .sc-tab-btn       { color: rgba(0,0,0,.45); }
        :root.light .sc-tab-btn:hover { color: rgba(0,0,0,.9); }
        :root.light .sc-coming-soon-block  { border-color: rgba(0,0,0,0.15) !important; background: rgba(0,0,0,0.02) !important; }
        :root.light .sc-coming-soon-label  { color: rgba(0,0,0,.5) !important; }
        :root.light .sc-coming-soon-dot    { background: rgba(0,0,0,.3) !important; }
        :root.light .sc-coming-soon-text   { color: rgba(0,0,0,.45) !important; }
        :root.light .sc-contact-line       { color: rgba(0,0,0,.45) !important; }

        /* light — disclosure */
        :root.light .sc-disclosure-badge { border-color: rgba(0,0,0,0.12) !important; background: rgba(0,0,0,0.04) !important; }
        :root.light .sc-disclosure-wrap:hover .sc-disclosure-badge,
        :root.light .sc-disclosure-badge-active { background: #C81040 !important; border-color: #E31B54 !important; box-shadow: 0 0 18px rgba(227,27,84,0.1), 0 2px 8px rgba(0,0,0,0.4) !important; }
        :root.light .sc-disclosure-icon  { color: rgba(0,0,0,0.3) !important; -webkit-text-fill-color: rgba(0,0,0,0.3) !important; }
        :root.light .sc-disclosure-wrap:hover .sc-disclosure-icon,
        :root.light .sc-disclosure-badge-active .sc-disclosure-icon { color: #fff !important; -webkit-text-fill-color: #fff !important; }
        :root.light .sc-disclosure-label { color: rgba(0,0,0,0.35) !important; -webkit-text-fill-color: rgba(0,0,0,0.35) !important; }
        :root.light .sc-disclosure-wrap:hover .sc-disclosure-label,
        :root.light .sc-disclosure-badge-active .sc-disclosure-label { color: #fff !important; -webkit-text-fill-color: #fff !important; }
        :root.light .sc-disclosure-tooltip { background: linear-gradient(160deg,#050508 0%,#09090f 50%,#0d0509 100%) !important; border: 1px solid rgba(227,27,84,0.5) !important; color: rgba(255,255,255,0.65) !important; -webkit-text-fill-color: rgba(255,255,255,0.65) !important; }
        :root.light .sc-disclosure-arrow { background: #050508 !important; border-color: rgba(227,27,84,0.5) !important; }
        
        /* light — modal */
        :root.light .sc-modal-panel   { background: #f8fafc !important; border: 1px solid rgba(0,0,0,.12) !important; box-shadow: 0 24px 60px rgba(0,0,0,.14), 0 0 0 1px rgba(0,0,0,.06) !important; }
        :root.light .sc-modal-logo-header { background: linear-gradient(170deg,#e8edf5 0%,#dce3ef 100%) !important; border-bottom: 1px solid rgba(0,0,0,.08) !important; }
        :root.light .sc-modal-eyebrow { color: rgba(0,0,0,.35) !important; -webkit-text-fill-color: rgba(0,0,0,.35) !important; }
        :root.light .sc-modal-name    { background: linear-gradient(135deg,#0f172a 0%,rgba(15,23,42,.65) 100%) !important; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; background-clip: text !important; }
        :root.light .sc-modal-divider { background: linear-gradient(90deg,rgba(227,27,84,.3),rgba(0,0,0,.08) 50%,transparent) !important; }
        :root.light .sc-modal-section-label { color: rgba(0,0,0,.3) !important; -webkit-text-fill-color: rgba(0,0,0,.3) !important; }
        :root.light .sc-modal-bio     { color: rgba(0,0,0,.6) !important; -webkit-text-fill-color: rgba(0,0,0,.6) !important; }
        :root.light .sc-modal-stats   { border: 1px solid rgba(0,0,0,.12) !important; background: rgba(0,0,0,.04) !important; }
        :root.light .sc-modal-stat-sep { background: rgba(0,0,0,.1) !important; }
        :root.light .sc-modal-stat-val { color: #0f172a !important; -webkit-text-fill-color: #0f172a !important; }
        :root.light .sc-modal-stat-lab { color: rgba(0,0,0,.4) !important; -webkit-text-fill-color: rgba(0,0,0,.4) !important; }
        :root.light .sc-modal-footer  { border-top: 1px solid rgba(0,0,0,.08) !important; }
        :root.light .sc-modal-role-tag { color: rgba(0,0,0,.45) !important; -webkit-text-fill-color: rgba(0,0,0,.45) !important; background: rgba(0,0,0,.04) !important; border: 1px solid rgba(0,0,0,.1) !important; }
        :root.light .sc-modal-impact-text { color: rgba(0,0,0,.65) !important; -webkit-text-fill-color: rgba(0,0,0,.65) !important; }

        /* ── Mobile close button: x only ── */
        @media(max-width:767px){
          .sc-close-full{display:none;}
          .sc-close-btn svg{margin-left:0 !important;}
          .sc-modal-outer{max-width:100% !important;margin:0 8px;}
          .sc-modal-btn{padding:10px 14px !important;font-size:0.82rem !important;}
        }
        @media(min-width:768px){
          .sc-close-full{display:inline;}
        }
      `}</style>

      <div style={{ paddingBottom: '8rem' }}>
        <section id="section-strategic-capital" className="sc-root">
          <div className="sc-hero">
            <div className="sc-hero-left">
              <div className="sc-eyebrow">
                <span className="sc-eyebrow-dot" />Capital Structure
              </div>
              <h2 className="sc-heading">
                Strategic Capital
              </h2>
              <div className="sc-disclosure-row">
                <DisclosureTooltip />
              </div>
              <p className="sc-sub">
                Capital aligned with conviction — each phase structured to advance
                the Notus continuum through a specific lens of formation, deployment, and scale.
              </p>
            </div>
            <div className="sc-stats-box">
              {CAPITAL_STATS.map((s, i) => (
                <div key={i} className="sc-stat-cell">
                  <span className={`sc-stat-value${s.accent ? ' accent' : ''}`}>{s.value}</span>
                  <span className="sc-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sc-body">
            {CAPITAL_PHASES.map((phase, pi) => (
              <div key={phase.id} className="sc-phase-block" style={{ animationDelay: `${pi * 120}ms` }}>
                <div className="sc-phase-header">
                  {phase.live && <span className="sc-phase-live-dot" />}
                  <h3 className="sc-phase-title">
                    {phase.title.split('—').map((part, i) =>
                      i === 0
                        ? <React.Fragment key={i}><span className="sc-phase-title-accent">{part.trim()}</span>{' — '}</React.Fragment>
                        : <React.Fragment key={i}>{part.trim()}</React.Fragment>
                    )}
                  </h3>
                  <div className="sc-phase-line" />
                  {!phase.live && <span className="sc-phase-coming-tag">Coming Soon</span>}
                </div>
                <p className="sc-phase-desc">{phase.description}</p>
                {phase.live && phase.investors.length > 0 ? (
                  <div className="ic-grid">
                    {phase.investors.map((inv, i) => (
                      <InvestorCard key={inv.id} investor={inv} index={i} onExpand={handleExpand} />
                    ))}
                  </div>
                ) : !phase.live ? (
                  <ComingSoonBlock phase={phase} />
                ) : null}
              </div>
            ))}
          </div>
        </section>
      </div>

      {activeInvestor && <InvestorModal investor={activeInvestor} onClose={handleClose} />}
    </>
  );
};

export default memo(StrategicCapital);