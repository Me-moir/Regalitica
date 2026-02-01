"use client";
import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { allProjects } from '@/data/Discover-data';
import styles from '@/styles/ui.module.css';

interface FeatureSectionProps {
  activeCardIndex: number;
  setActiveCardIndex: (index: number) => void;
  textAnimationKey: number;
  isAnimating: boolean;
}

// ═══════════════════════════════════════════════════════════════════
// PHASE 2 OPTIMIZATION: EXTRACTED STYLE CONSTANTS
// Prevents recreation of style objects on every render
// ═══════════════════════════════════════════════════════════════════
const GRADIENT_STYLES = {
  iconGradient: {
    background: `radial-gradient(
      150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(0, 255, 166, 0.8),
      rgba(255, 215, 0, 0.6),
      rgba(236, 72, 153, 0.6),
      rgba(147, 51, 234, 0.6),
      rgba(59, 130, 246, 0.5),
      transparent 70%
    )`,
    padding: '1px',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude'
  },
  lineGradient: {
    background: `radial-gradient(
      200px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(0, 255, 166, 0.8),
      rgba(255, 215, 0, 0.6),
      rgba(236, 72, 153, 0.6),
      rgba(147, 51, 234, 0.6),
      rgba(59, 130, 246, 0.5),
      transparent 70%
    )`
  },
  buttonBorder: {
    background: 'radial-gradient(150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 166, 0.8), rgba(255, 215, 0, 0.6), rgba(236, 72, 153, 0.6), rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.5), transparent 70%)',
    padding: '2px',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude'
  },
  timelineGradient: {
    background: 'radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 166, 0.8), rgba(255, 215, 0, 0.6), rgba(236, 72, 153, 0.6), rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.5), transparent 70%)',
    padding: '1px',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    willChange: 'opacity'
  }
} as const;

// ═══════════════════════════════════════════════════════════════════
// PHASE 2 OPTIMIZATION: THROTTLE UTILITY
// Limits function execution rate for better performance
// ═══════════════════════════════════════════════════════════════════
const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ═══════════════════════════════════════════════════════════════════
// PHASE 2 OPTIMIZATION: MEMOIZED PROJECT CARD COMPONENT
// Only re-renders when props actually change
// ═══════════════════════════════════════════════════════════════════
interface ProjectCardProps {
  project: any;
  index: number;
  isActive: boolean;
  rotation: { rotateX: number; rotateY: number };
  isMobile: boolean;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>, index: number) => void;
  onMouseLeave: (index: number) => void;
  cardRef: (el: HTMLDivElement | null) => void;
}

const ProjectCard = memo(({ 
  project, 
  index, 
  isActive, 
  rotation,
  isMobile,
  onMouseMove,
  onMouseLeave,
  cardRef
}: ProjectCardProps) => {
  return (
    <div
      ref={cardRef}
      className={`${styles.projectCard} ${styles.noselect} ${!isActive ? styles.cardInactive : styles.cardActive}`}
      onMouseMove={!isMobile && isActive ? (e) => onMouseMove(e, index) : undefined}
      onMouseLeave={!isMobile && isActive ? () => onMouseLeave(index) : undefined}
      style={{ 
        pointerEvents: isActive ? 'auto' : 'none',
        width: isMobile ? '280px' : '400px',
        height: isMobile ? '380px' : '500px'
      }}
    >
      <div className={styles.cardOuter}>
        <div 
          className={styles.cardInnerWrapper}
          style={{
            transform: `rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg)`,
            transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          onMouseMove={!isMobile ? (e) => {
            if (!isActive) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
            e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
          } : undefined}
        >
          <div className={styles.cardInner} style={{ padding: isMobile ? '18px' : '24px' }}>
            <div className={`absolute rounded-lg bg-white/10 border border-white/20 flex items-center justify-center z-10 ${isMobile ? 'top-4 right-4 w-9 h-9' : 'top-6 right-6 w-12 h-12'}`}>
              <span className={`text-white/40 font-medium ${isMobile ? 'text-[9px]' : 'text-xs'}`}>LOGO</span>
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className={`font-bold text-white leading-tight ${isMobile ? 'text-base pr-12' : 'text-lg lg:text-xl pr-16'}`}>
                  {project.title}
                </h3>
                
                <div className={isMobile ? 'text-[10px] text-gray-500' : 'text-xs text-gray-500'}>
                  <span className="font-semibold text-gray-400">{project.industryName}</span>
                </div>
                
                <p className={`text-gray-400 leading-relaxed ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                  {project.description}
                </p>
                
                <div className="h-px bg-white/10" />
                
                <div className="flex flex-wrap gap-1.5">
                  {project.domains.map((domain: string, idx: number) => (
                    <span key={idx} className={`${styles.domainTag} bg-white/5 rounded text-gray-300 border border-white/10 ${isMobile ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-xs'}`}>
                      {domain}
                    </span>
                  ))}
                </div>
                
                <div>
                  <p className={`text-gray-500 mb-1.5 font-medium ${isMobile ? 'text-[9px]' : 'text-xs'}`}>Features</p>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                    {project.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-1">
                        <span className={styles.prismBullet}>●</span>
                        <span className={`text-gray-400 ${isMobile ? 'text-[9px]' : 'text-xs'}`}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                {/* Timeline */}
                <div className="relative">
                  <div 
                    className="timeline-grid-border absolute inset-0 rounded-lg pointer-events-none"
                    style={GRADIENT_STYLES.timelineGradient}
                  />
                  <div 
                    className={`${styles.timelineGridBox} relative bg-gray-900/80 rounded-lg`} 
                    style={{ 
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: isMobile ? '12px 14px' : '20px'
                    }}
                    onMouseMove={!isMobile ? (e) => {
                      const border = e.currentTarget.previousElementSibling as HTMLElement;
                      if (border) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        border.style.setProperty('--mouse-x', `${x}px`);
                        border.style.setProperty('--mouse-y', `${y}px`);
                        border.style.opacity = '1';
                      }
                    } : undefined}
                    onMouseLeave={!isMobile ? (e) => {
                      const border = e.currentTarget.previousElementSibling as HTMLElement;
                      if (border) {
                        border.style.opacity = '0';
                      }
                    } : undefined}
                  >
                    <div 
                      className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden opacity-30"
                      style={{
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                        backgroundSize: isMobile ? '12px 12px' : '16px 16px',
                      }}
                    />

                    <div className={`relative ${isMobile ? 'h-8' : 'h-14'}`}>
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="w-full h-[0.5px] bg-white" />
                        <div 
                          className="absolute left-0 top-0 h-[0.5px] shadow-lg"
                          style={{ 
                            width: `${(project.timeline.filter((t: any) => t.status === 'complete').length / project.timeline.length) * 100}%`,
                            background: 'linear-gradient(to right, rgba(34, 197, 94, 1), rgba(59, 130, 246, 1), rgba(236, 72, 153, 1))',
                            boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)',
                            transition: 'width 0.8s ease-in-out'
                          }}
                        />
                      </div>
                      
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
                        <div className="relative flex justify-between items-center">
                          {project.timeline.map((stage: any, idx: number) => (
                            <div key={idx} className={`relative ${isMobile ? '' : 'group'}`}>
                              <div className={`${styles.techCheckpoint} ${styles[`techCheckpoint${stage.status.charAt(0).toUpperCase() + stage.status.slice(1)}`]}`}
                                style={isMobile ? { width: '10px', height: '10px' } : {}}
                              >
                                <div className={`${styles.checkpointInner} ${stage.status === 'current' ? 'checkpoint-inner-current' : ''}`}></div>
                                {stage.status === 'current' && <div className={styles.checkpointPulse}></div>}
                              </div>
                              {!isMobile && (
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                                  <div className="bg-gray-900 text-white text-[9px] px-2 py-1 rounded shadow-xl border border-white/20">
                                    <div className="font-semibold">{stage.stage}</div>
                                    <div className="text-[8px] text-gray-400">{stage.date}</div>
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-gray-900 border-r border-b border-white/20 rotate-45" />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Support button */}
                <div className={`border-t border-white/10 ${isMobile ? 'pt-2' : 'pt-3'}`}>
                  <div className="relative join-button-wrapper">
                    <button 
                      className={styles.premiumBtn}
                      style={isMobile ? { padding: '0.4rem 0.75rem', fontSize: '0.75rem' } : {}}
                      onMouseMove={!isMobile ? (e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                      } : undefined}
                    >
                      <svg className={styles.premiumBtnSvg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={isMobile ? { width: '12px', height: '12px' } : {}}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                        />
                      </svg>
                      <div className="premium-txt-wrapper">
                        <div className="premium-txt-1">
                          {'Support Project'.split('').map((letter, i) => (
                            <span key={i} className={styles.premiumBtnLetter} style={{ animationDelay: `${i * 0.08}s` }}>
                              {letter === ' ' ? '\u00A0' : letter}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div 
                        className={styles.premiumBtnBorder}
                        style={GRADIENT_STYLES.buttonBorder as React.CSSProperties}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for optimal memoization
  return (
    prevProps.isActive === nextProps.isActive &&
    prevProps.rotation.rotateX === nextProps.rotation.rotateX &&
    prevProps.rotation.rotateY === nextProps.rotation.rotateY &&
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.project === nextProps.project
  );
});

ProjectCard.displayName = 'ProjectCard';

const FeatureSection = memo(({
  activeCardIndex,
  setActiveCardIndex,
  textAnimationKey,
  isAnimating
}: FeatureSectionProps) => {
  const [cardRotations, setCardRotations] = useState<Record<number, { rotateX: number; rotateY: number }>>({});
  const [isSection3Visible, setIsSection3Visible] = useState(false);
  const isSection3VisibleRef = useRef(false);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // ═══════════════════════════════════════════════════════════════════
  // PHASE 2 OPTIMIZATION: CACHED DOM SELECTORS
  // Prevents querySelector on every mouse move
  // ═══════════════════════════════════════════════════════════════════
  const cachedSelectorsRef = useRef<{
    boxes: HTMLElement[];
    icons: Map<HTMLElement, HTMLElement[]>;
    lines: Map<HTMLElement, HTMLElement[]>;
  } | null>(null);

  // ─── SWIPE STATE (mobile only) ──────────────────────────────────────
  const swipeRef = useRef({
    startX: 0,
    startY: 0,
    currentX: 0,
    isDragging: false,
    didMove: false,
    baseTranslateX: 0,
  });
  const [swipeOffset, setSwipeOffset] = useState(0);

  // Detect mobile with debounced resize handler
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    
    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(check, 150);
    };
    
    window.addEventListener('resize', debouncedCheck);
    return () => {
      window.removeEventListener('resize', debouncedCheck);
      clearTimeout(timeoutId);
    };
  }, []);

  const activeProject = useMemo(() => 
    allProjects[activeCardIndex - 1] || allProjects[0],
    [activeCardIndex]
  );

  // 🔥 Track visibility - CRITICAL for auto-scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const rect = entry.boundingClientRect;
        const viewportHeight = window.innerHeight;
        
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        const sectionHeight = rect.height;
        const visibilityPercentage = (visibleHeight / sectionHeight) * 100;
        
        const isVisible = visibilityPercentage >= 70;
        
        if (isVisible !== isSection3VisibleRef.current) {
          setIsSection3Visible(isVisible);
          isSection3VisibleRef.current = isVisible;
          
          if (!isVisible) {
            setCardRotations({});
          }
        }
      },
      { 
        threshold: [0, 0.5, 0.7, 1.0],
        rootMargin: '0px'
      }
    );

    const section3 = document.getElementById('industries-carousel-section');
    
    if (section3) {
      observer.observe(section3);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // ═══════════════════════════════════════════════════════════════════
  // PHASE 2 OPTIMIZATION: CACHED DOM SELECTOR MOUSE TRACKING
  // Queries DOM once, then reuses cached elements
  // ═══════════════════════════════════════════════════════════════════
  useEffect(() => {
    const leftPanel = leftPanelRef.current;
    if (!leftPanel || isMobile) return;

    // Cache selectors ONCE
    const boxes = Array.from(leftPanel.querySelectorAll(`.${styles.notificationBox}`)) as HTMLElement[];
    const icons = new Map<HTMLElement, HTMLElement[]>();
    const lines = new Map<HTMLElement, HTMLElement[]>();
    
    boxes.forEach(box => {
      icons.set(box, Array.from(box.querySelectorAll('.box-icon-container')) as HTMLElement[]);
      lines.set(box, Array.from(box.querySelectorAll('.box-divider-line')) as HTMLElement[]);
    });
    
    cachedSelectorsRef.current = { boxes, icons, lines };

    const handleMouseMove = (e: MouseEvent) => {
      const cached = cachedSelectorsRef.current;
      if (!cached) return;
      
      // Use cached selectors - NO DOM queries during animation!
      cached.boxes.forEach((box) => {
        const rect = box.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        box.style.setProperty('--mouse-x', `${x}px`);
        box.style.setProperty('--mouse-y', `${y}px`);
        
        cached.icons.get(box)?.forEach(icon => {
          icon.style.setProperty('--mouse-x', `${x}px`);
          icon.style.setProperty('--mouse-y', `${y}px`);
        });
        
        cached.lines.get(box)?.forEach(line => {
          line.style.setProperty('--mouse-x', `${x}px`);
          line.style.setProperty('--mouse-y', `${y}px`);
        });
      });
    };

    leftPanel.addEventListener('mousemove', handleMouseMove);

    return () => {
      leftPanel.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile, activeProject]); // Re-cache when content changes

  // ═══════════════════════════════════════════════════════════════════
  // PHASE 2 OPTIMIZATION: THROTTLED CARD MOUSE MOVE
  // Reduces processing from 60/sec to controlled rate
  // ═══════════════════════════════════════════════════════════════════
  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, cardIndex: number) => {
    if (isMobile) return;
    
    const cardNumber = cardIndex + 1;
    if (cardNumber !== activeCardIndex) return;
    
    if (!isSection3VisibleRef.current) {
      const card = e.currentTarget;
      const wrapper = card.querySelector(`.${styles.cardInnerWrapper}`) as HTMLElement;
      if (wrapper) {
        wrapper.style.transition = 'none';
        wrapper.style.transform = 'rotateX(0deg) rotateY(0deg)';
        requestAnimationFrame(() => {
          wrapper.style.transition = '';
        });
      }
      setCardRotations(prev => ({
        ...prev,
        [cardIndex]: { rotateX: 0, rotateY: 0 }
      }));
      return;
    }
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${percentX}%`);
    card.style.setProperty('--mouse-y', `${percentY}%`);
    
    setCardRotations(prev => ({
      ...prev,
      [cardIndex]: { rotateX, rotateY }
    }));
  }, [activeCardIndex, isMobile]);

  // Throttled version of handleCardMouseMove
  const handleCardMouseMoveThrottled = useMemo(
    () => throttle(handleCardMouseMove, 16), // ~60fps
    [handleCardMouseMove]
  );

  const handleCardMouseLeave = useCallback((cardIndex: number) => {
    if (isMobile) return;
    
    const cardNumber = cardIndex + 1;
    if (cardNumber !== activeCardIndex) return;
    
    setCardRotations(prev => ({
      ...prev,
      [cardIndex]: { rotateX: 0, rotateY: 0 }
    }));
  }, [activeCardIndex, isMobile]);

  const carouselTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isManualInteraction, setIsManualInteraction] = useState(false);

  const goToCard = useCallback((cardIndex: number, manual: boolean = false) => {
    const clampedIndex = Math.max(1, Math.min(cardIndex, allProjects.length));
    setActiveCardIndex(clampedIndex);
    
    if (manual) {
      setIsManualInteraction(true);
      if (carouselTimerRef.current) {
        clearTimeout(carouselTimerRef.current);
      }
      carouselTimerRef.current = setTimeout(() => {
        setIsManualInteraction(false);
      }, 10000);
    }
  }, [setActiveCardIndex]);

  const goToNextCard = useCallback(() => {
    const nextIndex = activeCardIndex >= allProjects.length ? 1 : activeCardIndex + 1;
    goToCard(nextIndex, true);
  }, [activeCardIndex, goToCard]);

  // 🔥 FIX: Auto-advance carousel - PROPERLY CHECKING VISIBILITY (DISABLED ON MOBILE)
  useEffect(() => {
    if (isMobile || !isSection3Visible) {
      return;
    }
    
    const autoAdvanceDelay = isManualInteraction ? 10000 : 5000;
    
    const timer = setTimeout(() => {
      const next = activeCardIndex >= allProjects.length ? 1 : activeCardIndex + 1;
      setActiveCardIndex(next);
    }, autoAdvanceDelay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [activeCardIndex, isManualInteraction, isSection3Visible, setActiveCardIndex, isMobile]);

  useEffect(() => {
    return () => {
      if (carouselTimerRef.current) {
        clearTimeout(carouselTimerRef.current);
      }
    };
  }, []);

  const cardPositionTimeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (cardPositionTimeoutRef.current) {
      cancelAnimationFrame(cardPositionTimeoutRef.current);
    }

    cardPositionTimeoutRef.current = requestAnimationFrame(() => {
      const container = cardsContainerRef.current;
      const cards = cardsRef.current.filter(Boolean);
      
      if (!container || cards.length === 0) return;

      if (isMobile) {
        if (swipeOffset !== 0) return;

        const cardWidth = 280;
        const gap = 40;
        const containerWidth = window.innerWidth - 32;
        const centerPosition = containerWidth / 2;
        
        const cardArrayIndex = activeCardIndex - 1;
        const offsetToCard = cardArrayIndex * (cardWidth + gap);
        const targetX = -offsetToCard + centerPosition - (cardWidth / 2);
        
        container.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        container.style.transform = `translate3d(${targetX}px, 0, 0)`;
      } else {
        const cardWidth = 400;
        const gap = 80;
        
        const rightPadding = window.innerWidth >= 1024 ? 64 : 32;
        const rightContainerWidth = (window.innerWidth * 0.5) - rightPadding;
        const centerPosition = rightContainerWidth / 2;
        
        const cardArrayIndex = activeCardIndex - 1;
        const offsetToCard = cardArrayIndex * (cardWidth + gap);
        const targetX = -offsetToCard + centerPosition - (cardWidth / 2);
        
        container.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        container.style.transform = `translate3d(${targetX}px, 0, 0)`;
      }
      
      cards.forEach((card, index) => {
        if (!card) return;
        
        const cardNumber = index + 1;
        let scale: number;
        
        if (cardNumber === activeCardIndex) {
          scale = isMobile ? 1.05 : 1.1;
        } else if (Math.abs(cardNumber - activeCardIndex) === 1) {
          scale = isMobile ? 0.92 : 0.95;
        } else {
          scale = isMobile ? 0.82 : 0.85;
        }
        
        card.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.transform = `scale(${scale})`;
      });
    });

    return () => {
      if (cardPositionTimeoutRef.current) {
        cancelAnimationFrame(cardPositionTimeoutRef.current);
      }
    };
  }, [activeCardIndex, isMobile, swipeOffset]);

  // ─── MOBILE SWIPE HELPERS ────────────────────────────────────────────
  const getMobileBaseX = useCallback((cardIdx: number) => {
    const cardWidth = 280;
    const gap = 40;
    const containerWidth = window.innerWidth - 32;
    const centerPosition = containerWidth / 2;
    const offset = (cardIdx - 1) * (cardWidth + gap);
    return -offset + centerPosition - cardWidth / 2;
  }, []);

  const handleSwipeStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile) return;
    const touch = e.touches[0];
    swipeRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      isDragging: true,
      didMove: false,
      baseTranslateX: getMobileBaseX(activeCardIndex),
    };
  }, [isMobile, activeCardIndex, getMobileBaseX]);

  const handleSwipeMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile || !swipeRef.current.isDragging) return;
    const touch = e.touches[0];
    const dx = touch.clientX - swipeRef.current.startX;
    const dy = touch.clientY - swipeRef.current.startY;

    if (!swipeRef.current.didMove) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        swipeRef.current.isDragging = false;
        setSwipeOffset(0);
        return;
      }
      swipeRef.current.didMove = true;
      e.preventDefault();
    }

    e.preventDefault();
    swipeRef.current.currentX = touch.clientX;

    const atStart = activeCardIndex === 1 && dx > 0;
    const atEnd   = activeCardIndex === allProjects.length && dx < 0;
    const dampened = (atStart || atEnd) ? dx * 0.25 : dx;

    setSwipeOffset(dampened);
  }, [isMobile, activeCardIndex]);

  const handleSwipeEnd = useCallback(() => {
    if (!isMobile || !swipeRef.current.isDragging) return;
    swipeRef.current.isDragging = false;

    const dx = swipeRef.current.currentX - swipeRef.current.startX;
    const THRESHOLD = 50;

    if (dx < -THRESHOLD && activeCardIndex < allProjects.length) {
      goToCard(activeCardIndex + 1, true);
    } else if (dx > THRESHOLD && activeCardIndex > 1) {
      goToCard(activeCardIndex - 1, true);
    }
    setSwipeOffset(0);
  }, [isMobile, activeCardIndex, goToCard]);

  useEffect(() => {
    if (!isMobile || swipeOffset === 0) return;
    const container = cardsContainerRef.current;
    if (!container) return;

    const baseX = swipeRef.current.baseTranslateX;
    container.style.transition = 'none';
    container.style.transform = `translate3d(${baseX + swipeOffset}px, 0, 0)`;
  }, [isMobile, swipeOffset]);

  useEffect(() => {
    if (!isMobile) return;
    
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      swipeRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        isDragging: true,
        didMove: false,
        baseTranslateX: getMobileBaseX(activeCardIndex),
      };
    };
    
    const container = cardsContainerRef.current?.parentElement;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
      };
    }
  }, [isMobile, activeCardIndex, getMobileBaseX]);

  // ─── SHARED SUB-COMPONENTS (MEMOIZED) ───────────────────────────────────────────

  const ProblemBox = useMemo(() => (
    <div className={styles.notificationBox + " mb-3"}>
      <div className={styles.boxInner}>
        <div className="relative flex flex-col">
          <div className="relative box-icon-container mb-3 w-fit rounded-lg border border-gray-600 p-2">
            <div 
              className={`absolute inset-0 rounded-lg opacity-0 ${styles.boxIconGradient}`}
              style={GRADIENT_STYLES.iconGradient}
            />
            <svg className="w-4 h-4 text-neutral-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <div className="relative w-full h-px mb-3 box-divider-line">
            <div className="absolute inset-0 bg-white/10" />
            <div 
              className={`absolute inset-0 opacity-0 ${styles.boxLineGradient}`}
              style={GRADIENT_STYLES.lineGradient}
            />
          </div>
          <h3 className={styles.notititle + " mb-5"}>Problem Statement</h3>
          <div className="vanish-crossfade-container">
            <p 
              key={`problem-${textAnimationKey}`}
              className={styles.notibody + " vanish-content"}
              data-animating={isAnimating ? "true" : "false"}
              data-delay="2"
              style={isMobile ? { minHeight: '5rem' } : {}}
            >
              {activeProject.problem}
            </p>
          </div>
        </div>
      </div>
    </div>
  ), [activeProject.problem, textAnimationKey, isAnimating, isMobile]);

  const ValuePropBox = useMemo(() => (
    <div className={styles.notificationBox + " mb-3"}>
      <div className={styles.boxInner}>
        <div className="relative flex flex-col">
          <div className="relative box-icon-container mb-3 w-fit rounded-lg border border-gray-600 p-2">
            <div 
              className={`absolute inset-0 rounded-lg opacity-0 ${styles.boxIconGradient}`}
              style={GRADIENT_STYLES.iconGradient}
            />
            <svg className="w-4 h-4 text-neutral-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <div className="relative w-full h-px mb-3 box-divider-line">
            <div className="absolute inset-0 bg-white/10" />
            <div 
              className={`absolute inset-0 opacity-0 ${styles.boxLineGradient}`}
              style={GRADIENT_STYLES.lineGradient}
            />
          </div>
          <h3 className={styles.notititle + " mb-5"}>Value Proposition</h3>
          <div className="vanish-crossfade-container">
            <p 
              key={`value-prop-${textAnimationKey}`}
              className={styles.notibody + " vanish-content"}
              data-animating={isAnimating ? "true" : "false"}
              data-delay="3"
              style={isMobile ? { minHeight: '5rem' } : {}}
            >
              {activeProject.valueProposition}
            </p>
          </div>
        </div>
      </div>
    </div>
  ), [activeProject.valueProposition, textAnimationKey, isAnimating, isMobile]);

  const TeamSection = useMemo(() => (
    <div className={isMobile ? "pt-4 border-t border-white/10" : "pt-4 border-t border-white/10 mt-auto"}>
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Project Team</p>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center relative">
          {activeProject.team.map((member: any, idx: number) => (
            <div 
              key={idx}
              className={`relative ${isMobile ? '' : 'group hover:z-50'} transition-all duration-300`}
              style={{ 
                zIndex: 50 - (idx * 10),
                marginLeft: idx === 0 ? 0 : '-1.25rem'
              }}
            >
              <div className={`w-12 h-12 rounded-full ${member.color} border-2 border-white/20 flex items-center justify-center ${isMobile ? '' : 'cursor-pointer hover:scale-110'} transition-all duration-300 shadow-lg`}>
                <span className="text-white text-xs font-bold">
                  {idx === 0 ? 'TL' : `M${idx}`}
                </span>
              </div>
              {!isMobile && (
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  <div className="bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-2xl border border-white/20">
                    <p className="text-sm font-semibold">{member.name}</p>
                    <p className="text-xs text-gray-400">{member.role}</p>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 border-r border-b border-white/20 rotate-45" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="relative">
          <button 
            className={styles.premiumBtn}
            onClick={goToNextCard}
            onMouseMove={!isMobile ? (e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
              e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
            } : undefined}
          >
            <svg className={styles.premiumBtnSvg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
            <div className="premium-txt-wrapper">
              <div className="premium-txt-1">
                {'Next Venture'.split('').map((letter, i) => (
                  <span key={i} className={styles.premiumBtnLetter} style={{ animationDelay: `${i * 0.08}s` }}>
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </div>
            </div>
            <div 
              className={styles.premiumBtnBorder}
              style={GRADIENT_STYLES.buttonBorder as React.CSSProperties}
            />
          </button>
        </div>
      </div>
    </div>
  ), [activeProject.team, isMobile, goToNextCard]);

  // ─── CARDS STRIP (shared between mobile & desktop) ──────────────────

  const CardsStrip = (
    <div 
      ref={cardsContainerRef}
      className={`flex items-center bg-transparent ${styles.cardsScrollContainer}`}
      style={{ gap: isMobile ? '40px' : '80px' }}
    >
      {allProjects.map((project, index) => {
        const cardNumber = index + 1;
        const isActive = cardNumber === activeCardIndex;
        const rotation = (isActive && isSection3Visible) 
          ? (cardRotations[index] || { rotateX: 0, rotateY: 0 }) 
          : { rotateX: 0, rotateY: 0 };
        
        return (
          <ProjectCard
            key={index}
            project={project}
            index={index}
            isActive={isActive}
            rotation={rotation}
            isMobile={isMobile}
            onMouseMove={handleCardMouseMoveThrottled}
            onMouseLeave={handleCardMouseLeave}
            cardRef={(el) => { cardsRef.current[index] = el; }}
          />
        );
      })}
    </div>
  );

  // ─── PROGRESS BAR (shared) ───────────────────────────────────────────

  const ProgressBar = (
    <div className={`z-20 ${isMobile ? 'px-4' : 'px-8 lg:px-12'}`}>
      <div className="flex gap-2">
        {allProjects.map((project, index) => {
          const segmentIndex = index + 1;
          const isActive = segmentIndex <= activeCardIndex;
          const isCurrent = segmentIndex === activeCardIndex;
          
          const gradientStart = (index / allProjects.length) * 100;
          const gradientEnd = ((index + 1) / allProjects.length) * 100;
          
          return (
            <button 
              key={index}
              className={`flex-1 relative cursor-pointer ${isMobile ? '' : 'group'}`}
              onClick={() => goToCard(segmentIndex, true)}
              aria-label={`Go to ${project.title}`}
            >
              <div 
                className={`rounded-full overflow-hidden border transition-all duration-300 ${isMobile ? '' : 'group-hover:border-white/50 group-hover:scale-y-125'} ${
                  isCurrent 
                    ? 'border-white/60 shadow-lg' 
                    : isActive 
                      ? 'border-white/30' 
                      : 'border-white/10'
                } ${isMobile ? 'h-1.5' : 'h-2'}`}
                style={{
                  background: 'rgba(31, 41, 55, 0.6)',
                  backdropFilter: 'blur(4px)',
                  boxShadow: isCurrent 
                    ? '0 0 12px rgba(255, 255, 255, 0.2), 0 0 24px rgba(59, 130, 246, 0.15)' 
                    : 'none'
                }}
              >
                <div 
                  className={`h-full rounded-full transition-all duration-800 ease-in-out ${isActive ? 'w-full' : 'w-0'}`}
                  style={{ 
                    background: isActive 
                      ? `linear-gradient(to right, 
                          hsl(${142 - (gradientStart * 2.5)}, 70%, 50%), 
                          hsl(${142 - (gradientEnd * 2.5)}, 70%, 50%)
                        )`
                      : 'transparent',
                    transitionProperty: 'width, background',
                    transitionDuration: '800ms, 800ms',
                    transitionTimingFunction: 'ease-in-out, ease-in-out'
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>
          {activeCardIndex === 0 ? 'Start' : activeCardIndex > allProjects.length ? allProjects.length : activeCardIndex} / {allProjects.length}
        </span>
        <span>{activeCardIndex === 0 ? 'Begin' : allProjects[activeCardIndex - 1]?.industryName || ''}</span>
      </div>
    </div>
  );

  // ─── MOBILE LAYOUT ───────────────────────────────────────────────────
  if (isMobile) {
    return (
      <section 
        id="industries-carousel-section"
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, rgb(20, 20, 20) 0%, rgb(10, 10, 10) 50%, rgb(0, 0, 0) 100%)',
          paddingTop: '6vh',
          paddingBottom: '6vh',
          borderTop: '1px dashed rgba(255, 255, 255, 0.2)',
          borderBottom: '1px dashed rgba(255, 255, 255, 0.2)'
        }}
      >
        {/* Grain overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '100px 100px',
          }}
        />

        {/* ── SWIPE hint — own row, above cards, never overlaps ── */}
        <div className="flex justify-center mb-3 pointer-events-none">
          <div
            className="relative inline-flex items-center gap-2.5 rounded-full"
            style={{
              background: 'rgba(14, 14, 18, 0.6)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              padding: '6px 14px 6px 12px',
              boxShadow: '0 4px 28px rgba(0,0,0,0.4)',
            }}
          >
            {/* pulsing glow border */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(120px circle at 50% 50%, rgba(0,255,166,0.45), rgba(236,72,153,0.3), transparent 70%)',
                padding: '1px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                animation: 'swipeHintGlow 2.8s ease-in-out infinite',
              }}
            />

            {/* left arrow */}
            <svg
              width="14" height="10" viewBox="0 0 14 10" fill="none"
              className="relative z-10"
              style={{ animation: 'swipeArrowLeft 1.8s ease-in-out 0.3s infinite' }}
            >
              <path d="M0 5L5.5 0.5V4.5H14V5.5H5.5V9.5L0 5Z" fill="rgba(255,255,255,0.7)" />
            </svg>

            {/* horizontal "SWIPE" text */}
            <span
              className="relative z-10 font-semibold tracking-widest uppercase"
              style={{
                fontSize: '9px',
                letterSpacing: '0.22em',
                color: 'rgba(255,255,255,0.5)',
                textShadow: '0 0 10px rgba(0,255,166,0.2)',
              }}
            >
              SWIPE
            </span>

            {/* right arrow */}
            <svg
              width="14" height="10" viewBox="0 0 14 10" fill="none"
              className="relative z-10"
              style={{ animation: 'swipeArrowRight 1.8s ease-in-out infinite' }}
            >
              <path d="M14 5L8.5 9.5V5.5H0V4.5H8.5V0.5L14 5Z" fill="rgba(255,255,255,0.7)" />
            </svg>
          </div>
        </div>

        {/* ── Cards row ── */}
        <div
          className="relative w-full overflow-hidden mb-6"
          style={{ height: '420px', touchAction: 'pan-y' }}
          onTouchStart={handleSwipeStart}
          onTouchMove={handleSwipeMove}
          onTouchEnd={handleSwipeEnd}
          onTouchCancel={handleSwipeEnd}
        >
          <div className="absolute inset-0 flex items-center px-4">
            {CardsStrip}
          </div>
        </div>

        {/* keyframes */}
        <style>{`
          @keyframes swipeHintGlow {
            0%, 100% { opacity: 0.4; }
            50%       { opacity: 1; }
          }
          @keyframes swipeArrowLeft {
            0%, 100% { opacity: 0.35; transform: translateX(0); }
            50%      { opacity: 0.95; transform: translateX(-3px); }
          }
          @keyframes swipeArrowRight {
            0%, 100% { opacity: 0.35; transform: translateX(0); }
            50%      { opacity: 0.95; transform: translateX(3px); }
          }
        `}</style>

        {/* ── Info panel (bottom) ── */}
        <div 
          ref={leftPanelRef}
          className="relative px-4 pb-4"
        >
          {/* Industry header */}
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Industry</p>
          
          <div className="vanish-crossfade-container mb-2">
            <h2 
              key={`industry-name-${textAnimationKey}`}
              className="text-2xl font-bold text-white vanish-content leading-tight"
              data-animating={isAnimating ? "true" : "false"}
              data-delay="0"
            >
              {activeProject.industryName}
            </h2>
          </div>
          
          <div className="vanish-crossfade-container mb-4">
            <p 
              key={`industry-desc-${textAnimationKey}`}
              className="text-sm text-gray-400 leading-relaxed vanish-content line-clamp-2"
              data-animating={isAnimating ? "true" : "false"}
              data-delay="1"
            >
              {activeProject.industryDescription}
            </p>
          </div>

          {/* Problem & Value Prop boxes */}
          {ProblemBox}
          {ValuePropBox}

          {/* Team + Next button */}
          {TeamSection}
        </div>

        {/* ── Progress bar (bottom) ── */}
        <div className="mt-5">
          {ProgressBar}
        </div>
      </section>
    );
  }

  // ─── DESKTOP LAYOUT (adaptive height for short screens) ────────────────────────────
  return (
    <section 
      id="industries-carousel-section"
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, rgb(20, 20, 20) 0%, rgb(10, 10, 10) 50%, rgb(0, 0, 0) 100%)',
        minHeight: 'max(100vh, 900px)',
        paddingTop: '10vh',
        paddingBottom: '20vh',
        borderTop: '1px dashed rgba(255, 255, 255, 0.2)',
        borderBottom: '1px dashed rgba(255, 255, 255, 0.2)'
      }}
    >
      {/* Grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '100px 100px',
        }}
      />

      {/* Vertical divider line */}
      <div 
        className="absolute left-[50%] top-0 bottom-0 w-px pointer-events-none z-30"
        style={{
          borderLeft: '1px dashed rgba(255, 255, 255, 0.2)'
        }}
      />

      {/* Left Panel */}
      <div 
        ref={leftPanelRef}
        className="absolute left-0 w-[50%] z-20 flex items-start pl-12 pr-8 py-6 lg:pl-20 lg:pr-12"
        style={{
          top: '10vh',
          bottom: '20vh'
        }}
      >
        <div className="w-full flex flex-col h-full">
          <div className="flex-1 flex flex-col">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Industry</p>
            
            <div className="vanish-crossfade-container mb-3">
              <h2 
                key={`industry-name-${textAnimationKey}`}
                className="text-3xl lg:text-4xl font-bold text-white vanish-content leading-tight"
                data-animating={isAnimating ? "true" : "false"}
                data-delay="0"
              >
                {activeProject.industryName}
              </h2>
            </div>
            
            <div className="vanish-crossfade-container mb-5">
              <p 
                key={`industry-desc-${textAnimationKey}`}
                className="text-sm lg:text-base text-gray-400 leading-relaxed vanish-content line-clamp-3 min-h-[4.5rem] max-h-[4.5rem]"
                data-animating={isAnimating ? "true" : "false"}
                data-delay="1"
              >
                {activeProject.industryDescription}
              </p>
            </div>

            {ProblemBox}
            {ValuePropBox}
          </div>

          {TeamSection}
        </div>
      </div>

      {/* Cards Container */}
      <div 
        className="absolute left-[50%] right-0 flex items-center z-10 overflow-hidden bg-transparent pr-8 lg:pr-16"
        style={{
          top: '10vh',
          bottom: '20vh'
        }}
      >
        {CardsStrip}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-6 sm:bottom-8 z-20 lg:left-[50%] lg:right-0 left-0 right-0 px-8 lg:px-12">
        {ProgressBar}
      </div>
    </section>
  );
});

FeatureSection.displayName = 'FeatureSection';

export default FeatureSection;