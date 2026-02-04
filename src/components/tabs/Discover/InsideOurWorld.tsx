"use client";
import { memo, useState, useRef, useEffect, useCallback, useMemo } from "react";
import styles from "@/styles/ui.module.css";
import { WORLD_GRID_ITEMS, WORLD_CONTENT_DATA, WORLD_TITLE } from "@/data/Discover-data";

type WorldContentType = "enterprise" | "direction" | "teams" | "governance" | "affiliations" | "reachout";

// Pre-compute title letters once
const TITLE_LETTERS = WORLD_TITLE.split('');

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

const InsideOurWorld = memo(() => {
  const [activeContent, setActiveContent] = useState<WorldContentType>("enterprise");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectorPosition, setSelectorPosition] = useState(0);
  const buttonRefs = useRef({} as { [key: string]: HTMLButtonElement | null });
  const transitionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Memoize content change handler
  const handleContentChange = useCallback((newContent: WorldContentType) => {
    if (newContent === activeContent) return;
    
    // Clear any existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    
    // Update selector position immediately for instant visual feedback
    const index = WORLD_GRID_ITEMS.findIndex(item => item.key === newContent);
    setSelectorPosition(index);
    
    // Start content transition
    setIsTransitioning(true);
    setActiveContent(newContent);
    
    // End transition after content fade completes
    transitionTimeoutRef.current = setTimeout(() => setIsTransitioning(false), 350);
  }, [activeContent]);

  // Update selector position when active content changes
  useEffect(() => {
    const index = WORLD_GRID_ITEMS.findIndex(item => item.key === activeContent);
    setSelectorPosition(index);
  }, [activeContent]);

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

  // Memoize active content data
  const activeContentData = useMemo(() => 
    WORLD_CONTENT_DATA[activeContent], 
    [activeContent]
  );

  return (
    <section 
      className="relative"
      style={{
        background: 'linear-gradient(to bottom, rgb(20, 20, 20) 0%, rgb(10, 10, 10) 50%, rgb(0, 0, 0) 100%)',
      }}
    >
      <style>{`
        @keyframes cornerPulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        @keyframes orbitBorder {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
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
      `}</style>

      {/* Optimized noise texture - use CSS instead of inline SVG when possible */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '100px 100px',
        }}
      />

      <div className="relative z-10">
        <div 
          className="grid grid-cols-1 lg:grid-cols-10"
          style={{
            minHeight: '600px',
            borderTop: '1px dashed rgba(255, 255, 255, 0.2)',
            borderBottom: '1px dashed rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* Left Part - Content Area */}
          <div className="lg:col-span-7 flex flex-col px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-8 md:py-12 contain-layout">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8">
              {TITLE_LETTERS.map((letter, i) => (
                <span 
                  key={i} 
                  className={styles.premiumBtnLetter}
                  style={{ 
                    animationDelay: `${i * 0.08}s`,
                    background: 'linear-gradient(135deg, #ffffff 0%, #d4d4d4 50%, #a3a3a3 100%)',
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

            <div className="w-full h-px bg-gradient-to-r from-white/20 via-white/40 to-white/20 mb-6 md:mb-8" />

            <div style={contentWrapperStyles}>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white mb-4 flex items-center gap-2">
                {activeContentData.title}
                <i className="bi bi-arrow-up-right-square text-lg md:text-xl lg:text-2xl"></i>
              </h3>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-4">
                {activeContentData.description}
              </p>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                {activeContentData.description}
              </p>
            </div>
          </div>

          {/* Right Part - Grid Navigation */}
          <div className="lg:col-span-3 flex flex-col relative">
            {/* Shared Active Selector */}
            <div className="absolute pointer-events-none z-20 gpu-accelerated" style={selectorStyles}>
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
                  className="absolute w-4 h-4 border-white pointer-events-none grid-selector-corners"
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
                isActive={activeContent === item.key}
                onClick={handleContentChange}
                onMouseMove={handleMouseMove}
                buttonRefs={buttonRefs}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

InsideOurWorld.displayName = 'InsideOurWorld';

// Extracted and memoized GridButton component with performance optimizations
const GridButton = memo<{
  item: { key: WorldContentType; title: string };
  index: number;
  isActive: boolean;
  onClick: (key: WorldContentType) => void;
  onMouseMove: (e: React.MouseEvent<HTMLButtonElement>) => void;
  buttonRefs: React.MutableRefObject<{ [key: string]: HTMLButtonElement | null }>;
}>(({ item, index, isActive, onClick, onMouseMove, buttonRefs }) => {
  const handleClick = useCallback(() => {
    onClick(item.key);
  }, [onClick, item.key]);

  const buttonStyle = useMemo(() => ({
    background: 'transparent',
    borderTop: index === 0 ? 'none' : '1px dashed rgba(255, 255, 255, 0.2)',
    borderLeft: '1px dashed rgba(255, 255, 255, 0.2)',
  }), [index]);

  const spanStyle = useMemo(() => ({
    color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
    transform: isActive ? 'translateX(4px)' : 'translateX(0)',
    transition: 'color 0.2s ease-out, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  }), [isActive]);

  const hoverGradientStyle = useMemo(() => ({
    background: 'radial-gradient(200px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 166, 0.8), rgba(255, 215, 0, 0.6), rgba(236, 72, 153, 0.6), rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.5), transparent 70%)',
    padding: '1px',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
  }), []);

  return (
    <button
      ref={(el) => { buttonRefs.current[item.key] = el; }}
      onClick={handleClick}
      className="group relative flex-1 flex items-center justify-start px-6 md:px-8 transition-all duration-300 contain-layout"
      style={buttonStyle}
      onMouseMove={onMouseMove}
    >
      <span className="text-lg md:text-xl lg:text-2xl font-normal relative z-10" style={spanStyle}>
        {item.title}
      </span>

      {!isActive && (
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hover-gradient"
          style={hoverGradientStyle}
        />
      )}
    </button>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better memoization
  return (
    prevProps.isActive === nextProps.isActive &&
    prevProps.item.key === nextProps.item.key &&
    prevProps.index === nextProps.index
  );
});

GridButton.displayName = 'GridButton';

export default InsideOurWorld;