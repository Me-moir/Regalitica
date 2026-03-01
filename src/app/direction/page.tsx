import MicropageLayout from '@/components/ui/MicropageLayout';

export default function DirectionExtensionPage() {
  return (
    <MicropageLayout
      title="Direction"
      subtitle="The strategic roadmap, long-range planning frameworks, and directional thesis guiding Notus Regalia's institutional trajectory."
      eyebrow="Company · Direction"
      parentTab="discover"
      parentSubtab="discover-thecompany"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
        {/* Timeline-style layout */}
        {[
          { phase: 'Phase I', title: 'Foundation & Infrastructure', period: '2024 – 2025', desc: 'Establish core operational platforms, assemble founding teams, and deploy initial technology stacks across defense and healthcare verticals.', status: 'Active' },
          { phase: 'Phase II', title: 'Expansion & Integration', period: '2025 – 2027', desc: 'Scale operational capacity, integrate cross-domain systems, and expand the partner network to accelerate institutional compounding.', status: 'Pending' },
          { phase: 'Phase III', title: 'Sovereign-Grade Operations', period: '2027 – 2030', desc: 'Achieve full operational sovereignty across all verticals with self-sustaining technology ecosystems and institutional resilience.', status: 'Planned' },
          { phase: 'Phase IV', title: 'Global Framework Deployment', period: '2030+', desc: 'Deploy proven frameworks globally, establish institutional permanence, and transition from building to enduring operational excellence.', status: 'Vision' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            {/* Timeline marker */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: '0.5rem' }}>
              <div style={{
                width: 12, height: 12, borderRadius: '50%',
                background: i === 0 ? '#E31B54' : 'var(--border-color)',
                boxShadow: i === 0 ? '0 0 8px rgba(227,27,84,0.5)' : 'none',
              }} />
              {i < 3 && <div style={{ width: 1, height: '100%', minHeight: 60, background: 'var(--border-color)', marginTop: 4 }} />}
            </div>

            <div style={{
              flex: 1, padding: '1.5rem 2rem', borderRadius: '0.75rem',
              border: '1px solid var(--border-color)', background: 'var(--gradient-card)',
              position: 'relative',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{
                  fontFamily: 'ui-monospace, Menlo, monospace',
                  fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em',
                  color: '#E31B54', textTransform: 'uppercase',
                }}>
                  {item.phase}
                </span>
                <span style={{ width: 1, height: 12, background: 'var(--border-color)' }} />
                <span style={{
                  fontFamily: 'ui-monospace, Menlo, monospace',
                  fontSize: '0.55rem', letterSpacing: '0.1em', color: 'var(--content-faint)',
                }}>
                  {item.period}
                </span>
                <span style={{
                  marginLeft: 'auto',
                  fontFamily: 'ui-monospace, Menlo, monospace',
                  fontSize: '0.5rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: i === 0 ? '#E31B54' : 'var(--content-faint)',
                  padding: '2px 8px', borderRadius: 4,
                  border: `1px solid ${i === 0 ? 'rgba(227,27,84,0.3)' : 'var(--border-color)'}`,
                }}>
                  {item.status}
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.75, color: 'var(--content-tertiary)' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '3rem', padding: '3rem', borderRadius: '0.75rem',
        border: '1px dashed var(--border-dashed)', textAlign: 'center',
      }}>
        <i className="bi bi-hourglass-split" style={{ fontSize: '2rem', color: '#E31B54', marginBottom: '1rem', display: 'block' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', background: 'var(--text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Strategic Roadmap Details Coming Soon
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--content-muted)', maxWidth: 480, margin: '0 auto' }}>
          Detailed milestone documentation, progress reports, and expanded phase breakdowns are in preparation.
        </p>
      </div>
    </MicropageLayout>
  );
}
