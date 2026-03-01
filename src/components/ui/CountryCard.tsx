"use client";

import { type CountryInfo, THREAT_COLORS } from '@/data/defense-data';

// ── Country intel overlay ──────────────────────────────────────────────────
const CountryCard = ({ info, onClose, isLight }: { info: CountryInfo; onClose: () => void; isLight: boolean }) => {
  const tc = THREAT_COLORS[info.threat];
  const modalBg = isLight ? 'rgba(250,248,244,0.97)' : 'rgba(5,7,11,0.97)';
  const textColor = isLight ? 'rgba(15,25,45,0.92)' : '#fff';
  const metaColor = isLight ? 'rgba(15,25,45,0.35)' : 'rgba(255,255,255,0.3)';
  const statBg = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)';
  const statBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.07)';
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0, zIndex: 18,
          background: 'rgba(0,0,0,0.62)',
          backdropFilter: 'blur(3px)',
          animation: 'dvFade 0.2s ease',
        }}
      />
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
        width: 'clamp(260px, 72%, 360px)',
        border: `1px solid ${tc}40`,
        borderRadius: 8,
        background: modalBg,
        backdropFilter: 'blur(24px)',
        padding: '18px 20px 20px',
        animation: 'dvCardIn 0.22s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: `0 0 60px ${tc}18, 0 24px 80px rgba(0,0,0,0.6)`,
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, borderRadius: '8px 8px 0 0', background: `linear-gradient(90deg, transparent, ${tc}80, ${tc}40, transparent)` }} />
        {[
          { top: 6, left: 6, borderTop: `1px solid ${tc}55`, borderLeft: `1px solid ${tc}55` },
          { top: 6, right: 6, borderTop: `1px solid ${tc}55`, borderRight: `1px solid ${tc}55` },
          { bottom: 6, left: 6, borderBottom: `1px solid ${tc}55`, borderLeft: `1px solid ${tc}55` },
          { bottom: 6, right: 6, borderBottom: `1px solid ${tc}55`, borderRight: `1px solid ${tc}55` },
        ].map((s, i) => <div key={i} style={{ position: 'absolute', width: 10, height: 10, ...s }} />)}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.5rem', color: metaColor, letterSpacing: '0.15em', marginBottom: 3 }}>[{info.iso}] // {info.region}</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: textColor, letterSpacing: '0.02em', lineHeight: 1.1 }}>{info.name}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.14em', color: tc, border: `1px solid ${tc}44`, padding: '2px 7px', borderRadius: 3 }}>{info.threat} THREAT</span>
            <button onClick={onClose} style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.48rem', color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em', padding: 0 }}>[DESELECT]</button>
          </div>
        </div>

        <div style={{ height: 1, background: `linear-gradient(90deg, ${tc}22, transparent)`, marginBottom: 14 }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[{ label: 'Partners', value: info.partners }, { label: 'Contracts', value: info.contracts }].map(s => (
            <div key={s.label} style={{ background: statBg, border: `1px solid ${statBorder}`, padding: '10px 12px', borderRadius: 5 }}>
              <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '1.4rem', fontWeight: 700, color: tc, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.5rem', color: metaColor, letterSpacing: '0.08em', marginTop: 3, textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ position: 'absolute', inset: 0, borderRadius: 8, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)' }} />
      </div>
    </>
  );
};

export default CountryCard;
