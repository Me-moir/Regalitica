"use client";
import { memo } from 'react';

/* ═══════════════════════════════════════════════
   Detail pages data — migrated from (discover) route pages
   ═══════════════════════════════════════════════ */

interface PageMeta {
  title: string;
  subtitle: string;
  eyebrow: string;
}

const PAGE_META: Record<string, PageMeta> = {
  overview: {
    title: 'Company Overview',
    subtitle: 'A structured deep-dive into the foundations, operations, and strategic blueprint of Notus Regalia.',
    eyebrow: 'Overview',
  },
  company: {
    title: 'The Company',
    subtitle: 'An extended profile into the formation, structure, and operational philosophy of Notus Regalia as an institution.',
    eyebrow: 'Company Profile',
  },
  philosophy: {
    title: 'Philosophy',
    subtitle: 'The foundational principles, intellectual frameworks, and guiding beliefs that inform every decision across the organization.',
    eyebrow: 'Company · Philosophy',
  },
  ecosystem: {
    title: 'Ecosystem',
    subtitle: 'The interconnected network of ventures, partnerships, and operational domains that constitute the Notus Regalia ecosystem.',
    eyebrow: 'Company · Ecosystem',
  },
  direction: {
    title: 'Direction',
    subtitle: 'The strategic roadmap, long-range planning frameworks, and directional thesis guiding Notus Regalia\'s institutional trajectory.',
    eyebrow: 'Company · Direction',
  },
  governance: {
    title: 'Governance',
    subtitle: 'The institutional governance structures, accountability frameworks, and compliance mechanisms that ensure integrity at every operational level.',
    eyebrow: 'Company · Governance',
  },
  ethics: {
    title: 'Ethics',
    subtitle: 'The ethical frameworks, responsible innovation principles, and moral foundations that guide how Notus Regalia builds and operates.',
    eyebrow: 'Company · Ethics',
  },
};

/* ─── Shared card renderer ─── */

function IconCard({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div style={{
      padding: '2rem 2.5rem', borderRadius: '0.75rem',
      border: '1px solid var(--border-color)', background: 'var(--gradient-card)',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '10px',
          border: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, background: 'var(--surface-secondary)',
        }}>
          <i className={`bi ${icon}`} style={{ fontSize: '1.2rem', color: 'var(--content-faint)' }} />
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

function UnderDevelopmentBanner({ text }: { text: string }) {
  return (
    <div style={{
      marginTop: '3rem', padding: '3rem', borderRadius: '0.75rem',
      border: '1px dashed var(--border-dashed)', textAlign: 'center',
    }}>
      <i className="bi bi-hourglass-split" style={{ fontSize: '2rem', color: '#E31B54', marginBottom: '1rem', display: 'block' }} />
      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', background: 'var(--text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        {text}
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--content-muted)', maxWidth: 480, margin: '0 auto' }}>
        Detailed documentation and expanded content are being compiled for this section.
      </p>
    </div>
  );
}

/* ─── Page content renderers ─── */

function OverviewContent() {
  const items = [
    { title: 'Mission & Vision', icon: 'bi-bullseye', desc: 'Our foundational purpose and long-term directional mandate that informs every strategic decision across portfolios.' },
    { title: 'Core Capabilities', icon: 'bi-cpu', desc: 'Technology systems, research verticals, and operational capabilities that drive differentiated execution.' },
    { title: 'Global Operations', icon: 'bi-globe-americas', desc: 'Multi-domain operational footprint spanning defense, healthcare, civic technology, and capital deployment.' },
    { title: 'Leadership', icon: 'bi-people', desc: 'The executive structure, advisory network, and governance framework guiding institutional decision-making.' },
    { title: 'Innovation Pipeline', icon: 'bi-lightbulb', desc: 'Active research programs, prototype stages, and forward-looking technology investments across sectors.' },
    { title: 'Strategic Partnerships', icon: 'bi-diagram-3', desc: 'Institutional alliances, joint ventures, and cooperative frameworks that extend operational reach.' },
  ];
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            padding: '2rem', borderRadius: '0.75rem',
            border: '1px solid var(--border-color)', background: 'var(--gradient-card)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 2, background: 'linear-gradient(90deg, #E31B54, transparent)', opacity: 0.6 }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: 2, height: 40, background: 'linear-gradient(to bottom, #E31B54, transparent)', opacity: 0.6 }} />
            <i className={`bi ${item.icon}`} style={{ fontSize: '1.5rem', color: 'var(--content-faint)', marginBottom: '1rem', display: 'block' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--content-primary)' }}>{item.title}</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--content-tertiary)' }}>{item.desc}</p>
            <span style={{ display: 'inline-block', marginTop: '1rem', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--content-faint)' }}>Coming Soon</span>
          </div>
        ))}
      </div>
      <UnderDevelopmentBanner text="Full Overview Under Development" />
    </>
  );
}

function CompanyContent() {
  const items = [
    { title: 'Formation & History', desc: 'Notus Regalia was established with the mandate to operate at the convergence of technology, defense, and societal infrastructure. This section outlines the founding principles and milestones that shape the institution today.', icon: 'bi-building' },
    { title: 'Organizational DNA', desc: 'A look into the cultural frameworks, decision-making structures, and operational methodologies that define how the company approaches complex, multi-domain challenges.', icon: 'bi-diagram-3' },
    { title: 'Operational Scope', desc: 'From defense systems to healthcare innovation and civic technology — the full operational envelope of Notus Regalia across its portfolio of ventures.', icon: 'bi-globe2' },
    { title: 'Institutional Governance', desc: 'The board structure, compliance frameworks, and accountability mechanisms that ensure operational integrity at every level of the organization.', icon: 'bi-shield-check' },
  ];
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            padding: '2rem 2.5rem', borderRadius: '0.75rem',
            border: '1px solid var(--border-color)', background: 'var(--gradient-card)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: i === 0 ? 'linear-gradient(90deg, #E31B54, transparent)' : 'transparent', opacity: 0.5 }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--surface-secondary)' }}>
                <i className={`bi ${item.icon}`} style={{ fontSize: '1.2rem', color: 'var(--content-faint)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.88rem', lineHeight: 1.75, color: 'var(--content-tertiary)' }}>{item.desc}</p>
              </div>
            </div>
            <span style={{ position: 'absolute', bottom: '1rem', right: '1.5rem', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '0.5rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--content-faint)', opacity: 0.5 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>
      <UnderDevelopmentBanner text="Extended Company Profile Under Development" />
    </>
  );
}

function PhilosophyContent() {
  const items = [
    { title: 'First Principles Thinking', desc: 'Every system we build begins from fundamental truths rather than convention. We decompose problems to their atomic components before reconstruction — ensuring that our solutions are genuinely novel rather than iterative.', icon: 'bi-lightning-charge' },
    { title: 'Long-Horizon Orientation', desc: 'We operate on decadal timelines. Short-term optimization is subordinated to long-term institutional resilience and compounding capability development.', icon: 'bi-hourglass-split' },
    { title: 'Constructive Tension', desc: 'We believe the best ideas emerge from structured disagreement. Our decision-making frameworks institutionalize productive conflict to surface blind spots and strengthen conclusions.', icon: 'bi-arrows-angle-expand' },
    { title: 'Asymmetric Impact', desc: 'We seek leverage points — interventions where bounded effort produces unbounded results. This shapes our portfolio allocation, technology bets, and operational focus.', icon: 'bi-graph-up-arrow' },
  ];
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
        {items.map((item, i) => (
          <IconCard key={i} icon={item.icon}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>{item.title}</h3>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.75, color: 'var(--content-tertiary)' }}>{item.desc}</p>
          </IconCard>
        ))}
      </div>
      <UnderDevelopmentBanner text="Full Philosophy Documentation Coming Soon" />
    </>
  );
}

function EcosystemContent() {
  const items = [
    { title: 'Defense Systems', desc: 'Advanced defense technology platforms designed for sovereign-grade operational security and strategic deterrence.', icon: 'bi-shield-lock', tag: 'Active' },
    { title: 'Healthcare Innovation', desc: 'Next-generation medical systems, diagnostic platforms, and healthcare infrastructure modernization.', icon: 'bi-heart-pulse', tag: 'Active' },
    { title: 'Civic Technology', desc: 'Public infrastructure, governance tools, and civic engagement platforms for institutional modernization.', icon: 'bi-bank', tag: 'Active' },
    { title: 'Capital Deployment', desc: 'Strategic capital allocation across ventures, with emphasis on compounding long-term institutional value.', icon: 'bi-graph-up', tag: 'Active' },
    { title: 'Research & Development', desc: 'Foundational and applied research programs spanning AI, materials science, and systems architecture.', icon: 'bi-cpu', tag: 'Ongoing' },
    { title: 'Partner Network', desc: 'Institutional alliances, academic partnerships, and cooperative frameworks extending operational reach.', icon: 'bi-diagram-3', tag: 'Expanding' },
  ];
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            padding: '2rem', borderRadius: '0.75rem',
            border: '1px solid var(--border-color)', background: 'var(--gradient-card)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 2, background: 'linear-gradient(90deg, #E31B54, transparent)', opacity: 0.6 }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <i className={`bi ${item.icon}`} style={{ fontSize: '1.3rem', color: 'var(--content-faint)' }} />
              <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '0.5rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#E31B54', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(227,27,84,0.2)' }}>{item.tag}</span>
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>{item.title}</h3>
            <p style={{ fontSize: '0.82rem', lineHeight: 1.7, color: 'var(--content-tertiary)' }}>{item.desc}</p>
          </div>
        ))}
      </div>
      <UnderDevelopmentBanner text="Ecosystem Map Under Development" />
    </>
  );
}

function DirectionContent() {
  const items = [
    { phase: 'Phase I', title: 'Foundation & Infrastructure', period: '2024 – 2025', desc: 'Establish core operational platforms, assemble founding teams, and deploy initial technology stacks across defense and healthcare verticals.', status: 'Active' },
    { phase: 'Phase II', title: 'Expansion & Integration', period: '2025 – 2027', desc: 'Scale operational capacity, integrate cross-domain systems, and expand the partner network to accelerate institutional compounding.', status: 'Pending' },
    { phase: 'Phase III', title: 'Sovereign-Grade Operations', period: '2027 – 2030', desc: 'Achieve full operational sovereignty across all verticals with self-sustaining technology ecosystems and institutional resilience.', status: 'Planned' },
    { phase: 'Phase IV', title: 'Global Framework Deployment', period: '2030+', desc: 'Deploy proven frameworks globally, establish institutional permanence, and transition from building to enduring operational excellence.', status: 'Vision' },
  ];
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: '0.5rem' }}>
              <div style={{
                width: 12, height: 12, borderRadius: '50%',
                background: i === 0 ? '#E31B54' : 'var(--border-color)',
                boxShadow: i === 0 ? '0 0 8px rgba(227,27,84,0.5)' : 'none',
              }} />
              {i < 3 && <div style={{ width: 1, height: '100%', minHeight: 60, background: 'var(--border-color)', marginTop: 4 }} />}
            </div>
            <div style={{ flex: 1, padding: '1.5rem 2rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', background: 'var(--gradient-card)', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', color: '#E31B54', textTransform: 'uppercase' }}>{item.phase}</span>
                <span style={{ width: 1, height: 12, background: 'var(--border-color)' }} />
                <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '0.55rem', letterSpacing: '0.1em', color: 'var(--content-faint)' }}>{item.period}</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'ui-monospace, Menlo, monospace', fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: i === 0 ? '#E31B54' : 'var(--content-faint)', padding: '2px 8px', borderRadius: 4, border: `1px solid ${i === 0 ? 'rgba(227,27,84,0.3)' : 'var(--border-color)'}` }}>{item.status}</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.75, color: 'var(--content-tertiary)' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <UnderDevelopmentBanner text="Strategic Roadmap Details Coming Soon" />
    </>
  );
}

function GovernanceContent() {
  const items = [
    { title: 'Board Structure', desc: 'The governing board operates with clear separation of oversight and execution, ensuring that strategic decisions undergo rigorous multi-perspective evaluation before implementation.', icon: 'bi-people' },
    { title: 'Compliance Framework', desc: 'Multi-jurisdictional compliance architecture covering defense regulations, healthcare standards, financial reporting, and data sovereignty requirements across all operational domains.', icon: 'bi-clipboard-check' },
    { title: 'Risk Management', desc: 'Institutional risk assessment protocols spanning operational, strategic, financial, and reputational dimensions — with early warning systems and escalation pathways.', icon: 'bi-exclamation-triangle' },
    { title: 'Transparency & Reporting', desc: 'Structured disclosure practices including regular operational reports, financial statements, and stakeholder communications that maintain institutional accountability.', icon: 'bi-file-earmark-text' },
    { title: 'Audit & Oversight', desc: 'Independent audit mechanisms, internal review cycles, and external assessment partnerships ensuring continuous operational integrity verification.', icon: 'bi-search' },
  ];
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
        {items.map((item, i) => (
          <IconCard key={i} icon={item.icon}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>{item.title}</h3>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.75, color: 'var(--content-tertiary)' }}>{item.desc}</p>
          </IconCard>
        ))}
      </div>
      <UnderDevelopmentBanner text="Governance Documentation Coming Soon" />
    </>
  );
}

function EthicsContent() {
  const items = [
    { title: 'Responsible Innovation', desc: 'Every technology we develop undergoes ethical review to assess potential impacts, unintended consequences, and alignment with our core values before deployment.', icon: 'bi-shield-check' },
    { title: 'Human-Centric Design', desc: 'Systems are designed to augment human capability — not replace human judgment. We maintain clear boundaries on automation and preserve meaningful human oversight in all critical operations.', icon: 'bi-person-check' },
    { title: 'Data & Privacy', desc: 'Institutional commitment to data minimization, purpose limitation, and transparent data governance. We treat data stewardship as a fiduciary obligation.', icon: 'bi-lock' },
    { title: 'Dual-Use Awareness', desc: 'We rigorously evaluate dual-use implications of our technology, maintaining clear frameworks for acceptable use cases and enforcement mechanisms for compliance.', icon: 'bi-eye' },
    { title: 'Stakeholder Accountability', desc: 'Ethical obligations extend beyond shareholders to communities, partners, and the broader public affected by our operations and technology deployments.', icon: 'bi-globe2' },
  ];
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
        {items.map((item, i) => (
          <IconCard key={i} icon={item.icon}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>{item.title}</h3>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.75, color: 'var(--content-tertiary)' }}>{item.desc}</p>
          </IconCard>
        ))}
      </div>
      <UnderDevelopmentBanner text="Ethics Framework Documentation Coming Soon" />
    </>
  );
}

/* ─── Content router ─── */

const CONTENT_RENDERERS: Record<string, () => React.JSX.Element> = {
  overview: OverviewContent,
  company: CompanyContent,
  philosophy: PhilosophyContent,
  ecosystem: EcosystemContent,
  direction: DirectionContent,
  governance: GovernanceContent,
  ethics: EthicsContent,
};

/* ═══════════════════════════════════════════════
   DetailView — inline detail page for Discover
   ═══════════════════════════════════════════════ */

interface DetailViewProps {
  page: string;
  onBack: () => void;
}

const DetailView = memo(({ page, onBack }: DetailViewProps) => {
  const meta = PAGE_META[page];
  const ContentRenderer = CONTENT_RENDERERS[page];

  if (!meta || !ContentRenderer) return null;

  return (
    <div style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {/* ── Header with return button ── */}
      <div style={{
        padding: '8rem clamp(2rem, 5vw, 4rem) 3rem',
        borderBottom: '1px dashed var(--border-dashed)',
        background: 'var(--gradient-section)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative noise */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.02,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'repeat', backgroundSize: '100px 100px',
        }} />

        {/* Return button row with title */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1120px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={onBack}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.55rem 1.1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-secondary)',
                color: 'var(--content-faint)',
                fontSize: '0.8rem', fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--content-primary)';
                e.currentTarget.style.borderColor = '#E31B54';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--content-faint)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <i className="bi bi-arrow-left" style={{ fontSize: '0.75rem' }} />
              Return to Discover
            </button>

            {/* Eyebrow */}
            <span style={{
              fontFamily: 'ui-monospace, Menlo, monospace',
              fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#E31B54', fontWeight: 600,
            }}>
              {meta.eyebrow}
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 700,
            letterSpacing: '-0.03em', lineHeight: 1.15,
            background: 'var(--text-gradient)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            margin: 0, marginBottom: '1rem',
          }}>
            {meta.title}
          </h1>
          <p style={{
            fontSize: 'clamp(0.88rem, 1.1vw, 1rem)', lineHeight: 1.7,
            color: 'var(--content-tertiary)', maxWidth: '680px', margin: 0,
          }}>
            {meta.subtitle}
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{
        maxWidth: '1120px', margin: '0 auto',
        padding: '2rem clamp(2rem, 5vw, 4rem) 6rem',
      }}>
        <ContentRenderer />
      </div>
    </div>
  );
});

DetailView.displayName = 'DetailView';

export default DetailView;
