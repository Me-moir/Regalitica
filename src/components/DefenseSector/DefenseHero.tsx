"use client";
import { useState } from 'react';
import { type CountryInfo, PRODUCTS } from '@/data/defense-data';
import { useSiteThemeIsLight, DARK_THEME, LIGHT_THEME } from '@/hooks/defense-themes';
import CountryCard from '@/components/ui/CountryCard';
import GlobeD3 from '@/components/ui/GlobeD3';
import { SigBlink, AcronymTagline } from '@/components/ui/defense-utils';

export default function DefenseHero() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);
  const [deselectSignal, setDeselectSignal] = useState(0);

  const isLight = useSiteThemeIsLight();
  const globeTheme = isLight ? LIGHT_THEME : DARK_THEME;

  const handleProductChange = (idx: number) => {
    if (idx === activeProduct) return;
    setIsTransitioning(true);
    setTimeout(() => { setActiveProduct(idx); setIsTransitioning(false); }, 180);
  };

  const handleCountryClose = () => {
    setSelectedCountry(null);
    setDeselectSignal(s => s + 1);
  };

  const product = PRODUCTS[activeProduct];

  const glassBg = isLight ? 'rgba(244,245,246,0.55)' : 'rgba(1,3,8,0.52)';
  const glassBorder = isLight ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.07)';
  const glassInsetHighlight = isLight ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.055)';
  const glassReflection = isLight
    ? 'linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.0) 100%)'
    : 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.0) 100%)';

  const isMegiddo = product.id === 'megiddo';

  return (
    <section style={{ minHeight: 'auto', marginTop: 0, background: 'transparent', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: globeTheme.panelBg, transition: 'background 0.4s ease', zIndex: 0 }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.018, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundRepeat: 'repeat', backgroundSize: '100px 100px', zIndex: 1 }} />

      <div className="dv-main-grid" style={{ display: 'grid', gridTemplateColumns: '50% 50%', borderTop: '1px dashed var(--border-dashed)', borderBottom: '1px dashed var(--border-dashed)', minHeight: '100vh', position: 'relative', zIndex: 2 }}>

        {/* LEFT: Liquid glass panel */}
        <div className="dv-hero-col" style={{
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid ' + glassBorder,
          position: 'relative', overflow: 'hidden', minHeight: '100vh',
          background: glassBg,
          backdropFilter: 'blur(28px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
          boxShadow: `inset 1px 0 0 ${glassInsetHighlight}, inset -1px 0 0 rgba(255,255,255,0.02)`,
          transition: 'background 0.4s ease, backdrop-filter 0.4s ease',
        }}>
          {!isLight && (
            <div key={product.id} style={{ position: 'absolute', inset: 0, backgroundImage: `url(${product.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center 30%', backgroundRepeat: 'no-repeat', opacity: 0.30, zIndex: 0, animation: 'dvBgFadeIn 0.7s ease forwards', pointerEvents: 'none' }} />
          )}
          {!isLight && (
            <div style={{ position: 'absolute', inset: 0, background: ['linear-gradient(to bottom, rgba(4,5,12,0.78) 0%, rgba(4,5,12,0.30) 30%, rgba(4,5,12,0.22) 55%, rgba(4,5,12,0.60) 82%, rgba(4,5,12,0.94) 100%)', 'linear-gradient(to right, rgba(4,5,12,0.62) 0%, rgba(4,5,12,0.18) 55%, rgba(4,5,12,0.0) 100%)', 'radial-gradient(ellipse at 0% 100%, rgba(227,27,84,0.22) 0%, transparent 52%)', 'radial-gradient(ellipse at 100% 0%, rgba(0,180,140,0.09) 0%, transparent 48%)', 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(4,5,12,0.55) 100%)'].join(', '), zIndex: 1, pointerEvents: 'none' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundRepeat: 'repeat', backgroundSize: '180px 180px', opacity: 0.032, zIndex: 2, pointerEvents: 'none', mixBlendMode: 'overlay' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.055) 3px, rgba(0,0,0,0.055) 4px)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, background: glassReflection, pointerEvents: 'none', zIndex: 3 }} />

          <div style={{ flex: 1, padding: '190px clamp(2.5rem, 5vw, 4.5rem) 0 clamp(3.5rem, 7vw, 6rem)', position: 'relative', zIndex: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3.25rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#E31B54', animation: 'dvPulse 2s ease infinite' }} />
                <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.58rem', letterSpacing: '0.22em', fontWeight: 700, color: '#E31B54', textTransform: 'uppercase' }}>Notus Regalia</span>
              </div>
              <span style={{ width: 1, height: 10, background: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
              <span className="dv-defense-label" style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.55rem', color: isLight ? 'rgba(0,0,0,0.30)' : 'rgba(255,255,255,0.22)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Defense Division</span>
            </div>

            <div style={{ height: '1.1rem', marginBottom: '1.1rem', overflow: 'hidden' }}>
              <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(227,27,84,0.65)', opacity: isTransitioning ? 0 : 1, transition: 'opacity 0.18s ease', display: 'block' }}>{product.eyebrow}</span>
            </div>

            <div style={{ height: 'clamp(3.2rem, 5.5vw, 5rem)', marginBottom: '0.55rem', overflow: 'hidden' }}>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.08, background: 'var(--text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0, opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? 'translateY(6px)' : 'translateY(0)', transition: 'opacity 0.18s ease, transform 0.18s ease' }}>{product.title}</h1>
            </div>

            <div style={{ marginBottom: '1.75rem', overflow: 'hidden' }}>
              <p style={{ fontSize: 'clamp(0.88rem, 1.15vw, 1.0rem)', fontWeight: 600, lineHeight: 1.55, color: 'var(--content-primary)', margin: 0, opacity: isTransitioning ? 0 : 1, transition: 'opacity 0.18s ease', letterSpacing: '-0.01em' }}>
                {isMegiddo
                  ? <AcronymTagline text={product.subtitle} isLight={isLight} />
                  : product.subtitle.split('\n\n')[0].trim()
                }
              </p>
            </div>

            <div style={{ width: 40, height: 2, background: '#E31B54', borderRadius: 999, boxShadow: '0 0 8px rgba(227,27,84,0.45)', marginBottom: '1.75rem', flexShrink: 0 }} />

            <div style={{ marginBottom: '2.75rem', overflow: 'hidden' }}>
              <div style={{ opacity: isTransitioning ? 0 : 1, transition: 'opacity 0.18s ease', fontSize: 'clamp(0.82rem, 1.05vw, 0.93rem)', lineHeight: 1.85, color: isLight ? 'rgba(0,0,0,0.62)' : 'rgba(255,255,255,0.75)' }}>
                <p style={{ margin: 0 }}>{product.subtitle.split('\n\n')[1]}</p>
              </div>
            </div>
          </div>

          {/* Carousel pinned to bottom */}
          <div style={{ width: '100%', flexShrink: 0, position: 'sticky', bottom: 0, zIndex: 6 }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', padding: '0 clamp(2.5rem, 5vw, 4.5rem) 0 clamp(3.5rem, 7vw, 6rem)', marginBottom: '1.5rem' }}>
              {[{ label: 'Request Briefing', icon: 'bi-arrow-right', primary: true }, { label: 'Learn More', icon: 'bi-arrow-down', primary: false }].map(btn => (
                <div key={btn.label} className="dv-lm-border" style={{ display: 'inline-flex', flexShrink: 0, borderRadius: '10.5px', padding: '1px', position: 'relative', background: 'transparent', isolation: 'isolate' }}>
                  <button className={`dv-lm-btn${!btn.primary ? ' dv-btn-secondary' : ''}`} style={{ position: 'relative', zIndex: 1, display: 'inline-flex', alignItems: 'center', gap: 8, border: 'none', borderRadius: '9.5px', padding: btn.primary ? '0.75rem 1.5rem' : '0.75rem 1.25rem', fontSize: '0.85rem', fontWeight: btn.primary ? 600 : 500, letterSpacing: '0.01em', lineHeight: 1, cursor: 'pointer', whiteSpace: 'nowrap', background: btn.primary ? '#E31B54' : 'var(--navbar-bg, #0f0f0f)', color: btn.primary ? '#fff' : 'var(--content-faint)', boxShadow: btn.primary ? '0 4px 16px rgba(227,27,84,0.3)' : '0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 var(--glass-inset-top)', transition: 'all 0.15s ease' }}>
                    {btn.label}<i className={`bi ${btn.icon}`} style={{ fontSize: '0.8rem' }} />
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '10px clamp(2.5rem, 5vw, 4.5rem) 0 clamp(3.5rem, 7vw, 6rem)', marginBottom: '12px' }}>
              <span className="dv-sector-label" style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.55rem', letterSpacing: '0.18em', color: isLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.18)', textTransform: 'uppercase' }}>Product Systems</span>
              <div className="dv-sector-divider" style={{ flex: 1, height: 1, background: isLight ? 'linear-gradient(90deg, rgba(0,0,0,0.1), transparent)' : 'linear-gradient(90deg, rgba(255,255,255,0.07), transparent)' }} />
              <span className="dv-sector-counter" style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.5rem', color: isLight ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.12)', letterSpacing: '0.1em' }}>{activeProduct + 1} / {PRODUCTS.length}</span>
            </div>
            <div className="dv-carousel-grid">
              {PRODUCTS.map((p, i) => (
                <button key={p.id} className={`dv-carousel-cell${i === activeProduct ? ' active' : ''}`} onClick={() => handleProductChange(i)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                    <span className={i !== activeProduct ? 'dv-carousel-cell-tag-inactive' : ''} style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.18em', color: i === activeProduct ? '#E31B54' : isLight ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.25)', textTransform: 'uppercase', transition: 'color 0.22s' }}>{p.tag}</span>
                    {i === activeProduct && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#E31B54', animation: 'dvPulse 2s ease infinite', flexShrink: 0 }} />}
                  </div>
                  <div className={i === activeProduct ? 'dv-carousel-cell-title-active' : 'dv-carousel-cell-title-inactive'} style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.25, color: i === activeProduct ? isLight ? 'rgba(0,0,0,0.88)' : 'rgba(255,255,255,0.92)' : isLight ? 'rgba(0,0,0,0.32)' : 'rgba(255,255,255,0.35)', transition: 'color 0.22s', letterSpacing: '-0.01em' }}>{p.title}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Globe */}
        <div className="dv-globe-col" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', transition: 'background 0.4s ease' }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(${globeTheme.bgGrid} 1px, transparent 1px), linear-gradient(90deg, ${globeTheme.bgGrid} 1px, transparent 1px)`, backgroundSize: '38px 38px' }} />

          {[
            { text: '38\u00b054\u2032N 077\u00b002\u2032W', pos: { top: '4%', left: '5%' } },
            { text: null, pos: { top: '4%', right: '5%' } },
            { text: 'DRAG \u00b7 ROTATE', pos: { bottom: '4%', right: '5%' } },
          ].map((h, i) => (
            <span key={i} style={{ position: 'absolute', ...h.pos, fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.5rem', letterSpacing: '0.1em', color: globeTheme.hudText, pointerEvents: 'none', zIndex: 5, textTransform: 'uppercase' }}>
              {h.text ?? <SigBlink />}
            </span>
          ))}

          {[
            { top: '3%', left: '4%', borderTop: `1px solid ${globeTheme.hudBracket}`, borderLeft: `1px solid ${globeTheme.hudBracket}` },
            { top: '3%', right: '4%', borderTop: `1px solid ${globeTheme.hudBracket}`, borderRight: `1px solid ${globeTheme.hudBracket}` },
          ].map((b, i) => (
            <div key={i} style={{ position: 'absolute', width: 16, height: 16, pointerEvents: 'none', zIndex: 5, ...b }} />
          ))}

          <GlobeD3
            onCountrySelect={setSelectedCountry}
            theme={globeTheme}
            deselectSignal={deselectSignal}
            focusSignal={{ productId: PRODUCTS[activeProduct].id, active: true }}
          />

          {selectedCountry && (
            <CountryCard info={selectedCountry} onClose={handleCountryClose} isLight={isLight} />
          )}

          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '28%', background: `linear-gradient(to bottom, transparent, ${globeTheme.panelBg} 80%)`, pointerEvents: 'none', zIndex: 4 }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8%', background: `linear-gradient(to bottom, ${globeTheme.panelBg}, transparent)`, pointerEvents: 'none', zIndex: 4 }} />
        </div>
      </div>
    </section>
  );
}
