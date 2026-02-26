"use client";
import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { FOUNDERS, DYNASTY_STATS, type Founder } from '@/data/Discover-data';

const LINKEDIN_PATH = 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z';

/* ─────────────────────────────────────────
   MODAL — portaled to document.body
───────────────────────────────────────── */
function FounderModal({ founder, onClose }: { founder: Founder; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) return null;

  const modalStats = [
    { val: founder.since, lab: 'Member Since', accent: false },
    { val: '#1',          lab: 'Founding Rank', accent: true  },
    { val: 'Active',      lab: 'Status',        accent: false },
  ];

  return createPortal(
    <div
      onClick={onClose}
      className="fc-modal-overlay"
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', boxSizing: 'border-box',
        background: 'rgba(0,0,0,0.82)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      {/* Panel */}
      <div
        onClick={e => e.stopPropagation()}
        className="fc-modal-outer"
        onMouseMove={e => {
          const el = e.currentTarget;
          const rect = el.getBoundingClientRect();
          el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
          el.style.setProperty('--my', `${e.clientY - rect.top}px`);
        }}
        style={{
          position: 'relative', width: '100%', maxWidth: '820px', maxHeight: '88vh',
          borderRadius: '16px',
          display: 'flex', flexDirection: 'column', /* cap height so children can scroll */
        }}
      >
        <div className="fc-modal-gradient-border" />
        <div
          className="fc-modal-panel"
          style={{
            position: 'relative', display: 'flex', flexDirection: 'row',
            width: '100%', flex: 1, minHeight: 0, /* minHeight:0 lets flex child shrink & scroll */
            borderRadius: '16px', overflow: 'hidden',
            background: '#0d0d1a',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(227,27,84,0.12)',
          }}
        >
        {/* Close — top right */}
        <div className="teams-tab-border" style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 10 }}>
          <div className="teams-tab-item">
            <button className="teams-tab-btn modal-btn" onClick={onClose} aria-label="Close profile">
              Close Profile
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ marginLeft: '4px', opacity: 0.6 }}>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Portrait column — no minHeight, fills panel height naturally */}
        <div style={{
          position: 'relative', flexShrink: 0, width: '280px',
          overflow: 'hidden',
          background: 'linear-gradient(170deg, #0e0e1c 0%, #160c14 100%)',
        }}>
          {founder.src ? (
            <Image src={founder.src} alt={founder.name} fill style={{ objectFit: 'cover', objectPosition: 'center top' }} sizes="280px" />
          ) : (
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(227,27,84,0.15) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
          )}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', background: 'linear-gradient(to top, #0d0d1a 20%, transparent)', pointerEvents: 'none', zIndex: 1 }} />
          <span className="fc-modal-chip" style={{
            position: 'absolute', top: '14px', left: '14px', zIndex: 3,
            fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '10px',
            letterSpacing: '0.16em', textTransform: 'uppercase' as const,
            color: 'rgba(255,255,255,0.7)', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)', padding: '5px 11px', borderRadius: '4px',
          }}>{founder.codename}</span>
        </div>

        {/* Info column — minHeight:0 allows overflowY:auto to activate when content exceeds height */}
        <div className="fc-modal-info" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '2.25rem 2.5rem 2rem 2rem', borderLeft: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto', minWidth: 0 }}>
          <div className="fc-modal-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, fontWeight: 700, color: 'rgba(255,255,255,0.30)', marginBottom: '16px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#E31B54', flexShrink: 0 }} />
            Founding Member · Since {founder.since}
          </div>
          <h2 className="fc-modal-name" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, background: 'linear-gradient(135deg, #f1f5f9 0%, rgba(241,245,249,0.6) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0 }}>{founder.name}</h2>
          <p style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '11px', color: '#E31B54', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.14em', margin: '10px 0 0' }}>{founder.title}</p>
          <span className="fc-modal-role-tag" style={{ display: 'inline-block', marginTop: '14px', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '10px', textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.30)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', padding: '4px 12px', borderRadius: '4px', alignSelf: 'flex-start' }}>{founder.role}</span>
          <div className="fc-modal-divider" style={{ width: '100%', height: '1px', margin: '24px 0', background: 'linear-gradient(90deg, rgba(227,27,84,0.3), rgba(255,255,255,0.06) 50%, transparent)' }} />
          <div style={{ marginBottom: '24px' }}>
            <span className="fc-modal-about-label" style={{ display: 'block', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '9px', textTransform: 'uppercase' as const, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.25)', marginBottom: '10px' }}>About</span>
            <p className="fc-modal-bio" style={{ fontSize: '14px', lineHeight: 1.85, color: 'rgba(255,255,255,0.55)', margin: 0 }}>{founder.bio}</p>
          </div>
          <div className="fc-modal-stats" style={{ display: 'flex', alignItems: 'stretch', flexShrink: 0, height: '80px', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', overflow: 'hidden', marginBottom: '24px', background: 'rgba(255,255,255,0.02)' }}>
            {modalStats.map((s, i) => (
              <React.Fragment key={s.lab}>
                {i > 0 && <div className="fc-modal-stat-sep" style={{ width: '1px', background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />}
                <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 10px', gap: '6px' }}>
                  <span className={`fc-modal-stat-val${s.accent ? ' fc-modal-stat-accent' : ''}`} style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '13px', fontWeight: 700, letterSpacing: '-0.02em', textAlign: 'center', whiteSpace: 'normal', overflowWrap: 'break-word', wordBreak: 'break-word', width: '100%', lineHeight: 1.3 }}>{s.val}</span>
                  <span className="fc-modal-stat-lab" style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '9px', textTransform: 'uppercase' as const, letterSpacing: '0.16em', textAlign: 'center' as const, whiteSpace: 'nowrap' }}>{s.lab}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="fc-modal-footer" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 'auto' }}>
            <div className="teams-tab-border">
              <div className="teams-tab-item">
                <a href={founder.linkedin} onClick={e => e.stopPropagation()} className="teams-tab-btn modal-btn" style={{ textDecoration: 'none' }}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d={LINKEDIN_PATH} /></svg>
                  LinkedIn
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

/* ─────────────────────────────────────────
   FOUNDER CARD
───────────────────────────────────────── */
const FounderCard = memo(({ founder, index, onExpand }: { founder: Founder; index: number; onExpand: (f: Founder) => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <div ref={ref} className="fc-outer" style={{ animationDelay: `${index * 80}ms` }} onMouseMove={handleMouseMove} onClick={() => {
      if (ref.current) ref.current.classList.add('fc-expanding');
      onExpand(founder);
    }} tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onExpand(founder); }}>
      <div className="fc-gradient-border" />
      <div className="fc-inner">
        <div className="fc-portrait">
          {founder.src ? (
            <Image src={founder.src} alt={founder.name} fill className="fc-portrait-img" style={{ objectFit: 'cover', objectPosition: 'center top' }} sizes="(max-width: 767px) 50vw, 25vw" />
          ) : (
            <div className="fc-dot-grid" />
          )}
          <div className="fc-bottom-fade" />
          <span className="fc-id">{founder.codename}</span>
        </div>
        <div className="fc-info">
          <h3 className="fc-name">{founder.name}</h3>
          <p className="fc-title">{founder.title}</p>
          <span className="fc-role">{founder.role}</span>
        </div>
        <div className="fc-footer">
          <div className="teams-tab-border" onClick={e => e.stopPropagation()}>
            <div className="teams-tab-item">
              <a href={founder.linkedin} aria-label="LinkedIn" className="teams-tab-btn fc-btn" style={{ textDecoration: 'none' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d={LINKEDIN_PATH} /></svg>
              </a>
            </div>
          </div>
          <div className="teams-tab-border" onClick={e => e.stopPropagation()} style={{ marginLeft: 'auto' }}>
            <div className="teams-tab-item">
              <button className="teams-tab-btn fc-btn" onClick={() => onExpand(founder)}>
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
FounderCard.displayName = 'FounderCard';

/* ─────────────────────────────────────────
   TEAMS SECTION
───────────────────────────────────────── */
const TheOrganization = () => {
  const [activeFounder, setActiveFounder] = useState<Founder | null>(null);
  const handleExpand = useCallback((f: Founder) => {
    setActiveFounder(f);
  }, []);

  const handleClose = useCallback(() => {
    setActiveFounder(null);
    document.querySelectorAll('.fc-outer.fc-expanding').forEach(el => {
      el.classList.remove('fc-expanding');
    });
  }, []);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = (e.target as Element).closest('.teams-tab-border, .teams-tab-item');
      if (!target) return;
      const wrapper = (e.target as Element).closest('.teams-tab-border') ?? target;
      wrapper.classList.remove('teams-tab-pressed');
      void (wrapper as HTMLElement).offsetWidth;
      wrapper.classList.add('teams-tab-pressed');
      const cleanup = () => {
        wrapper.classList.remove('teams-tab-pressed');
        wrapper.removeEventListener('animationend', cleanup);
      };
      wrapper.addEventListener('animationend', cleanup);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  return (
    <>
      <style>{`

        .fc-outer.fc-expanding {
          transform: none !important;
          transition: none !important;
        }
        .fc-outer.fc-expanding .fc-gradient-border {
          opacity: 0 !important;
          transition: none !important;
        }

        @keyframes orbitBorder {
          0%   { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        @keyframes epulse {
          0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(227,27,84,.5);}
          50%{opacity:.7;box-shadow:0 0 0 5px rgba(227,27,84,0);}
        }
        @keyframes ring-spin{to{transform:rotate(360deg);}}
        @keyframes card-in{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}

        .teams-tab-border {
          display: inline-flex; flex-shrink: 0;
          border-radius: 10.5px; padding: 1px;
          position: relative; background: transparent;
        }
        .teams-tab-border::before {
          content: ''; position: absolute; inset: 0; border-radius: 10.5px;
          background: linear-gradient(90deg, rgba(0,255,166,0.0) 0%, rgba(0,255,166,0.9) 15%, rgba(255,215,0,0.7) 30%, rgba(236,72,153,0.7) 45%, rgba(147,51,234,0.7) 60%, rgba(59,130,246,0.6) 75%, rgba(0,255,166,0.0) 90%);
          background-size: 200% 100%; animation: orbitBorder 3s linear infinite;
          opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
        }
        .teams-tab-border:hover::before { opacity: 1; }
        .teams-tab-item {
          display: inline-flex; align-items: stretch; border-radius: 9.5px; overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 var(--glass-inset-top,rgba(255,255,255,0.06));
          transition: box-shadow 0.2s ease; flex-shrink: 0;
          background: var(--navbar-bg, #0f0f0f); position: relative; z-index: 1;
        }
        .teams-tab-border:hover .teams-tab-item { box-shadow: 0 4px 14px rgba(0,0,0,0.26), inset 0 1px 0 var(--glass-inset-top,rgba(255,255,255,0.06)); }
        :root.light .teams-tab-item { background: #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1); outline: 1px solid rgba(0,0,0,0.11); }
        :root.light .teams-tab-border:hover .teams-tab-item { box-shadow: 0 4px 12px rgba(0,0,0,0.14), 0 8px 24px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,1); outline: 1px solid rgba(0,0,0,0.15); }
        .teams-tab-btn {
          display: inline-flex; align-items: center; gap: 6px; border: none; background: transparent; cursor: pointer;
          font-weight: 500; letter-spacing: 0.01em; color: var(--content-faint, rgba(255,255,255,0.4));
          padding: 8px 14px; font-size: 0.88rem; line-height: 1; transition: color 0.15s ease; user-select: none; white-space: nowrap;
        }
        .teams-tab-btn:hover { color: var(--content-primary, #f1f5f9); }
        :root.light .teams-tab-btn { color: rgba(0,0,0,0.45); }
        :root.light .teams-tab-btn:hover { color: rgba(0,0,0,0.9); }

        .teams-root{
          position:relative;background:var(--gradient-section);color:var(--content-primary);
          border-top:1px dashed var(--border-dashed);border-bottom:1px dashed var(--border-dashed);
          overflow:hidden;
        }
        .teams-root::before{
          content:'';position:absolute;inset:0;pointer-events:none;
          background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);
          background-size:32px 32px;
          mask-image:linear-gradient(to bottom,transparent,black 4%,black 96%,transparent);
          -webkit-mask-image:linear-gradient(to bottom,transparent,black 4%,black 96%,transparent);
        }
        .teams-hero{ display:grid;grid-template-columns:1fr;gap:3rem;padding:5rem 2rem 4rem;position:relative;z-index:1; }
        @media(min-width:640px){.teams-hero{padding-left:4rem;padding-right:4rem;}}
        @media(min-width:768px){.teams-hero{grid-template-columns:1fr auto;gap:4rem;align-items:center;padding:6rem 6rem 5rem;}}
        @media(min-width:1024px){.teams-hero{padding-left:6rem;padding-right:6rem;}}
        @media(min-width:1280px){.teams-hero{padding-left:8rem;padding-right:8rem;}}
        @media(min-width:1536px){.teams-hero{padding-left:12rem;padding-right:12rem;}}
        @media(min-width:1920px){.teams-hero{padding-left:16rem;padding-right:16rem;}}
        .teams-hero-left{display:flex;flex-direction:column;}
        .teams-eyebrow{ display:inline-flex;align-items:center;gap:.5rem;font-size:.65rem;font-family:ui-monospace,Menlo,monospace;text-transform:uppercase;letter-spacing:.22em;font-weight:700;color:#E31B54;margin-bottom:1.25rem; }
        .teams-eyebrow-dot{ width:5px;height:5px;border-radius:50%;background:#E31B54;flex-shrink:0;animation:epulse 2s ease-in-out infinite; }
        .teams-heading{ font-size:clamp(1.75rem,4vw,2.75rem);font-weight:700;letter-spacing:-.02em;line-height:1.15;background:var(--text-gradient,linear-gradient(135deg,#f1f5f9 0%,rgba(241,245,249,.7) 100%));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:1.25rem; }
        .teams-sub{font-size:.9rem;line-height:2;color:var(--content-muted);}
        @media(min-width:640px){.teams-sub{font-size:1.2rem;}}
        .teams-stats-box{ border:1px dashed var(--border-dashed);display:grid;grid-template-columns:repeat(3,1fr);min-width:480px;position:relative;align-self:center; }
        @media(max-width:767px){.teams-stats-box{min-width:0;width:100%;}}
        .teams-stats-box::before,.teams-stats-box::after{ content:'';position:absolute;left:0;right:0;height:2px;background:#E31B54;box-shadow:0 0 10px rgba(227,27,84,.5); }
        .teams-stats-box::before{top:-2px;}.teams-stats-box::after{bottom:-2px;}
        .stat-cell{ display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2.5rem 2rem;border-right:1px dashed var(--border-dashed);gap:.6rem; }
        .stat-cell:last-child{border-right:none;}
        .stat-value{ font-family:ui-monospace,Menlo,monospace;font-size:clamp(1.6rem,2.5vw,2.2rem);font-weight:700;line-height:1;letter-spacing:-.04em;color:var(--content-primary); }
        .stat-value.accent{color:#E31B54;}
        .stat-label{ font-size:.65rem;text-transform:uppercase;letter-spacing:.18em;color:rgba(255,255,255,.3);font-family:ui-monospace,Menlo,monospace;text-align:center; }

        .founders-section{position:relative;z-index:1;padding:3rem 2rem 6rem;}
        @media(min-width:640px){.founders-section{padding-left:4rem;padding-right:4rem;}}
        @media(min-width:768px){.founders-section{padding:3rem 6rem 6rem;}}
        @media(min-width:1024px){.founders-section{padding-left:6rem;padding-right:6rem;}}
        @media(min-width:1280px){.founders-section{padding-left:8rem;padding-right:8rem;}}
        @media(min-width:1536px){.founders-section{padding-left:12rem;padding-right:12rem;}}
        @media(min-width:1920px){.founders-section{padding-left:16rem;padding-right:16rem;}}
        .founders-label-row{display:flex;align-items:center;gap:1rem;margin-bottom:1.75rem;}
        .founders-label{ font-size:0.8rem;font-family:ui-monospace,Menlo,monospace;text-transform:uppercase;letter-spacing:.22em;font-weight:700;color:rgba(255,255,255,.3);white-space:nowrap; }
        .founders-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.75rem;}
        @media(max-width:767px){.founders-grid{grid-template-columns:repeat(2,1fr);gap:1.25rem;}}

        .fc-outer{ position:relative;border-radius:.75rem;border:1px solid var(--border-color,rgba(255,255,255,.08));padding:1px;backdrop-filter:blur(4px);animation:card-in .5s cubic-bezier(.22,1,.36,1) both;transition:transform .3s ease,box-shadow .3s ease;overflow:hidden;cursor:pointer; }
        .fc-outer:hover{transform:translateY(-4px);box-shadow:0 20px 50px rgba(0,0,0,.5);}
        :root.light .fc-outer{border:1.5px solid rgba(0,0,0,.14);}
        :root.light .fc-outer:hover{transform:translateY(-3px);box-shadow:0 6px 18px rgba(0,0,0,.10);}
        .fc-gradient-border{ position:absolute;inset:0;border-radius:.75rem;padding:1px;opacity:0;transition:opacity .4s ease;pointer-events:none;z-index:1;background:radial-gradient(400px circle at var(--mx,50%) var(--my,50%),rgba(0,255,166,.8),rgba(255,215,0,.6),rgba(236,72,153,.6),rgba(147,51,234,.6),rgba(59,130,246,.5),transparent 70%);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude; }
        .fc-outer:hover .fc-gradient-border{opacity:1;}
        .fc-inner{ position:relative;z-index:2;display:flex;flex-direction:column;border-radius:calc(.75rem - 1px);overflow:hidden;background:var(--gradient-card,#0f0f1a);border:.75px solid var(--border-subtle,rgba(255,255,255,.05));height:100%; }
        :root.light .fc-inner{background:#ffffff;border:none;}
        .fc-portrait{ position:relative;width:100%;aspect-ratio:3/4;background:linear-gradient(170deg,#0e0e1c 0%,#160c14 100%);overflow:hidden;flex-shrink:0; }
        :root.light .fc-portrait{background:linear-gradient(170deg,#e2e8f0 0%,#cbd5e1 100%);}
        .fc-portrait-img{ filter:grayscale(100%) brightness(0.85);transition:filter 0.45s cubic-bezier(0.4,0,0.2,1); }
        .fc-outer:hover .fc-portrait-img{ filter:grayscale(0%) brightness(1); }
        .fc-dot-grid{ position:absolute;inset:0;background-image:radial-gradient(circle,rgba(227,27,84,.12) 1px,transparent 1px);background-size:22px 22px; }
        .fc-bottom-fade{ position:absolute;bottom:0;left:0;right:0;height:50%;background:linear-gradient(to top,var(--gradient-card,#0f0f1a) 10%,transparent);z-index:1;pointer-events:none; }
        .fc-id{ position:absolute;top:.75rem;left:.75rem;font-family:ui-monospace,Menlo,monospace;font-size:.5rem;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.55);background:rgba(0,0,0,.55);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.12);padding:4px 9px;border-radius:4px;z-index:2; }
        .fc-info{ padding:1.75rem 1.5rem 1.25rem;display:flex;flex-direction:column;gap:.65rem;border-top:1px solid rgba(255,255,255,.05);background:transparent; }
        :root.light .fc-info{border-top:1px solid rgba(0,0,0,.07);}
        .fc-name{ font-size:1.2rem;font-weight:700;color:var(--content-primary);letter-spacing:-.02em;line-height:1.2;margin:0;transition:transform .3s; }
        .fc-outer:hover .fc-name{transform:translateY(-1px);}
        .fc-title{ font-size:.75rem;color:#E31B54;font-weight:700;font-family:ui-monospace,Menlo,monospace;text-transform:uppercase;letter-spacing:.12em;margin:0;transition:transform .3s; }
        .fc-outer:hover .fc-title{transform:translateY(-1px);}
        .fc-role{ font-size:.7rem;font-family:ui-monospace,Menlo,monospace;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.22);transition:transform .3s; }
        :root.light .fc-role{color:rgba(0,0,0,.4);}
        .fc-outer:hover .fc-role{transform:translateY(-1px);}
        .fc-footer{ display:flex;align-items:center;gap:.75rem;padding:1rem 1.25rem 1.25rem;border-top:1px solid rgba(255,255,255,.04);transition:border-color .3s;margin-top:auto; }
        :root.light .fc-footer{border-top:1px solid rgba(0,0,0,.07);}
        .fc-outer:hover .fc-footer{border-color:rgba(255,255,255,.08);}
        :root.light .fc-outer:hover .fc-footer{border-color:rgba(0,0,0,.1);}
        .fc-btn { padding: 12px 18px !important; font-size: 0.93rem !important; font-weight: 600 !important; }
        .modal-btn { padding: 12px 20px !important; font-size: 0.93rem !important; font-weight: 600 !important; }

        .fc-modal-outer {
          position:relative; display:flex; flex-direction:column;
          width:100%; max-width:820px; max-height:88vh; border-radius:16px;
          transform-origin: center bottom;
        }
        .fc-modal-gradient-border {
          position:absolute; inset:0; border-radius:16px; padding:1px;
          opacity:0; transition:opacity .4s ease; pointer-events:none; z-index:10;
          background:radial-gradient(700px circle at var(--mx,50%) var(--my,50%), rgba(0,255,166,.7),rgba(255,215,0,.5),rgba(236,72,153,.5),rgba(147,51,234,.5),rgba(59,130,246,.4),transparent 65%);
          -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          -webkit-mask-composite:xor; mask-composite:exclude;
        }
        .fc-modal-outer:hover .fc-modal-gradient-border { opacity:1; }

        :root.light .fc-modal-panel{ background:#f8fafc !important;border:1px solid rgba(0,0,0,.12) !important;box-shadow:0 24px 60px rgba(0,0,0,.14), 0 0 0 1px rgba(0,0,0,.06) !important; }
        :root.light .fc-modal-overlay{background:rgba(200,210,220,.55) !important;}
        :root.light .fc-modal-info{border-left:1px solid rgba(0,0,0,.08) !important;}
        :root.light .fc-modal-eyebrow{color:rgba(0,0,0,.35) !important;}
        :root.light .fc-modal-name{ background:linear-gradient(135deg,#0f172a 0%,rgba(15,23,42,.65) 100%) !important;-webkit-background-clip:text !important;-webkit-text-fill-color:transparent !important;background-clip:text !important; }
        :root.light .fc-modal-divider{background:linear-gradient(90deg,rgba(227,27,84,.3),rgba(0,0,0,.08) 50%,transparent) !important;}
        :root.light .fc-modal-about-label{color:rgba(0,0,0,.3) !important;}
        :root.light .fc-modal-bio{color:rgba(0,0,0,.6) !important;}
        :root.light .fc-modal-stats{border:1px solid rgba(0,0,0,.09) !important;background:rgba(0,0,0,.02) !important;}
        :root.light .fc-modal-stat-sep{background:rgba(0,0,0,.09) !important;}
        .fc-modal-stat-val { color: #f1f5f9; }
        .fc-modal-stat-accent { color: #E31B54 !important; }
        .fc-modal-stat-lab { color: rgba(255,255,255,0.25); }
        :root.light .fc-modal-stat-val{color:#0f172a !important;}
        :root.light .fc-modal-stat-lab{color:rgba(0,0,0,.3) !important;}
        :root.light .fc-modal-footer{border-top:1px solid rgba(0,0,0,.08) !important;}
        :root.light .fc-modal-chip{color:rgba(0,0,0,.5) !important;background:rgba(0,0,0,.06) !important;border:1px solid rgba(0,0,0,.12) !important;}
        :root.light .fc-modal-role-tag{color:rgba(0,0,0,.45) !important;background:rgba(0,0,0,.04) !important;border:1px solid rgba(0,0,0,.1) !important;}
        :root.light .teams-root::before{ display: none; }
        :root.light .stat-label{color:rgba(0,0,0,.3);}
        :root.light .stat-value{color:#0f172a;}
        :root.light .founders-label{color:rgba(0,0,0,.3);}
        :root.light .founders-label-line{background:linear-gradient(to right,rgba(0,0,0,.1),transparent);}
        .founders-label-line{flex:1;height:1px;background:linear-gradient(to right,rgba(255,255,255,.08),transparent);}

        @keyframes teamsTabPress {
          0%   { transform: scale(1); }
          15%  { transform: scale(0.96); }
          50%  { transform: scale(1.02); }
          72%  { transform: scale(0.992); }
          88%  { transform: scale(1.004); }
          100% { transform: scale(1); }
        }
        .teams-tab-pressed {
          animation: teamsTabPress 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
          transform-origin: center !important;
        }
        @keyframes modal-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modal-panel-in {
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
        .fc-modal-overlay {
          animation: modal-overlay-in 0.2s ease both;
        }
        .fc-modal-outer {
          animation: modal-panel-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

      `}</style>

      <div style={{ paddingBottom: '8rem' }}>
        <section id="section-teams" className="teams-root">
          <div className="teams-hero">
            <div className="teams-hero-left">
              <div className="teams-eyebrow"><span className="teams-eyebrow-dot" />Governance Structure</div>
              <h2 className="teams-heading">The Organization</h2>
              <p className="teams-sub">
                The Notus Regalia is built on layered authority and specialised execution —
                four founders at the apex, six units in motion, founded on 2026.
              </p>
            </div>
            <div className="teams-stats-box">
              {DYNASTY_STATS.map((s, i) => (
                <div key={i} className="stat-cell">
                  <span className={`stat-value${s.accent ? ' accent' : ''}`}>{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="founders-section">
            <div className="founders-label-row">
              <span className="founders-label">The Four Founders</span>
              <div className="founders-label-line" />
            </div>
            <div className="founders-grid">
              {FOUNDERS.map((f, i) => (
                <FounderCard key={f.id} founder={f} index={i} onExpand={handleExpand} />
              ))}
            </div>
          </div>
        </section>
      </div>

      {activeFounder && <FounderModal founder={activeFounder} onClose={handleClose} />}
    </>
  );
};

export default memo(TheOrganization);