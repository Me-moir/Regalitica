"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Image from 'next/image';
import Footer from '@/components/ui/Footer';
import { useTheme } from '@/context/ThemeContext';
import SearchModal from '@/components/ui/SearchModal';
import { DEFENSE_NAV_ITEMS, DEFAULT_SUBTABS, type SubtabItem } from './nav-data';
import { DEFENSE_NAVBAR_CSS } from './styles';
import StripRow from './StripRow';
import DefenseHero from './DefenseHero';
import DefenseContent from './DefenseContent';
import DefenseLoadingScreen from './DefenseLoadingScreen';

export default function DefenseSitePage() {
  const { theme, toggleTheme, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [activeSubtab, setActiveSubtab] = useState<string | undefined>('overview');
  const [stripOpen, setStripOpen] = useState(true);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpandedTab, setMobileExpandedTab] = useState<string | null>(null);
  const [displayedTab, setDisplayedTab] = useState('home');
  const [displayedSubtab, setDisplayedSubtab] = useState('overview');
  const [searchOpen, setSearchOpen] = useState(false);

  const navContainerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const manualOpenRef = useRef(false);
  const touchRef = useRef<{ startX: number; startY: number } | null>(null);
  const navCollapsedRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollAnimRafRef = useRef<number | null>(null);
  const spyDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Smooth inertia scroll helper ──
  const smoothScrollTo = useCallback((targetY: number, duration = 1100) => {
    // Cancel any in-flight scroll animation
    if (scrollAnimRafRef.current !== null) {
      cancelAnimationFrame(scrollAnimRafRef.current);
      scrollAnimRafRef.current = null;
    }
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }

    // Disable CSS scroll-behavior:smooth — it fights our rAF animation
    const htmlEl = document.documentElement;
    htmlEl.style.scrollBehavior = 'auto';

    const startY = window.scrollY;
    const diff = targetY - startY;
    if (Math.abs(diff) < 1) {
      htmlEl.style.scrollBehavior = '';
      isProgrammaticScrollRef.current = false;
      return;
    }
    const startTime = performance.now();

    // easeInOutQuart for weighted / inertia feel
    const ease = (t: number) => {
      return t < 0.5
        ? 8 * t * t * t * t
        : 1 - Math.pow(-2 * t + 2, 4) / 2;
    };

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + diff * ease(progress));
      if (progress < 1) {
        scrollAnimRafRef.current = requestAnimationFrame(step);
      } else {
        scrollAnimRafRef.current = null;
        // Restore CSS scroll-behavior and release scroll-spy guard after buffer
        htmlEl.style.scrollBehavior = '';
        scrollTimeoutRef.current = setTimeout(() => {
          isProgrammaticScrollRef.current = false;
        }, 500);
      }
    };
    scrollAnimRafRef.current = requestAnimationFrame(step);
  }, []);

  // ── Responsive ──
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const check = () => { clearTimeout(t); t = setTimeout(() => setIsMobile(window.innerWidth < 640), 150); };
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener('resize', check); };
  }, []);

  // ── Mouse gradient accent ──
  useEffect(() => {
    const el = navContainerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mouse-x', `${((e.clientX - r.left) / r.width) * 100}%`);
        rafIdRef.current = null;
      });
    };
    document.addEventListener('mousemove', onMove, { passive: true });
    return () => { document.removeEventListener('mousemove', onMove); if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current); };
  }, []);

  // ── Content transitions ──
  useEffect(() => {
    // Home tab renders all sections at once — no subtab transition delay needed
    if (activeTab === 'home' && displayedTab === 'home') {
      setDisplayedSubtab(activeSubtab || DEFAULT_SUBTABS[activeTab]);
      return;
    }
    const timer = setTimeout(() => {
      setDisplayedTab(activeTab);
      setDisplayedSubtab(activeSubtab || DEFAULT_SUBTABS[activeTab]);
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTab, activeSubtab, displayedTab]);

  // ── Tab changes → reset strip ──
  useEffect(() => {
    manualOpenRef.current = false;
    setStripOpen(true);
    setActiveSubtab(DEFAULT_SUBTABS[activeTab]);
  }, [activeTab]);

  // ── Collapse / show nav ──
  const handleCollapseNav = useCallback(() => {
    setNavCollapsed(true);
    navCollapsedRef.current = true;
    setStripOpen(false);
    let hasScrolledAway = window.scrollY > 10;
    const restore = () => {
      if (!hasScrolledAway) { if (window.scrollY > 10) hasScrolledAway = true; return; }
      if (window.scrollY <= 10) { setNavCollapsed(false); navCollapsedRef.current = false; window.removeEventListener('scroll', restore); }
    };
    window.addEventListener('scroll', restore, { passive: true });
  }, []);

  const handleShowNav = useCallback(() => {
    setNavCollapsed(false);
    navCollapsedRef.current = false;
  }, []);

  // ── Tab click ──
  const handleTabClick = useCallback((tabId: string) => {
    // If already on this tab and on home, use guarded scroll to avoid scroll-spy jitter
    if (tabId === activeTab && tabId === 'home' && window.scrollY > 10) {
      isProgrammaticScrollRef.current = true;
      setActiveSubtab('overview');
      smoothScrollTo(0, 900);
      return;
    }
    setActiveTab(tabId);
    isProgrammaticScrollRef.current = true;
    smoothScrollTo(0, 600);
  }, [activeTab, smoothScrollTo]);

  // ── Arrow toggle ──
  const handleArrowToggle = useCallback((tabId: string) => {
    if (tabId !== activeTab) {
      setActiveTab(tabId);
      isProgrammaticScrollRef.current = true;
      smoothScrollTo(0, 600);
      return;
    }
    setStripOpen(prev => {
      const next = !prev;
      manualOpenRef.current = next;
      return next;
    });
  }, [activeTab, smoothScrollTo]);

  // ── Subtab click ──
  const handleSubtabClick = useCallback((sub: SubtabItem) => {
    // Special subtabs (e.g. "Return to Main Site")
    if (sub.isSpecial && sub.id === 'return-main') {
      window.location.href = '/?tab=technologies';
      return;
    }

    // Home tab subtabs scroll to sections instead of switching content
    if (sub.sectionId && activeTab === 'home') {
      isProgrammaticScrollRef.current = true;
      setActiveSubtab(sub.id);
      const el = document.getElementById(sub.sectionId);
      if (el) {
        const navH = stripOpen ? 134 : 84;
        const targetY = el.getBoundingClientRect().top + window.scrollY - navH;
        smoothScrollTo(targetY, 1100);
      } else {
        isProgrammaticScrollRef.current = false;
      }
      return;
    }

    setActiveSubtab(sub.id);
    isProgrammaticScrollRef.current = true;
    smoothScrollTo(0, 600);
  }, [activeTab, smoothScrollTo, stripOpen]);

  // ── Go home ──
  const goHome = useCallback(() => {
    window.location.href = '/?tab=technologies';
  }, []);

  // ── Search ──
  const openSearch  = useCallback(() => setSearchOpen(true),  []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(p => !p); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSearchNavigate = useCallback((tabId: string, subtabId?: string) => {
    const defenseTabIds = ['home', 'megiddo', 'argos', 'rnd'];
    if (defenseTabIds.includes(tabId)) {
      setActiveTab(tabId);
      if (subtabId) setActiveSubtab(subtabId);
      isProgrammaticScrollRef.current = true;
      smoothScrollTo(0, 600);
    } else {
      window.location.href = `/?tab=${tabId}${subtabId ? `&subtab=${subtabId}` : ''}`;
    }
    setSearchOpen(false);
  }, [smoothScrollTo]);

  // ── Mobile sidebar ──
  const openMobile = useCallback(() => setMobileOpen(true), []);

  // ── Scroll-spy for home (Systems Overview) tab ──
  useEffect(() => {
    if (activeTab !== 'home') return;
    const homeItem = DEFENSE_NAV_ITEMS.find(n => n.id === 'home')!;
    const sections = homeItem.subtabs
      .filter(s => s.sectionId)
      .map(s => ({ subtabId: s.id, sectionId: s.sectionId! }));

    let lastSetId: string | null = null;

    const computeActive = () => {
      if (isProgrammaticScrollRef.current) return;
      const scrollY = window.scrollY;
      const navH = 160;  // slightly above actual nav (134) to trigger early enough
      let active = sections[0]?.subtabId;
      for (const { subtabId, sectionId } of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.getBoundingClientRect().top + scrollY;
          // Add hysteresis: require passing the threshold by 40px to prevent flicker
          if (scrollY + navH >= top + (subtabId === lastSetId ? -40 : 0)) {
            active = subtabId;
          }
        }
      }
      if (active !== lastSetId) {
        lastSetId = active;
        setActiveSubtab(active);
      }
    };

    const onScroll = () => {
      if (isProgrammaticScrollRef.current) return;
      // Debounce scroll-spy to avoid rapid-fire updates
      if (spyDebounceRef.current) clearTimeout(spyDebounceRef.current);
      spyDebounceRef.current = setTimeout(computeActive, 30);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (spyDebounceRef.current) clearTimeout(spyDebounceRef.current);
    };
  }, [activeTab]);
  const closeMobile = useCallback(() => { setMobileOpen(false); setMobileExpandedTab(null); }, []);
  const toggleMobileTab = useCallback((id: string) => setMobileExpandedTab(p => p === id ? null : id), []);

  const handleMobileTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId); setMobileOpen(false); setMobileExpandedTab(null);
    isProgrammaticScrollRef.current = true;
    smoothScrollTo(0, 600);
  }, [smoothScrollTo]);

  const handleMobileSubtabClick = useCallback((parentTabId: string, sub: SubtabItem) => {
    if (sub.isSpecial && sub.id === 'return-main') {
      window.location.href = '/?tab=technologies';
      return;
    }
    setActiveTab(parentTabId); setActiveSubtab(sub.id);
    setMobileOpen(false); setMobileExpandedTab(null);
    if (sub.sectionId && parentTabId === 'home') {
      isProgrammaticScrollRef.current = true;
      requestAnimationFrame(() => {
        const el = document.getElementById(sub.sectionId!);
        if (el) {
          const navH = stripOpen ? 134 : 84;
          const targetY = el.getBoundingClientRect().top + window.scrollY - navH;
          smoothScrollTo(targetY, 1100);
        } else {
          isProgrammaticScrollRef.current = false;
        }
      });
    } else {
      isProgrammaticScrollRef.current = true;
      smoothScrollTo(0, 600);
    }
  }, [smoothScrollTo, stripOpen]);

  const onSidebarTouchStart = useCallback((e: React.TouchEvent) => {
    touchRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY };
  }, []);
  const onSidebarTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.startX;
    const dy = Math.abs(e.changedTouches[0].clientY - touchRef.current.startY);
    touchRef.current = null;
    if (dx > 60 && dy < dx) closeMobile();
  }, [closeMobile]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // ── Spring press listener ──
  useEffect(() => {
    const SELECTORS = [
      '.tab-item-border', '.tab-label-btn', '.tab-arrow-btn',
      '.strip-tab', '.strip-collapse', '.logo-mark', '.mob-tab-btn',
      '.mob-subtab-btn', '.mob-close', '.nav-reveal-tab', '.nav-theme-tab', '.mobile-burger',
    ].join(', ');
    const onPointerDown = (e: PointerEvent) => {
      const target = (e.target as Element).closest(SELECTORS);
      if (!target) return;
      target.classList.remove('tab-pressed');
      void (target as HTMLElement).offsetWidth;
      target.classList.add('tab-pressed');
      const cleanup = () => { target.classList.remove('tab-pressed'); target.removeEventListener('animationend', cleanup); };
      target.addEventListener('animationend', cleanup);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  // ── Derived ──
  const activeSet = useMemo(() => {
    const set = new Set<string>();
    set.add(activeTab);
    return set;
  }, [activeTab]);

  const barStyle = useMemo(() => ({
    height: isMobile ? '68px' : '84px',
    paddingLeft: isMobile ? '16px' : '36px',
    paddingRight: isMobile ? '16px' : '36px',
    gap: isMobile ? '10px' : '16px',
  }), [isMobile]);

  const isTransitioning = activeTab !== displayedTab || (activeTab !== 'home' && activeSubtab !== displayedSubtab);

  // Footer navigate — route back to main site sections
  const handleFooterNavigate = useCallback((tabId: string) => {
    window.location.href = `/?tab=${tabId}`;
  }, []);

  return (
    <>
      <style>{DEFENSE_NAVBAR_CSS}</style>

      {loading && <DefenseLoadingScreen onComplete={() => setLoading(false)} />}

      <div className="min-h-screen theme-transition" style={{ background: 'var(--surface-primary)', color: 'var(--content-primary)' }}>

        {/* ══ STICKY REVEAL TAB ══ */}
        <button
          className={`nav-reveal-tab${navCollapsed ? ' tab-visible' : ''}`}
          onClick={handleShowNav}
          aria-label="Show navigation bar"
        >
          <i className="bi bi-eye reveal-tab-icon" style={{ fontSize: '0.9rem' }} />
          {!isMobile && <span>Show Nav</span>}
        </button>

        {/* ══ NAVBAR ══ */}
        <nav ref={navContainerRef} className={`glass-navbar${navCollapsed ? ' nav-collapsed' : ''}`}>

          {/* Main bar row */}
          <div className="w-full flex items-center" style={barStyle}>

            {/* Logo — clicking goes back to main site */}
            <button className="logo-mark flex-shrink-0" onClick={goHome} aria-label="Back to Notus Regalia" data-tooltip="Return to Main Site">
              <div className="logo-icon">
                <Image src="/assets/Notus-Regalia-logo.svg" alt="Notus Regalia" width={42} height={42} priority />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span className="logo-text" style={{ fontSize: isMobile ? '0.95rem' : undefined }}>
                  Notus <span style={{ color: '#EB1143', fontWeight: 300 }}>Regalia</span>
                </span>
                <span style={{
                  fontFamily: 'ui-monospace, Menlo, monospace',
                  fontSize: '0.5rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: '#E31B54', fontWeight: 600, marginTop: 6,
                }}>
                  Defense Systems
                </span>
              </div>
            </button>

            <div className="nav-divider desktop-only" style={{ height: '32px', alignSelf: 'center' }} />

            {/* Tab pills */}
            <div className="nav-center">
              <div className="tabs-row">
                {DEFENSE_NAV_ITEMS.map(item => {
                  const active = activeSet.has(item.id);
                  const isActiveTab = item.id === activeTab;
                  const arrowOpen = isActiveTab && stripOpen;
                  return (
                    <div key={item.id} className={`tab-item-border${active ? ' is-active' : ''}`}>
                      <div className={`tab-item${active ? ' is-active' : ''}`}>
                        <button
                          className={`tab-label-btn${active ? ' is-active' : ''}`}
                          onClick={() => handleTabClick(item.id)}
                          style={{ fontSize: isMobile ? '0.84rem' : '0.97rem' }}
                        >
                          <i className={`bi ${item.icon}`} style={{ fontSize: '0.8rem', marginRight: '0.4em', opacity: 0.75 }} />
                          {item.label}
                        </button>
                        <span className="tab-sep" />
                        <button
                          className={`tab-arrow-btn${arrowOpen ? ' arrow-open' : ''}`}
                          onClick={() => handleArrowToggle(item.id)}
                          aria-label={arrowOpen ? `Hide ${item.label} sections` : `Show ${item.label} sections`}
                        >
                          <i className="bi bi-chevron-down arrow-icon" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right controls */}
            <div className="nav-right-controls">
              <div className="tab-item-border nav-icon-btn-wrap" data-tooltip={isDark ? 'Light mode' : 'Night mode'}>
                <div className="tab-item">
                  <button
                    className="tab-label-btn"
                    onClick={toggleTheme}
                    aria-label={isDark ? 'Switch to light mode' : 'Switch to night mode'}
                    style={{ padding: '11px 13px' }}
                  >
                    <i className={`bi ${isDark ? 'bi-sun' : 'bi-moon'}`} style={{ fontSize: '0.85rem' }} />
                  </button>
                </div>
              </div>
              <div className="tab-item-border collapse-btn-desktop nav-icon-btn-wrap" data-tooltip="Hide nav">
                <div className="tab-item">
                  <button
                    className="tab-label-btn collapse-btn-desktop"
                    onClick={handleCollapseNav}
                    aria-label="Hide navigation bar"
                    style={{ padding: '11px 13px' }}
                  >
                    <i className="bi bi-eye-slash" style={{ fontSize: '0.85rem' }} />
                  </button>
                </div>
              </div>
              <div className="tab-item-border" data-tooltip="Search">
                <div className="tab-item">
                  <button
                    className="tab-label-btn"
                    onClick={openSearch}
                    aria-label="Open search"
                    style={{ padding: isMobile ? '11px 13px' : '11px 18px 11px 16px' }}
                  >
                    <i className="bi bi-search" style={{ fontSize: '0.85rem' }} />
                    {!isMobile && <span>Search</span>}
                    {!isMobile && <span className="search-shortcut">⌘K</span>}
                  </button>
                </div>
              </div>
              <button className="mobile-burger" onClick={openMobile} aria-label="Open menu">
                <i className="bi bi-list" />
              </button>
            </div>
          </div>

          {/* Subtab strip */}
          {DEFENSE_NAV_ITEMS.map(item => {
            const isVisible = item.id === activeTab && stripOpen;
            return (
              <StripRow
                key={`strip-${item.id}`}
                item={item}
                isVisible={isVisible}
                activeSubtabId={activeSubtab ?? null}
                onSubtabClick={handleSubtabClick}
                onCollapse={() => { manualOpenRef.current = false; setStripOpen(false); }}
                isMobile={isMobile}
              />
            );
          })}
        </nav>

        {/* ══ MOBILE SIDEBAR ══ */}
        <div className={`mob-overlay${mobileOpen ? ' open' : ''}`} onClick={closeMobile} />
        <div
          className={`mob-sidebar${mobileOpen ? ' open' : ''}`}
          onTouchStart={onSidebarTouchStart}
          onTouchEnd={onSidebarTouchEnd}
        >
          <div className="mob-header">
            <span className="mob-header-title">Defense Systems</span>
            <button
              className="mob-close"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to night mode'}
              style={{ color: 'var(--content-faint)', fontSize: '0.85rem' }}
            >
              <i className={`bi ${isDark ? 'bi-sun' : 'bi-moon'}`} />
            </button>
            <button className="mob-close" onClick={() => { setMobileOpen(false); setSearchOpen(true); }} aria-label="Search" style={{ color: 'var(--content-faint)', fontSize: '0.85rem' }}>
              <i className="bi bi-search" />
            </button>
            <button className="mob-close" onClick={closeMobile} aria-label="Close menu"><i className="bi bi-x-lg" /></button>
          </div>
          <div className="mob-nav-list">
            {DEFENSE_NAV_ITEMS.map(item => {
              const active = activeSet.has(item.id);
              const isTabExpanded = mobileExpandedTab === item.id;
              return (
                <div key={item.id}>
                  <button
                    className={`mob-tab-btn${active ? ' is-active' : ''}`}
                    onClick={() => toggleMobileTab(item.id)}
                  >
                    <span className="mob-tab-left"><i className={`bi ${item.icon}`} />{item.label}</span>
                    <i className={`bi bi-chevron-right mob-tab-chevron${isTabExpanded ? ' open' : ''}`} />
                  </button>
                  <div className={`mob-subtabs ${isTabExpanded ? 'expanded' : 'collapsed'}`}>
                    {item.subtabs.map(sub => {
                      const isSubActive = activeTab === item.id && activeSubtab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          className={`mob-subtab-btn${isSubActive ? ' is-active' : ''}`}
                          onClick={() => handleMobileSubtabClick(item.id, sub)}
                        >
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══ MAIN CONTENT ══ */}
        <main style={{ paddingTop: stripOpen ? '134px' : '84px', transition: 'padding-top 0.38s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          {displayedTab === 'home' ? (
            <div className={`relative z-10 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <div id="defense-section-overview" style={{ scrollMarginTop: stripOpen ? '134px' : '84px' }}>
                <DefenseHero />
              </div>
              <div id="defense-section-features" style={{ scrollMarginTop: stripOpen ? '134px' : '84px' }}>
                <DefenseContent tabId="home" subtabId="features" />
              </div>
              <div id="defense-section-portfolio" style={{ scrollMarginTop: stripOpen ? '134px' : '84px' }}>
                <DefenseContent tabId="home" subtabId="systems-portfolio" />
              </div>
            </div>
          ) : (
            <div className={`relative z-10 transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <DefenseContent tabId={displayedTab} subtabId={displayedSubtab} />
            </div>
          )}
        </main>

        {/* ══ FOOTER — same component as main site ══ */}
        <Footer onNavigate={handleFooterNavigate} />
      </div>

      {/* ══ SEARCH MODAL ══ */}
      <SearchModal isOpen={searchOpen} onClose={closeSearch} onNavigate={handleSearchNavigate} />
    </>
  );
}
