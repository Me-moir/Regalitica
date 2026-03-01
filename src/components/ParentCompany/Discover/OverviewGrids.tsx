"use client";
import { memo, useState } from 'react';
import { OverviewContent } from '@/data/Discover-data';
import styles from '@/styles/ui.module.css';
import aboutStyles from '@/styles/About.module.css';

const Overview = memo(({ onLearnMore }: { onLearnMore?: () => void }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [learnMoreHovered, setLearnMoreHovered] = useState(false);

  return (
    <div style={{ paddingBottom: '8rem' }}>
      <section
        className="relative overflow-hidden"
        style={{
          background: 'var(--gradient-section)',
          borderTop: '1px dashed var(--border-dashed)',
          borderBottom: '1px dashed var(--border-dashed)',
        }}
      >
        {/* Noise texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '100px 100px',
          }}
        />

        <div className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-12 xl:px-20 py-8 md:py-12 lg:py-16">

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6 md:mb-10 lg:mb-12">
            <div
              className="inline-flex items-center gap-2 mb-4"
              style={{
                fontFamily: 'ui-monospace, Menlo, monospace',
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                fontWeight: 700,
                color: '#E31B54',
              }}
            >
              <span className={aboutStyles.eyebrowDot} />
              Company Overview
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold inline">
                {'The Core — '.split('').map((letter, i) => (
                  <span
                    key={i}
                    className={styles.premiumBtnLetter}
                    style={{
                      animationDelay: `${i * 0.08}s`,
                      background: 'var(--text-gradient)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      display: 'inline-block',
                    }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </h2>
              <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl inline">
                {'Everything. Structured.'.split('').map((letter, i) => (
                  <span
                    key={i}
                    className={styles.premiumBtnLetter}
                    style={{
                      animationDelay: `${(i + 21) * 0.08}s`,
                      color: 'var(--content-faint)',
                      display: 'inline-block',
                    }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </span>
            </div>

            <div className={aboutStyles.headerRule} />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {OverviewContent.map((overviewSection, index) => {
              const isHovered = hoveredIndex === index;

              return (
                <div
                  key={index}
                  className="relative backdrop-blur-sm overflow-hidden"
                  style={{
                    borderRadius: '0.75rem',
                    border: '1px solid var(--border-color)',
                    padding: '0.25rem',
                    transition: 'border-color 0.3s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                  }}
                >
                  {/* Hover gradient border */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      borderRadius: '0.75rem',
                      padding: '1px',
                      background: 'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,255,166,0.8), rgba(255,215,0,0.6), rgba(236,72,153,0.6), rgba(147,51,234,0.6), rgba(59,130,246,0.5), transparent 70%)',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      zIndex: 1,
                      opacity: isHovered ? 1 : 0,
                      transition: 'opacity 0.5s ease',
                    }}
                  />

                  <div
                    className="relative z-10 h-full md:!p-8 lg:!p-10 md:!min-h-[240px] lg:!min-h-[280px]"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      gap: 0,
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      background: 'var(--gradient-card)',
                      border: '0.75px solid var(--border-subtle)',
                      minHeight: '140px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Crimson corner accent — top-left, always visible */}
                    <div
                      className="absolute top-0 left-0 pointer-events-none"
                      style={{
                        width: '40px', height: '2px',
                        background: 'linear-gradient(90deg, #E31B54, transparent)',
                        opacity: 0.6,
                      }}
                    />
                    <div
                      className="absolute top-0 left-0 pointer-events-none"
                      style={{
                        width: '2px', height: '40px',
                        background: 'linear-gradient(to bottom, #E31B54, transparent)',
                        opacity: 0.6,
                      }}
                    />

                    {/* Crimson corner accent — bottom-right, on hover */}
                    <div
                      className="absolute bottom-0 right-0 pointer-events-none"
                      style={{
                        width: '32px', height: '2px',
                        background: 'linear-gradient(270deg, rgba(227,27,84,0.5), transparent)',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.4s ease',
                      }}
                    />
                    <div
                      className="absolute bottom-0 right-0 pointer-events-none"
                      style={{
                        width: '2px', height: '32px',
                        background: 'linear-gradient(to top, rgba(227,27,84,0.5), transparent)',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.4s ease',
                      }}
                    />

                    {/* Icon */}
                    <div
                      className="mb-2 md:mb-4 lg:mb-5 text-lg md:text-2xl lg:text-3xl xl:text-4xl"
                      style={{
                        color: 'var(--content-faint)',
                        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      <i className={`bi ${overviewSection.icon}`} />
                    </div>

                    {/* Title row — title shrinks to min-content, red line takes all remaining space */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.25rem',
                        width: '100%',
                        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                        transition: 'transform 0.3s ease',
                        overflow: 'hidden',
                      }}
                    >
                      <h3
                        className="text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl leading-tight"
                        style={{
                          color: 'var(--content-primary)',
                          fontWeight: 600,
                          margin: 0,
                          flexShrink: 0,
                          // letter-spacing expands outward from each character
                          letterSpacing: isHovered ? '0.02em' : '0em',
                          transition: 'letter-spacing 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        {overviewSection.title}
                      </h3>

                      {/* Red line — flex-1 makes it fill ALL remaining space to the right edge */}
                      <div
                        style={{
                          flex: 1,
                          height: '2px',
                          borderRadius: '999px',
                          background: 'linear-gradient(90deg, #E31B54, rgba(227,27,84,0.2))',
                          boxShadow: isHovered ? '0 0 6px rgba(227,27,84,0.4)' : 'none',
                          // width animates via maxWidth: 0 → 100% so it grows left to right
                          maxWidth: isHovered ? '100%' : '0%',
                          opacity: isHovered ? 1 : 0,
                          transition: 'max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.12s, opacity 0.3s ease 0.12s, box-shadow 0.3s ease 0.12s',
                          overflow: 'hidden',
                        }}
                      />
                    </div>

                    <p
                      style={{
                        color: 'var(--content-tertiary)',
                        lineHeight: '1.4',
                        margin: 0,
                        marginTop: '0.35rem',
                        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                        transition: 'transform 0.3s ease',
                      }}
                      className="text-[10px] sm:text-xs md:text-base lg:text-lg !leading-relaxed"
                    >
                      {overviewSection.description}
                    </p>

                    {/* Index tag — dark: frosted gray | light: crimson + white */}
                    <span
                      className={aboutStyles.overviewIndexTag}
                      style={{
                        position: 'absolute',
                        bottom: '0.75rem',
                        right: '0.75rem',
                        fontFamily: 'ui-monospace, Menlo, monospace',
                        fontSize: '0.5rem',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        pointerEvents: 'none',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Learn More Card */}
            <div
              className="relative backdrop-blur-sm overflow-hidden cursor-pointer"
              style={{
                borderRadius: '0.75rem',
                border: '1px solid var(--border-color)',
                padding: '0.25rem',
                transition: 'border-color 0.3s ease',
              }}
              onClick={() => onLearnMore?.()}
              onMouseEnter={() => setLearnMoreHovered(true)}
              onMouseLeave={() => setLearnMoreHovered(false)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
              }}
            >
              {/* Hover gradient border */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: '0.75rem',
                  padding: '1px',
                  background: 'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,255,166,0.8), rgba(255,215,0,0.6), rgba(236,72,153,0.6), rgba(147,51,234,0.6), rgba(59,130,246,0.5), transparent 70%)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  zIndex: 1,
                  opacity: learnMoreHovered ? 1 : 0,
                  transition: 'opacity 0.5s ease',
                }}
              />

              <div
                className="relative z-10 h-full flex items-center justify-center md:min-h-[240px] lg:min-h-[280px]"
                style={{
                  borderRadius: '0.5rem',
                  background: 'var(--surface-primary)',
                  border: '0.75px solid var(--border-subtle)',
                  minHeight: '140px',
                  overflow: 'hidden',
                }}
              >
                {/* Crimson glow orb */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(227,27,84,0.08) 0%, transparent 70%)',
                    opacity: learnMoreHovered ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                  }}
                />

                {/* Crimson top rule — expands outward from center */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                  style={{
                    height: '2px',
                    background: '#E31B54',
                    boxShadow: '0 0 10px rgba(227,27,84,0.6)',
                    borderRadius: '999px',
                    width: learnMoreHovered ? '60%' : '0px',
                    transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
                  }}
                />

                {/* Learn More content */}
                <div
                  className="flex flex-col items-center gap-2"
                  style={{
                    opacity: learnMoreHovered ? 1 : 0.5,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {/* Eyebrow dot */}
                  <span
                    style={{
                      display: 'block', width: '5px', height: '5px',
                      borderRadius: '50%', background: '#E31B54',
                      boxShadow: '0 0 6px rgba(227,27,84,0.7)',
                      animation: 'aboutEyepulse 2s ease-in-out infinite',
                      opacity: learnMoreHovered ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  />

                  {/* Title + icon — letter-spacing expands outward, arrow shifts right */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <h3
                      className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-semibold"
                      style={{
                        background: 'var(--text-gradient)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        letterSpacing: learnMoreHovered ? '0.09em' : '0em',
                        transition: 'letter-spacing 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'block',
                      }}
                    >
                      Learn More
                    </h3>
                    <i
                      className="bi bi-arrow-up-right-square text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl"
                      style={{
                        background: 'var(--text-gradient)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        transform: learnMoreHovered ? 'translateX(4px)' : 'translateX(0px)',
                        transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'inline-block',
                      }}
                    />
                  </div>

                  {/* Explore All Features */}
                  <span
                    className={aboutStyles.overviewExploreLabel}
                    style={{
                      fontFamily: 'ui-monospace, Menlo, monospace',
                      fontSize: '0.55rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      opacity: learnMoreHovered ? 1 : 0,
                      transition: 'opacity 0.4s ease 0.1s',
                    }}
                  >
                    Explore All Features
                  </span>
                </div>

                {/* Corner accents */}
                {[
                  { top: 0, left: 0, borderTop: '2px solid rgba(227,27,84,0.5)', borderLeft: '2px solid rgba(227,27,84,0.5)', borderRadius: '0.5rem 0 0 0' },
                  { top: 0, right: 0, borderTop: '2px solid rgba(227,27,84,0.5)', borderRight: '2px solid rgba(227,27,84,0.5)', borderRadius: '0 0.5rem 0 0' },
                  { bottom: 0, left: 0, borderBottom: '2px solid rgba(227,27,84,0.5)', borderLeft: '2px solid rgba(227,27,84,0.5)', borderRadius: '0 0 0 0.5rem' },
                  { bottom: 0, right: 0, borderBottom: '2px solid rgba(227,27,84,0.5)', borderRight: '2px solid rgba(227,27,84,0.5)', borderRadius: '0 0 0.5rem 0' },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="absolute pointer-events-none"
                    style={{
                      ...s,
                      width: '16px', height: '16px',
                      opacity: learnMoreHovered ? 1 : 0,
                      transition: `opacity 0.35s ease ${i * 0.05}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

Overview.displayName = 'Overview';

export default Overview;