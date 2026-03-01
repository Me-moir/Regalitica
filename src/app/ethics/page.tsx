import MicropageLayout from '@/components/ui/MicropageLayout';

export default function EthicsExtensionPage() {
  return (
    <MicropageLayout
      title="Ethics"
      subtitle="The ethical frameworks, responsible innovation principles, and moral foundations that guide how Notus Regalia builds and operates."
      eyebrow="Company · Ethics"
      parentTab="discover"
      parentSubtab="discover-thecompany"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
        {[
          { title: 'Responsible Innovation', desc: 'Every technology we develop undergoes ethical review to assess potential impacts, unintended consequences, and alignment with our core values before deployment.', icon: 'bi-shield-check' },
          { title: 'Human-Centric Design', desc: 'Systems are designed to augment human capability — not replace human judgment. We maintain clear boundaries on automation and preserve meaningful human oversight in all critical operations.', icon: 'bi-person-check' },
          { title: 'Data & Privacy', desc: 'Institutional commitment to data minimization, purpose limitation, and transparent data governance. We treat data stewardship as a fiduciary obligation.', icon: 'bi-lock' },
          { title: 'Dual-Use Awareness', desc: 'We rigorously evaluate dual-use implications of our technology, maintaining clear frameworks for acceptable use cases and enforcement mechanisms for compliance.', icon: 'bi-eye' },
          { title: 'Stakeholder Accountability', desc: 'Ethical obligations extend beyond shareholders to communities, partners, and the broader public affected by our operations and technology deployments.', icon: 'bi-globe2' },
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
          Ethics Framework Documentation Coming Soon
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--content-muted)', maxWidth: 480, margin: '0 auto' }}>
          Detailed ethical guidelines, review processes, and case studies will be published here.
        </p>
      </div>
    </MicropageLayout>
  );
}
