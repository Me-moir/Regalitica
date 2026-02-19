"use client";
import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import type { InfoContentType } from '@/data/information-data';

const LandingTab     = lazy(() => import('@/components/tabs/Landing'));
const DiscoverTab    = lazy(() => import('@/components/tabs/Discover'));
const VenturesTab    = lazy(() => import('@/components/tabs/Ventures'));
const InformationTab = lazy(() => import('@/components/tabs/Information/Information'));

interface MainContentProps {
  activeTab: string;
  activeInfoContent: InfoContentType;
  onInfoContentChange: (content: InfoContentType) => void;
}

const TabLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-sm" style={{ color: 'var(--content-muted)' }}>Loading...</p>
    </div>
  </div>
);

const MainContent = ({ activeTab, activeInfoContent, onInfoContentChange }: MainContentProps) => {
  const [displayedTab, setDisplayedTab] = useState(activeTab);
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab !== displayedTab) {
      const timer = setTimeout(() => {
        setDisplayedTab(activeTab);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab, displayedTab]);

  const renderContent = () => {
    switch (displayedTab) {
      case 'home':
        return <LandingTab />;
      case 'discover':
        return <DiscoverTab />;
      case 'ventures':
        return <VenturesTab />;
      case 'information':
        return (
          <InformationTab
            activeContent={activeInfoContent}
            onContentChange={onInfoContentChange}
          />
        );
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