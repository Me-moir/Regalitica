import MicropageLayout from '@/components/ui/MicropageLayout';

export default function CompanyExtensionPage() {
  return (
    <MicropageLayout
      title="The Company"
      subtitle="An extended profile into the formation, structure, and operational philosophy of Notus Regalia as an institution."
      eyebrow="Company Profile"
      parentTab="discover"
      parentSubtab="discover-thecompany"
    >
      {/* Company deep-dive sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '2rem' }}>
        {[
          { title: 'Formation & History', desc: 'Notus Regalia was established with the mandate to operate at the convergence of technology, defense, and societal infrastructure. This section outlines the founding principles and milestones that shape the institution today.', icon: 'bi-building' },
          { title: 'Organizational DNA', desc: 'A look into the cultural frameworks, decision-making structures, and operational methodologies that define how the company approaches complex, multi-domain challenges.', icon: 'bi-diagram-3' },
          { title: 'Operational Scope', desc: 'From defense systems to healthcare innovation and civic technology — the full operational envelope of Notus Regalia across its portfolio of ventures.', icon: 'bi-globe2' },
          { title: 'Institutional Governance', desc: 'The board structure, compliance frameworks, and accountability mechanisms that ensure operational integrity at every level of the organization.', icon: 'bi-shield-check' },
        ].map((item, i) => (
          <div key={i} style={{
            padding: '2rem 2.5rem', borderRadius: '0.75rem',
            border: '1px solid var(--border-color)', background: 'var(--gradient-card)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: i === 0 ? 'linear-gradient(90deg, #E31B54, transparent)' : 'transparent',
              opacity: 0.5,
            }} />
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
            <span style={{
              position: 'absolute', bottom: '1rem', right: '1.5rem',
              fontFamily: 'ui-monospace, Menlo, monospace',
              fontSize: '0.5rem', letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'var(--content-faint)', opacity: 0.5,
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '3rem', padding: '3rem', borderRadius: '0.75rem',
        border: '1px dashed var(--border-dashed)', textAlign: 'center',
      }}>
        <i className="bi bi-hourglass-split" style={{ fontSize: '2rem', color: '#E31B54', marginBottom: '1rem', display: 'block' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', background: 'var(--text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Extended Company Profile Under Development
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--content-muted)', maxWidth: 480, margin: '0 auto' }}>
          Detailed company documentation, operational reports, and institutional history are being compiled for this section.
        </p>
      </div>
    </MicropageLayout>
  );
}
