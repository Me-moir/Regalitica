"use client";
import { lazy, Suspense, useState, memo, useEffect } from 'react';
import type { InfoContentType } from '@/data/information-data';
import InformationGrid from './InformationGrid';

// Eager load: First section loads immediately
import Statements from './Statements';

// Lazy load: Other sections
const NewsMedia = lazy(() => import('./NewsMedia'));
const Attributions = lazy(() => import('./Attributions'));
const Licenses = lazy(() => import('./Licenses'));
const Terms = lazy(() => import('./Terms'));
const Privacy = lazy(() => import('./Privacy'));
const UsePolicy = lazy(() => import('./UsePolicy'));
const Disclaimer = lazy(() => import('./Disclaimer'));

// Loading fallback with matching background
const LoadingFallback = () => (
  <div 
    className="min-h-screen"
    style={{
      background: 'var(--gradient-section)'
    }}
  />
);

const Information = memo(() => {
  const [activeContent, setActiveContent] = useState<InfoContentType>('statements');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [contentHistory, setContentHistory] = useState<InfoContentType[]>(['statements']);

  // Preload all lazy components when Information page mounts
  useEffect(() => {
    // Use requestIdleCallback for non-blocking preloading, fallback to setTimeout
    const preloadComponents = () => {
      import('./NewsMedia');
      import('./Attributions');
      import('./Licenses');
      import('./Terms');
      import('./Privacy');
      import('./UsePolicy');
      import('./Disclaimer');
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadComponents);
    } else {
      setTimeout(preloadComponents, 1);
    }
  }, []);

  // Handle browser back/forward navigation
  useEffect(() => {
    // Don't initialize history state if one already exists
    const currentState = window.history.state;
    if (!currentState?.infoTab && !currentState?.tab) {
      // Only set initial state if there's no existing state
      const initialState = { tab: 'information', infoTab: activeContent };
      window.history.replaceState(initialState, '');
    }

    const handlePopState = (event: PopStateEvent) => {
      // Only handle if this is an info tab navigation (has infoTab in state)
      if (event.state?.infoTab) {
        const previousTab = event.state.infoTab;
        
        // Check if we're going back to a different info tab
        if (previousTab !== activeContent) {
          setIsTransitioning(true);
          setActiveContent(previousTab);
          
          // Update history
          setContentHistory(prev => {
            const index = prev.indexOf(previousTab);
            if (index !== -1) {
              return prev.slice(0, index + 1);
            }
            return prev;
          });
          
          setTimeout(() => {
            setIsTransitioning(false);
          }, 500);
        }
      } else if (event.state?.tab && !event.state?.infoTab) {
        // This is a main tab navigation, not our responsibility
        // The ClientWrapper will handle it
        return;
      } else if (!event.state) {
        // Going back to a state before our history, let browser handle it
        return;
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [activeContent]);

  const handleContentChange = (newContent: InfoContentType) => {
    if (newContent === activeContent) return;
    
    // Start transition immediately
    setIsTransitioning(true);
    
    // Add to history
    setContentHistory(prev => [...prev, newContent]);
    
    // Push browser state with both tab and infoTab
    window.history.pushState({ tab: 'information', infoTab: newContent }, '');
    
    // Change content immediately - CSS handles the smooth crossfade
    setActiveContent(newContent);
    
    // End transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <>
      <InformationGrid 
        activeContent={activeContent} 
        onContentChange={handleContentChange} 
      />
      
      {/* Single persistent background wrapper */}
      <div 
        className="relative overflow-hidden mb-20"
        style={{
          background: 'var(--gradient-section)',
          borderTop: '1px dashed var(--border-dashed)',
          borderBottom: '1px dashed var(--border-dashed)',
          borderLeft: '1px dashed var(--border-dashed)',
          borderRight: '1px dashed var(--border-dashed)',
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

        {/* Content with crossfade transition */}
        <div className="relative z-10" style={{ minHeight: '800px' }}>
          {/* Statements */}
          <div style={{
            position: activeContent === 'statements' ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            right: 0,
            opacity: activeContent === 'statements' ? 1 : 0,
            pointerEvents: activeContent === 'statements' ? 'auto' : 'none',
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <Statements isTransitioning={isTransitioning} />
          </div>

          {/* News */}
          <div style={{
            position: activeContent === 'news' ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            right: 0,
            opacity: activeContent === 'news' ? 1 : 0,
            pointerEvents: activeContent === 'news' ? 'auto' : 'none',
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <Suspense fallback={<LoadingFallback />}>
              <NewsMedia isTransitioning={isTransitioning} />
            </Suspense>
          </div>

          {/* Attributions */}
          <div style={{
            position: activeContent === 'attributions' ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            right: 0,
            opacity: activeContent === 'attributions' ? 1 : 0,
            pointerEvents: activeContent === 'attributions' ? 'auto' : 'none',
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <Suspense fallback={<LoadingFallback />}>
              <Attributions isTransitioning={isTransitioning} />
            </Suspense>
          </div>

          {/* Licenses */}
          <div style={{
            position: activeContent === 'licenses' ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            right: 0,
            opacity: activeContent === 'licenses' ? 1 : 0,
            pointerEvents: activeContent === 'licenses' ? 'auto' : 'none',
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <Suspense fallback={<LoadingFallback />}>
              <Licenses isTransitioning={isTransitioning} />
            </Suspense>
          </div>

          {/* Terms */}
          <div style={{
            position: activeContent === 'terms' ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            right: 0,
            opacity: activeContent === 'terms' ? 1 : 0,
            pointerEvents: activeContent === 'terms' ? 'auto' : 'none',
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <Suspense fallback={<LoadingFallback />}>
              <Terms isTransitioning={isTransitioning} />
            </Suspense>
          </div>

          {/* Privacy */}
          <div style={{
            position: activeContent === 'privacy' ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            right: 0,
            opacity: activeContent === 'privacy' ? 1 : 0,
            pointerEvents: activeContent === 'privacy' ? 'auto' : 'none',
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <Suspense fallback={<LoadingFallback />}>
              <Privacy isTransitioning={isTransitioning} />
            </Suspense>
          </div>

          {/* Acceptable Use */}
          <div style={{
            position: activeContent === 'acceptable-use' ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            right: 0,
            opacity: activeContent === 'acceptable-use' ? 1 : 0,
            pointerEvents: activeContent === 'acceptable-use' ? 'auto' : 'none',
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <Suspense fallback={<LoadingFallback />}>
              <UsePolicy isTransitioning={isTransitioning} />
            </Suspense>
          </div>

          {/* Disclaimer */}
          <div style={{
            position: activeContent === 'disclaimer' ? 'relative' : 'absolute',
            top: 0,
            left: 0,
            right: 0,
            opacity: activeContent === 'disclaimer' ? 1 : 0,
            pointerEvents: activeContent === 'disclaimer' ? 'auto' : 'none',
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <Suspense fallback={<LoadingFallback />}>
              <Disclaimer isTransitioning={isTransitioning} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
});

Information.displayName = 'Information';

export default Information;