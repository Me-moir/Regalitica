"use client";

const CivicTab = () => {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1.5rem' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#E31B54' }} />
          <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.55rem', letterSpacing: '0.22em', fontWeight: 700, color: '#E31B54', textTransform: 'uppercase' }}>Civic Operations</span>
        </div>
        <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.12, background: 'var(--text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: '0 0 1rem' }}>
          Coming Soon
        </h2>
        <p style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.65rem', color: 'var(--content-muted)', letterSpacing: '0.08em', lineHeight: 1.7 }}>
          Civic infrastructure and public sector solutions are currently under development.
        </p>
      </div>
    </section>
  );
};

export default CivicTab;
