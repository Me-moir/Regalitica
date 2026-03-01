import MicropageLayout from '@/components/ui/MicropageLayout';

export default function EcosystemExtensionPage() {
  return (
    <MicropageLayout
      title="Ecosystem"
      subtitle="The interconnected network of ventures, partnerships, and operational domains that constitute the Notus Regalia ecosystem."
      eyebrow="Company · Ecosystem"
      parentTab="discover"
      parentSubtab="discover-thecompany"
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {[
          { title: 'Defense Systems', desc: 'Advanced defense technology platforms designed for sovereign-grade operational security and strategic deterrence.', icon: 'bi-shield-lock', tag: 'Active' },
          { title: 'Healthcare Innovation', desc: 'Next-generation medical systems, diagnostic platforms, and healthcare infrastructure modernization.', icon: 'bi-heart-pulse', tag: 'Active' },
          { title: 'Civic Technology', desc: 'Public infrastructure, governance tools, and civic engagement platforms for institutional modernization.', icon: 'bi-bank', tag: 'Active' },
          { title: 'Capital Deployment', desc: 'Strategic capital allocation across ventures, with emphasis on compounding long-term institutional value.', icon: 'bi-graph-up', tag: 'Active' },
          { title: 'Research & Development', desc: 'Foundational and applied research programs spanning AI, materials science, and systems architecture.', icon: 'bi-cpu', tag: 'Ongoing' },
          { title: 'Partner Network', desc: 'Institutional alliances, academic partnerships, and cooperative frameworks extending operational reach.', icon: 'bi-diagram-3', tag: 'Expanding' },
        ].map((item, i) => (
          <div key={i} style={{
            padding: '2rem', borderRadius: '0.75rem',
            border: '1px solid var(--border-color)', background: 'var(--gradient-card)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, width: 40, height: 2,
              background: 'linear-gradient(90deg, #E31B54, transparent)', opacity: 0.6,
            }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <i className={`bi ${item.icon}`} style={{ fontSize: '1.3rem', color: 'var(--content-faint)' }} />
              <span style={{
                fontFamily: 'ui-monospace, Menlo, monospace',
                fontSize: '0.5rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#E31B54', fontWeight: 600,
                padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(227,27,84,0.2)',
              }}>
                {item.tag}
              </span>
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>{item.title}</h3>
            <p style={{ fontSize: '0.82rem', lineHeight: 1.7, color: 'var(--content-tertiary)' }}>{item.desc}</p>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '3rem', padding: '3rem', borderRadius: '0.75rem',
        border: '1px dashed var(--border-dashed)', textAlign: 'center',
      }}>
        <i className="bi bi-hourglass-split" style={{ fontSize: '2rem', color: '#E31B54', marginBottom: '1rem', display: 'block' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem', background: 'var(--text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          Ecosystem Map Under Development
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--content-muted)', maxWidth: 480, margin: '0 auto' }}>
          Interactive ecosystem visualization and detailed venture profiles are being prepared.
        </p>
      </div>
    </MicropageLayout>
  );
}
