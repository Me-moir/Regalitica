"use client";
import Image from 'next/image';
import { useRef, useEffect } from 'react';

const logoImage = '/assets/Notosphere-logo.svg';

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const logoBadgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const rect = footer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        footer.style.setProperty('--mouse-x', `${x}px`);
        footer.style.setProperty('--mouse-y', `${y}px`);
        rafId = null;
      });
    };

    footer.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      footer.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const sections = [
    {
      title: 'Information',
      links: ['About', 'Organization', 'Vision', 'Ventures', 'Approach']
    },
    {
      title: 'Reach Out',
      links: ['Contact', 'Support', 'Feedback', 'Report bug']
    },
    {
      title: 'Tools',
      links: ["The Fool's Sandbox", "Attributions", "Resources"]
    },
    {
      title: 'Affiliates',
      links: ['Partners', 'Sponsors', 'Licenses']
    },
    {
      title: 'Community',
      links: ['Contribute', 'Build With Us', 'Become a Fool', 'Sandbox Program']
    },
    {
      title: 'Legal',
      links: ['Acceptable Use Policy', 'Terms & Conditions', 'Privacy Policy', 'Cookie Policy']
    }
  ];

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden mt-20 z-50 text-slate-300 glass-footer"
    >
      <style jsx>{`
        .footer-grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: linear-gradient(to bottom, transparent, black 6%, black 96%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 6%, black 96%, transparent);
          opacity: 0.7;
        }

        .footer-spotlight {
          background: radial-gradient(520px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(14,165,164,0.06), transparent 36%);
          transition: opacity 260ms ease;
        }

        .system-status { border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); }
        .system-status .preserve-system { color: inherit; }

        footer { border-top: none; }

        .tech-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          transition: color 180ms ease, text-shadow 180ms ease;
        }
        .tech-link::before,
        .tech-link::after {
          opacity: 0;
          color: #0ea5a4;
          transition: opacity 180ms ease, transform 180ms ease;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }
        .tech-link::before { content: '['; margin-right: 6px; transform: translateX(4px); }
        .tech-link::after { content: ']'; margin-left: 6px; transform: translateX(-4px); }
        .tech-link:hover { color: #ffffff; text-shadow: 0 0 10px rgba(255,255,255,0.18); }
        .tech-link:hover::before, .tech-link:hover::after { opacity: 1; transform: translateX(0); }

        .hud-border-top { position: relative; }
        .hud-border-top::before {
          content: '';
          position: absolute;
          top: -1px; left: 50%;
          width: 44px; height: 2px;
          transform: translateX(-50%);
          background: linear-gradient(90deg, #06b6d4, #0891b2);
          border-radius: 2px;
          opacity: 0.95;
        }
        @media (min-width: 1024px) {
          .hud-border-top::before { left: 0; transform: none; }
        }

        /*
          LOGO BADGE — outline-only, theme-agnostic
          ──────────────────────────────────────────
          Previous approach used a solid background on the inner .logo-badge to
          "cut out" the gradient, which created a jarring dark box in light mode
          (and a visible colour shift on theme switch).

          This approach instead clips the ::before gradient to only the padding
          ring using mask-composite: exclude — but critically, the OUTER wrapper
          has no fill, so the area behind the logo is always the footer surface
          itself (correct colour in any theme, no mismatch).

          The white-fringe artifact from mask-composite only appears when the
          mask edge is composited against a different-coloured solid fill. Here
          the interior of the mask reveals transparency (not a solid), so the
          logo's own pixels sit directly on the footer — no fringe possible.
        */
        .logo-badge-wrapper {
          position: relative;
          display: inline-flex;
          padding: 2px;
          border-radius: 1.125rem;
          background: transparent;
          cursor: pointer;
        }

        .logo-badge-wrapper::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: radial-gradient(
            360px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(0, 255, 166, 0.85),
            rgba(255, 215, 0, 0.65),
            rgba(236, 72, 153, 0.65),
            rgba(147, 51, 234, 0.65),
            rgba(59, 130, 246, 0.55),
            transparent 70%
          );
          /* Clip to padding ring only — interior stays transparent,
             so no solid fill behind the logo, no theme colour clash */
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 0;
        }

        .logo-badge-wrapper:hover::before { opacity: 1; }

        .logo-badge {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border-radius: 1rem;
          background: transparent; /* no fill — footer surface shows through */
          z-index: 1;
          width: fit-content;
        }

        .glass-footer {
          background: var(--glass-bg);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border-top: none;
          box-shadow:
            0 -8px 32px var(--glass-shadow-1), 0 -12px 48px var(--glass-shadow-2),
            inset 0 1px 1px var(--glass-inset-top), inset 0 -1px 1px var(--glass-inset-bottom);
          position: relative;
        }
        .glass-footer::before {
          content: ''; position: absolute; top: -1px; left: 0; right: 0; height: 1px;
          background: radial-gradient(600px circle at var(--mouse-x, 50%) 0%,
            rgba(0,255,166,0.9), rgba(255,215,0,0.7), rgba(236,72,153,0.7),
            rgba(147,51,234,0.6), rgba(59,130,246,0.5), transparent 70%);
          opacity: 0; transition: opacity 0.35s ease; pointer-events: none;
        }
        .glass-footer:hover::before { opacity: 1; }
        .glass-footer::after {
          content: '';
          position: absolute;
          left: 0; right: 0; top: 0;
          height: 1px;
          transform-origin: top;
          transform: scaleY(0.35);
          background: var(--border-color);
          opacity: 0.95;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .footer-grid-bg { background-size: 20px 20px; }
          .footer-spotlight { background-size: 360px; }
          .footer-brand { align-items: center; text-align: center; }
          .grid-sections { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; }
          .partner-status { justify-content: center; }
        }

        :global(.light) .glass-footer {
          background: linear-gradient(to bottom, #f8fafc 0%, #eef2f6 60%);
          color: var(--content-primary);
          border-top: none;
        }
        :global(.light) .glass-footer::after { background: var(--border-color); }
        :global(.light) .footer-grid-bg {
          background-image:
            linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px);
        }
        :global(.light) .footer-brand-title { color: #0f172a; }
        :global(.light) .footer-tagline { color: #0f172a; }
        :global(.light) .footer-tagline p { color: #0f172a; }
        :global(.light) .system-status { background: #000000; border-color: rgba(0,0,0,0.9); }
        :global(.light) .system-status .preserve-system { color: #ffffff; }
        :global(.light) .tech-link::before, :global(.light) .tech-link::after { color: #0ea5a4; }
        :global(.light) .tech-link { color: #0f172a; }
        :global(.light) .hud-border-top::before { background: linear-gradient(90deg, #06b6d4, #0891b2); }
        :global(.light) .partner-status { background: rgba(14,165,164,0.06); color: #0f172a; border-color: rgba(14,165,164,0.12); }
        /* No .logo-badge light-mode override needed — background: transparent works in both themes */
      `}</style>

      <div className="absolute inset-0 pointer-events-none footer-grid-bg" />
      <div className="absolute inset-0 pointer-events-none footer-spotlight opacity-0 transition-opacity duration-500 hover:opacity-100" />

      <div
        className="relative z-10 w-full pt-16 pb-8"
        style={{ paddingLeft: 'clamp(1.25rem, 5vw, 6rem)', paddingRight: 'clamp(1.25rem, 5vw, 6rem)' }}
      >
        <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-16 lg:gap-8 mb-16">

          {/* LEFT: Brand & Identity */}
          <div className="flex flex-col items-center lg:items-start lg:w-1/3 space-y-8">

            <div ref={logoBadgeRef} className="logo-badge-wrapper group">
              <div className="logo-badge">
                <Image
                  src={logoImage}
                  alt="Notosphere"
                  width={160}
                  height={160}
                  className="h-40 w-40 object-contain relative z-10 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                  priority={false}
                />
              </div>
            </div>

            <div className="space-y-4 footer-brand">
              <h3 className="text-2xl font-bold text-white footer-brand-title">
                Notosphere <span className="text-slate-500 font-light">Group</span>
              </h3>
              <div className="text-base font-light leading-relaxed text-slate-400 space-y-1 border-l border-white/10 pl-4 footer-tagline">
                <p>Beyond Perception.</p>
                <p>Beyond Form.</p>
                <p className="font-medium text-slate-200 mt-2">Beyond Fate.</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/5 bg-white/[0.02] rounded-sm system-status">
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse shadow-[0_0_8px_#14b8a6]" />
              <span className="text-[0.75rem] preserve-system uppercase tracking-widest text-slate-400">
                the many return to one
              </span>
            </div>
          </div>

          {/* RIGHT: Navigation Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-12 lg:w-2/3">
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-5 hud-border-top pt-4 text-center sm:text-left">
                <h4 className="text-sm font-sans uppercase text-slate-500 flex items-center gap-2 justify-center sm:justify-start">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a href="#" className="tech-link text-base text-slate-400">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col-reverse sm:flex-row items-center sm:justify-between justify-center pt-8 border-t border-dashed border-white/10 gap-6">
          <p className="text-[0.8rem] font-sans tracking-wider text-slate-500 uppercase">
            © 2026 Notosphere Group. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {['bi-twitter-x', 'bi-github', 'bi-discord', 'bi-linkedin'].map((icon, idx) => (
              <a
                key={idx}
                href="#"
                className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-sm bg-white/[0.02] text-slate-400 transition-all duration-300 hover:border-teal-500/50 hover:bg-teal-500/10 hover:text-teal-400"
              >
                <i className={`bi ${icon} text-sm`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;