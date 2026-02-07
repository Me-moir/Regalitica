"use client";
import { memo, useState, useRef, useEffect, useCallback, useMemo } from "react";
import styles from "@/styles/ui.module.css";
import { WORLD_GRID_ITEMS, WORLD_CONTENT_DATA, ExecutiveCard } from "@/data/Discover-data";
import Head from 'next/head';

type WorldContentType = "company" | "direction" | "teams" | "governance" | "affiliations" | "reachout";

// Pre-compute corner positions to avoid recreation
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
  const [activeContent, setActiveContent] = useState<WorldContentType>("company");
  const [displayContent, setDisplayContent] = useState<WorldContentType>("company");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectorPosition, setSelectorPosition] = useState(0);
  const [activeSubsection, setActiveSubsection] = useState<Record<WorldContentType, string>>({
    company: 'about',
    direction: 'vision',
    teams: 'core-executives',
    governance: 'structure',
    affiliations: 'investors', // Changed default to 'investors'
    reachout: 'inquiry'
  });
  const [displaySubsection, setDisplaySubsection] = useState<Record<WorldContentType, string>>({
    company: 'about',
    direction: 'vision',
    teams: 'core-executives',
    governance: 'structure',
    affiliations: 'investors', // Changed default to 'investors'
    reachout: 'inquiry'
  });
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const tabTransitionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      if (tabTransitionTimeoutRef.current) {
        clearTimeout(tabTransitionTimeoutRef.current);
      }
    };
  }, []);

  // Memoize content change handler
  const handleContentChange = useCallback((newContent: WorldContentType) => {
    if (newContent === displayContent) return;
    
    // Clear any existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    
    // Update selector position and grid display immediately for instant visual feedback
    const index = WORLD_GRID_ITEMS.findIndex(item => item.key === newContent);
    setSelectorPosition(index);
    setDisplayContent(newContent);
    
    // Start fade out transition for right content panel
    setIsTransitioning(true);
    
    // Wait for fade out to complete, then update content and fade in
    transitionTimeoutRef.current = setTimeout(() => {
      setActiveContent(newContent);
      setIsTransitioning(false);
    }, 350);
  }, [displayContent]);

  // Handle subsection tab change with transition
  const handleSubsectionChange = useCallback((subsectionKey: string) => {
    if (subsectionKey === activeSubsection[activeContent]) return;
    
    // Update the active subsection immediately for instant button feedback
    setActiveSubsection(prev => ({
      ...prev,
      [activeContent]: subsectionKey
    }));
    
    // Clear any existing timeout
    if (tabTransitionTimeoutRef.current) {
      clearTimeout(tabTransitionTimeoutRef.current);
    }
    
    // Start fade out transition for content only
    setIsTabTransitioning(true);
    
    // Wait for fade out to complete, then update display subsection and fade in
    tabTransitionTimeoutRef.current = setTimeout(() => {
      setDisplaySubsection(prev => ({
        ...prev,
        [activeContent]: subsectionKey
      }));
      setIsTabTransitioning(false);
    }, 350);
  }, [activeContent, activeSubsection]);

  // Optimized mouse move handler with throttling
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    // Use requestAnimationFrame for smoother performance
    requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.style.setProperty('--mouse-x', `${x}px`);
      target.style.setProperty('--mouse-y', `${y}px`);
    });
  }, []);

  // Mouse move handler for buttons
  const handleButtonMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    const target = e.currentTarget;
    requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.style.setProperty('--mouse-x', `${x}px`);
      target.style.setProperty('--mouse-y', `${y}px`);
    });
  }, []);

  // Mouse move handler for executive cards
  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.style.setProperty('--mouse-x', `${x}px`);
      target.style.setProperty('--mouse-y', `${y}px`);
    });
  }, []);

  // Mouse move handler for affiliation table rows
  const handleRowMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.style.setProperty('--mouse-x', `${x}px`);
      target.style.setProperty('--mouse-y', `${y}px`);
    });
  }, []);

  // Memoize inline styles
  const selectorStyles = useMemo(() => ({
    top: `${selectorPosition * (100 / WORLD_GRID_ITEMS.length)}%`,
    left: 0,
    right: 0,
    height: `${100 / WORLD_GRID_ITEMS.length}%`,
    transition: 'top 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  }), [selectorPosition]);

  const contentWrapperStyles = useMemo(() => ({
    opacity: isTransitioning ? 0 : 1,
    transform: isTransitioning ? 'translateY(-10px)' : 'translateY(0)',
    transition: 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
  }), [isTransitioning]);

  const tabContentStyles = useMemo(() => ({
    opacity: isTabTransitioning ? 0 : 1,
    transform: isTabTransitioning ? 'translateY(-10px)' : 'translateY(0)',
    transition: 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
  }), [isTabTransitioning]);

  const activeContentData = WORLD_CONTENT_DATA[activeContent];
  const currentSubsectionKey = displaySubsection[activeContent];
  const currentSubsection = activeContentData.subsections.find(s => s.key === currentSubsectionKey) || activeContentData.subsections[0];
  
  // Pre-compute title letters
  const TITLE_LETTERS = useMemo(() => activeContentData.title.split(''), [activeContentData.title]);

  return (
    <>
      {/* FAILSAFE #1: Meta tags to prevent search indexing */}
      <Head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noodp, noydir" />
        <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="slurp" content="noindex, nofollow, noarchive, nosnippet" />
        <meta name="duckduckbot" content="noindex, nofollow" />
      </Head>

      <section 
        className="relative"
        style={{
          background: 'linear-gradient(to bottom, rgb(20, 20, 20) 0%, rgb(10, 10, 10) 50%, rgb(0, 0, 0) 100%)',
          height: '100vh',
          minHeight: '600px',
          marginTop: '200px',
          marginBottom: '200px',
        }}
        // FAILSAFE #2: data-nosnippet attribute
        data-nosnippet="true"
      >
        <style>{`
          @keyframes cornerPulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
          }

          .grid-selector-border {
            transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            will-change: opacity;
          }

          .grid-selector-corners {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }

          /* GPU acceleration for smooth animations */
          .gpu-accelerated {
            transform: translateZ(0);
            backface-visibility: hidden;
          }

          /* Optimize radial gradient performance */
          .hover-gradient {
            will-change: opacity;
          }

          /* Contain layout calculations */
          .contain-layout {
            contain: layout style paint;
          }

          /* Button Gradient Border */
          .gradient-btn {
            position: relative;
          }

          .gradient-btn::before {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: 10px;
            padding: 1px;
            background: radial-gradient(
              200px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
              rgba(0, 255, 166, 0.8),
              rgba(255, 215, 0, 0.6),
              rgba(236, 72, 153, 0.6),
              rgba(147, 51, 234, 0.6),
              rgba(59, 130, 246, 0.5),
              transparent 70%
            );
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 0;
          }

          .gradient-btn:hover::before {
            opacity: 1;
          }

          /* Tab Button Styles */
          .tab-btn {
            --border-radius: 8px;
            --button-color: #101010;
            position: relative;
            user-select: none;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            padding: 0.625rem 2rem;
            font-size: 0.875rem;
            font-weight: 500;
            background-color: var(--button-color);
            box-shadow: inset 0px 1px 1px rgba(255, 255, 255, 0.2),
              inset 0px 2px 2px rgba(255, 255, 255, 0.15),
              inset 0px 4px 4px rgba(255, 255, 255, 0.1);
            border: solid 1px #fff2;
            border-radius: var(--border-radius);
            cursor: pointer;
            overflow: visible;
            color: #fff5;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            isolation: isolate;
          }

          .tab-btn::before {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: 10px;
            padding: 1px;
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(0, 255, 166, 0.8) 15%,
              rgba(255, 215, 0, 0.6) 30%,
              rgba(236, 72, 153, 0.6) 45%,
              rgba(147, 51, 234, 0.6) 60%,
              rgba(59, 130, 246, 0.5) 75%,
              transparent 90%
            );
            background-size: 200% 100%;
            animation: orbitBorder 3s linear infinite;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            opacity: 0;
            transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            z-index: -1;
          }

          @keyframes orbitBorder {
            0% { background-position: 0% 0%; }
            100% { background-position: 200% 0%; }
          }

          .tab-btn.active {
            color: #fff;
            background-color: rgba(255, 255, 255, 0.08);
          }

          .tab-btn.active::before {
            opacity: 1;
          }

          .tab-btn:hover {
            color: #fff;
          }

          .tab-btn:hover::before {
            opacity: 1;
          }

          /* Executive Card Styles - Bigger Size */
          .executive-card {
            position: relative;
            aspect-ratio: 3/4;
            border-radius: 16px;
            background: linear-gradient(135deg, #0f0f0f 0%, #050505 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 2rem;
            cursor: pointer;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
          }

          .executive-card:hover {
            transform: translateY(-4px);
          }

          .executive-card::before {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: 16px;
            padding: 1px;
            background: radial-gradient(
              300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
              rgba(0, 255, 166, 0.8),
              rgba(255, 215, 0, 0.6),
              rgba(236, 72, 153, 0.6),
              rgba(147, 51, 234, 0.6),
              rgba(59, 130, 246, 0.5),
              transparent 70%
            );
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 1;
          }

          .executive-card:hover::before {
            opacity: 1;
          }

          .portrait-placeholder {
            width: 100%;
            aspect-ratio: 1;
            border-radius: 10px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
            position: relative;
            overflow: hidden;
          }

          .portrait-placeholder::after {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(
              circle at center,
              rgba(255, 255, 255, 0.03) 0%,
              transparent 70%
            );
          }

          .initials-text {
            font-size: 2.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, #ffffff 0%, #d4d4d4 50%, #a3a3a3 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            z-index: 1;
          }

          /* Executive Cards Grid - 2 rows: 3 cards top, 2 cards bottom */
          .executives-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .executives-grid .executive-card:nth-child(n+4) {
            grid-column: span 1;
          }

          /* Center the bottom row */
          .executives-grid .executive-card:nth-child(4) {
            margin-left: auto;
            margin-right: 0.75rem;
          }

          .executives-grid .executive-card:nth-child(5) {
            margin-left: 0.75rem;
            margin-right: auto;
          }

          /* Affiliation Table Styles */
          .affiliation-table {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin-top: 2rem;
          }

          .affiliation-row {
            position: relative;
            display: grid;
            grid-template-columns: 80px 1fr 150px;
            align-items: center;
            gap: 1.5rem;
            padding: 1.5rem;
            border-radius: 12px;
            background: linear-gradient(135deg, #0f0f0f 0%, #050505 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
          }

          .affiliation-row:hover {
            transform: translateY(-2px);
          }

          .affiliation-row::before {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: 12px;
            padding: 1px;
            background: radial-gradient(
              300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
              rgba(0, 255, 166, 0.8),
              rgba(255, 215, 0, 0.6),
              rgba(236, 72, 153, 0.6),
              rgba(147, 51, 234, 0.6),
              rgba(59, 130, 246, 0.5),
              transparent 70%
            );
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: 1;
          }

          .affiliation-row:hover::before {
            opacity: 1;
          }

          .affiliation-logo {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(255, 255, 255, 0.05);
            position: relative;
            overflow: hidden;
          }

          .affiliation-logo::after {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(
              circle at center,
              rgba(255, 255, 255, 0.03) 0%,
              transparent 70%
            );
          }

          .logo-icon {
            font-size: 2rem;
            background: linear-gradient(135deg, #ffffff 0%, #d4d4d4 50%, #a3a3a3 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            z-index: 1;
          }

          .affiliation-name {
            font-size: 1.125rem;
            font-weight: 600;
            color: #ffffff;
            z-index: 2;
          }

          .affiliation-date {
            font-size: 0.875rem;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.5);
            text-align: right;
            z-index: 2;
          }

          @media (max-width: 1024px) {
            .executives-grid {
              grid-template-columns: repeat(2, 1fr);
            }

            .executives-grid .executive-card:nth-child(4),
            .executives-grid .executive-card:nth-child(5) {
              margin-left: 0;
              margin-right: 0;
            }

            .affiliation-row {
              grid-template-columns: 60px 1fr 120px;
              gap: 1rem;
            }

            .affiliation-logo {
              width: 60px;
              height: 60px;
            }

            .logo-icon {
              font-size: 1.5rem;
            }
          }

          @media (max-width: 640px) {
            .executives-grid {
              grid-template-columns: 1fr;
            }

            .initials-text {
              font-size: 2rem;
            }

            .executive-card {
              padding: 1.25rem;
            }

            .affiliation-row {
              grid-template-columns: 1fr;
              gap: 1rem;
              text-align: center;
            }

            .affiliation-logo {
              margin: 0 auto;
            }

            .affiliation-date {
              text-align: center;
            }
          }
        `}</style>

        {/* Optimized noise texture */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '100px 100px',
          }}
        />

        <div className="relative z-10 h-full">
          <div 
            className="grid lg:grid-cols-10 h-full"
            style={{
              borderTop: '1px dashed rgba(255, 255, 255, 0.2)',
              borderBottom: '1px dashed rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* Left Part - Grid Navigation */}
            <div className="lg:col-span-3 flex flex-col relative h-full">
              {/* Shared Active Selector */}
              <div className="absolute pointer-events-none z-20 gpu-accelerated" style={selectorStyles}>
                {/* Lighter background for active box */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                  }}
                />
                
                <div 
                  className="absolute inset-0 pointer-events-none grid-selector-border"
                  style={{
                    padding: '1px',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(0, 255, 166, 0.8) 15%, rgba(255, 215, 0, 0.6) 30%, rgba(236, 72, 153, 0.6) 45%, rgba(147, 51, 234, 0.6) 60%, rgba(59, 130, 246, 0.5) 75%, transparent 90%)',
                    backgroundSize: '200% 100%',
                    animation: 'orbitBorder 3s linear infinite',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />

                {/* Corner Indicators */}
                {CORNER_POSITIONS.map((corner, idx) => (
                  <div 
                    key={idx}
                    className="absolute w-3 h-3 lg:w-4 lg:h-4 border-white pointer-events-none grid-selector-corners"
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

              {WORLD_GRID_ITEMS.map((item, index) => (
                <GridButton
                  key={item.key}
                  item={item}
                  index={index}
                  isActive={displayContent === item.key}
                  onClick={handleContentChange}
                  onMouseMove={handleMouseMove}
                />
              ))}
            </div>

            {/* Right Part - Content Area */}
            <div 
              className="lg:col-span-7 flex flex-col px-4 sm:px-6 lg:px-12 xl:px-20 contain-layout h-full overflow-y-auto"
              style={{
                paddingTop: '80px',
                paddingBottom: '80px',
              }}
            >
              <div style={contentWrapperStyles} className="flex-1 flex flex-col">
                {/* Tab Buttons (if applicable) */}
                {activeContentData.buttonType === 'tabs' && (
                  <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 lg:mb-10">
                    {activeContentData.subsections.map((subsection) => (
                      <button
                        key={subsection.key}
                        onClick={() => handleSubsectionChange(subsection.key)}
                        onMouseMove={handleButtonMouseMove}
                        className={`tab-btn ${
                          activeSubsection[activeContent] === subsection.key ? 'active' : ''
                        }`}
                      >
                        {subsection.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Card Buttons for Teams Section */}
                {activeContentData.buttonType === 'cards' && (
                  <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 lg:mb-10">
                    {activeContentData.subsections.map((subsection) => (
                      <button
                        key={subsection.key}
                        onClick={() => handleSubsectionChange(subsection.key)}
                        onMouseMove={handleButtonMouseMove}
                        className={`tab-btn ${
                          activeSubsection[activeContent] === subsection.key ? 'active' : ''
                        }`}
                      >
                        {subsection.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Tab Content with transition */}
                <div style={tabContentStyles} className="flex-1 flex flex-col">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-white mb-3 sm:mb-4">
                    {currentSubsection.label}
                  </h3>
                  
                  {/* Description for Core Executives - shown before cards */}
                  {activeContent === 'teams' && currentSubsectionKey === 'core-executives' && (
                    <div className="flex-1 flex flex-col space-y-4 sm:space-y-5 lg:space-y-6 mb-8">
                      {currentSubsection.description.map((paragraph, index) => (
                        <p 
                          key={index} 
                          className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400"
                          style={{ lineHeight: '2rem' }}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                  
                  {/* Executive Cards Grid - FAILSAFE #3: aria-hidden to prevent screen reader indexing */}
                  {activeContent === 'teams' && currentSubsectionKey === 'core-executives' && activeContentData.executives && (
                    <div 
                      className="executives-grid"
                      aria-hidden="true"
                      data-nosnippet="true"
                    >
                      {activeContentData.executives.map((exec) => (
                        <div
                          key={exec.id}
                          className="executive-card"
                          onMouseMove={handleCardMouseMove}
                          // FAILSAFE #4: data-private attribute
                          data-private="true"
                          data-nosnippet="true"
                        >
                          {/* Portrait Placeholder */}
                          <div className="portrait-placeholder">
                            <span className="initials-text">{exec.initials}</span>
                          </div>
                          
                          {/* Executive Info - FAILSAFE #5: Obfuscated text rendering */}
                          <div className="relative z-10">
                            {/* Name placeholder */}
                            <h3 
                              className="text-sm sm:text-base font-bold text-white mb-1"
                              style={{ 
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                MozUserSelect: 'none',
                                msUserSelect: 'none'
                              }}
                              data-nosnippet="true"
                            >
                              {exec.name.split('').map((char, idx) => (
                                <span key={idx} data-char="obfuscated">
                                  {char}
                                  {idx < exec.name.length - 1 && <span style={{fontSize: 0}}>&#8203;</span>}
                                </span>
                              ))}
                            </h3>
                            <h4 
                              className="text-xs sm:text-sm font-semibold text-gray-300 mb-1"
                              style={{ 
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                MozUserSelect: 'none',
                                msUserSelect: 'none'
                              }}
                              data-nosnippet="true"
                            >
                              {/* FAILSAFE #6: Zero-width characters to break pattern matching */}
                              {exec.position.split('').map((char, idx) => (
                                <span key={idx} data-char="obfuscated">
                                  {char}
                                  {idx < exec.position.length - 1 && <span style={{fontSize: 0}}>&#8203;</span>}
                                </span>
                              ))}
                            </h4>
                            {exec.department && (
                              <p 
                                className="text-xs text-gray-400"
                                style={{ 
                                  userSelect: 'none',
                                  WebkitUserSelect: 'none',
                                  MozUserSelect: 'none',
                                  msUserSelect: 'none'
                                }}
                                data-nosnippet="true"
                              >
                                {exec.department}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Description Content - shown for all sections */}
                  {!(activeContent === 'teams' && currentSubsectionKey === 'core-executives') && (
                    <div className="flex-1 flex flex-col space-y-4 sm:space-y-5 lg:space-y-6">
                      {currentSubsection.description.map((paragraph, index) => (
                        <p 
                          key={index} 
                          className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400"
                          style={{ lineHeight: '2rem' }}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Affiliation Table - shown when activeContent is 'affiliations' and entries exist */}
                  {activeContent === 'affiliations' && currentSubsection.entries && currentSubsection.entries.length > 0 && (
                    <div className="affiliation-table">
                      {currentSubsection.entries.map((entry) => (
                        <div
                          key={entry.id}
                          className="affiliation-row"
                          onMouseMove={handleRowMouseMove}
                        >
                          <div className="affiliation-logo">
                            <span className="logo-icon">🏢</span>
                          </div>
                          <div className="affiliation-name">{entry.name}</div>
                          <div className="affiliation-date">{entry.dateJoined}</div>
                        </div>
                      ))}
                    </div>
                  )}
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

const GridButton = memo<{
  item: { key: WorldContentType; title: string; subtitle: string };
  index: number;
  isActive: boolean;
  onClick: (key: WorldContentType) => void;
  onMouseMove: (e: React.MouseEvent<HTMLButtonElement>) => void;
}>(({ item, index, isActive, onClick, onMouseMove }) => {
  const handleClick = useCallback(() => {
    onClick(item.key);
  }, [onClick, item.key]);

  const buttonStyle = useMemo(() => ({
    background: 'transparent',
    borderTop: index === 0 ? 'none' : '1px dashed rgba(255, 255, 255, 0.2)',
    borderRight: '1px dashed rgba(255, 255, 255, 0.2)',
  }), [index]);

  const titleStyle = useMemo(() => ({
    transform: isActive ? 'translateX(-4px)' : 'translateX(0)',
    fontWeight: isActive ? '700' : '400',
    textTransform: isActive ? 'uppercase' : 'none',
    letterSpacing: isActive ? '0.05em' : '0',
    background: isActive ? 'linear-gradient(135deg, #ffffff 0%, #d4d4d4 50%, #a3a3a3 100%)' : 'transparent',
    WebkitBackgroundClip: isActive ? 'text' : 'unset',
    WebkitTextFillColor: isActive ? 'transparent' : 'rgba(255, 255, 255, 0.5)',
    backgroundClip: isActive ? 'text' : 'unset',
    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  }), [isActive]);

  const subtitleStyle = useMemo(() => ({
    opacity: isActive ? 0.9 : 0.6,
    transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  }), [isActive]);

  const hoverGradientStyle = {
    background: 'radial-gradient(200px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 166, 0.8), rgba(255, 215, 0, 0.6), rgba(236, 72, 153, 0.6), rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.5), transparent 70%)',
    padding: '1px',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
  };

  return (
    <button
      onClick={handleClick}
      className="group relative flex-1 flex flex-col items-end justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-3 transition-all duration-300 contain-layout"
      style={buttonStyle}
      onMouseMove={onMouseMove}
    >
      <span 
        className="text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl font-normal relative z-10 text-right" 
        style={titleStyle}
      >
        {item.title}
      </span>
      
      {item.subtitle && (
        <span 
          className="text-[10px] sm:text-xs md:text-sm text-gray-400 relative z-10 text-right mt-1"
          style={subtitleStyle}
        >
          {item.subtitle}
        </span>
      )}

      {!isActive && (
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hover-gradient"
          style={hoverGradientStyle}
        />
      )}
    </button>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.isActive === nextProps.isActive &&
    prevProps.item.key === nextProps.item.key &&
    prevProps.index === nextProps.index
  );
});

GridButton.displayName = 'GridButton';

export default About;