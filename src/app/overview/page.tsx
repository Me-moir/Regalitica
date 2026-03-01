import MicropageLayout from '@/components/ui/MicropageLayout';

export default function OverviewPage() {
  return (
    <MicropageLayout
      title="Company Overview"
      subtitle="A structured deep-dive into the foundations, operations, and strategic blueprint of Notus Regalia."
      eyebrow="Overview"
      parentTab="discover"
      parentSubtab="discover-overview"
    >
      {/* Placeholder content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {[
          { title: 'Mission & Vision', icon: 'bi-bullseye', desc: 'Our foundational purpose and long-term directional mandate that informs every strategic decision across portfolios.' },
          { title: 'Core Capabilities', icon: 'bi-cpu', desc: 'Technology systems, research verticals, and operational capabilities that drive differentiated execution.' },
          { title: 'Global Operations', icon: 'bi-globe-americas', desc: 'Multi-domain operational footprint spanning defense, healthcare, civic technology, and capital deployment.' },
          { title: 'Leadership', icon: 'bi-people', desc: 'The executive structure, advisory network, and governance framework guiding institutional decision-making.' },
          { title: 'Innovation Pipeline', icon: 'bi-lightbulb', desc: 'Active research programs, prototype stages, and forward-looking technology investments across sectors.' },
          { title: 'Strategic Partnerships', icon: 'bi-diagram-3', desc: 'Institutional alliances, joint ventures, and cooperative frameworks that extend operational reach.' },
        ].map((item, i) => (
          <div key={i} style={{
            padding: '2rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--border-color)',
            background: 'var(--gradient-card)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, width: 40, height: 2,
              background: 'linear-gradient(90deg, #E31B54, transparent)', opacity: 0.6,
            }} />
            <div style={{
              position: 'absolute', top: 0, left: 0, width: 2, height: 40,
              background: 'linear-gradient(to bottom, #E31B54, transparent)', opacity: 0.6,
            }} />

            <i className={`bi ${item.icon}`} style={{ fontSize: '1.5rem', color: 'var(--content-faint)', marginBottom: '1rem', display: 'block' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--content-primary)' }}>
              {item.title}
            </h3>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--content-tertiary)' }}>
              {item.desc}
            </p>
            <span style={{
              display: 'inline-block', marginTop: '1rem',
              fontFamily: 'ui-monospace, Menlo, monospace',
              fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'var(--content-faint)',
            }}>
              Coming Soon
            </span>
          </div>
        ))}
      </div>

      {/* Placeholder section */}
      <div style={{
        marginTop: '3rem', padding: '3rem', borderRadius: '0.75rem',
        border: '1px dashed var(--border-dashed)', textAlign: 'center',
      }}>
        <i className="bi bi-hourglass-split" style={{ fontSize: '2rem', color: '#E31B54', marginBottom: '1rem', display: 'block' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', background: 'var(--text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Full Overview Under Development
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--content-muted)', maxWidth: 480, margin: '0 auto' }}>
          This page will contain comprehensive documentation of all company sectors, operational metrics, and strategic frameworks.
        </p>
      </div>
    </MicropageLayout>
  );
}
