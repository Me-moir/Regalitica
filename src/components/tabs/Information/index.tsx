"use client";
import { lazy, Suspense, useState, memo, useEffect } from 'react';
import type { InfoContentType } from '@/data/information-data';
import Statements from './Statements';
import InformationHero from './InformationHero';

const NewsMedia         = lazy(() => import('./NewsMedia'));
const Attributions      = lazy(() => import('./Attributions'));
const Licenses          = lazy(() => import('./Licenses'));
const Terms             = lazy(() => import('./Terms'));
const Privacy           = lazy(() => import('./Privacy'));
const UsePolicy         = lazy(() => import('./UsePolicy'));
const Documents         = lazy(() => import('./Documents'));
const InvestorRelations = lazy(() => import('./InvestorRelations'));
const Report            = lazy(() => import('./Report'));

const LoadingFallback = () => (
  <div className="min-h-screen" style={{ background: 'var(--gradient-section)' }} />
);

interface InformationProps {
  activeContent: InfoContentType;
  onContentChange: (content: InfoContentType) => void;
}

const Information = memo(({ activeContent, onContentChange }: InformationProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const preload = () => {
      import('./NewsMedia');
      import('./Attributions');
      import('./Licenses');
      import('./Terms');
      import('./Privacy');
      import('./UsePolicy');
      import('./Documents');
      import('./InvestorRelations');
      import('./Report');
    };
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preload);
    } else {
      setTimeout(preload, 1);
    }
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.infoTab) {
        const previous = event.state.infoTab as InfoContentType;
        if (previous !== activeContent) onContentChange(previous);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeContent, onContentChange]);

  const show = (key: InfoContentType) => activeContent === key;

  return (
    <div>
      <InformationHero />

      <div
        className="relative overflow-hidden mb-20"
        style={{
          background:   'var(--gradient-section)',
          borderTop:    '1px dashed var(--border-dashed)',
          borderBottom: '1px dashed var(--border-dashed)',
          borderLeft:   '1px dashed var(--border-dashed)',
          borderRight:  '1px dashed var(--border-dashed)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize:   '100px 100px',
          }}
        />

        <div className="relative z-10" style={{ minHeight: '800px' }}>

          <div style={{
            position: show('statements') ? 'relative' : 'absolute',
            top: 0, left: 0, right: 0,
            opacity: show('statements') ? 1 : 0,
            pointerEvents: show('statements') ? 'auto' : 'none',
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <Statements isTransitioning={isTransitioning} />
          </div>

          <div style={{
            position: show('news') ? 'relative' : 'absolute',
            top: 0, left: 0, right: 0,
            opacity: show('news') ? 1 : 0,
            pointerEvents: show('news') ? 'auto' : 'none',
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <Suspense fallback={<LoadingFallback />}>
              <NewsMedia isTransitioning={isTransitioning} />
            </Suspense>
          </div>

          <div style={{
            position: show('attributions') ? 'relative' : 'absolute',
            top: 0, left: 0, right: 0,
            opacity: show('attributions') ? 1 : 0,
            pointerEvents: show('attributions') ? 'auto' : 'none',
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <Suspense fallback={<LoadingFallback />}>
              <Attributions isTransitioning={isTransitioning} />
            </Suspense>
          </div>

          <div style={{
            position: show('licenses') ? 'relative' : 'absolute',
            top: 0, left: 0, right: 0,
            opacity: show('licenses') ? 1 : 0,
            pointerEvents: show('licenses') ? 'auto' : 'none',
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <Suspense fallback={<LoadingFallback />}>
              <Licenses isTransitioning={isTransitioning} />
            </Suspense>
          </div>

          <div style={{
            position: show('terms') ? 'relative' : 'absolute',
            top: 0, left: 0, right: 0,
            opacity: show('terms') ? 1 : 0,
            pointerEvents: show('terms') ? 'auto' : 'none',
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <Suspense fallback={<LoadingFallback />}>
              <Terms isTransitioning={isTransitioning} />
            </Suspense>
          </div>

          <div style={{
            position: show('policies') ? 'relative' : 'absolute',
            top: 0, left: 0, right: 0,
            opacity: show('policies') ? 1 : 0,
            pointerEvents: show('policies') ? 'auto' : 'none',
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <Suspense fallback={<LoadingFallback />}>
              <Privacy isTransitioning={isTransitioning} />
              <UsePolicy isTransitioning={isTransitioning} />
            </Suspense>
          </div>

          <div style={{
            position: show('documents') ? 'relative' : 'absolute',
            top: 0, left: 0, right: 0,
            opacity: show('documents') ? 1 : 0,
            pointerEvents: show('documents') ? 'auto' : 'none',
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <Suspense fallback={<LoadingFallback />}>
              <Documents isTransitioning={isTransitioning} />
            </Suspense>
          </div>

          <div style={{
            position: show('investor-relations') ? 'relative' : 'absolute',
            top: 0, left: 0, right: 0,
            opacity: show('investor-relations') ? 1 : 0,
            pointerEvents: show('investor-relations') ? 'auto' : 'none',
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <Suspense fallback={<LoadingFallback />}>
              <InvestorRelations isTransitioning={isTransitioning} />
            </Suspense>
          </div>

          <div style={{
            position: show('report') ? 'relative' : 'absolute',
            top: 0, left: 0, right: 0,
            opacity: show('report') ? 1 : 0,
            pointerEvents: show('report') ? 'auto' : 'none',
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            <Suspense fallback={<LoadingFallback />}>
              <Report isTransitioning={isTransitioning} />
            </Suspense>
          </div>

        </div>
      </div>
    </div>
  );
});

Information.displayName = 'Information';
export default Information;