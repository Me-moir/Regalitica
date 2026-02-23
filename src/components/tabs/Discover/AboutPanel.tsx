"use client";
import { memo, useMemo, useCallback } from "react";
import Head from 'next/head';
import { ABOUT_PANEL_ITEMS, ABOUT_PANEL_CONTENT } from "@/data/Discover-data";
import { useAboutNavigation } from "@/hooks/useAboutNavigation";
import { useAboutMouseTracking } from "@/hooks/useAboutMouseTracking";
import GridNavButton from "@/components/ui/GridNavButton";
import styles from "@/styles/About.module.css";

type AboutContentType = "company" | "philosophy" | "ecosystem" | "direction" | "governance" | "ethics";

type CornerPosition = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  borderL?: boolean;
  borderR?: boolean;
  borderT?: boolean;
  borderB?: boolean;
  delay: number;
};

const CORNER_POSITIONS: CornerPosition[] = [
  { top: 0, left: 0, borderL: true, borderT: true, delay: 0 },
  { top: 0, right: 0, borderR: true, borderT: true, delay: 0.5 },
  { bottom: 0, left: 0, borderL: true, borderB: true, delay: 1 },
  { bottom: 0, right: 0, borderR: true, borderB: true, delay: 1.5 },
];

const ABOUT_TAB_CSS = `
@keyframes aboutTabOrbit {
  0%   { background-position: 0% 0%; }
  100% { background-position: 200% 0%; }
}

.about-tab-border {
  display: inline-flex;
  flex-shrink: 0;
  border-radius: 10.5px;
  padding: 1px;
  position: relative;
  background: transparent;
}

.about-tab-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10.5px;
  background: linear-gradient(90deg,
    rgba(0,255,166,0.0)  0%,
    rgba(0,255,166,0.9) 15%,
    rgba(255,215,0,0.7)  30%,
    rgba(236,72,153,0.7) 45%,
    rgba(147,51,234,0.7) 60%,
    rgba(59,130,246,0.6) 75%,
    rgba(0,255,166,0.0)  90%);
  background-size: 200% 100%;
  animation: aboutTabOrbit 3s linear infinite;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.about-tab-border:hover::before,
.about-tab-border.abt-active::before {
  opacity: 1;
}

.about-tab-btn {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: none;
  border-radius: 9.5px;
  padding: 0.5rem 1.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  background: var(--navbar-bg, #0f0f0f);
  color: var(--content-faint, rgba(255,255,255,0.45));
  box-shadow:
    0 2px 8px rgba(0,0,0,0.18),
    inset 0 1px 0 var(--glass-inset-top, rgba(255,255,255,0.06));
  transition: color 0.15s ease, background 0.15s ease, box-shadow 0.2s ease;
}

@media (min-width: 640px) {
  .about-tab-btn {
    padding: 0.625rem 2rem;
    font-size: 0.875rem;
  }
}

.about-tab-border:hover .about-tab-btn {
  color: var(--content-primary, rgba(255,255,255,0.92));
  box-shadow:
    0 4px 14px rgba(0,0,0,0.26),
    inset 0 1px 0 var(--glass-inset-top, rgba(255,255,255,0.06));
}

.about-tab-btn.abt-active {
  color: var(--content-primary, rgba(255,255,255,0.92));
  font-weight: 600;
  background: var(--navbar-bg-active, #1a1a1a);
  box-shadow:
    0 4px 14px rgba(0,0,0,0.26),
    inset 0 1px 0 var(--glass-inset-top, rgba(255,255,255,0.06));
}

:root.dark .about-tab-border:not(.abt-active) .about-tab-btn {
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.06),
    0 2px 8px rgba(0,0,0,0.18),
    inset 0 1px 0 var(--glass-inset-top, rgba(255,255,255,0.06));
}

:root.light .about-tab-btn {
  background: var(--navbar-bg, #f5f5f5);
  color: var(--content-faint, rgba(0,0,0,0.45));
}
:root.light .about-tab-btn.abt-active {
  background: var(--navbar-bg-active, #ebebeb);
  color: var(--content-primary, rgba(0,0,0,0.92));
}
:root.light .about-tab-border:hover .about-tab-btn {
  color: var(--content-primary, rgba(0,0,0,0.92));
}

.about-lm-border {
  display: inline-flex;
  flex-shrink: 0;
  border-radius: 10.5px;
  padding: 1px;
  position: relative;
  background: transparent;
}

.about-lm-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10.5px;
  background: linear-gradient(90deg,
    rgba(0,255,166,0.0)  0%,
    rgba(0,255,166,0.9) 15%,
    rgba(255,215,0,0.7)  30%,
    rgba(236,72,153,0.7) 45%,
    rgba(147,51,234,0.7) 60%,
    rgba(59,130,246,0.6) 75%,
    rgba(0,255,166,0.0)  90%);
  background-size: 200% 100%;
  animation: aboutTabOrbit 3s linear infinite;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.about-lm-border:hover::before {
  opacity: 1;
}

.about-lm-btn {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  text-decoration: none;
  border-radius: 9.5px;
  padding: 0.5rem 1.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  background: var(--navbar-bg, #0f0f0f);
  color: var(--content-faint, rgba(255,255,255,0.45));
  box-shadow:
    0 2px 8px rgba(0,0,0,0.18),
    inset 0 1px 0 var(--glass-inset-top, rgba(255,255,255,0.06));
  transition: color 0.15s ease, background 0.15s ease, box-shadow 0.2s ease;
}

@media (min-width: 640px) {
  .about-lm-btn {
    padding: 0.625rem 2rem;
    font-size: 0.875rem;
  }
}

.about-lm-border:hover .about-lm-btn {
  color: var(--content-primary, rgba(255,255,255,0.92));
  box-shadow:
    0 4px 14px rgba(0,0,0,0.26),
    inset 0 1px 0 var(--glass-inset-top, rgba(255,255,255,0.06));
}

:root.dark .about-lm-border .about-lm-btn {
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.06),
    0 2px 8px rgba(0,0,0,0.18),
    inset 0 1px 0 var(--glass-inset-top, rgba(255,255,255,0.06));
}

:root.light .about-lm-btn {
  background: var(--navbar-bg, #f5f5f5);
  color: var(--content-faint, rgba(0,0,0,0.45));
}
:root.light .about-lm-border:hover .about-lm-btn {
  color: var(--content-primary, rgba(0,0,0,0.92));
}
`;

interface AboutTabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  onMouseMove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const AboutTabButton = memo<AboutTabButtonProps>(({ label, isActive, onClick, onMouseMove }) => (
  <div className={`about-tab-border${isActive ? " abt-active" : ""}`}>
    <button
      className={`about-tab-btn${isActive ? " abt-active" : ""}`}
      onClick={onClick}
      onMouseMove={onMouseMove}
    >
      {label}
    </button>
  </div>
));
AboutTabButton.displayName = "AboutTabButton";

interface AboutLearnMoreButtonProps {
  href: string;
  onMouseMove?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const AboutLearnMoreButton = memo<AboutLearnMoreButtonProps>(({ href, onMouseMove }) => (
  <div className="about-lm-border">
    <a href={href} className="about-lm-btn" onMouseMove={onMouseMove}>
      <span>Learn More</span>
      <i className="bi bi-arrow-up-right-square"></i>
    </a>
  </div>
));
AboutLearnMoreButton.displayName = "AboutLearnMoreButton";

const AboutPanel = memo(() => {
  const {
    activeContent,
    displayContent,
    isTransitioning,
    selectorPosition,
    activeSubsection,
    displaySubsection,
    isTabTransitioning,
    handleContentChange,
    handleSubsectionChange,
  } = useAboutNavigation(ABOUT_PANEL_ITEMS);

  const { handleMouseMove } = useAboutMouseTracking();

  const activeContentData = ABOUT_PANEL_CONTENT[activeContent];
  const currentSubsectionKey = displaySubsection[activeContent];
  const currentSubsection =
    activeContentData.subsections.find((s) => s.key === currentSubsectionKey) ||
    activeContentData.subsections[0];

  const selectorStyles = useMemo(
    () => ({
      top: `${selectorPosition * (100 / ABOUT_PANEL_ITEMS.length)}%`,
      height: `${100 / ABOUT_PANEL_ITEMS.length}%`,
    }),
    [selectorPosition]
  );

  const getLearnMoreLink = useCallback(() => {
    const links: Record<AboutContentType, string> = {
      company: "/company",
      philosophy: "/philosophy",
      ecosystem: "/ecosystem",
      direction: "/direction",
      governance: "/governance",
      ethics: "/ethics",
    };
    return links[activeContent];
  }, [activeContent]);

  return (
    <>
      <style>{ABOUT_TAB_CSS}</style>

      <Head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noodp, noydir" />
        <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="slurp" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="duckduckbot" content="noindex, nofollow" />
      </Head>

      <section className={styles.aboutSection} data-nosnippet="true">
        <div className={styles.noiseTexture} />

        <div className="relative z-10 h-full">

          {/* ── About Us Header — no background, sits above the panel ── */}
          <div
            style={{
              width: '100%',
              maxWidth: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              paddingTop: '3rem',
              paddingBottom: '2rem',
              background: 'transparent',
            }}
          >
            <h2 className={styles.aboutHeaderTitle}>About Us</h2>
            <p
              className={styles.aboutHeaderDesc}
              style={{
                whiteSpace: 'nowrap',
                display: 'block',
                margin: '0 auto',
                textAlign: 'center',
                maxWidth: 'none',
                width: 'auto',
              }}
            >
              We build with intention — exploring the intersection of technology, design, and human experience.
            </p>
          </div>

          {/* ── Panel — background lives here only ── */}
          <div className={styles.mainGrid}>

            <div className={styles.gridNavigation}>
              <div className={styles.activeSelector} style={selectorStyles}>
                <div className={styles.selectorBackground} />
                <div className={styles.selectorBorder} />
                {CORNER_POSITIONS.map((corner, idx) => (
                  <div
                    key={idx}
                    className={styles.cornerIndicator}
                    style={{
                      ...corner,
                      borderLeftWidth: corner.borderL ? "2px" : 0,
                      borderRightWidth: corner.borderR ? "2px" : 0,
                      borderTopWidth: corner.borderT ? "2px" : 0,
                      borderBottomWidth: corner.borderB ? "2px" : 0,
                      animation: `cornerPulse 2s ease-in-out infinite ${corner.delay}s`,
                    }}
                  />
                ))}
              </div>

              {ABOUT_PANEL_ITEMS.map((item, index) => (
                <GridNavButton
                  key={item.key}
                  item={item}
                  index={index}
                  isActive={displayContent === item.key}
                  onClick={handleContentChange}
                  onMouseMove={handleMouseMove}
                />
              ))}
            </div>

            <div className={styles.contentPanel}>
              <div className={`${styles.contentWrapper} ${isTransitioning ? styles.transitioning : ""}`}>

                {(activeContentData.buttonType === "tabs" || activeContentData.buttonType === "cards") && (
                  <>
                    <div className={styles.tabButtonsContainer}>
                      {activeContentData.subsections.map((subsection) => (
                        <AboutTabButton
                          key={subsection.key}
                          label={subsection.label}
                          isActive={activeSubsection[activeContent] === subsection.key}
                          onClick={() => handleSubsectionChange(subsection.key)}
                          onMouseMove={handleMouseMove}
                        />
                      ))}
                    </div>
                    <div className={styles.divider} />
                  </>
                )}

                <div className={`${styles.tabContent} ${isTabTransitioning ? styles.transitioning : ""}`}>
                  <h3 className={styles.sectionTitle}>{currentSubsection.label}</h3>
                  {currentSubsection.description && (
                    <div className={styles.descriptionContainer}>
                      {currentSubsection.description.map((paragraph, index) => (
                        <p key={index} className={styles.descriptionText}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.learnMoreSection}>
                  <AboutLearnMoreButton href={getLearnMoreLink()} onMouseMove={handleMouseMove} />
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
});

AboutPanel.displayName = "AboutPanel";

export default AboutPanel;