"use client";
import { memo } from 'react';
import React from 'react';
import { contentData } from '@/data/information-data';
import ContentHeader from './ContentHeader';
import { CardSpotlight } from '@/components/ui/card-spotlight';

interface Partner {
  logo: React.ReactNode;
  name: string;
  purpose: string;
}

const ASSET_BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const partners: Partner[] = [
  {
    logo: (
      <img src={`${ASSET_BASE}/assets/aceternity.png`} alt="Aceternity logo" loading="lazy" style={{ width: 40, height: 40, objectFit: 'contain' }} />
    ),
    name: 'Aceternity',
    purpose: 'Library',
  },
  {
    logo: (
      <img src={`${ASSET_BASE}/assets/framer-motion.png`} alt="Framer Motion logo" loading="lazy" style={{ width: 40, height: 40, objectFit: 'contain' }} />
    ),
    name: 'Framer Motion',
    purpose: 'Library',
  },
  {
    logo: (
      <img src={`${ASSET_BASE}/assets/gsap.png`} alt="GreenSock Animation Platform logo" loading="lazy" style={{ width: 40, height: 40, objectFit: 'contain' }} />
    ),
    name: 'GreenSock Animation Platform',
    purpose: 'Library',
  },
  {
    logo: (
      <img src={`${ASSET_BASE}/assets/react-bits.png`} alt="React Bits logo" loading="lazy" style={{ width: 40, height: 40, objectFit: 'contain' }} />
    ),
    name: 'React Bits',
    purpose: 'Library',
  },
  {
    logo: (
      <img src={`${ASSET_BASE}/assets/shadcn-io.png`} alt="shadcn.io logo" loading="lazy" style={{ width: 40, height: 40, objectFit: 'contain' }} />
    ),
    name: 'Shadcn.io',
    purpose: 'Library',
  },
];

const PartnerCard = ({ partner }: { partner: Partner }) => (
  <>
    <CardSpotlight>
    {/* Icon pill — centered, bigger */}
    <div className="partner-logo" style={{
      width: 64, height: 64,
      borderRadius: '12px',
      background: '#000000',
      border: '1px solid rgba(255,255,255,0.14)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {partner.logo}
    </div>

    {/* Divider */}
    <hr style={{ width: '75%', height: '1px', background: 'hsl(240, 9%, 17%)', border: 'none', margin: 0 }} />

    {/* Text — centered, larger */}
    <div style={{ textAlign: 'center' }}>
      <p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', margin: 0, letterSpacing: '0.01em' }}>
        {partner.name}
      </p>
      <p style={{ color: 'hsl(0, 0%, 60%)', fontSize: '0.75rem', margin: '0.35rem 0 0', letterSpacing: '0.02em' }}>
        {partner.purpose}
      </p>
    </div>
    </CardSpotlight>
    <style>{`
      /* Stronger override: target both the card and inner wrapper so specificity beats CardSpotlight */
      html.light .uiverse-card .uiverse-card-inner > .partner-logo {
        background: #000000 !important;
        border: 1px solid rgba(255,255,255,0.14) !important;
      }
      /* Fallback even more specific */
      html.light div.uiverse-card div.uiverse-card-inner > div.partner-logo {
        background: #000000 !important;
        border: 1px solid rgba(255,255,255,0.14) !important;
      }

      /* Gradient hover overlay on the partner logo — matches CardSpotlight hover effect */
      .uiverse-card .uiverse-card-inner > .partner-logo {
        position: relative;
        overflow: visible;
      }

      /* Gradient animated frame border (masked) */
      .uiverse-card .uiverse-card-inner > .partner-logo::before {
        content: '';
        position: absolute;
        inset: -1px;
        border-radius: 12px;
        padding: 1px;
        background: radial-gradient(
          160px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
          rgba(0, 255, 166, 0.9),
          rgba(255, 215, 0, 0.7),
          rgba(236, 72, 153, 0.6),
          rgba(147, 51, 234, 0.55),
          rgba(59, 130, 246, 0.5),
          transparent 72%
        );
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0;
        transition: opacity 0.35s ease, transform 0.35s ease;
        pointer-events: none;
        z-index: 1;
      }

      /* Keep an inner sheen separate (optional) */
      .uiverse-card .uiverse-card-inner > .partner-logo::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 12px;
        background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.03), transparent 40%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        z-index: 0;
      }

      .uiverse-card:hover .uiverse-card-inner > .partner-logo::before,
      .uiverse-card:hover .uiverse-card-inner > .partner-logo::after {
        opacity: 1;
      }

      /* Ensure the logo image sits above the overlay */
      .uiverse-card .uiverse-card-inner > .partner-logo img {
        position: relative;
        z-index: 2;
      }
    `}</style>
  </>
);

interface AttributionsProps {
  isTransitioning?: boolean;
}

const content = contentData.attributions;

const Attributions = memo(({ isTransitioning = false }: AttributionsProps) => {
  return (
    <div className={`px-4 sm:px-8 lg:px-20 py-8 sm:py-12 lg:py-16 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">

        <ContentHeader
          icon={content.icon}
          title={content.title}
          isTransitioning={isTransitioning}
        />

        <div className="space-y-6 sm:space-y-8">
          {content.sections.map((section, index) => (
            <div key={index} className="space-y-3 sm:space-y-4">
              {section.heading && (
                <h3 className={`text-xl sm:text-2xl lg:text-3xl font-semibold ${section.heading === 'Acknowledgments' ? 'text-center' : ''}`} style={{ color: 'var(--content-primary)' }}>
                  {section.heading}
                </h3>
              )}
              <div className={section.heading === 'Acknowledgments' ? 'space-y-3 sm:space-y-4 text-center max-w-3xl mx-auto' : 'space-y-3 sm:space-y-4'}>
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className={section.heading === 'Acknowledgments' ? 'text-base sm:text-lg lg:text-xl leading-relaxed mx-auto' : 'text-base sm:text-lg lg:text-xl leading-relaxed'} style={{ color: 'var(--content-muted)' }}>
                    {paragraph}
                  </p>
                ))}
              </div>
              {index < content.sections.length - 1 && (
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent mt-6 sm:mt-8" />
              )}
            </div>
          ))}
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8">
          {partners.map((partner) => (
            <PartnerCard key={partner.name} partner={partner} />
          ))}
        </div>

        <div className="pt-6 sm:pt-8" style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-sm sm:text-base text-center" style={{ color: 'var(--content-muted)' }}>
            Last updated: January 2026 • All trademarks and logos are the property of their respective owners.
          </p>
        </div>

      </div>
    </div>
  );
});

Attributions.displayName = 'Attributions';
export default Attributions;