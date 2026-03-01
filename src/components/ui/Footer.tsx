"use client";
import Image from 'next/image';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';

const logoImage = '/assets/Notus-Regalia-logo.svg';

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 0, b: 0 };
}

interface Dot { x: number; y: number; baseOpacity: number; }

function DotPattern({
  containerRef,
  dotSize = 2, gap = 24, baseColor = '#404040',
  glowColor = '#22d3ee', proximity = 120, glowIntensity = 1,
  waveSpeed = 0.5, baseOpacity = 0.85,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
  dotSize?: number; gap?: number; baseColor?: string;
  glowColor?: string; proximity?: number; glowIntensity?: number;
  waveSpeed?: number; baseOpacity?: number;
}) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const dotsRef    = useRef<Dot[]>([]);
  const mouseRef   = useRef({ x: -1000, y: -1000 });
  const animRef    = useRef<number | null>(null);
  const startTime  = useRef(Date.now());
  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const glowRgb = useMemo(() => hexToRgb(glowColor), [glowColor]);

  const buildGrid = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    const dpr  = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
      canvas.width  = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width  = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
    }
    const cell = dotSize + gap;
    const cols = Math.ceil(rect.width  / cell) + 1;
    const rows = Math.ceil(rect.height / cell) + 1;
    const ox   = (rect.width  - (cols - 1) * cell) / 2;
    const oy   = (rect.height - (rows - 1) * cell) / 2;
    const dots: Dot[] = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        dots.push({ x: ox + c * cell, y: oy + r * cell, baseOpacity: baseOpacity + Math.random() * (1 - baseOpacity) * 0.15 });
    dotsRef.current = dots;
  }, [containerRef, dotSize, gap, baseOpacity]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    const { x: mx, y: my } = mouseRef.current;
    const proxSq = proximity * proximity;
    const time   = (Date.now() - startTime.current) * 0.001 * waveSpeed;
    for (const dot of dotsRef.current) {
      const dx = dot.x - mx, dy = dot.y - my;
      const distSq = dx * dx + dy * dy;
      const wave   = Math.sin(dot.x * 0.02 + dot.y * 0.02 + time) * 0.5 + 0.5;
      let opacity  = dot.baseOpacity + wave * 0.15;
      let scale    = 1 + wave * 0.2;
      let r = baseRgb.r, g = baseRgb.g, b = baseRgb.b, glow = 0;
      if (distSq < proxSq) {
        const t = 1 - Math.sqrt(distSq) / proximity;
        const e = t * t * (3 - 2 * t);
        r = Math.round(baseRgb.r + (glowRgb.r - baseRgb.r) * e);
        g = Math.round(baseRgb.g + (glowRgb.g - baseRgb.g) * e);
        b = Math.round(baseRgb.b + (glowRgb.b - baseRgb.b) * e);
        opacity = Math.min(1, opacity + e * 0.7);
        scale   = scale + e * 0.8;
        glow    = e * glowIntensity;
      }
      const radius = (dotSize / 2) * scale;
      if (glow > 0) {
        const grad = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, radius * 4);
        grad.addColorStop(0,   `rgba(${glowRgb.r},${glowRgb.g},${glowRgb.b},${glow * 0.4})`);
        grad.addColorStop(0.5, `rgba(${glowRgb.r},${glowRgb.g},${glowRgb.b},${glow * 0.1})`);
        grad.addColorStop(1,   `rgba(${glowRgb.r},${glowRgb.g},${glowRgb.b},0)`);
        ctx.beginPath(); ctx.arc(dot.x, dot.y, radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${opacity})`; ctx.fill();
    }
    animRef.current = requestAnimationFrame(draw);
  }, [proximity, baseRgb, glowRgb, dotSize, glowIntensity, waveSpeed]);

  useEffect(() => {
    buildGrid();
    const ro = new ResizeObserver(buildGrid);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [buildGrid, containerRef]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [draw]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onMove  = (e: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: -1000, y: -1000 }; };
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);
    return () => { container.removeEventListener('mousemove', onMove); container.removeEventListener('mouseleave', onLeave); };
  }, [containerRef]);

  return (
    <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
  );
}

const contactEmails = [
  { label: 'General',      address: 'info@notus-regalia.com' },
  { label: 'Careers',      address: 'careers@notus-regalia.com' },
  { label: 'Partnerships', address: 'partners@notus-regalia.com' },
  { label: 'Support',      address: 'support@notus-regalia.com' },
];

function CopyIcon({ copied }: { copied: boolean }) {
  return copied ? (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E31B54" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ) : (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

interface FooterProps {
  onNavigate?: (tabId: string, subtabId?: string, infoContent?: string) => void;
}

const Footer = ({ onNavigate }: FooterProps) => {
  const footerRef  = useRef<HTMLElement>(null);
  const splitRef   = useRef<HTMLDivElement>(null);
  const nlBgRef    = useRef<HTMLDivElement>(null);
  const ctPanelRef = useRef<HTMLDivElement>(null);

  const [email, setEmail]                   = useState('');
  const [submitState, setSubmitState]       = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [copiedEmail, setCopiedEmail]       = useState<string | null>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const SUGGESTION = '@gmail.com';

  const seamSvgRef  = useRef<SVGSVGElement>(null);
  const seamLineRef = useRef<SVGLineElement>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    setShowSuggestion(val.length > 0 && !val.includes('@'));
  };
  const completeSuggestion = () => {
    if (showSuggestion) { setEmail(prev => prev + SUGGESTION); setShowSuggestion(false); emailInputRef.current?.focus(); }
  };
  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && showSuggestion) { e.preventDefault(); completeSuggestion(); }
  };
  const handleCopyEmail = (address: string) => {
    const fallbackCopy = (text: string) => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        setCopiedEmail(address);
        setTimeout(() => setCopiedEmail(null), 2000);
      } catch {
        // silently fail
      }
      document.body.removeChild(textarea);
    };

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(address).then(() => {
        setCopiedEmail(address);
        setTimeout(() => setCopiedEmail(null), 2000);
      }).catch(() => fallbackCopy(address));
    } else {
      fallbackCopy(address);
    }
  };

  useEffect(() => {
    const measure = () => {
      const band = splitRef.current;
      const bg   = nlBgRef.current;
      const line = seamLineRef.current;
      const svg  = seamSvgRef.current;
      if (!band || !bg || !line || !svg) return;
      const bandRect = band.getBoundingClientRect();
      const bgRect   = bg.getBoundingClientRect();
      const top    = bgRect.right - bandRect.left;
      const bottom = bgRect.right - 72 - bandRect.left;
      line.setAttribute('x1', String(top));
      line.setAttribute('x2', String(bottom));
      svg.style.opacity = '1';
    };
    const raf = requestAnimationFrame(measure);
    window.addEventListener('resize', measure, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const band3Ref = useRef<HTMLDivElement>(null);
  const BORDER_THRESHOLD = 200;

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    let rafId: number | null = null;
    const onMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const footerRect = footer.getBoundingClientRect();
        const x = e.clientX - footerRect.left;
        const y = e.clientY - footerRect.top;
        footer.style.setProperty('--mouse-x', `${x}px`);
        footer.style.setProperty('--mouse-y', `${y}px`);
        footer.classList.toggle('border-top-active', y <= BORDER_THRESHOLD);
        const band3 = band3Ref.current;
        if (band3) {
          const b3Top = band3.getBoundingClientRect().top - footerRect.top;
          band3.classList.toggle('border-top-active', Math.abs(y - b3Top) <= BORDER_THRESHOLD);
        }
        rafId = null;
      });
    };
    const onLeave = () => {
      footer.classList.remove('border-top-active');
      band3Ref.current?.classList.remove('border-top-active');
    };
    footer.addEventListener('mousemove', onMove, { passive: true });
    footer.addEventListener('mouseleave', onLeave);
    return () => {
      footer.removeEventListener('mousemove', onMove);
      footer.removeEventListener('mouseleave', onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const bandBorderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const band = splitRef.current;
    const borderEl = bandBorderRef.current;
    if (!band || !borderEl) return;
    let rafId: number | null = null;
    const BAND_THRESHOLD = 200;
    const onMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const rect = band.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        borderEl.style.background = `radial-gradient(600px circle at ${x}px 0%, rgba(0,255,166,0.9), rgba(255,215,0,0.7), rgba(236,72,153,0.7), rgba(147,51,234,0.6), rgba(59,130,246,0.5), transparent 70%)`;
        borderEl.style.opacity = y <= BAND_THRESHOLD ? '1' : '0';
        rafId = null;
      });
    };
    const onLeave = () => { borderEl.style.opacity = '0'; };
    band.addEventListener('mousemove', onMove, { passive: true });
    band.addEventListener('mouseleave', onLeave);
    return () => {
      band.removeEventListener('mousemove', onMove);
      band.removeEventListener('mouseleave', onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitState === 'loading') return;
    setSubmitState('loading');
    await new Promise(res => setTimeout(res, 1200));
    setSubmitState('success');
    setEmail('');
    setTimeout(() => setSubmitState('idle'), 4000);
  };

  interface FooterLink {
    label: string;
    tabId?: string;
    subtabId?: string;
    infoContent?: string;
    href?: string;
  }

  const sections: { title: string; links: FooterLink[] }[] = [
    {
      title: 'Discover',
      links: [
        { label: 'Overview',          tabId: 'discover', subtabId: 'discover-overview' },
        { label: 'The Company',       tabId: 'discover', subtabId: 'discover-thecompany' },
        { label: 'The Organization',  tabId: 'discover', subtabId: 'discover-theorganization' },
        { label: 'Strategic Capital', tabId: 'discover', subtabId: 'discover-strategiccapital' },
      ]
    },
    {
      title: 'Information',
      links: [
        { label: 'Releases',           tabId: 'information', infoContent: 'statements' },
        { label: 'News & Media',       tabId: 'information', infoContent: 'news' },
        { label: 'Investor Relations', tabId: 'information', infoContent: 'investor-relations' },
        { label: 'Documents',          tabId: 'information', infoContent: 'documents' },
        { label: 'Attributions',       tabId: 'information', infoContent: 'attributions' },
        { label: 'Report',             tabId: 'information', infoContent: 'report' },
      ]
    },
    {
      title: 'Ventures',
      links: [
        { label: 'Defense',          tabId: 'ventures', subtabId: 'defense' },
        { label: 'Healthcare',       tabId: 'ventures', subtabId: 'healthcare' },
        { label: 'Civic Operations', tabId: 'ventures', subtabId: 'civic-operations' },
      ]
    },
    {
      title: 'Reach Out',
      links: [
        { label: 'Contact',  href: '/contact' },
        { label: 'Support',  href: '/contact' },
        { label: 'Feedback', href: '/contact' },
      ]
    },
    {
      title: 'Community',
      links: [
        { label: 'Contribute',      href: '#' },
        { label: 'Build With Us',   href: '#' },
        { label: 'Become a Fool',   href: '#' },
        { label: 'Sandbox Program', href: '#' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Acceptable Use Policy', tabId: 'information', infoContent: 'use-policy' },
        { label: 'Terms & Conditions',    tabId: 'information', infoContent: 'terms' },
        { label: 'Privacy Policy',        tabId: 'information', infoContent: 'privacy' },
        { label: 'Licenses',              tabId: 'information', infoContent: 'licenses' },
      ]
    },
  ];

  return (
    <footer ref={footerRef} className="nr-footer">
      <style>{`
        /* ─────────────────────────────────────────────
           CSS CUSTOM PROPERTIES — scoped to .nr-footer
           Dark defaults; .light overrides below
        ───────────────────────────────────────────── */
        .nr-footer {
          /* Dark-mode tokens */
          --f-bg:              linear-gradient(160deg, #0a0a0f 0%, #0d0d14 60%, #080810 100%);
          --f-glass-bg:        rgba(10,10,20,0.85);
          --f-border:          rgba(255,255,255,0.22);
          --f-border-subtle:   rgba(255,255,255,0.06);
          --f-text-primary:    #f1f5f9;
          --f-text-secondary:  rgba(255,255,255,0.55);
          --f-text-faint:      rgba(255,255,255,0.35);
          --f-text-copyright:  rgba(255,255,255,0.45);
          --f-nav-link:        rgba(255,255,255,0.45);
          --f-nav-title:       rgba(255,255,255,0.85);
          --f-hud-accent:      #EB1143;
          --f-grid-line:       rgba(255,255,255,0.02);
          --f-status-bg:       rgba(255,255,255,0.02);
          --f-status-border:   rgba(255,255,255,0.04);
          --f-status-text:     #94a3b8;
          --f-glass-box-bg:    rgba(255,255,255,0.06);
          --f-glass-box-hover: rgba(255,255,255,0.1);
          --f-glass-box-color: #94a3b8;
          --f-divider:         rgba(255,255,255,0.06);
          --f-tagline-border:  rgba(255,255,255,0.12);
          --f-tagline-em:      #e2e8f0;
          --f-tech-color:      rgba(255,255,255,0.45);
          --f-band3-bg:        linear-gradient(160deg, #0a0a0f 0%, #0d0d14 60%, #080810 100%);

          /* Layout */
          position: relative;
          overflow: hidden;
          margin-top: 5rem;
          z-index: 10;
          color: var(--f-text-primary);

          /* Glass surface */
          background: var(--f-glass-bg);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow:
            0 -8px 32px rgba(0,0,0,0.3),
            0 -12px 48px rgba(0,0,0,0.18),
            inset 0 1px 1px rgba(255,255,255,0.06),
            inset 0 -1px 1px rgba(0,0,0,0.2);
        }

        /* ── Light-mode token overrides ── */
        .light .nr-footer {
          --f-bg:              linear-gradient(to bottom, #f8fafc 0%, #eef2f6 60%);
          --f-glass-bg:        rgba(248,250,252,0.92);
          --f-border:          rgba(0,0,0,0.1);
          --f-border-subtle:   rgba(0,0,0,0.06);
          --f-text-primary:    #0f172a;
          --f-text-secondary:  #475569;
          --f-text-faint:      #94a3b8;
          --f-text-copyright:  rgba(15,23,42,0.6);
          --f-nav-link:        #475569;
          --f-nav-title:       #64748b;
          --f-hud-accent:      #EB1143;
          --f-grid-line:       rgba(0,0,0,0.025);
          --f-status-bg:       #0f172a;
          --f-status-border:   rgba(0,0,0,0.8);
          --f-status-text:     #94a3b8;
          --f-glass-box-bg:    rgba(0,0,0,0.05);
          --f-glass-box-hover: rgba(0,0,0,0.1);
          --f-glass-box-color: #475569;
          --f-divider:         rgba(0,0,0,0.08);
          --f-tagline-border:  rgba(0,0,0,0.1);
          --f-tagline-em:      #0f172a;
          --f-tech-color:      #475569;
          --f-band3-bg:        linear-gradient(to bottom, #f8fafc 0%, #eef2f6 60%);

          background: var(--f-glass-bg);
          box-shadow:
            0 -4px 24px rgba(0,0,0,0.06),
            0 -8px 40px rgba(0,0,0,0.04),
            inset 0 1px 1px rgba(0,0,0,0.06),
            inset 0 -1px 1px rgba(0,0,0,0.03);
          color: var(--f-text-primary);
        }

        /* ── Top shimmer border (mouse-tracked) ── */
        .nr-footer::before {
          content: '';
          position: absolute; top: -1px; left: 0; right: 0; height: 1px;
          background: radial-gradient(600px circle at var(--mouse-x, 50%) 0%,
            rgba(0,255,166,0.9), rgba(255,215,0,0.7), rgba(236,72,153,0.7),
            rgba(147,51,234,0.6), rgba(59,130,246,0.5), transparent 70%);
          opacity: 0; transition: opacity 0.35s ease; pointer-events: none;
        }
        .nr-footer.border-top-active::before { opacity: 1; }
        .nr-footer::after {
          content: ''; position: absolute; left: 0; right: 0; top: 0; height: 1px;
          transform-origin: top; transform: scaleY(0.35);
          background: var(--f-border); pointer-events: none;
        }
        .light .nr-footer::after { background: var(--f-border); }

        /* ── Grid background ── */
        .nr-footer-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(var(--f-grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--f-grid-line) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: linear-gradient(to bottom, transparent, black 6%, black 96%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 6%, black 96%, transparent);
          opacity: 0.7;
        }

        /* ─────────────────────────────────────────────
           SPLIT BAND — always dark (constant)
        ───────────────────────────────────────────── */
        .split-band {
          position: relative;
          display: flex;
          height: 560px;
          overflow: hidden;
          border-top: 1px solid rgba(255,255,255,0.22);
          background: #000000;
          isolation: isolate;
          color-scheme: dark;
        }

        .split-band-border {
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          opacity: 0; transition: opacity 0.35s ease; pointer-events: none; z-index: 20;
        }

        /* ── Panels ── */
        .split-panel {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 5rem clamp(2rem, 4vw, 7rem);
          overflow: hidden;
          height: 100%;
          z-index: 1;
        }

        .split-panel-nl { background: transparent; z-index: 1; }
        .split-panel-nl-bg {
          position: absolute;
          top: 0; bottom: 0; left: -72px; right: 0;
          clip-path: polygon(72px 0, 100% 0, calc(100% - 72px) 100%, 0 100%);
          background: #07070e;
          z-index: 0;
        }

        .split-panel-ct {
          background: transparent;
          z-index: 2;
          margin-left: -72px;
          clip-path: polygon(72px 0, calc(100% + 72px) 0, 100% 100%, 0 100%);
        }
        .split-panel-ct-bg {
          position: absolute;
          inset: 0;
          background: #000000;
          z-index: 0;
        }

        .split-panel-content {
          position: relative;
          z-index: 2;
          width: 100%;
          /* FIX: constrain the left (contact) panel content so emails don't
             bleed into the diagonal seam on small screens like MBP 13".
             The seam eats ~72px from the right edge of the left panel,
             so we pull the max-width back by that amount plus a safety buffer. */
          max-width: calc(100% - 96px);
        }
        .split-panel-ct .split-panel-content {
          /* Right (newsletter) panel can use full width — content sits left of seam */
          max-width: 100%;
        }

        /* Always-dark text inside split band */
        .sp-eyebrow {
          display: inline-flex; align-items: center; gap: 0.6rem;
          font-size: clamp(0.72rem, 1.2vw, 0.82rem);
          text-transform: uppercase; letter-spacing: 0.22em;
          font-weight: 700; color: #E31B54; margin-bottom: 1.25rem; white-space: nowrap;
        }
        .sp-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #E31B54; flex-shrink: 0;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(227,27,84,0.4); }
          50%       { opacity: 0.8; transform: scale(1.2); box-shadow: 0 0 0 4px rgba(227,27,84,0); }
        }
        .sp-title {
          font-size: clamp(2rem, 4vw, 3.25rem); font-weight: 300;
          color: #f1f5f9; letter-spacing: -0.03em; line-height: 1.05;
          margin-bottom: 1.75rem;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .sp-sub {
          font-size: clamp(0.875rem, 2vw, 1.05rem);
          color: rgba(255,255,255,0.45);
          line-height: 1.65; max-width: 44ch; margin-bottom: 3rem;
          display: block; overflow-wrap: anywhere;
        }
        .split-panel-ct .sp-sub { max-width: 100%; }

        /* ── Newsletter form (always dark) ── */
        @keyframes fadeIn    { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes spin      { to { transform: rotate(360deg); } }

        .nl-slot { width: 100%; max-width: 620px; height: 56px; flex-shrink: 0; position: relative; margin-left: auto; }
        .nl-slot-inner { position: absolute; inset: 0; display: flex; align-items: center; width: 100%; }
        .nl-search-modal {
          width: 100%; border-radius: 4px;
          background: #1a1a1a; border: 1px solid #2a2a2a;
          border-left: 4px solid #E31B54;
          display: flex; align-items: center;
          padding: 8px 16px;
          transition: border-color 0.2s ease;
        }
        .nl-search-modal:focus-within { border-color: #444; }
        .nl-input {
          width: 100%; background: transparent; border: none; outline: none;
          color: white; padding: 12px 0;
          font-size: clamp(0.875rem, 2vw, 1.05rem);
          font-family: inherit; caret-color: #E31B54;
        }
        .nl-input::placeholder { color: rgba(255,255,255,0.25); }
        .nl-btn {
          display: inline-flex; align-items: center; gap: 0.45rem;
          padding: 8px 18px; border-radius: 3px;
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em;
          color: rgba(255,255,255,0.5); background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer; font-family: inherit; text-transform: uppercase;
          transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
          white-space: nowrap;
        }
        .nl-btn:hover:not(:disabled) { color: #ffffff; border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.06); }
        .nl-btn:disabled { opacity: 0.25; cursor: not-allowed; }
        .nl-autocomplete-pill {
          display: inline-flex; align-items: center; gap: 0.35rem; padding: 5px 10px; border-radius: 3px;
          font-size: 0.66rem; font-weight: 600; letter-spacing: 0.08em;
          color: rgba(255,255,255,0.45); background: transparent; border: 1px solid rgba(255,255,255,0.15);
          text-transform: uppercase; cursor: pointer; white-space: nowrap; user-select: none;
          font-family: inherit;
          transition: color 0.12s ease, border-color 0.12s ease, background 0.12s ease;
        }
        .nl-autocomplete-pill:hover { color: rgba(255,255,255,0.8); border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.04); }
        .nl-tab-icon { display: inline-flex; align-items: center; opacity: 0.6; }
        .nl-input-wrap { flex: 1; position: relative; display: flex; align-items: center; overflow: hidden; }
        .nl-input-wrap .nl-input { position: relative; z-index: 2; background: transparent; }
        .nl-ghost-text {
          position: absolute; left: 0; top: 50%; transform: translateY(-50%);
          font-size: clamp(0.875rem, 2vw, 1.05rem); font-family: inherit;
          white-space: nowrap; pointer-events: none; z-index: 1; color: transparent;
        }
        .nl-ghost-suffix { color: rgba(227,27,84,0.45); pointer-events: auto; cursor: text; }
        .nl-success {
          display: flex; align-items: center; justify-content: flex-end;
          width: 100%; gap: 0.625rem; color: rgba(255,255,255,0.7);
          font-size: clamp(0.875rem, 2vw, 1.05rem);
          animation: fadeIn 350ms ease; font-weight: 400; padding: 0;
        }
        .nl-success i { color: #E31B54; }
        .spinner { width: 0.75rem; height: 0.75rem; border: 1.5px solid rgba(255,255,255,0.2); border-top-color: #ffffff; border-radius: 50%; animation: spin 0.6s linear infinite; }

        /* ── Contact emails (always dark) ── */
        .ct-email-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 2.5rem clamp(1.5rem, 4vw, 10rem);
        }
        .ct-email-row { display: flex; flex-direction: column; gap: 0.5rem; min-width: 0; }
        .ct-email-label {
          font-size: clamp(0.65rem, 1.4vw, 0.8rem);
          text-transform: uppercase; letter-spacing: 0.18em;
          color: rgba(255,255,255,0.35); font-weight: 600;
        }
        .ct-email-btn {
          display: inline-flex; align-items: center; gap: 0.6rem;
          font-family: ui-monospace, Menlo, monospace;
          font-size: clamp(0.75rem, 1.4vw, 0.8rem);
          color: rgba(255,255,255,0.7); font-weight: 500; letter-spacing: 0.01em;
          cursor: pointer; background: none; border: none; padding: 0; text-align: left;
          transition: color 0.2s ease;
          /* FIX: allow wrapping on small screens instead of overflowing into the seam */
          white-space: normal;
          word-break: break-all;
          overflow-wrap: anywhere;
          min-width: 0;
        }
        .ct-email-btn > span { display: inline; }
        .ct-email-btn:hover { color: #ffffff; }
        .ct-email-btn:hover .ct-copy-icon { opacity: 1; }
        .ct-email-btn.is-copied { color: #E31B54; }
        .ct-copy-icon { display: inline-flex; align-items: center; flex-shrink: 0; opacity: 0.35; transition: opacity 0.2s ease; color: rgba(255,255,255,0.5); }
        .ct-email-btn.is-copied .ct-copy-icon { opacity: 1; color: #E31B54; }

        /* ── Seam line ── */
        @media (max-width: 768px) { .split-seam-line { display: none; } }

        /* ── Mobile split band ── */
        @media (max-width: 768px) {
          .split-band { height: auto; flex-direction: column; }
          .split-panel { height: 420px; }
          .split-panel-nl, .split-panel-ct { margin-left: 0; clip-path: none; }
          .split-panel-nl-bg, .split-panel-ct-bg { clip-path: none; left: 0; right: 0; }
          .split-panel-nl { border-bottom: 1px solid rgba(255,255,255,0.06); }
          .ct-email-list { grid-template-columns: 1fr; }
          .sp-sub { max-width: 100%; }
          /* On mobile, restore full width since there's no seam */
          .split-panel-content { max-width: 100%; }
        }

        /* ─────────────────────────────────────────────
           BAND DIVIDER
        ───────────────────────────────────────────── */
        .nr-band-divider {
          height: 1px;
          background: linear-gradient(90deg,
            transparent,
            var(--f-divider) 20%,
            var(--f-divider) 80%,
            transparent
          );
          position: relative; z-index: 10;
        }

        /* ─────────────────────────────────────────────
           MAIN FOOTER BAND — themed
        ───────────────────────────────────────────── */
        .nr-band3 {
          padding: 4rem clamp(1rem, 5vw, 9rem);
          background: var(--f-band3-bg);
          border-top: 1px solid var(--f-border);
          position: relative; isolation: isolate;
          color: var(--f-text-primary);
        }
        .nr-band3::before {
          content: ''; position: absolute; top: -1px; left: 0; right: 0; height: 1px;
          background: radial-gradient(600px circle at var(--mouse-x, 50%) 0%,
            rgba(0,255,166,0.7), rgba(255,215,0,0.5), rgba(236,72,153,0.5),
            rgba(147,51,234,0.45), rgba(59,130,246,0.4), transparent 70%);
          opacity: 0; transition: opacity 0.35s ease; pointer-events: none;
        }
        .nr-band3.border-top-active::before { opacity: 1; }
        .light .nr-band3::before { display: none; }
        .light .nr-band3 { border-top-color: var(--f-border); }

        /* ── Brand title ── */
        .nr-brand-title {
          font-size: clamp(1.75rem, 4vw, 2.875rem);
          font-weight: 700;
          color: var(--f-text-primary);
          letter-spacing: -0.025em;
          line-height: 1.1;
        }

        /* ── Tagline ── */
        .nr-tagline {
          font-size: clamp(0.875rem, 2vw, 1.125rem);
          font-weight: 300; line-height: 1.65;
          color: var(--f-text-secondary);
          border-left: 1px solid var(--f-tagline-border);
          padding-left: 1rem; margin-top: 0.25rem;
        }
        .nr-tagline-em { font-weight: 500; color: var(--f-tagline-em); margin-top: 0.5rem; }

        /* ── System status badge ── */
        .nr-system-status {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.375rem 0.75rem;
          border: 1px solid var(--f-status-border);
          background: var(--f-status-bg);
          border-radius: 2px;
        }
        .nr-system-status-text {
          font-size: clamp(0.65rem, 1.4vw, 0.8rem);
          font-weight: 500; letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--f-status-text);
        }
        .light .nr-system-status-text { color: #94a3b8; }

        /* ── Nav titles ── */
        .nr-nav-title {
          font-size: clamp(0.65rem, 1.4vw, 0.8rem);
          font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em;
          color: var(--f-nav-title);
          display: flex; align-items: center; gap: 0.5rem; justify-content: center;
        }
        @media (min-width: 640px) { .nr-nav-title { justify-content: flex-start; } }

        /* ── Nav links ── */
        .nr-nav-link {
          font-size: clamp(0.875rem, 2vw, 1.05rem);
          color: var(--f-nav-link);
          position: relative;
          display: inline-flex; align-items: center;
          transition: color 180ms ease, text-shadow 180ms ease;
        }
        .nr-nav-link::before,
        .nr-nav-link::after {
          opacity: 0; color: #EB1143;
          transition: opacity 180ms ease, transform 180ms ease;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
        .nr-nav-link::before { content: '['; margin-right: 6px; transform: translateX(4px); }
        .nr-nav-link::after  { content: ']'; margin-left: 6px; transform: translateX(-4px); }
        .nr-nav-link:hover { color: var(--f-text-primary); text-shadow: 0 0 10px rgba(0,0,0,0.08); }
        .nr-nav-link:hover::before, .nr-nav-link:hover::after { opacity: 1; transform: translateX(0); }

        /* ── HUD top-border accent ── */
        .nr-hud {
          position: relative;
          padding-top: 1rem;
        }
        .nr-hud::before {
          content: ''; position: absolute; top: -1px; left: 50%; width: 44px; height: 2px;
          transform: translateX(-50%);
          background: linear-gradient(90deg, #EB1143, #c40e38);
          border-radius: 2px; opacity: 0.9;
          box-shadow: 0 0 8px rgba(235,17,67,0.5);
        }
        @media (min-width: 1024px) { .nr-hud::before { left: 0; transform: none; } }

        /* ── Logo badge ── */
        .nr-logo-wrap {
          position: relative; display: inline-flex; padding: 2px;
          border-radius: 1.125rem; background: transparent; cursor: pointer;
        }
        .nr-logo-wrap::before {
          content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 2px;
          background: radial-gradient(320px circle at var(--cx,50%) var(--cy,50%),
            rgba(0,255,166,0.9), rgba(255,215,0,0.75), rgba(236,72,153,0.75),
            rgba(147,51,234,0.7), rgba(59,130,246,0.6), transparent 70%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude;
          opacity: 0; transition: opacity 0.3s ease; pointer-events: none; z-index: 0;
        }
        .nr-logo-wrap:hover::before { opacity: 1; }
        .nr-logo-inner {
          position: relative; display: inline-flex; align-items: center;
          justify-content: center; gap: 0.5rem; padding: 0.5rem;
          border-radius: 1rem; background: transparent; z-index: 1; width: fit-content;
        }

        /* ── Social glass buttons ── */
        .nr-glass-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 4.5rem; height: 4.5rem; border-radius: 0.75rem;
          background: var(--f-glass-box-bg);
          border: 1px solid var(--f-border-subtle);
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          color: var(--f-glass-box-color);
          transition: background 180ms ease, box-shadow 180ms ease, transform 180ms ease, color 180ms ease;
        }
        .nr-glass-btn:hover {
          background: var(--f-glass-box-hover);
          transform: translateY(-1px);
          color: var(--f-text-primary);
        }

        /* ── Bottom bar ── */
        .nr-bottom-bar {
          border-top: 1px dashed var(--f-border-subtle);
        }
        .nr-copyright {
          font-size: clamp(0.65rem, 1.4vw, 0.8rem);
          font-weight: 500; letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--f-text-copyright);
        }

        /* ── Mobile ── */
        @media (max-width: 640px) {
          .nr-glass-btn { width: 2rem; height: 2rem; }
          .nr-band3 { padding-top: 3.5rem !important; padding-bottom: 2.5rem !important; }
          .nr-logo-img { height: 100px !important; width: 100px !important; }
        }
      `}</style>

      {/* Grid bg */}
      <div className="nr-footer-grid" />

      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter width="3000%" x="-1000%" height="3000%" y="-1000%" id="unopaq">
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 3 0" />
        </filter>
      </svg>

      {/* ══ SPLIT BAND — always dark ══ */}
      <div ref={splitRef} className="relative z-10 split-band">
        <div
          ref={bandBorderRef}
          className="split-band-border"
          style={{ opacity: 0, transition: 'opacity 0.35s ease' }}
        />

        <svg
          ref={seamSvgRef}
          aria-hidden
          className="split-seam-line"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            zIndex: 10, pointerEvents: 'none', overflow: 'visible',
            opacity: 0, transition: 'opacity 0.2s ease',
          }}
        >
          <defs>
            <linearGradient id="seamGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.08)" />
              <stop offset="30%"  stopColor="rgba(255,255,255,0.45)" />
              <stop offset="70%"  stopColor="rgba(255,255,255,0.45)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
            </linearGradient>
          </defs>
          <line
            ref={seamLineRef}
            x1="0" y1="0"
            x2="0" y2="560"
            stroke="url(#seamGrad)"
            strokeWidth={1}
            strokeDasharray="5 5"
          />
        </svg>

        {/* Left: Contact Us */}
        <div className="split-panel split-panel-nl">
          <div className="split-panel-nl-bg" ref={nlBgRef} />
          <div className="split-panel-content">
            <div style={{ textAlign: 'left' }}>
              <p className="sp-eyebrow"><span className="sp-eyebrow-dot" />Get in Touch</p>
              <h2 className="sp-title">Contact Us</h2>
              <p className="sp-sub">
                Reach out directly — whether it&apos;s a question, a proposal, or a conversation worth having. We read everything.
              </p>
            </div>
            <div className="ct-email-list">
              {contactEmails.map(({ label, address }) => (
                <div key={label} className="ct-email-row">
                  <span className="ct-email-label">{label}</span>
                  <button
                    type="button"
                    className={`ct-email-btn${copiedEmail === address ? ' is-copied' : ''}`}
                    onClick={() => handleCopyEmail(address)}
                  >
                    <span>{copiedEmail === address ? 'Copied!' : address}</span>
                    <span className="ct-copy-icon">
                      <CopyIcon copied={copiedEmail === address} />
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Newsletter */}
        <div ref={ctPanelRef} className="split-panel split-panel-ct">
          <div className="split-panel-ct-bg" />
          <DotPattern
            containerRef={ctPanelRef}
            dotSize={1.5} gap={28}
            baseColor="#1e2a38" glowColor="#EB1143"
            proximity={110} glowIntensity={0.85} waveSpeed={0.35}
            baseOpacity={0.99}
          />
          <div className="split-panel-content" style={{ width: '100%', maxWidth: '100%' }}>
            <div style={{ textAlign: 'right' }}>
              <p className="sp-eyebrow" style={{ justifyContent: 'flex-end' }}><span className="sp-eyebrow-dot" />Notus Regalia Signal</p>
              <h2 className="sp-title">Newsletter</h2>
              <p className="sp-sub" style={{ width: '100%' }}>
                Curated insights on emerging ideas, ventures, and moments that matter — delivered sparingly, always with intent. No noise. No algorithms. Just signal.
              </p>
            </div>
            <div className="nl-slot">
              {submitState === 'success' ? (
                <div className="nl-slot-inner">
                  <p className="nl-success">
                    <i className="bi bi-check-circle-fill" />
                    You&apos;re in. Watch for the first dispatch.
                  </p>
                </div>
              ) : (
                <div className="nl-slot-inner">
                  <form onSubmit={handleNewsletterSubmit} style={{ width: '100%' }}>
                    <div className="nl-search-modal" onClick={() => emailInputRef.current?.focus()} style={{ cursor: 'text' }}>
                      <div className="nl-input-wrap">
                        <input
                          ref={emailInputRef} type="email" className="nl-input"
                          placeholder="youremail@gmail.com" value={email}
                          onChange={handleEmailChange} onKeyDown={handleEmailKeyDown}
                          required disabled={submitState === 'loading'}
                        />
                        {showSuggestion && (
                          <span className="nl-ghost-text" aria-hidden onClick={completeSuggestion}>
                            {email}<span className="nl-ghost-suffix">@gmail.com</span>
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
                        {showSuggestion && (
                          <button type="button" className="nl-autocomplete-pill" onClick={completeSuggestion}>
                            TAB
                            <span className="nl-tab-icon">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 10 4 15 9 20" />
                                <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                              </svg>
                            </span>
                          </button>
                        )}
                        <button type="submit" className="nl-btn" disabled={submitState === 'loading' || !email}>
                          {submitState === 'loading' ? <span className="spinner" /> : 'subscribe'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="nr-band-divider" />

      {/* ══ MAIN FOOTER BAND — themed ══ */}
      <div
        ref={band3Ref}
        className="nr-band3 relative z-10 w-full pt-20 pb-10"
      >
        <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-14 lg:gap-12 mb-16">

          {/* Brand */}
          <div className="flex flex-col items-center lg:items-start lg:w-1/3 space-y-6">
            <a
              href="/#hero" aria-label="Go to top"
              className="nr-logo-wrap group inline-flex"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--cx', `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty('--cy', `${e.clientY - r.top}px`);
              }}
            >
              <div className="nr-logo-inner">
                <Image
                  src={logoImage}
                  alt="Notus Regalia"
                  width={160} height={160}
                  className="nr-logo-img h-40 w-40 object-contain relative z-10 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                  priority={false}
                />
              </div>
            </a>
            <div className="space-y-3">
              <h3 className="nr-brand-title">
                Notus <span style={{ color: '#EB1143', fontWeight: 300 }}>Regalia</span>
              </h3>
              <div className="nr-tagline">
                <p>Beyond Perception.</p>
                <p>Beyond Form.</p>
                <p className="nr-tagline-em">Beyond Fate.</p>
              </div>
            </div>
            {/* Status badge — always dark bg so text contrast is stable */}
            <div className="nr-system-status">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: '#EB1143', boxShadow: '0 0 8px rgba(235,17,67,0.8)' }} />
              <span className="nr-system-status-text">the many return to one</span>
            </div>
          </div>

          {/* Nav */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-12 lg:w-2/3">
            {sections.map((section, idx) => (
              <div key={idx} className="nr-hud text-center sm:text-left">
                <h4 className="nr-nav-title">{section.title}</h4>
                <ul className="space-y-2.5 mt-4">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      {link.tabId && onNavigate ? (
                        <a
                          href="#"
                          className="nr-nav-link"
                          onClick={(e) => {
                            e.preventDefault();
                            onNavigate(link.tabId!, link.subtabId, link.infoContent);
                          }}
                        >
                          {link.label}
                        </a>
                      ) : (
                        <a href={link.href || '#'} className="nr-nav-link">{link.label}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col-reverse sm:flex-row items-center sm:justify-between justify-center pt-10 gap-5 nr-bottom-bar">
          <p className="nr-copyright">
            &copy; 2026 Notus Regalia — The Notus Dynasty
            <br />
            All rights reserved.
          </p>
          <div className="flex items-center gap-2.5">
            {['bi-twitter-x', 'bi-github', 'bi-discord', 'bi-linkedin'].map((icon, idx) => (
              <a key={idx} href="#" className="nr-glass-btn" aria-label={icon.replace('bi-', '')}>
                <i className={`bi ${icon} text-2xl`} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;