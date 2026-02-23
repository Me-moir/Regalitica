"use client";
import { memo, useMemo, useCallback } from "react";
import Head from 'next/head';
import { ABOUT_PANEL_ITEMS, ABOUT_PANEL_CONTENT } from "@/data/Discover-data";
import { useAboutNavigation } from "@/hooks/useAboutNavigation";
import { useAboutMouseTracking } from "@/hooks/useAboutMouseTracking";
import GridNavButton from "@/components/ui/GridNavButton";
import TabButton from "@/components/ui/TabButton";
// AffiliationRow removed — entries are paragraph-only now
import LearnMoreButton from "@/components/ui/LearnMoreButton";
import styles from "@/styles/About.module.css";

type WorldContentType = "company" | "philosophy" | "ecosystem" | "direction" | "governance" | "ethics";

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

const WorldPanel = memo(() => {
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
  const currentSubsection = activeContentData.subsections.find(s => s.key === currentSubsectionKey) || activeContentData.subsections[0];

  const selectorStyles = useMemo(() => ({
    top: `${selectorPosition * (100 / ABOUT_PANEL_ITEMS.length)}%`,
    height: `${100 / ABOUT_PANEL_ITEMS.length}%`,
  }), [selectorPosition]);

  const getLearnMoreLink = useCallback(() => {
    const links: Record<WorldContentType, string> = {
      company: '/company',
      philosophy: '/philosophy',
      ecosystem: '/ecosystem',
      direction: '/direction',
      governance: '/governance',
      ethics: '/ethics',
    };
    return links[activeContent];
  }, [activeContent]);

  return (
    <>
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
                      borderLeftWidth: corner.borderL ? '2px' : 0,
                      borderRightWidth: corner.borderR ? '2px' : 0,
                      borderTopWidth: corner.borderT ? '2px' : 0,
                      borderBottomWidth: corner.borderB ? '2px' : 0,
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
              <div className={`${styles.contentWrapper} ${isTransitioning ? styles.transitioning : ''}`}>
                {(activeContentData.buttonType === 'tabs' || activeContentData.buttonType === 'cards') && (
                  <>
                    <div className={styles.tabButtonsContainer}>
                      {activeContentData.subsections.map((subsection) => (
                        <TabButton
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

                <div className={`${styles.tabContent} ${isTabTransitioning ? styles.transitioning : ''}`}>
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
                  <LearnMoreButton href={getLearnMoreLink()} onMouseMove={handleMouseMove} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
});

WorldPanel.displayName = 'WorldPanel';

export default WorldPanel;
