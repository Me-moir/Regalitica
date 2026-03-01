"use client";

import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import Image from 'next/image';
import Footer from '@/components/ui/Footer';
import ThemeToggle from '@/components/ui/ThemeToggle';
import SearchModal from '@/components/ui/SearchModal';
import { type CountryInfo, PRODUCTS } from '@/data/defense-data';
import { useSiteThemeIsLight, DARK_THEME, LIGHT_THEME } from '@/hooks/defense-themes';
import CountryCard from '@/components/ui/CountryCard';
import GlobeD3 from '@/components/ui/GlobeD3';
import { SigBlink, AcronymTagline } from '@/components/ui/defense-utils';

/* ═══════════════════════════════════════════════
   DEFENSE NAV DATA
   ═══════════════════════════════════════════════ */

interface SubtabItem {
  id: string;
  label: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  subtabs: SubtabItem[];
}

const DEFENSE_NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: 'bi-house',
    subtabs: [
      { id: 'overview', label: 'Overview' },
      { id: 'features', label: 'Features' },
      { id: 'systems-portfolio', label: 'Systems Portfolio' },
    ],
  },
  {
    id: 'megiddo',
    label: 'Megiddo',
    icon: 'bi-crosshair',
    subtabs: [
      { id: 'system-overview', label: 'System Overview' },
      { id: 'operational-role', label: 'Operational Role' },
      { id: 'capabilities', label: 'Capabilities' },
      { id: 'architecture', label: 'Architecture' },
      { id: 'framework', label: 'Framework' },
      { id: 'documentations', label: 'Documentations' },
    ],
  },
  {
    id: 'argos',
    label: 'Argos',
    icon: 'bi-eye',
    subtabs: [
      { id: 'system-overview', label: 'System Overview' },
      { id: 'operational-role', label: 'Operational Role' },
      { id: 'capabilities', label: 'Capabilities' },
      { id: 'architecture', label: 'Architecture' },
      { id: 'framework', label: 'Framework' },
      { id: 'documentations', label: 'Documentations' },
    ],
  },
];

const DEFAULT_SUBTABS: Record<string, string> = {
  home: 'overview',
  megiddo: 'system-overview',
  argos: 'system-overview',
};

/* ═══════════════════════════════════════════════
   PLACEHOLDER content per tab+subtab
   ═══════════════════════════════════════════════ */

function getPlaceholderContent(tabId: string, subtabId: string): { title: string; desc: string; items: { title: string; desc: string; icon: string }[] } {
  const systemName = tabId === 'megiddo' ? 'Megiddo' : tabId === 'argos' ? 'Argos' : '';

  const contentMap: Record<string, { title: string; desc: string; items: { title: string; desc: string; icon: string }[] }> = {
    // Home
    'home:overview': {
      title: 'Defense Systems Division — Overview',
      desc: 'The Defense Systems Division operates at the frontier of sovereign-grade technology, developing platforms that redefine operational security, intelligence processing, and strategic deterrence.',
      items: [
        { title: 'Mission Statement', desc: 'Deliver asymmetric technological advantage through vertically integrated defense platforms designed for multi-domain operational superiority.', icon: 'bi-bullseye' },
        { title: 'Operational Domain', desc: 'Spanning signal intelligence, autonomous systems, predictive analytics, and hardened communications across land, sea, air, space, and cyber domains.', icon: 'bi-globe2' },
        { title: 'Strategic Posture', desc: 'Defensive by doctrine, decisive by capability — our systems are built to deter, detect, and respond with precision proportionality.', icon: 'bi-shield-check' },
      ],
    },
    'home:features': {
      title: 'Core Features & Capabilities',
      desc: 'A structured overview of the primary feature sets and technological differentiators across the defense systems portfolio.',
      items: [
        { title: 'Real-Time Intelligence Fusion', desc: 'Multi-source data aggregation with sub-second latency, fusing signals intelligence, satellite imagery, and ground sensor networks into unified operational awareness.', icon: 'bi-cpu' },
        { title: 'Autonomous Decision Support', desc: 'AI-assisted decision frameworks that augment human operators with predictive scenario modeling and optimized response recommendations.', icon: 'bi-lightning-charge' },
        { title: 'Hardened Communications', desc: 'Quantum-resistant encrypted communications architecture ensuring operational integrity under adversarial electronic warfare conditions.', icon: 'bi-lock' },
        { title: 'Modular Architecture', desc: 'Plug-and-play system design enabling rapid configuration for theater-specific requirements without compromising core platform integrity.', icon: 'bi-grid-3x3' },
      ],
    },
    'home:systems-portfolio': {
      title: 'Systems Portfolio',
      desc: 'The defense division maintains two primary operational platforms, each addressing distinct but complementary domains of modern defense technology.',
      items: [
        { title: 'MEGIDDO', desc: 'Multi-Environment Ground Intelligence and Dynamic Defense Operations — a comprehensive ground-to-space defense coordination platform.', icon: 'bi-crosshair' },
        { title: 'ARGOS', desc: 'Advanced Reconnaissance and Global Observation System — a persistent wide-area surveillance and intelligence processing platform.', icon: 'bi-eye' },
      ],
    },

    // Megiddo subtabs
    'megiddo:system-overview': {
      title: `${systemName} — System Overview`,
      desc: `${systemName} represents a sovereign-grade defense coordination platform designed for multi-environment operational superiority.`,
      items: [
        { title: 'Platform Classification', desc: 'Tier-1 strategic defense platform with multi-domain integration capabilities spanning ground, maritime, aerial, and cyber operational theaters.', icon: 'bi-diagram-3' },
        { title: 'Operational Status', desc: 'Active development with modular subsystems in various stages of testing, integration, and operational deployment readiness.', icon: 'bi-activity' },
        { title: 'Integration Scope', desc: 'Designed for seamless integration with allied defense networks, NATO-standard data links, and proprietary secure communication channels.', icon: 'bi-link-45deg' },
      ],
    },
    'megiddo:operational-role': {
      title: `${systemName} — Operational Role`,
      desc: `The operational doctrine governing ${systemName} deployment, engagement parameters, and strategic positioning within the broader defense architecture.`,
      items: [
        { title: 'Primary Mission', desc: 'Theater-level coordination of defense assets with real-time situational awareness fusion and automated threat response orchestration.', icon: 'bi-bullseye' },
        { title: 'Secondary Capabilities', desc: 'Humanitarian operation support, disaster response coordination, and allied force interoperability in joint operational environments.', icon: 'bi-people' },
      ],
    },
    'megiddo:capabilities': {
      title: `${systemName} — Capabilities`,
      desc: `Technical capability matrix detailing the operational parameters, performance envelopes, and system specifications.`,
      items: [
        { title: 'Signal Processing', desc: 'Multi-spectrum signal intelligence processing with real-time classification, attribution, and geolocation capabilities.', icon: 'bi-broadcast' },
        { title: 'Autonomous Operations', desc: 'Semi-autonomous subsystem management with human-in-the-loop oversight for critical decision points.', icon: 'bi-robot' },
        { title: 'Environmental Resilience', desc: 'Operational certification across extreme temperature, electromagnetic, and kinetic threat environments.', icon: 'bi-shield-lock' },
      ],
    },
    'megiddo:architecture': {
      title: `${systemName} — Architecture`,
      desc: `System architecture documentation covering hardware topology, software stack, and integration interfaces.`,
      items: [
        { title: 'Core Architecture', desc: 'Distributed microservices architecture with edge computing nodes, central processing clusters, and redundant communication backbones.', icon: 'bi-hdd-stack' },
        { title: 'Data Pipeline', desc: 'Real-time data ingestion, processing, and distribution pipeline with guaranteed delivery and sub-100ms end-to-end latency.', icon: 'bi-arrow-repeat' },
      ],
    },
    'megiddo:framework': {
      title: `${systemName} — Framework`,
      desc: `Operational and development frameworks governing ${systemName} lifecycle management, upgrade protocols, and compliance verification.`,
      items: [
        { title: 'Development Framework', desc: 'Agile-hybrid development methodology with security-first design principles and continuous integration/deployment pipelines.', icon: 'bi-gear' },
        { title: 'Testing Framework', desc: 'Multi-stage verification including simulation, hardware-in-the-loop testing, and live operational evaluation protocols.', icon: 'bi-check2-all' },
      ],
    },
    'megiddo:documentations': {
      title: `${systemName} — Documentation`,
      desc: `Structured documentation library for ${systemName} system specifications, operational procedures, and maintenance protocols.`,
      items: [
        { title: 'Technical Specifications', desc: 'Detailed system specification documents covering all subsystems, interfaces, and performance parameters.', icon: 'bi-file-earmark-text' },
        { title: 'Operator Manuals', desc: 'Comprehensive operator training materials, standard operating procedures, and emergency response protocols.', icon: 'bi-journal-text' },
        { title: 'Integration Guides', desc: 'Technical integration documentation for allied system interoperability and third-party subsystem incorporation.', icon: 'bi-book' },
      ],
    },

    // Argos subtabs (mirror structure)
    'argos:system-overview': {
      title: `${systemName} — System Overview`,
      desc: `${systemName} is an advanced persistent surveillance and intelligence platform designed for continuous wide-area monitoring and threat detection.`,
      items: [
        { title: 'Platform Classification', desc: 'Tier-1 intelligence, surveillance, and reconnaissance (ISR) platform with global coverage capability and real-time processing.', icon: 'bi-diagram-3' },
        { title: 'Operational Status', desc: 'Active development with core surveillance subsystems in advanced testing and initial deployment qualification.', icon: 'bi-activity' },
        { title: 'Coverage Scope', desc: 'Multi-altitude, multi-spectrum observation capability from ground level to orbital assets with seamless handoff protocols.', icon: 'bi-binoculars' },
      ],
    },
    'argos:operational-role': {
      title: `${systemName} — Operational Role`,
      desc: `${systemName}'s operational role within the intelligence community and defense architecture — from strategic early warning to tactical support.`,
      items: [
        { title: 'Strategic Surveillance', desc: 'Continuous monitoring of areas of interest with automated change detection, anomaly flagging, and pattern recognition.', icon: 'bi-eye' },
        { title: 'Tactical Support', desc: 'Real-time intelligence feed to operational units with target identification, tracking, and engagement support capabilities.', icon: 'bi-crosshair' },
      ],
    },
    'argos:capabilities': {
      title: `${systemName} — Capabilities`,
      desc: `Technical capability specifications for the ${systemName} surveillance and reconnaissance platform.`,
      items: [
        { title: 'Multi-Spectrum Imaging', desc: 'Visible, infrared, synthetic aperture radar, and hyperspectral imaging with automated target recognition.', icon: 'bi-camera' },
        { title: 'Persistent Coverage', desc: '24/7 uninterrupted surveillance with automated asset handoff between orbital, aerial, and ground-based sensor platforms.', icon: 'bi-clock-history' },
        { title: 'AI-Driven Analysis', desc: 'Machine learning-powered image and signal analysis with automated reporting and human analyst augmentation.', icon: 'bi-cpu' },
      ],
    },
    'argos:architecture': {
      title: `${systemName} — Architecture`,
      desc: `System architecture and technical topology of the ${systemName} intelligence platform.`,
      items: [
        { title: 'Sensor Network', desc: 'Distributed sensor constellation with edge processing, secure data links, and centralized fusion architecture.', icon: 'bi-broadcast-pin' },
        { title: 'Processing Pipeline', desc: 'Scalable cloud-edge hybrid processing with automated triage, classification, and priority queuing for human review.', icon: 'bi-hdd-network' },
      ],
    },
    'argos:framework': {
      title: `${systemName} — Framework`,
      desc: `Development and operational frameworks for ${systemName} lifecycle management and continuous improvement.`,
      items: [
        { title: 'Collection Framework', desc: 'Structured intelligence collection protocols with automated tasking, scheduling, and quality assurance mechanisms.', icon: 'bi-collection' },
        { title: 'Dissemination Framework', desc: 'Tiered access intelligence distribution system with automated classification, redaction, and audience-appropriate formatting.', icon: 'bi-share' },
      ],
    },
    'argos:documentations': {
      title: `${systemName} — Documentation`,
      desc: `Documentation library for ${systemName} covering system specifications, analyst procedures, and data handling protocols.`,
      items: [
        { title: 'System Specifications', desc: 'Complete technical documentation of all Argos subsystems, sensor packages, and processing capabilities.', icon: 'bi-file-earmark-text' },
        { title: 'Analyst Procedures', desc: 'Standard operating procedures for intelligence analysts operating within the Argos ecosystem.', icon: 'bi-journal-text' },
        { title: 'Data Governance', desc: 'Data handling, retention, classification, and sharing policies governing all intelligence products.', icon: 'bi-shield-lock' },
      ],
    },
  };

  return contentMap[`${tabId}:${subtabId}`] || {
    title: 'Section Under Development',
    desc: 'This section is currently being prepared.',
    items: [],
  };
}

/* ═══════════════════════════════════════════════
   StripRow — carbon copy of Navbar StripRow
   ═══════════════════════════════════════════════ */

interface StripRowProps {
  item: NavItem;
  isVisible: boolean;
  activeSubtabId: string | null;
  onSubtabClick: (sub: SubtabItem) => void;
  onCollapse: () => void;
  isMobile?: boolean;
}

const StripRow = memo(({
  item, isVisible, activeSubtabId, onSubtabClick, onCollapse, isMobile,
}: StripRowProps) => {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [indStyle, setIndStyle] = useState<{ left: number; width: number } | null>(null);
  const [animate, setAnimate] = useState(false);
  const [entering, setEntering] = useState(false);
  const hasPlacedRef = useRef(false);
  const [atEnd, setAtEnd] = useState(false);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setAtEnd(maxScroll > 2 && track.scrollLeft >= maxScroll - 2);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const handler = () => updateScrollState();
    track.addEventListener('scroll', handler, { passive: true });
    updateScrollState();
    return () => track.removeEventListener('scroll', handler);
  }, [isVisible, updateScrollState]);

  useEffect(() => {
    if (!activeSubtabId || !isVisible) return;
    const idx = item.subtabs.findIndex(s => s.id === activeSubtabId);
    if (idx < 0) return;
    const btn = btnRefs.current[idx];
    const track = trackRef.current;
    if (!btn || !track) return;
    requestAnimationFrame(() => {
      const trackRect = track.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const btnCenter = btnRect.left + btnRect.width / 2 - trackRect.left + track.scrollLeft;
      const targetScroll = btnCenter - trackRect.width / 2;
      track.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
    });
  }, [activeSubtabId, isVisible, item.subtabs]);

  const place = useCallback((shouldAnimate: boolean) => {
    if (!activeSubtabId) return;
    const idx = item.subtabs.findIndex(s => s.id === activeSubtabId);
    if (idx < 0) return;
    const btn = btnRefs.current[idx];
    const track = trackRef.current;
    if (!btn || !track) return;

    let left = 0;
    let el: HTMLElement | null = btn;
    while (el && el !== track) {
      left += el.offsetLeft;
      el = el.offsetParent as HTMLElement | null;
    }
    const width = btn.offsetWidth;

    if (!shouldAnimate) {
      setAnimate(false);
      setIndStyle({ left, width });
      requestAnimationFrame(() => setAnimate(true));
    } else {
      setAnimate(true);
      setIndStyle({ left, width });
    }
    hasPlacedRef.current = true;
  }, [activeSubtabId, item.subtabs]);

  useEffect(() => {
    place(hasPlacedRef.current);
  }, [activeSubtabId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isVisible) {
      hasPlacedRef.current = false;
      setAnimate(false);
      setIndStyle(null);
      setEntering(false);
      return;
    }
    setEntering(true);
    const enterTimer = setTimeout(() => setEntering(false), 400);
    const t = setTimeout(() => place(false), 40);
    return () => { clearTimeout(t); clearTimeout(enterTimer); };
  }, [isVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  const indicatorCSSStyle: React.CSSProperties = {
    left: indStyle?.left ?? 0,
    width: indStyle?.width ?? 0,
    opacity: indStyle ? 1 : 0,
    transition: animate
      ? 'left 0.32s cubic-bezier(0.4, 0, 0.2, 1), width 0.32s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.18s ease'
      : 'none',
  };

  const handleArrowClick = useCallback(() => {
    if (isMobile && trackRef.current) {
      const track = trackRef.current;
      if (atEnd) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const maxScroll = track.scrollWidth - track.clientWidth;
        const newLeft = Math.min(track.scrollLeft + track.clientWidth * 0.65, maxScroll);
        track.scrollTo({ left: newLeft, behavior: 'smooth' });
      }
    } else {
      onCollapse();
    }
  }, [isMobile, atEnd, onCollapse]);

  const arrowIcon = isMobile
    ? (atEnd ? 'bi-chevron-left' : 'bi-chevron-right')
    : 'bi-chevron-up';

  return (
    <div className={`subtab-strip-outer${isVisible ? ' strip-visible' : ''}${entering ? ' strip-entering' : ''}`}>
      <div className="subtab-strip-clip">
        <div className="subtab-strip-inner">
          <div className="strip-tabs-track" ref={trackRef}>
            <div className="strip-indicator" style={indicatorCSSStyle} aria-hidden>
              <div className="strip-indicator-bg" />
              <div className="strip-indicator-line" />
            </div>
            {item.subtabs.map((sub, idx) => (
              <button
                key={sub.id}
                ref={el => { btnRefs.current[idx] = el; }}
                className={`strip-tab${activeSubtabId === sub.id ? ' strip-tab-active' : ''}`}
                style={{ '--si': idx } as React.CSSProperties}
                onClick={() => onSubtabClick(sub)}
              >
                {sub.label}
              </button>
            ))}
          </div>
          <button
            className="strip-collapse"
            onClick={handleArrowClick}
            aria-label={isMobile ? `Scroll ${item.label} sections` : `Hide ${item.label} sections`}
          >
            <i className={`bi ${arrowIcon}`} />
          </button>
        </div>
      </div>
    </div>
  );
});
StripRow.displayName = 'DefenseStripRow';


/* ═══════════════════════════════════════════════
   DEFENSE CONTENT RENDERER
   ═══════════════════════════════════════════════ */

function DefenseContent({ tabId, subtabId }: { tabId: string; subtabId: string }) {
  const content = getPlaceholderContent(tabId, subtabId);
  const currentTab = DEFENSE_NAV_ITEMS.find(t => t.id === tabId)!;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 24px 6rem' }}>
      {/* Content header */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          fontFamily: 'ui-monospace, Menlo, monospace',
          fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase',
          fontWeight: 700, color: '#E31B54', marginBottom: '1.25rem',
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%', background: '#E31B54',
            boxShadow: '0 0 0 0 rgba(227,27,84,.5)',
            animation: 'dfEyepulse 2s ease-in-out infinite',
          }} />
          {currentTab.label} {subtabId !== 'overview' ? `· ${currentTab.subtabs.find(s => s.id === subtabId)?.label}` : ''}
        </div>

        <h1 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700,
          letterSpacing: '-0.03em', lineHeight: 1.1,
          background: 'var(--text-gradient)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', marginBottom: '1rem',
        }}>
          {content.title}
        </h1>

        <p style={{
          fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--content-muted)',
          maxWidth: 700,
        }}>
          {content.desc}
        </p>

        <div style={{
          width: 48, height: 2, background: '#E31B54', borderRadius: 999,
          boxShadow: '0 0 8px rgba(227,27,84,0.5)', marginTop: '1.5rem',
        }} />
      </div>

      {/* Content cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: content.items.length <= 2 ? '1fr 1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
      }}>
        {content.items.map((item, i) => (
          <div key={i} style={{
            padding: '2rem', borderRadius: '0.75rem',
            border: '1px solid var(--border-color)', background: 'var(--gradient-card)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 2, background: 'linear-gradient(90deg, #E31B54, transparent)', opacity: 0.6 }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: 2, height: 40, background: 'linear-gradient(to bottom, #E31B54, transparent)', opacity: 0.6 }} />

            <div style={{
              width: 44, height: 44, borderRadius: '10px',
              border: '1px solid var(--border-color)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--surface-secondary)', marginBottom: '1rem',
            }}>
              <i className={`bi ${item.icon}`} style={{ fontSize: '1.1rem', color: 'var(--content-faint)' }} />
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>{item.title}</h3>
            <p style={{ fontSize: '0.82rem', lineHeight: 1.75, color: 'var(--content-tertiary)' }}>{item.desc}</p>

            <span style={{
              position: 'absolute', bottom: '0.75rem', right: '1rem',
              fontFamily: 'ui-monospace, Menlo, monospace',
              fontSize: '0.5rem', letterSpacing: '0.12em',
              color: 'var(--content-faint)', opacity: 0.4,
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>

      {/* Placeholder notice */}
      <div style={{
        marginTop: '3rem', padding: '3rem', borderRadius: '0.75rem',
        border: '1px dashed var(--border-dashed)', textAlign: 'center',
      }}>
        <i className="bi bi-hourglass-split" style={{ fontSize: '2rem', color: '#E31B54', marginBottom: '1rem', display: 'block' }} />
        <h3 style={{
          fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem',
          background: 'var(--text-gradient)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          Section Under Active Development
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--content-muted)', maxWidth: 480, margin: '0 auto' }}>
          Detailed documentation, interactive system diagrams, and operational specifications are being compiled for this section.
        </p>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   DEFENSE HERO — ported from original Defense tab
   ═══════════════════════════════════════════════ */

function DefenseHero() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);
  const [deselectSignal, setDeselectSignal] = useState(0);

  const isLight = useSiteThemeIsLight();
  const globeTheme = isLight ? LIGHT_THEME : DARK_THEME;

  const handleProductChange = (idx: number) => {
    if (idx === activeProduct) return;
    setIsTransitioning(true);
    setTimeout(() => { setActiveProduct(idx); setIsTransitioning(false); }, 180);
  };

  const handleCountryClose = () => {
    setSelectedCountry(null);
    setDeselectSignal(s => s + 1);
  };

  const product = PRODUCTS[activeProduct];

  const glassBg = isLight ? 'rgba(244,245,246,0.55)' : 'rgba(1,3,8,0.52)';
  const glassBorder = isLight ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.07)';
  const glassInsetHighlight = isLight ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.055)';
  const glassReflection = isLight
    ? 'linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.0) 100%)'
    : 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.0) 100%)';

  const isMegiddo = product.id === 'megiddo';

  return (
    <section style={{ minHeight: 'auto', marginTop: 0, background: 'transparent', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: globeTheme.panelBg, transition: 'background 0.4s ease', zIndex: 0 }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.018, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundRepeat: 'repeat', backgroundSize: '100px 100px', zIndex: 1 }} />

      <div className="dv-main-grid" style={{ display: 'grid', gridTemplateColumns: '50% 50%', borderTop: '1px dashed var(--border-dashed)', borderBottom: '1px dashed var(--border-dashed)', minHeight: '100vh', position: 'relative', zIndex: 2 }}>

        {/* LEFT: Liquid glass panel */}
        <div className="dv-hero-col" style={{
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid ' + glassBorder,
          position: 'relative', overflow: 'hidden', minHeight: '100vh',
          background: glassBg,
          backdropFilter: 'blur(28px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
          boxShadow: `inset 1px 0 0 ${glassInsetHighlight}, inset -1px 0 0 rgba(255,255,255,0.02)`,
          transition: 'background 0.4s ease, backdrop-filter 0.4s ease',
        }}>
          {!isLight && (
            <div key={product.id} style={{ position: 'absolute', inset: 0, backgroundImage: `url(${product.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center 30%', backgroundRepeat: 'no-repeat', opacity: 0.30, zIndex: 0, animation: 'dvBgFadeIn 0.7s ease forwards', pointerEvents: 'none' }} />
          )}
          {!isLight && (
            <div style={{ position: 'absolute', inset: 0, background: ['linear-gradient(to bottom, rgba(4,5,12,0.78) 0%, rgba(4,5,12,0.30) 30%, rgba(4,5,12,0.22) 55%, rgba(4,5,12,0.60) 82%, rgba(4,5,12,0.94) 100%)', 'linear-gradient(to right, rgba(4,5,12,0.62) 0%, rgba(4,5,12,0.18) 55%, rgba(4,5,12,0.0) 100%)', 'radial-gradient(ellipse at 0% 100%, rgba(227,27,84,0.22) 0%, transparent 52%)', 'radial-gradient(ellipse at 100% 0%, rgba(0,180,140,0.09) 0%, transparent 48%)', 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(4,5,12,0.55) 100%)'].join(', '), zIndex: 1, pointerEvents: 'none' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundRepeat: 'repeat', backgroundSize: '180px 180px', opacity: 0.032, zIndex: 2, pointerEvents: 'none', mixBlendMode: 'overlay' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.055) 3px, rgba(0,0,0,0.055) 4px)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, background: glassReflection, pointerEvents: 'none', zIndex: 3 }} />

          <div style={{ flex: 1, padding: '190px clamp(2.5rem, 5vw, 4.5rem) 0 clamp(3.5rem, 7vw, 6rem)', position: 'relative', zIndex: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3.25rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#E31B54', animation: 'dvPulse 2s ease infinite' }} />
                <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.58rem', letterSpacing: '0.22em', fontWeight: 700, color: '#E31B54', textTransform: 'uppercase' }}>Notus Regalia</span>
              </div>
              <span style={{ width: 1, height: 10, background: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
              <span className="dv-defense-label" style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.55rem', color: isLight ? 'rgba(0,0,0,0.30)' : 'rgba(255,255,255,0.22)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Defense Division</span>
            </div>

            <div style={{ height: '1.1rem', marginBottom: '1.1rem', overflow: 'hidden' }}>
              <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(227,27,84,0.65)', opacity: isTransitioning ? 0 : 1, transition: 'opacity 0.18s ease', display: 'block' }}>{product.eyebrow}</span>
            </div>

            <div style={{ height: 'clamp(3.2rem, 5.5vw, 5rem)', marginBottom: '0.55rem', overflow: 'hidden' }}>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.08, background: 'var(--text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? 'translateY(6px)' : 'translateY(0)', transition: 'opacity 0.18s ease, transform 0.18s ease' }}>{product.title}</h1>
            </div>

            <div style={{ marginBottom: '1.75rem', overflow: 'hidden' }}>
              <p style={{ fontSize: 'clamp(0.88rem, 1.15vw, 1.0rem)', fontWeight: 600, lineHeight: 1.55, color: 'var(--content-primary)', margin: 0, opacity: isTransitioning ? 0 : 1, transition: 'opacity 0.18s ease', letterSpacing: '-0.01em' }}>
                {isMegiddo
                  ? <AcronymTagline text={product.subtitle} isLight={isLight} />
                  : product.subtitle.split('\n\n')[0].trim()
                }
              </p>
            </div>

            <div style={{ width: 40, height: 2, background: '#E31B54', borderRadius: 999, boxShadow: '0 0 8px rgba(227,27,84,0.45)', marginBottom: '1.75rem', flexShrink: 0 }} />

            <div style={{ marginBottom: '2.75rem', overflow: 'hidden' }}>
              <div style={{ opacity: isTransitioning ? 0 : 1, transition: 'opacity 0.18s ease', fontSize: 'clamp(0.82rem, 1.05vw, 0.93rem)', lineHeight: 1.85, color: isLight ? 'rgba(0,0,0,0.62)' : 'rgba(255,255,255,0.75)' }}>
                <p style={{ margin: 0 }}>{product.subtitle.split('\n\n')[1]}</p>
              </div>
            </div>
          </div>

          {/* Carousel pinned to bottom */}
          <div style={{ width: '100%', flexShrink: 0, position: 'sticky', bottom: 0, zIndex: 6 }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', padding: '0 clamp(2.5rem, 5vw, 4.5rem) 0 clamp(3.5rem, 7vw, 6rem)', marginBottom: '1.5rem' }}>
              {[{ label: 'Request Briefing', icon: 'bi-arrow-right', primary: true }, { label: 'Learn More', icon: 'bi-arrow-down', primary: false }].map(btn => (
                <div key={btn.label} className="dv-lm-border" style={{ display: 'inline-flex', flexShrink: 0, borderRadius: '10.5px', padding: '1px', position: 'relative', background: 'transparent', isolation: 'isolate' }}>
                  <button className={`dv-lm-btn${!btn.primary ? ' dv-btn-secondary' : ''}`} style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 8, border: 'none', borderRadius: '9.5px', padding: btn.primary ? '0.75rem 1.5rem' : '0.75rem 1.25rem', fontSize: '0.85rem', fontWeight: btn.primary ? 600 : 500, letterSpacing: '0.01em', lineHeight: 1, cursor: 'pointer', whiteSpace: 'nowrap', background: btn.primary ? '#E31B54' : 'var(--navbar-bg, #0f0f0f)', color: btn.primary ? '#fff' : 'var(--content-faint)', boxShadow: btn.primary ? '0 4px 16px rgba(227,27,84,0.3)' : '0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 var(--glass-inset-top)', transition: 'all 0.15s ease' }}>
                    {btn.label}<i className={`bi ${btn.icon}`} style={{ fontSize: '0.8rem' }} />
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '10px clamp(2.5rem, 5vw, 4.5rem) 0 clamp(3.5rem, 7vw, 6rem)', marginBottom: '12px' }}>
              <span className="dv-sector-label" style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.55rem', letterSpacing: '0.18em', color: isLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.18)', textTransform: 'uppercase' }}>Product Systems</span>
              <div className="dv-sector-divider" style={{ flex: 1, height: 1, background: isLight ? 'linear-gradient(90deg, rgba(0,0,0,0.1), transparent)' : 'linear-gradient(90deg, rgba(255,255,255,0.07), transparent)' }} />
              <span className="dv-sector-counter" style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.5rem', color: isLight ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.12)', letterSpacing: '0.1em' }}>{activeProduct + 1} / {PRODUCTS.length}</span>
            </div>
            <div className="dv-carousel-grid">
              {PRODUCTS.map((p, i) => (
                <button key={p.id} className={`dv-carousel-cell${i === activeProduct ? ' active' : ''}`} onClick={() => handleProductChange(i)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                    <span className={i !== activeProduct ? 'dv-carousel-cell-tag-inactive' : ''} style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.18em', color: i === activeProduct ? '#E31B54' : isLight ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.25)', textTransform: 'uppercase', transition: 'color 0.22s' }}>{p.tag}</span>
                    {i === activeProduct && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#E31B54', animation: 'dvPulse 2s ease infinite', flexShrink: 0 }} />}
                  </div>
                  <div className={i === activeProduct ? 'dv-carousel-cell-title-active' : 'dv-carousel-cell-title-inactive'} style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.25, color: i === activeProduct ? isLight ? 'rgba(0,0,0,0.88)' : 'rgba(255,255,255,0.92)' : isLight ? 'rgba(0,0,0,0.32)' : 'rgba(255,255,255,0.35)', transition: 'color 0.22s', letterSpacing: '-0.01em' }}>{p.title}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Globe */}
        <div className="dv-globe-col" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', transition: 'background 0.4s ease' }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(${globeTheme.bgGrid} 1px, transparent 1px), linear-gradient(90deg, ${globeTheme.bgGrid} 1px, transparent 1px)`, backgroundSize: '38px 38px' }} />

          {[
            { text: '38\u00b054\u2032N 077\u00b002\u2032W', pos: { top: '4%', left: '5%' } },
            { text: null, pos: { top: '4%', right: '5%' } },
            { text: 'DRAG \u00b7 ROTATE', pos: { bottom: '4%', right: '5%' } },
          ].map((h, i) => (
            <span key={i} style={{ position: 'absolute', ...h.pos, fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.5rem', letterSpacing: '0.1em', color: globeTheme.hudText, pointerEvents: 'none', zIndex: 5, textTransform: 'uppercase' }}>
              {h.text ?? <SigBlink />}
            </span>
          ))}

          {[
            { top: '3%', left: '4%', borderTop: `1px solid ${globeTheme.hudBracket}`, borderLeft: `1px solid ${globeTheme.hudBracket}` },
            { top: '3%', right: '4%', borderTop: `1px solid ${globeTheme.hudBracket}`, borderRight: `1px solid ${globeTheme.hudBracket}` },
          ].map((b, i) => (
            <div key={i} style={{ position: 'absolute', width: 16, height: 16, pointerEvents: 'none', zIndex: 5, ...b }} />
          ))}

          <GlobeD3
            onCountrySelect={setSelectedCountry}
            theme={globeTheme}
            deselectSignal={deselectSignal}
            focusSignal={{ productId: PRODUCTS[activeProduct].id, active: true }}
          />

          {selectedCountry && (
            <CountryCard info={selectedCountry} onClose={handleCountryClose} isLight={isLight} />
          )}

          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%', background: `linear-gradient(to bottom, transparent, ${globeTheme.panelBg} 80%)`, pointerEvents: 'none', zIndex: 4 }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8%', background: `linear-gradient(to bottom, ${globeTheme.panelBg}, transparent)`, pointerEvents: 'none', zIndex: 4 }} />
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════════
   NAVBAR CSS — carbon copy of original
   ═══════════════════════════════════════════════ */

const DEFENSE_NAVBAR_CSS = `
@keyframes orbitBorder {
  0%   { background-position: 0% 0%; }
  100% { background-position: 200% 0%; }
}
@keyframes slimTabIn {
  from { opacity: 0; transform: translateX(8px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes dfEyepulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(227,27,84,.5); }
  50%       { opacity: .7; box-shadow: 0 0 0 5px rgba(227,27,84,0); }
}

/* ── Hero animations ── */
@keyframes dvOrbit { 0% { background-position: 0% 0%; } 100% { background-position: 200% 0%; } }
@keyframes dvBgFadeIn { from { opacity: 0; } to { opacity: 0.30; } }
@keyframes dvPulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(227,27,84,0.5); }
  50%       { opacity: .7; box-shadow: 0 0 0 4px rgba(227,27,84,0); }
}
@keyframes dvSpin { to { transform: rotate(360deg); } }
@keyframes dvFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes dvCardIn {
  from { opacity: 0; transform: translate(-50%, -46%) scale(0.96); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
@keyframes dvLegendFadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Hero orbit border button ── */
.dv-lm-border::before {
  content: ''; position: absolute; inset: 0; z-index: 0; border-radius: 10.5px;
  background: linear-gradient(90deg, rgba(0,255,166,0) 0%, rgba(0,255,166,0.9) 15%, rgba(255,215,0,0.7) 30%, rgba(236,72,153,0.7) 45%, rgba(147,51,234,0.7) 60%, rgba(59,130,246,0.6) 75%, rgba(0,255,166,0) 90%);
  background-size: 200% 100%; animation: dvOrbit 3s linear infinite;
  opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
}
.dv-lm-border:hover::before { opacity: 1; }
.dv-lm-border:hover .dv-lm-btn { color: var(--content-primary, rgba(255,255,255,0.92)) !important; }

/* ── Hero carousel ── */
.dv-carousel-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); width: 100%;
  border-top: 1px solid rgba(255,255,255,0.07);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
}
.dv-carousel-cell {
  position: relative; padding: 36px 32px 40px; min-height: 180px;
  cursor: pointer; border: none; background: transparent; text-align: left;
  transition: background 0.22s ease;
  border-right: 1px solid rgba(255,255,255,0.07);
}
.dv-carousel-cell:last-child { border-right: none; }
.dv-carousel-cell.active { background: rgba(227,27,84,0.06); }
.dv-carousel-cell.active::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, rgba(227,27,84,0.7), transparent);
}
.dv-carousel-cell:not(.active):hover { background: rgba(255,255,255,0.025); }

/* ── Hero light mode ── */
:root.light .dv-carousel-grid { border-top-color: rgba(0,0,0,0.09); }
:root.light .dv-carousel-cell { border-right-color: rgba(0,0,0,0.09); }
:root.light .dv-carousel-cell.active { background: rgba(227,27,84,0.05); }
:root.light .dv-carousel-cell:not(.active):hover { background: rgba(0,0,0,0.035); }
:root.light .dv-carousel-cell-tag-inactive { color: rgba(0,0,0,0.28) !important; }
:root.light .dv-carousel-cell-title-inactive { color: rgba(0,0,0,0.32) !important; }
:root.light .dv-carousel-cell-title-active { color: rgba(0,0,0,0.88) !important; }
:root.light .dv-carousel-cell-stat-inactive { color: rgba(0,0,0,0.18) !important; }
:root.light .dv-carousel-cell-statlabel { color: rgba(0,0,0,0.28) !important; }
:root.light .dv-sector-label { color: rgba(0,0,0,0.28) !important; }
:root.light .dv-sector-counter { color: rgba(0,0,0,0.22) !important; }
:root.light .dv-sector-divider { background: linear-gradient(90deg, rgba(0,0,0,0.07), transparent) !important; }
:root.light .dv-header-divider { background: rgba(0,0,0,0.1) !important; }
:root.light .dv-defense-label { color: rgba(0,0,0,0.3) !important; }
:root.light .dv-btn-secondary {
  background: rgba(255,255,255,0.9) !important;
  color: rgba(0,0,0,0.7) !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,1), 0 0 0 1px rgba(0,0,0,0.09) !important;
}
:root.light .dv-btn-secondary:hover { color: rgba(0,0,0,0.9) !important; }
:root.light .mob-subtab-btn.is-active::before { background: rgba(0,0,0,0.6); }

/* ── Hero responsive ── */
@media (max-width: 860px) {
  .dv-main-grid { grid-template-columns: 1fr !important; }
  .dv-globe-col { min-height: 50vh !important; order: 2; }
  .dv-hero-col  { order: 1; }
  .dv-carousel-grid { grid-template-columns: 1fr !important; }
  .dv-carousel-cell { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.07); }
  :root.light .dv-carousel-cell { border-bottom-color: rgba(0,0,0,0.09) !important; }
  .dv-carousel-cell:last-child { border-bottom: none; }
}

/* ── Search shortcut badge ── */
.search-shortcut {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 1px 6px; border-radius: 4px; margin-left: 8px;
  font-size: 0.65rem; font-weight: 600; letter-spacing: 0.02em;
  color: var(--content-faint); opacity: 0.6;
  background: var(--hover-bg); border: 1px solid var(--border-color);
}

:root.light .glass-navbar {
  background: linear-gradient(to bottom, #f8fafc 0%, #eef2f6 60%);
  border-bottom: 1px solid rgba(0,0,0,0.08);
}
:root.light .glass-navbar::before { display: none; }

.glass-navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 60;
  background: linear-gradient(160deg, #0a0a0f 0%, #0d0d14 60%, #080810 100%);
  backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255,255,255,0.07);
  box-shadow:
    0 8px 32px var(--glass-shadow-1), 0 12px 48px var(--glass-shadow-2),
    inset 0 1px 1px var(--glass-inset-top), inset 0 -1px 1px var(--glass-inset-bottom);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease;
  will-change: transform, opacity;
}
.glass-navbar.nav-collapsed {
  transform: translateY(-100%); opacity: 0; pointer-events: none;
}
.glass-navbar::before {
  content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 1px;
  background: radial-gradient(400px circle at var(--mouse-x, 50%) 100%,
    rgba(0,255,166,0.45), rgba(255,215,0,0.35), rgba(236,72,153,0.35),
    rgba(147,51,234,0.28), rgba(59,130,246,0.22), transparent 70%);
  opacity: 0; transition: opacity 0.35s ease; pointer-events: none;
}
.glass-navbar:hover::before { opacity: 1; }

.logo-mark {
  display: flex; align-items: center; gap: 12px; user-select: none;
  border: none; background: transparent; padding: 0; cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.34,1.18,0.64,1);
}
.logo-mark:hover { transform: scale(1.08); }
.logo-mark:active { transform: scale(1.02); }
.logo-icon {
  width: 42px; height: 42px; border-radius: 10px;
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 60%, #111 100%);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  box-shadow: 0 0 14px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08);
  overflow: hidden;
}
.logo-text { font-size: 1.18rem; font-weight: 800; letter-spacing: -0.03em; color: var(--content-primary); line-height: 1; }

.nav-reveal-tab,
.nav-theme-tab {
  position: fixed; right: 0; z-index: 59;
  display: flex; align-items: center; gap: 7px;
  padding: 9px 14px 9px 12px;
  border-radius: 10px 0 0 10px;
  background: var(--glass-bg, rgba(15,15,15,0.85));
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color); border-right: none;
  color: var(--content-faint); font-size: 0.8rem; font-weight: 600;
  letter-spacing: 0.02em; cursor: pointer;
  box-shadow: -4px 4px 24px rgba(0,0,0,0.25);
  opacity: 0; pointer-events: none; transform: translateX(100%);
  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.38s cubic-bezier(0.34, 1.18, 0.64, 1), color 0.15s ease;
}
.nav-reveal-tab { top: 16px; }
.nav-theme-tab  { top: calc(16px + 38px + 6px); }
.nav-reveal-tab, .nav-theme-tab { min-width: 118px; justify-content: flex-start; }
.nav-reveal-tab.tab-visible, .nav-theme-tab.tab-visible { opacity: 1; pointer-events: auto; transform: translateX(0); }
.nav-reveal-tab:hover, .nav-theme-tab:hover { color: var(--content-primary); }
.nav-reveal-tab::before, .nav-theme-tab::before {
  content: ''; position: absolute; left: 0; top: 4px; bottom: 4px; width: 2.5px;
  border-radius: 999px; background: linear-gradient(180deg, rgba(220,20,60,1) 0%, rgba(200,15,50,0.9) 50%, rgba(180,10,40,0.75) 100%);
  opacity: 0.9; box-shadow: 0 0 6px rgba(220,20,60,0.6);
}

.nav-icon-btn-wrap { position: relative; }
.nav-icon-btn-wrap::after {
  content: attr(data-tooltip);
  position: absolute; top: calc(100% + 8px); left: 50%;
  transform: translateX(-50%) translateY(-4px);
  background: rgba(20,20,28,0.96); color: rgba(255,255,255,0.88);
  font-size: 0.72rem; font-weight: 600; letter-spacing: 0.03em; white-space: nowrap;
  padding: 5px 9px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 4px 16px rgba(0,0,0,0.4); pointer-events: none; opacity: 0;
  transition: opacity 0.18s ease, transform 0.18s ease; z-index: 100;
}
.nav-icon-btn-wrap:hover::after { opacity: 1; transform: translateX(-50%) translateY(0); }
:root.light .nav-icon-btn-wrap::after {
  background: rgba(255,255,255,0.97); color: rgba(0,0,0,0.8);
  border-color: rgba(0,0,0,0.12); box-shadow: 0 4px 16px rgba(0,0,0,0.14);
}

.nav-divider { width: 1px; background: linear-gradient(to bottom, transparent, var(--border-color), transparent); margin: 0 4px; flex-shrink: 0; }
.nav-center { position: relative; flex: 1; min-width: 0; display: flex; align-items: center; overflow: visible; }
.tabs-row { display: flex; align-items: center; gap: 12px; width: 100%; pointer-events: auto; }
.nav-right-controls { display: flex; align-items: center; gap: 8px; flex-shrink: 0; margin-left: auto; position: relative; z-index: 20; }

.tab-item-border {
  display: inline-flex; flex-shrink: 0; border-radius: 10.5px; padding: 1.5px; position: relative; background: transparent;
}
.tab-item-border::before {
  content: ''; position: absolute; inset: 0; border-radius: 10.5px; padding: 1.5px;
  background: linear-gradient(90deg, rgba(0,255,166,0.0) 0%, rgba(0,255,166,0.7) 15%, rgba(255,215,0,0.6) 30%, rgba(236,72,153,0.6) 45%, rgba(147,51,234,0.6) 60%, rgba(59,130,246,0.55) 75%, rgba(0,255,166,0.0) 90%);
  background-size: 200% 100%; animation: orbitBorder 3s linear infinite;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
}
.tab-item-border:hover::before, .tab-item-border.is-active::before { opacity: 1; }

.tab-item {
  display: inline-flex; align-items: stretch; border-radius: 9.5px; overflow: hidden;
  box-shadow: inset 0 1px 0 var(--glass-inset-top); transition: box-shadow 0.2s ease;
  flex-shrink: 0; background: var(--navbar-bg, #0f0f0f); position: relative; width: 100%; z-index: 1;
}
.tab-item-border:hover .tab-item { box-shadow: 0 2px 6px rgba(0,0,0,0.12), inset 0 1px 0 var(--glass-inset-top); }
.tab-item.is-active { background: var(--navbar-bg-active, #1a1a1a); }

:root.light .tab-item {
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1);
  outline: 1px solid rgba(0,0,0,0.11);
}
:root.light .tab-item.is-active {
  background: #f5f5f5;
  box-shadow: 0 2px 8px rgba(0,0,0,0.13), 0 5px 20px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.8);
  outline: 1px solid rgba(0,0,0,0.15);
}
:root.light .tab-item-border:hover .tab-item {
  box-shadow: 0 4px 12px rgba(0,0,0,0.14), 0 8px 24px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,1);
  outline: 1px solid rgba(0,0,0,0.15);
}

.tab-label-btn {
  display: inline-flex; align-items: center; gap: 7px; border: none; background: transparent;
  cursor: pointer; font-weight: 500; letter-spacing: 0.01em; color: var(--content-faint);
  padding: 11px 14px 11px 20px; font-size: 0.97rem; line-height: 1;
  transition: color 0.15s ease; user-select: none;
}
.tab-label-btn:hover, .tab-label-btn.is-active { color: var(--content-primary); }
.tab-label-btn.is-active { font-weight: 600; }

.tab-sep { width: 1px; margin: 6px 0; background: var(--border-color); opacity: 0.45; flex-shrink: 0; pointer-events: none; }

.tab-arrow-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; border: none; background: transparent; cursor: pointer;
  color: var(--content-faint); transition: color 0.15s ease, background 0.15s ease;
  flex-shrink: 0; padding: 0; border-radius: 0 8px 8px 0;
}
.tab-arrow-btn:hover { color: var(--content-primary); background: rgba(255,255,255,0.08); }
.tab-arrow-btn .arrow-icon { font-size: 0.62rem; transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.tab-arrow-btn.arrow-open .arrow-icon { transform: rotate(180deg); }
.tab-arrow-btn.arrow-open { color: var(--content-primary); background: rgba(255,255,255,0.06); }

.subtab-strip-outer {
  display: grid; grid-template-rows: 0fr; opacity: 0; pointer-events: none;
  border-top: 1px solid transparent;
  transition: grid-template-rows 0.38s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.28s ease, border-top-color 0.3s ease;
}
.subtab-strip-outer.strip-visible { grid-template-rows: 1fr; opacity: 1; border-top-color: var(--border-color); pointer-events: auto; }
.subtab-strip-clip { overflow: hidden; min-height: 0; }
.subtab-strip-inner { display: flex; align-items: stretch; height: 50px; overflow: hidden; }

.strip-tabs-track {
  position: relative; display: flex; align-items: stretch; flex: 1; min-width: 0;
  overflow-x: auto; scrollbar-width: none;
}
.strip-tabs-track::-webkit-scrollbar { display: none; }

.strip-tab {
  position: relative; display: inline-flex; align-items: center; justify-content: center;
  padding: 0 22px; border: none; background: transparent;
  color: var(--content-muted); font-size: 0.88rem; font-weight: 500;
  cursor: pointer; flex-shrink: 0; white-space: nowrap;
  transition: color 0.22s ease;
  border-right: 1px solid var(--border-color);
  letter-spacing: 0.01em; z-index: 1;
}
.strip-tab:hover { color: var(--content-primary); }
.strip-tab.strip-tab-active { color: var(--content-primary); font-weight: 600; }

.strip-indicator {
  position: absolute; top: 0; bottom: 0; pointer-events: none; z-index: 0;
}
.strip-indicator-bg { position: absolute; inset: 0; background: rgba(255,255,255,0.06); transition: background 0.2s ease; }
:root.light .strip-indicator-bg { background: rgba(0,0,0,0.065); }
.strip-indicator-line {
  position: absolute; bottom: 0; left: 14px; right: 14px; height: 2px; border-radius: 999px;
  background: linear-gradient(90deg, transparent 0%, rgba(0,255,166,0.6) 15%, rgba(255,215,0,0.45) 30%, rgba(236,72,153,0.45) 45%, rgba(147,51,234,0.45) 60%, rgba(59,130,246,0.4) 75%, transparent 90%);
  background-size: 200% 100%; animation: orbitBorder 2.5s linear infinite;
}
:root.light .strip-indicator-line { display: none; }

.subtab-strip-outer.strip-entering .strip-tab {
  animation: slimTabIn 0.22s cubic-bezier(0.34,1.18,0.64,1) both;
  animation-delay: calc(var(--si, 0) * 0.035s + 0.04s);
}

.strip-collapse {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0 20px; border: none; background: transparent;
  color: var(--content-muted); cursor: pointer; flex-shrink: 0;
  transition: color 0.14s ease, background 0.14s ease;
  border-left: 1px solid var(--border-color); margin-left: auto;
}
.strip-collapse:hover { color: var(--content-primary); background: rgba(255,255,255,0.03); }
.strip-collapse i { font-size: 0.7rem; transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1); }
.strip-collapse:hover i { transform: translateY(-2px); }

@keyframes tabPress {
  0%   { transform: scale(1); }
  15%  { transform: scale(0.96); }
  50%  { transform: scale(1.02); }
  72%  { transform: scale(0.992); }
  88%  { transform: scale(1.004); }
  100% { transform: scale(1); }
}
.tab-pressed { animation: tabPress 0.38s cubic-bezier(0.34,1.18,0.64,1); }

@media (max-width: 640px) {
  .nav-center, .nav-divider.desktop-only { display: none; }
  .tab-sep, .tab-arrow-btn { display: none; }
  .tab-label-btn { padding: 6px 11px; font-size: 0.84rem; }
  .collapse-btn-desktop { display: none !important; }
  .nav-icon-btn-wrap::after { display: none; }
  .strip-tab { padding: 0 14px; font-size: 0.82rem; }
  .strip-collapse { padding: 0 14px; }
}

.mobile-burger {
  display: none; align-items: center; justify-content: center;
  width: 42px; height: 42px; border-radius: 10px;
  border: none; background: transparent; color: var(--content-faint);
  font-size: 1.2rem; cursor: pointer; transition: color 0.15s ease, background 0.15s ease;
  flex-shrink: 0; margin-left: auto;
}
.mobile-burger:hover { color: var(--content-primary); background: var(--hover-bg); }
@media (max-width: 640px) { .mobile-burger { display: inline-flex; } }

.mob-overlay {
  position: fixed; inset: 0; z-index: 90;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
  opacity: 0; pointer-events: none; transition: opacity 0.25s ease;
}
.mob-overlay.open { opacity: 1; pointer-events: auto; }
.mob-sidebar {
  position: fixed; top: 0; right: 0; bottom: 0; width: min(320px, 85vw); z-index: 91;
  background: var(--surface-secondary); border-left: 1px solid var(--border-color);
  box-shadow: -8px 0 32px rgba(0,0,0,0.3); display: flex; flex-direction: column;
  transform: translateX(100%); transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
}
.mob-sidebar.open { transform: translateX(0); }
.mob-header { display: flex; align-items: center; gap: 12px; padding: 18px 20px; border-bottom: 1px solid var(--border-color); flex-shrink: 0; }
.mob-header-title { font-size: 1rem; font-weight: 700; color: var(--content-primary); letter-spacing: -0.01em; }
.mob-close { margin-left: auto; display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 8px; border: none; background: transparent; color: var(--content-faint); font-size: 0.9rem; cursor: pointer; transition: color 0.12s ease, background 0.12s ease; }
.mob-close:hover { color: var(--content-primary); background: var(--hover-bg-strong); }
.mob-nav-list { display: flex; flex-direction: column; padding: 8px 0; flex: 1; }
.mob-tab-btn { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 15px 20px; border: none; background: transparent; color: var(--content-faint); font-size: 1rem; font-weight: 500; cursor: pointer; transition: color 0.12s ease, background 0.12s ease; user-select: none; }
.mob-tab-btn:hover { color: var(--content-primary); background: var(--hover-bg); }
.mob-tab-btn.is-active { color: var(--content-primary); font-weight: 600; background: var(--hover-bg-strong); }
.mob-tab-left { display: flex; align-items: center; gap: 10px; }
.mob-tab-left i { font-size: 0.92rem; width: 20px; text-align: center; }
.mob-tab-chevron { font-size: 0.65rem; transition: transform 0.2s ease; color: var(--content-faint); }
.mob-tab-chevron.open { transform: rotate(90deg); }
.mob-subtabs { overflow: hidden; transition: max-height 0.25s ease, opacity 0.2s ease; }
.mob-subtabs.collapsed { max-height: 0; opacity: 0; }
.mob-subtabs.expanded { max-height: 500px; opacity: 1; }
.mob-subtab-btn { display: flex; align-items: center; gap: 8px; width: 100%; padding: 12px 20px 12px 50px; border: none; background: transparent; color: var(--content-faint); font-size: 0.93rem; font-weight: 400; cursor: pointer; transition: color 0.12s ease, background 0.12s ease; user-select: none; }
.mob-subtab-btn:hover { color: var(--content-primary); background: var(--hover-bg); }
.mob-subtab-btn.is-active { color: var(--content-primary); font-weight: 600; position: relative; }
.mob-subtab-btn.is-active::before { content: ''; position: absolute; left: 36px; top: 50%; transform: translateY(-50%); width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.8); }
`;


/* ═══════════════════════════════════════════════
   DEFENSE PAGE — Full site carbon copy
   ═══════════════════════════════════════════════ */

export default function DefenseSitePage() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeSubtab, setActiveSubtab] = useState<string | undefined>('overview');
  const [stripOpen, setStripOpen] = useState(true);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpandedTab, setMobileExpandedTab] = useState<string | null>(null);
  const [displayedTab, setDisplayedTab] = useState('home');
  const [displayedSubtab, setDisplayedSubtab] = useState('overview');
  const [searchOpen, setSearchOpen] = useState(false);

  const navContainerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const manualOpenRef = useRef(false);
  const touchRef = useRef<{ startX: number; startY: number } | null>(null);
  const navCollapsedRef = useRef(false);

  // ── Responsive ──
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const check = () => { clearTimeout(t); t = setTimeout(() => setIsMobile(window.innerWidth < 640), 150); };
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener('resize', check); };
  }, []);

  // ── Mouse gradient accent ──
  useEffect(() => {
    const el = navContainerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mouse-x', `${((e.clientX - r.left) / r.width) * 100}%`);
        rafIdRef.current = null;
      });
    };
    document.addEventListener('mousemove', onMove, { passive: true });
    return () => { document.removeEventListener('mousemove', onMove); if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current); };
  }, []);

  // ── Content transitions ──
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedTab(activeTab);
      setDisplayedSubtab(activeSubtab || DEFAULT_SUBTABS[activeTab]);
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTab, activeSubtab]);

  // ── Tab changes → reset strip ──
  useEffect(() => {
    manualOpenRef.current = false;
    setStripOpen(true);
    setActiveSubtab(DEFAULT_SUBTABS[activeTab]);
  }, [activeTab]);

  // ── Collapse / show nav ──
  const handleCollapseNav = useCallback(() => {
    setNavCollapsed(true);
    navCollapsedRef.current = true;
    setStripOpen(false);
    let hasScrolledAway = window.scrollY > 10;
    const restore = () => {
      if (!hasScrolledAway) { if (window.scrollY > 10) hasScrolledAway = true; return; }
      if (window.scrollY <= 10) { setNavCollapsed(false); navCollapsedRef.current = false; window.removeEventListener('scroll', restore); }
    };
    window.addEventListener('scroll', restore, { passive: true });
  }, []);

  const handleShowNav = useCallback(() => {
    setNavCollapsed(false);
    navCollapsedRef.current = false;
  }, []);

  // ── Tab click ──
  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ── Arrow toggle ──
  const handleArrowToggle = useCallback((tabId: string) => {
    if (tabId !== activeTab) {
      setActiveTab(tabId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setStripOpen(prev => {
      const next = !prev;
      manualOpenRef.current = next;
      return next;
    });
  }, [activeTab]);

  // ── Subtab click ──
  const handleSubtabClick = useCallback((sub: SubtabItem) => {
    setActiveSubtab(sub.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ── Go home ──
  const goHome = useCallback(() => {
    window.location.href = '/?tab=technologies';
  }, []);

  // ── Search ──
  const openSearch  = useCallback(() => setSearchOpen(true),  []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(p => !p); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSearchNavigate = useCallback((tabId: string, subtabId?: string) => {
    const defenseTabIds = ['home', 'megiddo', 'argos'];
    if (defenseTabIds.includes(tabId)) {
      setActiveTab(tabId);
      if (subtabId) setActiveSubtab(subtabId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = `/?tab=${tabId}${subtabId ? `&subtab=${subtabId}` : ''}`;
    }
    setSearchOpen(false);
  }, []);

  // ── Mobile sidebar ──
  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => { setMobileOpen(false); setMobileExpandedTab(null); }, []);
  const toggleMobileTab = useCallback((id: string) => setMobileExpandedTab(p => p === id ? null : id), []);

  const handleMobileTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId); setMobileOpen(false); setMobileExpandedTab(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleMobileSubtabClick = useCallback((parentTabId: string, sub: SubtabItem) => {
    setActiveTab(parentTabId); setActiveSubtab(sub.id);
    setMobileOpen(false); setMobileExpandedTab(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const onSidebarTouchStart = useCallback((e: React.TouchEvent) => {
    touchRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY };
  }, []);
  const onSidebarTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.startX;
    const dy = Math.abs(e.changedTouches[0].clientY - touchRef.current.startY);
    touchRef.current = null;
    if (dx > 60 && dy < dx) closeMobile();
  }, [closeMobile]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // ── Spring press listener ──
  useEffect(() => {
    const SELECTORS = [
      '.tab-item-border', '.tab-label-btn', '.tab-arrow-btn',
      '.strip-tab', '.strip-collapse', '.logo-mark', '.mob-tab-btn',
      '.mob-subtab-btn', '.mob-close', '.nav-reveal-tab', '.nav-theme-tab', '.mobile-burger',
    ].join(', ');
    const onPointerDown = (e: PointerEvent) => {
      const target = (e.target as Element).closest(SELECTORS);
      if (!target) return;
      target.classList.remove('tab-pressed');
      void (target as HTMLElement).offsetWidth;
      target.classList.add('tab-pressed');
      const cleanup = () => { target.classList.remove('tab-pressed'); target.removeEventListener('animationend', cleanup); };
      target.addEventListener('animationend', cleanup);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  // ── Derived ──
  const activeSet = useMemo(() => {
    const set = new Set<string>();
    set.add(activeTab);
    return set;
  }, [activeTab]);

  const barStyle = useMemo(() => ({
    height: isMobile ? '68px' : '84px',
    paddingLeft: isMobile ? '16px' : '36px',
    paddingRight: isMobile ? '16px' : '36px',
    gap: isMobile ? '10px' : '16px',
  }), [isMobile]);

  const isTransitioning = activeTab !== displayedTab || activeSubtab !== displayedSubtab;

  // Footer navigate — route back to main site sections
  const handleFooterNavigate = useCallback((tabId: string) => {
    window.location.href = `/?tab=${tabId}`;
  }, []);

  return (
    <>
      <style>{DEFENSE_NAVBAR_CSS}</style>

      <div className="min-h-screen theme-transition" style={{ background: 'var(--surface-primary)', color: 'var(--content-primary)' }}>

        {/* ══ STICKY REVEAL TAB ══ */}
        <button
          className={`nav-reveal-tab${navCollapsed ? ' tab-visible' : ''}`}
          onClick={handleShowNav}
          aria-label="Show navigation bar"
        >
          <i className="bi bi-eye reveal-tab-icon" style={{ fontSize: '0.9rem' }} />
          {!isMobile && <span>Show Nav</span>}
        </button>

        {/* ══ NAVBAR ══ */}
        <nav ref={navContainerRef} className={`glass-navbar${navCollapsed ? ' nav-collapsed' : ''}`}>

          {/* Main bar row */}
          <div className="w-full flex items-center" style={barStyle}>

            {/* Logo — clicking goes back to main site */}
            <button className="logo-mark flex-shrink-0" onClick={goHome} aria-label="Back to Notus Regalia">
              <div className="logo-icon">
                <Image src="/assets/Notus-Regalia-logo.svg" alt="Notus Regalia" width={42} height={42} priority />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span className="logo-text" style={{ fontSize: isMobile ? '0.95rem' : undefined }}>
                  Notus <span style={{ color: '#EB1143', fontWeight: 300 }}>Regalia</span>
                </span>
                <span style={{
                  fontFamily: 'ui-monospace, Menlo, monospace',
                  fontSize: '0.5rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: '#E31B54', fontWeight: 600, marginTop: 2,
                }}>
                  Defense Systems
                </span>
              </div>
            </button>

            <div className="nav-divider desktop-only" style={{ height: '32px', alignSelf: 'center' }} />

            {/* Tab pills */}
            <div className="nav-center">
              <div className="tabs-row">
                {DEFENSE_NAV_ITEMS.map(item => {
                  const active = activeSet.has(item.id);
                  const isActiveTab = item.id === activeTab;
                  const arrowOpen = isActiveTab && stripOpen;
                  return (
                    <div key={item.id} className={`tab-item-border${active ? ' is-active' : ''}`}>
                      <div className={`tab-item${active ? ' is-active' : ''}`}>
                        <button
                          className={`tab-label-btn${active ? ' is-active' : ''}`}
                          onClick={() => handleTabClick(item.id)}
                          style={{ fontSize: isMobile ? '0.84rem' : '0.97rem' }}
                        >
                          {item.label}
                        </button>
                        <span className="tab-sep" />
                        <button
                          className={`tab-arrow-btn${arrowOpen ? ' arrow-open' : ''}`}
                          onClick={() => handleArrowToggle(item.id)}
                          aria-label={arrowOpen ? `Hide ${item.label} sections` : `Show ${item.label} sections`}
                        >
                          <i className="bi bi-chevron-down arrow-icon" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right controls */}
            <div className="nav-right-controls">
              <div className="tab-item-border nav-icon-btn-wrap" data-tooltip="Search">
                <div className="tab-item">
                  <button
                    className="tab-label-btn"
                    onClick={openSearch}
                    aria-label="Open search"
                    style={{ padding: isMobile ? '11px 13px' : '11px 18px 11px 16px' }}
                  >
                    <i className="bi bi-search" style={{ fontSize: '0.85rem' }} />
                    {!isMobile && <span>Search</span>}
                    {!isMobile && <span className="search-shortcut">⌘K</span>}
                  </button>
                </div>
              </div>
              <div className="tab-item-border nav-icon-btn-wrap" data-tooltip="Toggle theme">
                <div className="tab-item">
                  <ThemeToggle />
                </div>
              </div>
              <div className="tab-item-border collapse-btn-desktop nav-icon-btn-wrap" data-tooltip="Hide nav">
                <div className="tab-item">
                  <button
                    className="tab-label-btn collapse-btn-desktop"
                    onClick={handleCollapseNav}
                    aria-label="Hide navigation bar"
                    style={{ padding: '11px 13px' }}
                  >
                    <i className="bi bi-eye-slash" style={{ fontSize: '0.85rem' }} />
                  </button>
                </div>
              </div>
              <button className="mobile-burger" onClick={openMobile} aria-label="Open menu">
                <i className="bi bi-list" />
              </button>
            </div>
          </div>

          {/* Subtab strip */}
          {DEFENSE_NAV_ITEMS.map(item => {
            const isVisible = item.id === activeTab && stripOpen;
            return (
              <StripRow
                key={`strip-${item.id}`}
                item={item}
                isVisible={isVisible}
                activeSubtabId={activeSubtab ?? null}
                onSubtabClick={handleSubtabClick}
                onCollapse={() => { manualOpenRef.current = false; setStripOpen(false); }}
                isMobile={isMobile}
              />
            );
          })}
        </nav>

        {/* ══ MOBILE SIDEBAR ══ */}
        <div className={`mob-overlay${mobileOpen ? ' open' : ''}`} onClick={closeMobile} />
        <div
          className={`mob-sidebar${mobileOpen ? ' open' : ''}`}
          onTouchStart={onSidebarTouchStart}
          onTouchEnd={onSidebarTouchEnd}
        >
          <div className="mob-header">
            <span className="mob-header-title">Defense Systems</span>
            <ThemeToggle />
            <button className="mob-close" onClick={() => { setMobileOpen(false); setSearchOpen(true); }} aria-label="Search" style={{ color: 'var(--content-faint)', fontSize: '0.85rem' }}>
              <i className="bi bi-search" />
            </button>
            <button className="mob-close" onClick={closeMobile} aria-label="Close menu"><i className="bi bi-x-lg" /></button>
          </div>
          <div className="mob-nav-list">
            {DEFENSE_NAV_ITEMS.map(item => {
              const active = activeSet.has(item.id);
              const isTabExpanded = mobileExpandedTab === item.id;
              return (
                <div key={item.id}>
                  <button
                    className={`mob-tab-btn${active ? ' is-active' : ''}`}
                    onClick={() => toggleMobileTab(item.id)}
                  >
                    <span className="mob-tab-left"><i className={`bi ${item.icon}`} />{item.label}</span>
                    <i className={`bi bi-chevron-right mob-tab-chevron${isTabExpanded ? ' open' : ''}`} />
                  </button>
                  <div className={`mob-subtabs ${isTabExpanded ? 'expanded' : 'collapsed'}`}>
                    {item.subtabs.map(sub => {
                      const isSubActive = activeTab === item.id && activeSubtab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          className={`mob-subtab-btn${isSubActive ? ' is-active' : ''}`}
                          onClick={() => handleMobileSubtabClick(item.id, sub)}
                        >
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══ MAIN CONTENT ══ */}
        <main style={{ paddingTop: (displayedTab === 'home' && displayedSubtab === 'overview') ? (stripOpen ? '134px' : '84px') : (stripOpen ? '134px' : '84px'), transition: 'padding-top 0.38s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          <div className={`relative z-10 transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            {displayedTab === 'home' && displayedSubtab === 'overview' ? (
              <DefenseHero />
            ) : (
              <DefenseContent tabId={displayedTab} subtabId={displayedSubtab} />
            )}
          </div>
        </main>

        {/* ══ FOOTER — same component as main site ══ */}
        <Footer onNavigate={handleFooterNavigate} />
      </div>

      {/* ══ SEARCH MODAL ══ */}
      <SearchModal isOpen={searchOpen} onClose={closeSearch} onNavigate={handleSearchNavigate} />
    </>
  );
}
