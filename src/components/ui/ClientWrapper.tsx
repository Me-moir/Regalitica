"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import LoadingScreen from './LoadingScreen';
import Navbar from './Navbar';
import MainContent from './MainContent';
import Footer from './Footer';

type TabType = 'discover' | 'information' | 'affiliations' | 'ventures';

const VALID_TABS: TabType[] = ['discover', 'information', 'affiliations', 'ventures'];

const ClientWrapper = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('discover');

  const isValidTab = useCallback((tab: string): tab is TabType => {
    return VALID_TABS.includes(tab as TabType);
  }, []);

  useEffect(() => {
    if (isLoading) {
      Promise.all([
        import('../tabs/Discover/HeroSection'),
        import('../tabs/Discover/Overview'),
      ]).then(() => {
        console.log('✅ Critical sections preloaded');
      });
      
      if (typeof document !== 'undefined') {
        document.fonts.ready.then(() => {
          console.log('✅ Fonts loaded');
        });
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      const params = new URLSearchParams(window.location.search);
      const tabFromUrl = params.get('tab');
      
      if (tabFromUrl && isValidTab(tabFromUrl)) {
        setActiveTab(tabFromUrl);
      }
    }
  }, [isLoading, isValidTab]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.infoTab) return;
      const tab = event.state?.tab;
      if (tab && isValidTab(tab)) {
        setActiveTab(tab);
      } else {
        setActiveTab('discover');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isValidTab]);

  const handleTabChange = useCallback((tab: TabType) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({ tab }, '', url);
  }, [activeTab]);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen theme-transition" style={{ background: 'var(--surface-primary)', color: 'var(--content-primary)' }}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange}
      />
      
      <main>
        <MainContent activeTab={activeTab} />
      </main>
      
      <Footer />
    </div>
  );
};

export default ClientWrapper;