import MicropageLayout from '@/components/ui/MicropageLayout';

export default function PhilosophyExtensionPage() {
  return (
    <MicropageLayout
      title="Philosophy"
      subtitle="The foundational principles, intellectual frameworks, and guiding beliefs that inform every decision across the organization."
      eyebrow="Company · Philosophy"
      parentTab="discover"
      parentSubtab="discover-thecompany"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
        {[
          { title: 'First Principles Thinking', desc: 'Every system we build begins from fundamental truths rather than convention. We decompose problems to their atomic components before reconstruction — ensuring that our solutions are genuinely novel rather than iterative.', icon: 'bi-lightning-charge' },
          { title: 'Long-Horizon Orientation', desc: 'We operate on decadal timelines. Short-term optimization is subordinated to long-term institutional resilience and compounding capability development.', icon: 'bi-hourglass-split' },
          { title: 'Constructive Tension', desc: 'We believe the best ideas emerge from structured disagreement. Our decision-making frameworks institutionalize productive conflict to surface blind spots and strengthen conclusions.', icon: 'bi-arrows-angle-expand' },
          { title: 'Asymmetric Impact', desc: 'We seek leverage points — interventions where bounded effort produces unbounded results. This shapes our portfolio allocation, technology bets, and operational focus.', icon: 'bi-graph-up-arrow' },
        ].map((item, i) => (
          <div key={i} style={{
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
                <i className={`bi ${item.icon}`} style={{ fontSize: '1.2rem', color: '#E31B54' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.88rem', lineHeight: 1.75, color: 'var(--content-tertiary)' }}>{item.desc}</p>
              </div>
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
          Full Philosophy Documentation Coming Soon
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--content-muted)', maxWidth: 480, margin: '0 auto' }}>
          Extended writings, case studies, and principle-application mappings are in preparation.
        </p>
      </div>
    </MicropageLayout>
  );
}
