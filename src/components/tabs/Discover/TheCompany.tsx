"use client";
import { memo, useMemo, useCallback, useRef } from "react";
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

interface AboutTabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  onMouseMove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const AboutTabButton = memo<AboutTabButtonProps>(({ label, isActive, onClick, onMouseMove }) => (
  <div className={`${styles.tabBorder}${isActive ? ` ${styles.tabBorderActive}` : ""}`}>
    <button
      className={`${styles.tabBtn}${isActive ? ` ${styles.tabBtnActive}` : ""}`}
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
  <div className={styles.lmBorder}>
    <a href={href} className={styles.lmBtn} onMouseMove={onMouseMove}>
      <span>Learn More</span>
      <i className="bi bi-arrow-up-right-square"></i>
    </a>
  </div>
));
AboutLearnMoreButton.displayName = "AboutLearnMoreButton";

const TheCompany = memo(() => {
  const sectionRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

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
    <div style={{ paddingBottom: '8rem' }}>
    <section
      ref={sectionRef}
      className={styles.aboutSection}
      data-nosnippet="true"
      data-hydrated="true"
      style={{ borderTop: '1px dashed var(--border-dashed)' }}
    >
        <div className={styles.noiseTexture} />

        <div className="relative z-10 h-full">

          {/* ── About Us Header ── */}
          <div
            style={{
              width: '100%',
              maxWidth: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              paddingTop: '6rem',
              paddingBottom: '4rem',
              background: 'transparent',
            }}
          >
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
              Company Profile
            </div>

            <h2 className={styles.aboutHeaderTitle}>The Company</h2>
            <p
              className={styles.aboutHeaderDesc}
              style={{
                whiteSpace: 'nowrap',
                display: 'block',
                margin: '0 auto',
                textAlign: 'center',
                maxWidth: 'none',
                width: 'auto',
                fontSize: '1.2rem',
              }}
            >
              We build with intention — exploring the intersection of technology, design, and human experience.
            </p>

            <div className={styles.headerRule} />
          </div>

          {/* ── Panel ── */}
          <div style={{ marginTop: "3rem" }}>
          <div className={styles.mainGrid}>

            <div ref={navRef} className={styles.gridNavigation} data-hydrated="true">
              <div className={styles.activeSelector} style={selectorStyles}>
                <div className={styles.selectorBackground} />
                <div className={styles.selectorBorder} />
                <div className={styles.selectorCrimson} />
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

              <div className={styles.navDivider} />
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
                    <div className={styles.dividerCrimson} />
                  </>
                )}

                <div
                  className={`${styles.tabContent} ${isTabTransitioning ? styles.transitioning : ""}`}
                  style={{ paddingTop: '2rem' }}
                >
                  <h3 className={styles.sectionTitle}>{currentSubsection.contentTitle}</h3>
                  {currentSubsection.description && (
                    <div className={styles.descriptionContainer}>
                      {currentSubsection.description.map((paragraph, index) => (
                        <p key={index} className={styles.descriptionText}>{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.learnMoreSection}>
                  <div className={styles.learnMoreInner}>
                    <AboutLearnMoreButton href={getLearnMoreLink()} onMouseMove={handleMouseMove} />
                  </div>
                </div>

              </div>
            </div>

          </div>
          </div>
        </div>
      </section>
    </div>
  );
});

TheCompany.displayName = "TheCompany";

export default TheCompany;