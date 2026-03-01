import MicropageLayout from '@/components/ui/MicropageLayout';

export default function GovernanceExtensionPage() {
  return (
    <MicropageLayout
      title="Governance"
      subtitle="The institutional governance structures, accountability frameworks, and compliance mechanisms that ensure integrity at every operational level."
      eyebrow="Company · Governance"
      parentTab="discover"
      parentSubtab="discover-thecompany"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
        {[
          { title: 'Board Structure', desc: 'The governing board operates with clear separation of oversight and execution, ensuring that strategic decisions undergo rigorous multi-perspective evaluation before implementation.', icon: 'bi-people' },
          { title: 'Compliance Framework', desc: 'Multi-jurisdictional compliance architecture covering defense regulations, healthcare standards, financial reporting, and data sovereignty requirements across all operational domains.', icon: 'bi-clipboard-check' },
          { title: 'Risk Management', desc: 'Institutional risk assessment protocols spanning operational, strategic, financial, and reputational dimensions — with early warning systems and escalation pathways.', icon: 'bi-exclamation-triangle' },
          { title: 'Transparency & Reporting', desc: 'Structured disclosure practices including regular operational reports, financial statements, and stakeholder communications that maintain institutional accountability.', icon: 'bi-file-earmark-text' },
          { title: 'Audit & Oversight', desc: 'Independent audit mechanisms, internal review cycles, and external assessment partnerships ensuring continuous operational integrity verification.', icon: 'bi-search' },
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
                <i className={`bi ${item.icon}`} style={{ fontSize: '1.2rem', color: 'var(--content-faint)' }} />
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
          Governance Documentation Coming Soon
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--content-muted)', maxWidth: 480, margin: '0 auto' }}>
          Expanded governance policies, charter documents, and compliance certifications will be published here.
        </p>
      </div>
    </MicropageLayout>
  );
}
