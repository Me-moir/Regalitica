"use client";
import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import SearchModal from './SearchModal';
import ThemeToggle from './ThemeToggle';

/* ═══════════════════════════════════════════════════════════════════════════
   Interfaces
   ═══════════════════════════════════════════════════════════════════════════ */
interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeSubtab?: string;
  onSubtabClick?: (parentTabId: string, subtabId: string) => void;
}

interface SubtabItem {
  id: string;
  label: string;
  sectionId?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  isSpecial?: boolean;
  subtabs?: SubtabItem[];
}

/* ═══════════════════════════════════════════════════════════════════════════
   Static nav data — lives outside component, never reallocated
   ═══════════════════════════════════════════════════════════════════════════ */
const NAV_ITEMS: NavItem[] = [
  {
    id: 'discover',
    label: 'Discover',
    icon: 'bi-rocket-takeoff',
    subtabs: [
      { id: 'discover-hero',     label: 'Home',     sectionId: 'section-hero' },
      { id: 'discover-about',    label: 'About',    sectionId: 'section-about' },
      { id: 'discover-features', label: 'Features', sectionId: 'section-features' },
      { id: 'discover-team',     label: 'Team',     sectionId: 'section-team' },
      { id: 'discover-contact',  label: 'Contact',  sectionId: 'section-contact' },
    ],
  },
  {
    id: 'information',
    label: 'Information',
    icon: 'bi-pin',
    subtabs: [
      { id: 'info-docs',      label: 'Docs' },
      { id: 'info-faq',       label: 'FAQ' },
      { id: 'info-blog',      label: 'Blog' },
      { id: 'info-changelog', label: 'Changelog' },
    ],
  },
  {
    id: 'ventures',
    label: 'Ventures',
    icon: 'bi-crosshair',
    isSpecial: true,
    subtabs: [
      { id: 'ventures-portfolio', label: 'Portfolio' },
      { id: 'ventures-invest',    label: 'Invest' },
      { id: 'ventures-pitch',     label: 'Pitch Us' },
      { id: 'ventures-thesis',    label: 'Thesis' },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   CSS — extracted to a module-level constant so the browser never
   re-parses it on React re-renders.  This alone removes the biggest
   source of jank (CSSOM churn every time state changes).
   ═══════════════════════════════════════════════════════════════════════════ */
const NAVBAR_CSS = `
/* ─── Animated active border ─── */
.nav-button-active-border {
  position: relative;
  padding: 1px;
  border-radius: 10px;
}
.nav-button-active-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10px;
  padding: 1px;
  pointer-events: none;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(0,255,166,0.8) 15%,
    rgba(255,215,0,0.6) 30%,
    rgba(236,72,153,0.6) 45%,
    rgba(147,51,234,0.6) 60%,
    rgba(59,130,246,0.5) 75%,
    transparent 90%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: orbitBorder 3s linear infinite;
  background-size: 200% 100%;
}
@keyframes orbitBorder {
  0%   { background-position: 0% 0%; }
  100% { background-position: 200% 0%; }
}

/* ─── Glass navbar ─── */
.glass-navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 50;
  background: var(--glass-bg);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border-color);
  box-shadow:
    0 8px 32px var(--glass-shadow-1),
    0 12px 48px var(--glass-shadow-2),
    inset 0 1px 1px var(--glass-inset-top),
    inset 0 -1px 1px var(--glass-inset-bottom);
}
.glass-navbar::before {
  content: '';
  position: absolute;
  bottom: -1px; left: 0; right: 0; height: 1px;
  background: radial-gradient(
    600px circle at var(--mouse-x, 50%) 100%,
    rgba(0,255,166,0.9), rgba(255,215,0,0.7),
    rgba(236,72,153,0.7), rgba(147,51,234,0.6),
    rgba(59,130,246,0.5), transparent 70%
  );
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}
.glass-navbar:hover::before { opacity: 1; }

/* ─── Logo ─── */
.logo-mark { display:flex; align-items:center; gap:12px; text-decoration:none; user-select:none; }
.logo-icon {
  width:38px; height:38px; border-radius:10px;
  background: linear-gradient(135deg,#1a1a1a 0%,#0d0d0d 60%,#111 100%);
  display:flex; align-items:center; justify-content:center;
  box-shadow: 0 0 14px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08);
  flex-shrink:0;
}
.logo-icon svg { width:18px; height:18px; fill:rgba(255,255,255,0.92); }
.logo-text { font-size:1.05rem; font-weight:800; letter-spacing:-0.03em; color:var(--content-primary); line-height:1; }

/* ─── Divider ─── */
.nav-divider {
  width:1px;
  background: linear-gradient(to bottom, transparent, var(--border-dashed), transparent);
  margin: 0 12px; flex-shrink:0;
}

/* ─── CENTER wrapper ─── */
.nav-center {
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
}

/* ─── Tabs & subs rows ─── */
.tabs-row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  transition:
    opacity 0.2s ease,
    transform 0.22s ease;
  pointer-events: auto;
}
.tabs-row.expanded {
  opacity: 0;
  transform: translateX(-16px);
}
.tabs-row.expanded .tab-label-btn { pointer-events: none; }

.subs-row {
  position: absolute;
  left: 0; top: 50%;
  transform: translateY(-50%) translateX(20px);
  width: 100%;
  display: flex;
  align-items: center;
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.22s ease,
    transform 0.24s ease;
  white-space: nowrap;
  overflow: hidden;
}
.subs-row.expanded {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
  pointer-events: auto;
}

/* ─── Tab item: [label│arrow] ─── */
.tab-item {
  display: inline-flex;
  align-items: stretch;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 var(--glass-inset-top);
  transition: box-shadow 0.2s ease;
  flex-shrink: 0;
  background: transparent;
}
.tab-item:hover {
  box-shadow: 0 4px 14px rgba(0,0,0,0.26), inset 0 1px 0 var(--glass-inset-top);
}
.tab-item.is-active { background: var(--hover-bg-strong); }

.tab-label-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--content-faint);
  padding: 10px 16px 10px 18px;
  font-size: 0.88rem;
  line-height: 1;
  transition: color 0.15s ease;
  user-select: none;
}
.tab-label-btn:hover,
.tab-label-btn.is-active { color: var(--content-primary); }
.tab-label-btn.is-active { font-weight: 600; }

.tab-sep {
  width: 1px;
  margin: 6px 0;
  background: var(--border-dashed);
  opacity: 0.45;
  flex-shrink: 0;
  pointer-events: none;
}

.tab-arrow-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--content-faint);
  transition: color 0.15s ease, background 0.15s ease;
  flex-shrink: 0;
  padding: 0;
}
.tab-arrow-btn:hover { color: var(--content-primary); background: rgba(0,255,166,0.07); }
.tab-arrow-btn.active-arrow {
  color: var(--content-primary);
  background: rgba(0,255,166,0.10);
}

@media (max-width: 640px) {
  .tab-sep, .tab-arrow-btn { display: none; }
  .tab-label-btn { padding: 5px 10px; font-size: 0.75rem; }
}

/* ─── Subtab breadcrumb ─── */
.sub-parent {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.87rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--content-primary);
  padding: 8px 10px 8px 6px;
  border: none;
  background: transparent;
  flex-shrink: 0;
  user-select: none;
}
.sub-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--content-faint);
  font-size: 0.6rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: color 0.15s ease, background 0.15s ease;
  margin-left: -4px;
}
.sub-close:hover {
  color: var(--content-primary);
  background: var(--hover-bg-strong);
}
.sub-spacer { width: 12px; flex-shrink: 0; }
.sub-sep {
  display: inline-flex;
  align-items: center;
  color: var(--content-secondary);
  font-size: 0.62rem;
  margin: 0 1px;
  flex-shrink: 0;
  opacity: 0.55;
  user-select: none;
}
.sub-btn {
  display: inline-flex;
  align-items: center;
  padding: 7px 12px;
  font-size: 0.83rem;
  font-weight: 500;
  color: var(--content-faint);
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
  transition: color 0.12s ease, background 0.12s ease;
}
.sub-btn:hover {
  color: var(--content-primary);
  background: var(--hover-bg-strong);
  transform: translateY(-1px);
}
.sub-btn.is-active {
  color: var(--content-primary);
  font-weight: 600;
  background: var(--hover-bg-strong);
  position: relative;
}
.sub-btn.is-active::after {
  content: '';
  position: absolute;
  bottom: 3px; left: 12px; right: 12px;
  height: 1.5px;
  border-radius: 999px;
  background: rgba(0,255,166,0.75);
}

/* Staggered entrance */
.subs-row.expanded .sub-btn {
  animation: subIn 0.24s cubic-bezier(0.34,1.18,0.64,1) both;
  animation-delay: calc(var(--i, 0) * 0.04s);
}
@keyframes subIn {
  from { opacity:0; transform:translateX(10px); }
  to   { opacity:1; transform:translateX(0); }
}

/* ─── Search trigger ─── */
.search-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: var(--content-faint);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 var(--glass-inset-top);
  transition: color 0.15s ease, box-shadow 0.2s ease, transform 0.15s ease;
  user-select: none;
  flex-shrink: 0;
}
.search-trigger:hover {
  color: var(--content-primary);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 var(--glass-inset-top);
  transform: translateY(-1px);
}
.search-trigger .search-shortcut {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 5px;
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--content-faint);
  background: var(--hover-bg);
  border: 1px solid var(--border-color);
  opacity: 0.7;
  letter-spacing: 0.03em;
}
`;

/* ═══════════════════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════════════════ */
const Navbar = ({
  activeTab,
  setActiveTab,
  activeSubtab,
  onSubtabClick,
}: NavbarProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedTab, setExpandedTab] = useState<string | null>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const autoCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Mobile check (debounced) ──────────────────────────────────────────
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const check = () => { clearTimeout(t); t = setTimeout(() => setIsMobile(window.innerWidth < 640), 150); };
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener('resize', check); };
  }, []);

  // ── Mouse-tracking for gradient glow ──────────────────────────────────
  useEffect(() => {
    const el = navContainerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mouse-x', `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty('--mouse-y', `${((e.clientY - r.top) / r.height) * 100}%`);
        rafIdRef.current = null;
      });
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      document.removeEventListener('mousemove', onMove);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  // ── Expansion helpers ─────────────────────────────────────────────────
  const toggleExpand = useCallback((tabId: string) => {
    setExpandedTab(prev => prev === tabId ? null : tabId);
  }, []);

  const closeExpand = useCallback(() => {
    setExpandedTab(null);
  }, []);

  // Auto-close after 10 s
  useEffect(() => {
    if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
    if (expandedTab) {
      autoCloseRef.current = setTimeout(() => setExpandedTab(null), 10_000);
    }
    return () => { if (autoCloseRef.current) clearTimeout(autoCloseRef.current); };
  }, [expandedTab]);

  // ── Navigation ────────────────────────────────────────────────────────
  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setActiveTab]);

  const handleSubtabClick = useCallback((parentTabId: string, sub: SubtabItem) => {
    setActiveTab(parentTabId);
    onSubtabClick?.(parentTabId, sub.id);
    if (sub.sectionId) {
      requestAnimationFrame(() => {
        document.getElementById(sub.sectionId!)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [setActiveTab, onSubtabClick]);

  // ── Search ────────────────────────────────────────────────────────────
  const openSearch  = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSearchNavigate = useCallback((tabId: string, subtabId?: string) => {
    setActiveTab(tabId);
    if (subtabId) onSubtabClick?.(tabId, subtabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setActiveTab, onSubtabClick]);

  // ── Precompute active-tab set once per render ─────────────────────────
  const activeSet = useMemo(() => {
    const set = new Set<string>();
    for (const item of NAV_ITEMS) {
      if (activeTab === item.id) { set.add(item.id); continue; }
      if (activeSubtab && item.subtabs?.some(s => s.id === activeSubtab)) set.add(item.id);
    }
    return set;
  }, [activeTab, activeSubtab]);

  const expandedItem = useMemo(
    () => NAV_ITEMS.find(item => item.id === expandedTab) ?? null,
    [expandedTab],
  );
  const isExpanded = expandedTab !== null;

  // ── Inline style objects — stable references via useMemo ──────────────
  const barStyle = useMemo(() => ({
    height: isMobile ? '60px' : '72px',
    paddingLeft:  isMobile ? '16px' : '36px',
    paddingRight: isMobile ? '16px' : '36px',
    gap: isMobile ? '10px' : '20px',
  }), [isMobile]);

  const labelFontStyle = useMemo(
    () => ({ fontSize: isMobile ? '0.75rem' : '0.88rem' }),
    [isMobile],
  );

  return (
    <>
      <style>{NAVBAR_CSS}</style>

      <SearchModal isOpen={searchOpen} onClose={closeSearch} onNavigate={handleSearchNavigate} />

      <nav ref={navContainerRef} className="glass-navbar">
        <div className="w-full flex items-center" style={barStyle}>

          {/* Logo */}
          <div className="logo-mark flex-shrink-0">
            <div className="logo-icon">
              <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z"/>
              </svg>
            </div>
            {!isMobile && <div className="logo-text">Your<span>Brand</span></div>}
          </div>

          <div className="nav-divider" style={{ height: '28px', alignSelf: 'center' }} />

          {/* CENTER */}
          <div className="nav-center">

            {/* ── TABS ROW ── */}
            <div className={`tabs-row${isExpanded ? ' expanded' : ''}`}>
              {NAV_ITEMS.map((item) => {
                const active = activeSet.has(item.id);
                const thisExpanded = expandedTab === item.id;

                return (
                  <div key={item.id} className={active ? 'nav-button-active-border' : ''}>
                    <div className={`tab-item${active ? ' is-active' : ''}`}>
                      <button
                        className={`tab-label-btn${active ? ' is-active' : ''}`}
                        onClick={() => { if (thisExpanded) closeExpand(); else handleTabClick(item.id); }}
                        style={labelFontStyle}
                      >
                        <i className={`bi ${item.icon} text-xs`} />
                        {item.label}
                      </button>

                      <span className="tab-sep" />
                      <button
                        className={`tab-arrow-btn${thisExpanded ? ' active-arrow' : ''}`}
                        onClick={() => toggleExpand(item.id)}
                        aria-label={thisExpanded ? `Close ${item.label} sections` : `Show ${item.label} sections`}
                      >
                        <i
                          className={`bi ${thisExpanded ? 'bi-x-lg' : 'bi-chevron-down'}`}
                          style={{ fontSize: thisExpanded ? '0.7rem' : '0.6rem', color: 'var(--content-secondary)' }}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── SUBTABS ROW ── */}
            <div className={`subs-row${isExpanded ? ' expanded' : ''}`}>
              {expandedItem && (
                <>
                  <button className="sub-parent" onClick={closeExpand} style={{ cursor: 'pointer' }}>
                    <i className={`bi ${expandedItem.icon} text-xs`} />
                    {expandedItem.label}
                  </button>
                  <button className="sub-close" onClick={closeExpand} aria-label="Close subtabs">
                    <i className="bi bi-x-lg" />
                  </button>
                  <span className="sub-spacer" />
                  {expandedItem.subtabs?.map((sub, idx) => (
                    <span key={sub.id} style={{ display: 'contents' }}>
                      {idx > 0 && <span className="sub-sep"><i className="bi bi-chevron-right" /></span>}
                      <button
                        className={`sub-btn${activeSubtab === sub.id ? ' is-active' : ''}`}
                        style={{ '--i': idx } as React.CSSProperties}
                        onClick={() => handleSubtabClick(expandedItem.id, sub)}
                      >
                        {sub.label}
                      </button>
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <ThemeToggle />
            <div className="nav-divider" style={{ height: '28px', alignSelf: 'center' }} />
            <button className="search-trigger" onClick={openSearch}>
              <i className="bi bi-search" style={{ fontSize: '0.8rem' }} />
              {!isMobile && <span>Search</span>}
              {!isMobile && <span className="search-shortcut">⌘K</span>}
            </button>
          </div>

        </div>
      </nav>
    </>
  );
};

export default memo(Navbar);
