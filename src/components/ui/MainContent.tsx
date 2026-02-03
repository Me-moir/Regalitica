"use client";
import { useState, useEffect, useRef, Suspense, lazy } from 'react';

// Lazy load tab components for code splitting
const DiscoverTab = lazy(() => import('@/components/tabs/Discover'));
const VenturesTab = lazy(() => import('@/components/tabs/Ventures'));
const InformationTab = lazy(() => import('@/components/tabs/Information'));

interface MainContentProps {
  activeTab: string;
}

// Loading fallback component
const TabLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  </div>
);

const MainContent = ({ activeTab }: MainContentProps) => {
  const [displayedTab, setDisplayedTab] = useState(activeTab);
  const [activeCardIndex, setActiveCardIndex] = useState(1);
  const [textAnimationKey, setTextAnimationKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevCardIndexRef = useRef(1);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Handle vanish animation when activeCardIndex changes
  useEffect(() => {
    if (activeCardIndex !== prevCardIndexRef.current) {
      setTextAnimationKey(prev => prev + 1);
      setIsAnimating(true);
      prevCardIndexRef.current = activeCardIndex;
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [activeCardIndex]);

  // Handle tab transitions with smooth animation
  useEffect(() => {
    if (activeTab !== displayedTab) {
      const timer = setTimeout(() => {
        setDisplayedTab(activeTab);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab, displayedTab]);

  // 🎯 HYPER-FOCUSED: Mouse tracking ONLY on specific elements that need it
  useEffect(() => {
    // Only run on 'discover' tab (DiscoverTab with interactive elements)
    if (displayedTab !== 'discover') return;

    const listeners: Array<{ element: Element; handler: EventListener }> = [];
    let rafId: number | null = null;
    let lastUpdate = 0;
    const throttleMs = 16; // ~60fps max
    
    // Reusable mouse move handler
    const createMouseMoveHandler = (element: HTMLElement) => {
      return (e: MouseEvent) => {
        const now = Date.now();
        
        // Throttle updates to max 60fps
        if (now - lastUpdate < throttleMs) return;
        
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }
        
        rafId = requestAnimationFrame(() => {
          const rect = element.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          // Use percentage for better performance
          const percentX = (x / rect.width) * 100;
          const percentY = (y / rect.height) * 100;
          
          element.style.setProperty('--mouse-x', `${percentX}%`);
          element.style.setProperty('--mouse-y', `${percentY}%`);
          
          lastUpdate = now;
          rafId = null;
        });
      };
    };

    // Attach listeners to elements
    const attachListeners = () => {
      // Get all elements that need mouse tracking
      const selectors = [
        '.notification-box',      // Problem/Value boxes (left panel)
        '.timeline-grid-box',     // Timeline container (in cards)
        '.domain-tag',            // Technology tags (in cards)
        '.premium-btn',           // Join Initiative buttons (in cards)
        '.card-inner-wrapper',    // Project cards themselves
      ];

      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
          // Skip if already has listener
          if (listeners.some(l => l.element === element)) return;
          
          const handler = createMouseMoveHandler(element as HTMLElement);
          
          // Attach listener directly to each element
          element.addEventListener('mousemove', handler as EventListener, { passive: true });
          
          // Store for cleanup
          listeners.push({ element, handler: handler as EventListener });
        });
      });
    };

    // Initial attachment
    const timeoutId = setTimeout(attachListeners, 100);
    
    // Watch for DOM changes using MutationObserver
    const observer = new MutationObserver(() => {
      attachListeners(); // Re-attach to any new elements
    });
    
    // Observe the entire discover tab
    const discoverTab = document.querySelector('[class*="discover"]') || document.body;
    observer.observe(discoverTab, {
      childList: true,
      subtree: true,
    });
    
    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      
      // Remove all listeners
      listeners.forEach(({ element, handler }) => {
        element.removeEventListener('mousemove', handler);
      });
      
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [displayedTab]);

  const renderContent = () => {
    switch (displayedTab) {
      case 'discover':
        return (
          <DiscoverTab
            activeCardIndex={activeCardIndex}
            setActiveCardIndex={setActiveCardIndex}
            textAnimationKey={textAnimationKey}
            isAnimating={isAnimating}
          />
        );
      case 'ventures':
        return <VenturesTab />;
      case 'information':
        return <InformationTab />;
      default:
        return null;
    }
  };

  const isTransitioning = activeTab !== displayedTab;

  return (
    <div 
      ref={mainContentRef}
      className={`relative z-10 transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
    >
      <Suspense fallback={<TabLoadingFallback />}>
        {renderContent()}
      </Suspense>
    </div>
  );
};

export default MainContent;