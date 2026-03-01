"use client";
import { useState, useEffect, useCallback } from 'react';
import Navbar from './Navbar';
import MainContent from './MainContent';
import Footer from './Footer';
import LoadingScreen from './LoadingScreen';
import CookieBanner from './CookieBanner';
import type { InfoContentType } from '@/data/information-data';

type TabType = 'home' | 'discover' | 'information' | 'affiliations' | 'ventures';
const VALID_TABS: TabType[] = ['home', 'discover', 'information', 'affiliations', 'ventures'];

const DEFAULT_SUBTABS: Partial<Record<TabType, string>> = {
  discover: 'discover-overview',
  ventures: 'ventures-defense',
};

const ClientWrapper = () => {
  const [activeTab, setActiveTab]               = useState<TabType>('home');
  const [activeSubtab, setActiveSubtab]         = useState<string | undefined>(undefined);
  const [activeInfoContent, setActiveInfoContent] = useState<InfoContentType>('statements');
  const [loading, setLoading]                   = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  const isValidTab = useCallback((tab: string): tab is TabType => {
    return VALID_TABS.includes(tab as TabType);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabFromUrl = params.get('tab');
    if (tabFromUrl && isValidTab(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [isValidTab]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.infoTab) {
        setActiveInfoContent(event.state.infoTab as InfoContentType);
        return;
      }
      const tab = event.state?.tab;
      if (tab && isValidTab(tab)) {
        setActiveTab(tab);
      } else {
        setActiveTab('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isValidTab]);

  const handleTabChange = useCallback((tab: string) => {
    if (!isValidTab(tab) || tab === activeTab) return;
    setActiveTab(tab);
    setActiveSubtab(DEFAULT_SUBTABS[tab as TabType]);
    const url = new URL(window.location.href);
    if (tab === 'home') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', tab);
    }
    window.history.pushState({ tab }, '', url);
  }, [activeTab, isValidTab]);

const handleInfoContentChange = useCallback((content: InfoContentType) => {
  setActiveInfoContent(content);
}, []);

  const handleSubtabClick = useCallback((parentTabId: string, subtabId: string) => {
    setActiveSubtab(subtabId);
  }, []);

  const handleFooterNavigate = useCallback((tabId: string, subtabId?: string, infoContent?: string) => {
    if (!isValidTab(tabId)) return;
    setActiveTab(tabId);
    setActiveSubtab(subtabId ?? DEFAULT_SUBTABS[tabId as TabType]);
    const url = new URL(window.location.href);
    if (tabId === 'home') url.searchParams.delete('tab');
    else url.searchParams.set('tab', tabId);
    window.history.pushState({ tab: tabId }, '', url);
    if (infoContent) setActiveInfoContent(infoContent as InfoContentType);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isValidTab]);

  return (
    <>
      {loading && <LoadingScreen duration={3000} onComplete={handleLoadingComplete} />}
      <div className="min-h-screen theme-transition" style={{ background: 'var(--surface-primary)', color: 'var(--content-primary)' }}>
        <Navbar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          activeSubtab={activeSubtab}
          onSubtabClick={handleSubtabClick}
          activeInfoContent={activeInfoContent}
          onInfoContentChange={handleInfoContentChange}
        />
        <main>
          <MainContent
            activeTab={activeTab}
            activeSubtab={activeSubtab}
            activeInfoContent={activeInfoContent}
            onInfoContentChange={handleInfoContentChange}
          />
        </main>
        <Footer onNavigate={handleFooterNavigate} />
      </div>
      <CookieBanner visible={!loading} />
    </>
  );
};

export default ClientWrapper;