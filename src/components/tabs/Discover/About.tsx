"use client";
import { memo, useMemo, useCallback } from "react";
import Head from 'next/head';
import { WORLD_GRID_ITEMS, WORLD_CONTENT_DATA } from "@/data/Discover-data";
import { useAboutNavigation } from "@/hooks/useAboutNavigation";
import { useAboutMouseTracking } from "@/hooks/useAboutMouseTracking";
import GridNavButton from "@/components/ui/GridNavButton";
import TabButton from "@/components/ui/TabButton";
import ExecutiveCard from "@/components/ui/ExecutiveCard";
import AffiliationRow from "@/components/ui/AffiliationRow";
import LearnMoreButton from "@/components/ui/LearnMoreButton";
import styles from "@/styles/About.module.css";

type WorldContentType = "company" | "direction" | "teams" | "governance" | "affiliations" | "reachout";

// Pre-computed corner positions
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

const About = memo(() => {
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
  } = useAboutNavigation(WORLD_GRID_ITEMS);

  const { handleMouseMove } = useAboutMouseTracking();

  // Memoized data
  const activeContentData = WORLD_CONTENT_DATA[activeContent];
  const currentSubsectionKey = displaySubsection[activeContent];
  const currentSubsection = activeContentData.subsections.find(s => s.key === currentSubsectionKey) || activeContentData.subsections[0];

  // Selector position style
  const selectorStyles = useMemo(() => ({
    top: `${selectorPosition * (100 / WORLD_GRID_ITEMS.length)}%`,
    height: `${100 / WORLD_GRID_ITEMS.length}%`,
  }), [selectorPosition]);

  // Learn more link
  const getLearnMoreLink = useCallback(() => {
    const links: Record<WorldContentType, string> = {
      company: '/company',
      direction: '/direction',
      teams: '/teams',
      governance: '/governance',
      affiliations: '/affiliations',
      reachout: '/contact',
    };
    return links[activeContent];
  }, [activeContent]);

  return (
    <>
      {/* Meta tags to prevent search indexing */}
      <Head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noodp, noydir" />
        <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="slurp" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="duckduckbot" content="noindex, nofollow" />
      </Head>

      <section className={styles.aboutSection} data-nosnippet="true">
        {/* Noise texture */}
        <div className={styles.noiseTexture} />

        <div className="relative z-10 h-full">
          <div className={styles.mainGrid}>
            {/* Left: Grid Navigation */}
            <div className={styles.gridNavigation}>
              {/* Active Selector */}
              <div className={styles.activeSelector} style={selectorStyles}>
                <div className={styles.selectorBackground} />
                <div className={styles.selectorBorder} />

                {/* Corner Indicators */}
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

              {/* Grid Buttons */}
              {WORLD_GRID_ITEMS.map((item, index) => (
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

            {/* Right: Content Panel */}
            <div className={styles.contentPanel}>
              <div className={`${styles.contentWrapper} ${isTransitioning ? styles.transitioning : ''}`}>
                {/* Tab Buttons */}
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

                {/* Tab Content */}
                <div className={`${styles.tabContent} ${isTabTransitioning ? styles.transitioning : ''}`}>
                  <h3 className={styles.sectionTitle}>
                    {currentSubsection.label}
                  </h3>

                  {/* Executive Cards (Teams section only) */}
                  {activeContent === 'teams' && currentSubsectionKey === 'core-executives' && (
                    <>
                      <div className={styles.descriptionContainer}>
                        {currentSubsection.description.map((paragraph, index) => (
                          <p key={index} className={styles.descriptionText}>
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      {activeContentData.executives && (
                        <div className={styles.executivesGrid} aria-hidden="true" data-nosnippet="true">
                          {activeContentData.executives.map((exec) => (
                            <ExecutiveCard
                              key={exec.id}
                              {...exec}
                              onMouseMove={handleMouseMove}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Regular Description Content */}
                  {!(activeContent === 'teams' && currentSubsectionKey === 'core-executives') && (
                    <div className={styles.descriptionContainer}>
                      {currentSubsection.description.map((paragraph, index) => (
                        <p key={index} className={styles.descriptionText}>
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Affiliation Table */}
                  {activeContent === 'affiliations' && currentSubsection.entries && currentSubsection.entries.length > 0 && (
                    <div className={styles.affiliationTable}>
                      {currentSubsection.entries.map((entry) => (
                        <AffiliationRow
                          key={entry.id}
                          {...entry}
                          onMouseMove={handleMouseMove}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Learn More Button */}
                <div className={styles.learnMoreSection}>
                  <LearnMoreButton
                    href={getLearnMoreLink()}
                    onMouseMove={handleMouseMove}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
});

About.displayName = 'About';

export default About;