"use client";
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import SearchModal from './SearchModal';
import ThemeToggle from './ThemeToggle';
import { informationGrids, type InfoContentType } from '@/data/information-data';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeSubtab?: string;
  onSubtabClick?: (parentTabId: string, subtabId: string) => void;
  activeInfoContent?: InfoContentType;
  onInfoContentChange?: (content: InfoContentType) => void;
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

const NAV_ITEMS: NavItem[] = [
  {
    id: 'discover',
    label: 'Discover',
    icon: 'bi-rocket-takeoff',
    subtabs: [
      { id: 'discover-overview',     label: 'Overview',     sectionId: 'section-overview' },
      { id: 'discover-about',        label: 'About',        sectionId: 'section-about' },
      { id: 'discover-direction',    label: 'Direction',    sectionId: 'section-direction' },
      { id: 'discover-team',         label: 'Team',         sectionId: 'section-team' },
      { id: 'discover-governance',   label: 'Governance',   sectionId: 'section-governance' },
      { id: 'discover-affiliations', label: 'Affiliations', sectionId: 'section-affiliations' },
    ],
  },
  {
    id: 'information',
    label: 'Information',
    icon: 'bi-pin',
    subtabs: [
      { id: 'info-releases',     label: 'Releases' },
      { id: 'info-media',        label: 'Media' },
      { id: 'info-attributions', label: 'Attributions' },
      { id: 'info-licenses',     label: 'Licenses' },
      { id: 'info-terms',        label: 'Terms' },
      { id: 'info-policies',     label: 'Policies' },
      { id: 'info-disclaimer',   label: 'Disclaimer' },
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

// ── Shared dark-mode hook ──
function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    setDark(root.classList.contains('dark'));
    const obs = new MutationObserver(() => setDark(root.classList.contains('dark')));
    obs.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  const toggle = useCallback(() => {
    const root = document.documentElement;
    root.classList.toggle('dark');
    root.classList.toggle('light');
    setDark(prev => !prev);
  }, []);
  return { dark, toggle };
}

// ── Theme toggle — styled exactly like main nav tab buttons ──
const ThemeToggleTabBtn = ({ isMobile }: { isMobile: boolean }) => {
  const { dark, toggle } = useDarkMode();
  return (
    <div className="tab-item-border">
      <div className="tab-item">
        <button
          className="tab-label-btn"
          onClick={toggle}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{ padding: isMobile ? '11px 13px' : '11px 18px 11px 16px' }}
        >
          <i className={`bi ${dark ? 'bi-sun' : 'bi-moon'}`} style={{ fontSize: '0.85rem' }} />
          {!isMobile && <span>{dark ? 'Light' : 'Dark'}</span>}
        </button>
      </div>
    </div>
  );
};

// ── Hide-navbar button — styled exactly like main nav tab buttons ──
const HideNavTabBtn = ({
  isMobile,
  onClick,
}: {
  isMobile: boolean;
  onClick: () => void;
}) => (
  <div className="tab-item-border collapse-btn-desktop">
    <div className="tab-item">
      <button
        className="tab-label-btn collapse-btn-desktop"
        onClick={onClick}
        aria-label="Hide navigation bar"
        style={{ padding: isMobile ? '11px 13px' : '11px 18px 11px 16px' }}
      >
        <i className="bi bi-eye-slash" style={{ fontSize: '0.85rem' }} />
        {!isMobile && <span>Hide</span>}
      </button>
    </div>
  </div>
);

// ── Search button — styled exactly like main nav tab buttons ──
const SearchTabBtn = ({
  isMobile,
  onClick,
}: {
  isMobile: boolean;
  onClick: () => void;
}) => (
  <div className="tab-item-border">
    <div className="tab-item">
      <button
        className="tab-label-btn"
        onClick={onClick}
        aria-label="Open search"
        style={{ padding: isMobile ? '11px 13px' : '11px 18px 11px 16px' }}
      >
        <i className="bi bi-search" style={{ fontSize: '0.85rem' }} />
        {!isMobile && <span>Search</span>}
        {!isMobile && <span className="search-shortcut">⌘K</span>}
      </button>
    </div>
  </div>
);

// ── Sticky theme tab: purely CSS-driven toggle, zero React state ──
// Clicking directly mutates document.documentElement classes — React is never
// involved, so the tab-visible slide-in transition is never interrupted.
// Both icons and both text labels live in the DOM permanently; CSS rules
// keyed off :root.dark show/hide the correct one.
const StickyThemeTab = ({ visible, isMobile }: { visible: boolean; isMobile: boolean }) => {
  const handleClick = useCallback(() => {
    const root = document.documentElement;
    root.classList.toggle('dark');
    root.classList.toggle('light');
  }, []);

  return (
    <button
      className={`nav-theme-tab${visible ? ' tab-visible' : ''}`}
      onClick={handleClick}
      aria-label="Toggle light/dark mode"
    >
      <span className="sticky-theme-icon reveal-tab-icon" aria-hidden>
        <i className="bi bi-moon sticky-icon-moon" />
        <i className="bi bi-sun  sticky-icon-sun" />
      </span>
      {!isMobile && (
        <span className="sticky-theme-label">
          <span className="sticky-label-dark">Dark</span>
          <span className="sticky-label-light">Light</span>
        </span>
      )}
    </button>
  );
};

const NAVBAR_CSS = `
@keyframes orbitBorder {
  0%   { background-position: 0% 0%; }
  100% { background-position: 200% 0%; }
}

/* Light-mode overrides: keep navbar visually white while retaining glass blur/shadow */
:root.light .glass-navbar {
  background: linear-gradient(to bottom, #f8fafc 0%, #eef2f6 60%);
  border-bottom: 1px solid rgba(0,0,0,0.08);
}
:root.light .glass-navbar::before { display: none; }
@keyframes subIn {
  from { opacity:0; transform:translateX(10px); }
  to   { opacity:1; transform:translateX(0); }
}
@keyframes cardFadeUp {
  from { opacity:0; transform:translateY(10px); }
  to   { opacity:1; transform:translateY(0); }
}

.glass-navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 60;
  background: linear-gradient(160deg, #0a0a0f 0%, #0d0d14 60%, #080810 100%);
  backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255,255,255,0.07);
  box-shadow:
    0 8px 32px var(--glass-shadow-1), 0 12px 48px var(--glass-shadow-2),
    inset 0 1px 1px var(--glass-inset-top), inset 0 -1px 1px var(--glass-inset-bottom);
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease;
  will-change: transform, opacity;
}
.glass-navbar.nav-collapsed {
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
}
.glass-navbar::before {
  content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 1px;
  background: radial-gradient(600px circle at var(--mouse-x, 50%) 100%,
    rgba(0,255,166,0.9), rgba(255,215,0,0.7), rgba(236,72,153,0.7),
    rgba(147,51,234,0.6), rgba(59,130,246,0.5), transparent 70%);
  opacity: 0; transition: opacity 0.35s ease; pointer-events: none;
}
.glass-navbar:hover::before { opacity: 1; }

.logo-mark {
  display: flex; align-items: center; gap: 12px; user-select: none;
  border: none; background: transparent; padding: 0; cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.34,1.18,0.64,1);
}
.logo-mark:hover { transform: scale(1.08); }
.logo-mark:active { transform: scale(1.02); }
.logo-icon {
  width: 42px; height: 42px; border-radius: 10px;
  background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 60%, #111 100%);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  box-shadow: 0 0 14px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08);
  overflow: hidden;
}
.logo-icon svg { width: 20px; height: 20px; fill: rgba(255,255,255,0.92); }
.logo-text { font-size: 1.18rem; font-weight: 800; letter-spacing: -0.03em; color: var(--content-primary); line-height: 1; }

.nav-reveal-tab,
.nav-theme-tab {
  position: fixed; right: 0; z-index: 59;
  display: flex; align-items: center; gap: 7px;
  padding: 9px 14px 9px 12px;
  border-radius: 10px 0 0 10px;
  background: var(--glass-bg, rgba(15,15,15,0.85));
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color); border-right: none;
  color: var(--content-faint); font-size: 0.8rem; font-weight: 600;
  letter-spacing: 0.02em; cursor: pointer;
  box-shadow: -4px 4px 24px rgba(0,0,0,0.25);
  opacity: 0; pointer-events: none; transform: translateX(100%);
  transition:
    opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.38s cubic-bezier(0.34, 1.18, 0.64, 1),
    color 0.15s ease, box-shadow 0.2s ease;
}
.nav-reveal-tab { top: 16px; }
.nav-theme-tab  { top: calc(16px + 38px + 6px); }
.nav-reveal-tab,
.nav-theme-tab  { min-width: 118px; justify-content: flex-start; }
.nav-reveal-tab.tab-visible,
.nav-theme-tab.tab-visible  { opacity: 1; pointer-events: auto; transform: translateX(0); }
/* transition-delay removed — caused slide transition to re-run on every render */
.nav-reveal-tab:hover,
.nav-theme-tab:hover { color: var(--content-primary); box-shadow: -6px 4px 28px rgba(0,0,0,0.35); }
.nav-reveal-tab:hover .reveal-tab-icon,
.nav-theme-tab:hover  .reveal-tab-icon { transform: translateX(-2px); }
.reveal-tab-icon { font-size: 0.82rem; transition: transform 0.2s cubic-bezier(0.34,1.18,0.64,1); }

/* ── Sticky theme tab: CSS-only icon + label toggling ── */
.sticky-theme-icon { position: relative; display: inline-flex; width: 0.9rem; height: 0.9rem; font-size: 0.9rem; flex-shrink: 0; }
.sticky-icon-moon,
.sticky-icon-sun  { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; transition: opacity 0.18s ease; }
/* default (dark mode): show sun, hide moon */
.sticky-icon-moon { opacity: 1; }
.sticky-icon-sun  { opacity: 0; }
:root.dark .sticky-icon-moon { opacity: 0; }
:root.dark .sticky-icon-sun  { opacity: 1; }
/* label: both always in DOM, opacity-swap — display:none causes reflow which
   re-triggers the parent button's opacity/transform transitions (the visible flash) */
.sticky-theme-label { position: relative; display: inline-block; min-width: 2.6rem; }
.sticky-label-dark,
.sticky-label-light { transition: opacity 0.18s ease; }
.sticky-label-dark  { opacity: 1; position: relative; }
.sticky-label-light { opacity: 0; position: absolute; left: 0; top: 0; pointer-events: none; }
:root.dark .sticky-label-dark  { opacity: 0; pointer-events: none; }
:root.dark .sticky-label-light { opacity: 1; pointer-events: auto; }
.nav-reveal-tab::before,
.nav-theme-tab::before {
  content: ''; position: absolute; left: 0; top: 4px; bottom: 4px; width: 2.5px;
  border-radius: 999px;
  background: linear-gradient(180deg,
    rgba(220,20,60,1) 0%, rgba(200,15,50,0.9) 50%, rgba(180,10,40,0.75) 100%);
  opacity: 0.9;
  box-shadow: 0 0 6px rgba(220,20,60,0.6);
}

.nav-divider {
  width: 1px;
  background: linear-gradient(to bottom, transparent, var(--border-color), transparent);
  margin: 0 4px; flex-shrink: 0;
}

.nav-center {
  position: relative; flex: 1; min-width: 0;
  display: flex; align-items: center;
  overflow: visible;
}

.tabs-row {
  display: flex; align-items: center; gap: 12px; width: 100%;
  transition: opacity 0.2s ease, transform 0.22s ease; pointer-events: auto;
}
.tabs-row.expanded { opacity: 0; transform: translateX(-16px); }
.tabs-row.expanded .tab-label-btn { pointer-events: none; }

.subs-row {
  position: absolute; left: 0; top: 50%;
  transform: translateY(-50%) translateX(20px);
  width: 100%;
  display: flex; align-items: center;
  opacity: 0; pointer-events: none;
  transition: opacity 0.22s ease, transform 0.24s ease;
  white-space: nowrap;
  overflow: visible;
  z-index: 10;
}
.subs-row.expanded { opacity: 1; transform: translateY(-50%) translateX(0); pointer-events: auto; }

.nav-right-controls {
  display: flex; align-items: center; gap: 8px;
  flex-shrink: 0; margin-left: auto;
  position: relative; z-index: 20;
  transition: opacity 0.2s ease, visibility 0.2s ease;
}
.nav-right-controls.controls-hidden {
  opacity: 0; visibility: hidden; pointer-events: none;
}

.tab-item-border {
  display: inline-flex; flex-shrink: 0;
  border-radius: 10.5px;
  padding: 1px;
  position: relative;
  background: transparent;
}
.tab-item-border::before {
  content: '';
  position: absolute; inset: 0;
  border-radius: 10.5px;
  background: linear-gradient(90deg,
    rgba(0,255,166,0.0) 0%, rgba(0,255,166,0.9) 15%,
    rgba(255,215,0,0.7) 30%, rgba(236,72,153,0.7) 45%,
    rgba(147,51,234,0.7) 60%, rgba(59,130,246,0.6) 75%,
    rgba(0,255,166,0.0) 90%);
  background-size: 200% 100%;
  animation: orbitBorder 3s linear infinite;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}
.tab-item-border:hover::before,
.tab-item-border.is-active::before { opacity: 1; }

.tab-item {
  display: inline-flex; align-items: stretch; border-radius: 9.5px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 var(--glass-inset-top);
  transition: box-shadow 0.2s ease; flex-shrink: 0;
  background: var(--navbar-bg, #0f0f0f);
  position: relative; width: 100%; z-index: 1;
}
.tab-item-border:hover .tab-item {
  box-shadow: 0 4px 14px rgba(0,0,0,0.26), inset 0 1px 0 var(--glass-inset-top);
}
.tab-item.is-active { background: var(--navbar-bg-active, #1a1a1a); }
.dark .tab-item:not(.is-active) {
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.18), inset 0 1px 0 var(--glass-inset-top);
  transition: box-shadow 0.25s ease;
}

:root.light .tab-item {
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1);
  outline: 1px solid rgba(0,0,0,0.11);
}
:root.light .tab-item.is-active {
  background: #f5f5f5;
  box-shadow: 0 2px 8px rgba(0,0,0,0.13), 0 5px 20px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.8);
  outline: 1px solid rgba(0,0,0,0.15);
}
:root.light .tab-item-border:hover .tab-item {
  box-shadow: 0 4px 12px rgba(0,0,0,0.14), 0 8px 24px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,1);
  outline: 1px solid rgba(0,0,0,0.15);
}

.tab-label-btn {
  display: inline-flex; align-items: center; gap: 7px; border: none; background: transparent;
  cursor: pointer; font-weight: 500; letter-spacing: 0.01em; color: var(--content-faint);
  padding: 11px 18px 11px 20px; font-size: 0.97rem; line-height: 1;
  transition: color 0.15s ease; user-select: none;
}
.tab-label-btn:hover, .tab-label-btn.is-active { color: var(--content-primary); }
.tab-label-btn.is-active { font-weight: 600; }

.tab-sep {
  width: 1px; margin: 6px 0; background: var(--border-color); opacity: 0.45;
  flex-shrink: 0; pointer-events: none;
}

.tab-arrow-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 36px; border: none; background: transparent; cursor: pointer;
  color: var(--content-faint); transition: color 0.15s ease, background 0.15s ease;
  flex-shrink: 0; padding: 0; border-radius: 0 8px 8px 0;
}
.tab-arrow-btn:hover { color: var(--content-primary); background: rgba(255,255,255,0.12); }
.tab-arrow-btn.active-arrow { color: var(--content-primary); background: rgba(255,255,255,0.16); }
.tab-arrow-btn.info-expand-hint { color: rgba(0,0,0,0.7); }
.tab-arrow-btn.info-expand-hint:hover { color: rgba(0,0,0,0.95); background: rgba(255,255,255,0.12); box-shadow: 0 8px 20px rgba(0,0,0,0.12); }

.sub-parent {
  display: inline-flex; align-items: center; gap: 6px; font-size: 0.96rem;
  font-weight: 700; letter-spacing: -0.01em; color: var(--content-primary);
  padding: 8px 10px 8px 6px; border: none; background: transparent;
  flex-shrink: 0; user-select: none; cursor: pointer;
}
.sub-close {
  display: inline-flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; border-radius: 6px; border: none; background: transparent;
  color: var(--content-faint); font-size: 0.65rem; cursor: pointer;
  flex-shrink: 0; transition: color 0.15s ease, background 0.15s ease; margin-left: -4px;
}
.sub-close:hover { color: var(--content-primary); background: var(--hover-bg-strong); }
.sub-spacer { width: 12px; flex-shrink: 0; }
.sub-sep {
  display: inline-flex; align-items: center; color: var(--content-secondary);
  font-size: 0.66rem; margin: 0 1px; flex-shrink: 0; opacity: 0.55; user-select: none;
}
.sub-btn {
  display: inline-flex; align-items: center; padding: 8px 13px; font-size: 0.92rem;
  font-weight: 500; color: var(--content-faint); border-radius: 8px; border: none;
  background: transparent; cursor: pointer; flex-shrink: 0;
  transition: color 0.12s ease, background 0.12s ease;
}
.sub-btn:hover { color: var(--content-primary); background: var(--hover-bg-strong); transform: translateY(-1px); }
.sub-btn.is-active { color: var(--content-primary); font-weight: 600; background: var(--hover-bg-strong); position: relative; }
.sub-btn.is-active::after {
  content: ''; position: absolute; bottom: 3px; left: 12px; right: 12px;
  height: 1.5px; border-radius: 999px; background: rgba(0,255,166,0.75);
}
.subs-row.expanded .sub-btn {
  animation: subIn 0.24s cubic-bezier(0.34,1.18,0.64,1) both;
  animation-delay: calc(var(--i, 0) * 0.04s);
}

.search-shortcut {
  display: inline-flex; align-items: center; padding: 2px 6px; border-radius: 5px;
  font-size: 0.72rem; font-weight: 600; color: var(--content-faint);
  background: var(--hover-bg); border: 1px solid var(--border-color);
  opacity: 0.7; letter-spacing: 0.03em; margin-left: 2px;
}

@media (max-width: 640px) {
  .nav-center, .nav-divider.desktop-only { display: none; }
  .tab-sep, .tab-arrow-btn { display: none; }
  .tab-label-btn { padding: 6px 11px; font-size: 0.84rem; }
  .collapse-btn-desktop { display: none !important; }
  .nav-reveal-tab { top: 12px; padding: 7px 11px 7px 10px; font-size: 0.74rem; }
  .nav-theme-tab  { top: calc(12px + 34px + 5px); padding: 7px 11px 7px 10px; font-size: 0.74rem; }
}

.mobile-burger {
  display: none; align-items: center; justify-content: center;
  width: 42px; height: 42px; border-radius: 10px;
  border: none; background: transparent; color: var(--content-faint);
  font-size: 1.2rem; cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease;
  flex-shrink: 0; margin-left: auto;
}
.mobile-burger:hover { color: var(--content-primary); background: var(--hover-bg); }
@media (max-width: 640px) { .mobile-burger { display: inline-flex; } }

.mob-overlay {
  position: fixed; inset: 0; z-index: 90;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
  opacity: 0; pointer-events: none; transition: opacity 0.25s ease;
}
.mob-overlay.open { opacity: 1; pointer-events: auto; }
.mob-sidebar {
  position: fixed; top: 0; right: 0; bottom: 0; width: min(320px, 85vw); z-index: 91;
  background: var(--surface-secondary); border-left: 1px solid var(--border-color);
  box-shadow: -8px 0 32px rgba(0,0,0,0.3); display: flex; flex-direction: column;
  transform: translateX(100%); transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto; -webkit-overflow-scrolling: touch;
}
.mob-sidebar.open { transform: translateX(0); }
.mob-header { display: flex; align-items: center; gap: 12px; padding: 18px 20px; border-bottom: 1px solid var(--border-color); flex-shrink: 0; }
.mob-header-title { font-size: 1rem; font-weight: 700; color: var(--content-primary); letter-spacing: -0.01em; }
.mob-close { margin-left: auto; display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 8px; border: none; background: transparent; color: var(--content-faint); font-size: 0.9rem; cursor: pointer; transition: color 0.12s ease, background 0.12s ease; }
.mob-close:hover { color: var(--content-primary); background: var(--hover-bg-strong); }
.mob-search { display: flex; align-items: center; gap: 10px; margin: 12px 16px; padding: 11px 14px; border-radius: 10px; background: var(--hover-bg); border: 1px solid var(--border-color); cursor: pointer; transition: background 0.12s ease; flex-shrink: 0; }
.mob-search:hover { background: var(--hover-bg-strong); }
.mob-search i { color: var(--content-faint); font-size: 0.93rem; }
.mob-search span { color: var(--content-faint); font-size: 0.93rem; font-weight: 500; }
.mob-nav-list { display: flex; flex-direction: column; padding: 8px 0; flex: 1; }
.mob-tab-btn { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 15px 20px; border: none; background: transparent; color: var(--content-faint); font-size: 1rem; font-weight: 500; cursor: pointer; transition: color 0.12s ease, background 0.12s ease; user-select: none; }
.mob-tab-btn:hover { color: var(--content-primary); background: var(--hover-bg); }
.mob-tab-btn.is-active { color: var(--content-primary); font-weight: 600; background: var(--hover-bg-strong); }
.mob-tab-left { display: flex; align-items: center; gap: 10px; }
.mob-tab-left i { font-size: 0.92rem; width: 20px; text-align: center; }
.mob-tab-chevron { font-size: 0.65rem; transition: transform 0.2s ease; color: var(--content-faint); }
.mob-tab-chevron.open { transform: rotate(90deg); }
.mob-subtabs { overflow: hidden; transition: max-height 0.25s ease, opacity 0.2s ease; }
.mob-subtabs.collapsed { max-height: 0; opacity: 0; }
.mob-subtabs.expanded { max-height: 300px; opacity: 1; }
.mob-subtab-btn { display: flex; align-items: center; gap: 8px; width: 100%; padding: 12px 20px 12px 50px; border: none; background: transparent; color: var(--content-faint); font-size: 0.93rem; font-weight: 400; cursor: pointer; transition: color 0.12s ease, background 0.12s ease; user-select: none; }
.mob-subtab-btn:hover { color: var(--content-primary); background: var(--hover-bg); }
.mob-subtab-btn.is-active { color: var(--content-primary); font-weight: 600; position: relative; }
.mob-subtab-btn.is-active::before { content: ''; position: absolute; left: 36px; top: 50%; transform: translateY(-50%); width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.8); }

.info-hub-outer {
  display: grid; grid-template-rows: 0fr; opacity: 0; pointer-events: none;
  border-top: 1px solid transparent;
  transition: grid-template-rows 0.42s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, border-top-color 0.35s ease;
}
.info-hub-outer.hub-visible { grid-template-rows: 1fr; opacity: 1; border-top-color: var(--border-color); pointer-events: auto; }
.info-hub-clip { overflow: hidden; min-height: 0; }
.info-hub-expanded { overflow: hidden; transition: max-height 0.44s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease; }
.info-hub-expanded.state-hidden { max-height: 0; opacity: 0; pointer-events: none; }
.info-hub-expanded.state-visible { max-height: 320px; opacity: 1; pointer-events: auto; }
.info-hub-grid { display: flex; justify-content: center; }
.info-hub-card {
  position: relative; display: flex; flex-direction: column;
  padding: 24px 22px 26px; border: none; background: transparent;
  cursor: pointer; text-align: left; overflow: hidden;
  border-right: 1px solid var(--border-color); transition: background 0.18s ease;
}
.info-hub-card:last-child { border-right: none; }
.info-hub-card:hover:not(.card-active) { background: rgba(255,255,255,0.025); }
.info-hub-card.card-active { background: rgba(255,255,255,0.03); }
.card-hover-spot {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(180px circle at var(--cx,50%) var(--cy,50%), rgba(255,255,255,0.04), transparent 70%);
  opacity: 0; transition: opacity 0.18s ease; z-index: 1;
}
.info-hub-card:not(.card-active):hover .card-hover-spot { opacity: 1; }
.card-content { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 5px; }
.info-hub-card-icon { font-size: 1.6rem; margin-bottom: 5px; color: var(--content-secondary); transition: color 0.18s ease, transform 0.26s cubic-bezier(0.34,1.56,0.64,1); }
.info-hub-card.card-active .info-hub-card-icon { color: var(--content-primary); transform: translateY(-3px); }
.info-hub-card-title { font-size: 0.93rem; font-weight: 700; letter-spacing: 0.01em; line-height: 1.2; color: var(--content-secondary); transition: color 0.18s ease, transform 0.26s cubic-bezier(0.34,1.56,0.64,1); }
.info-hub-card.card-active .info-hub-card-title { color: var(--content-primary); transform: translateY(-3px); }
.info-hub-card-desc { font-size: 0.79rem; line-height: 1.5; color: var(--content-muted); transition: color 0.18s ease, transform 0.26s cubic-bezier(0.34,1.56,0.64,1); }
.info-hub-card.card-active .info-hub-card-desc { color: var(--content-primary); transform: translateY(-3px); }
.info-hub-expanded.state-visible .info-hub-card {
  animation: cardFadeUp 0.32s cubic-bezier(0.34,1.18,0.64,1) both;
  animation-delay: calc(var(--ci, 0) * 0.045s + 0.06s);
}
.info-hub-slim { overflow: hidden; transition: max-height 0.38s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease; }
.info-hub-slim.state-hidden { max-height: 0; opacity: 0; pointer-events: none; }
.info-hub-slim.state-visible { max-height: 58px; opacity: 1; pointer-events: auto; }
.info-hub-slim-inner { display: flex; align-items: stretch; overflow-x: auto; scrollbar-width: none; height: 54px; border-right: 1px solid var(--border-color); }
.info-hub-slim-inner::-webkit-scrollbar { display: none; }
.info-slim-label { display: flex; align-items: center; gap: 7px; padding: 0 40px; flex-shrink: 0; border-right: 1px solid var(--border-color); min-width: 210px; }
.info-slim-label span { font-size: 0.74rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--content-muted); white-space: nowrap; }
.info-slim-tab {
  position: relative; display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  padding: 0 20px; border: none; background: transparent;
  color: var(--content-muted); font-size: 0.89rem; font-weight: 500;
  cursor: pointer; flex-shrink: 0; white-space: nowrap;
  transition: color 0.14s ease, background 0.14s ease;
  min-width: 148px; border-right: 1px solid var(--border-color); letter-spacing: 0.01em;
}
.info-slim-tab:hover { color: var(--content-primary); background: rgba(255,255,255,0.04); }
.info-slim-tab.slim-active { color: var(--content-primary); background: rgba(255,255,255,0.03); font-weight: 700; }
.info-slim-tab.slim-active::after {
  content: ''; position: absolute; bottom: 0; left: 14px; right: 14px; height: 2px; border-radius: 999px;
  background: linear-gradient(90deg, transparent 0%, rgba(0,255,166,0.8) 15%, rgba(255,215,0,0.6) 30%, rgba(236,72,153,0.6) 45%, rgba(147,51,234,0.6) 60%, rgba(59,130,246,0.5) 75%, transparent 90%);
  background-size: 200% 100%; animation: orbitBorder 2.5s linear infinite;
}
:root.light .info-hub-card.card-active,
:root.light .info-slim-tab.slim-active { background: #000000; color: #ffffff; }
:root.light .info-hub-card.card-active .info-hub-card-icon,
:root.light .info-hub-card.card-active .info-hub-card-title,
:root.light .info-hub-card.card-active .info-hub-card-desc { color: #ffffff; }
.info-slim-expand {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0 20px; border: none; background: transparent;
  color: var(--content-muted); cursor: pointer; flex-shrink: 0;
  transition: color 0.14s ease, background 0.14s ease;
  border-left: 1px solid var(--border-color); margin-left: auto;
}
.info-slim-expand:hover { color: var(--content-primary); background: rgba(255,255,255,0.03); }
.info-slim-expand i { transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.info-slim-expand:hover i { transform: translateY(-2px); }

@media (max-width: 640px) {
  .info-hub-grid { grid-template-columns: repeat(2, 1fr); }
  .info-hub-card { padding: 18px 15px 20px; }
  .info-hub-card-icon { font-size: 1.3rem; }
  .info-hub-card-desc { display: none; }
  .info-hub-expanded.state-visible { max-height: 400px; }
  .info-slim-label { padding: 0 14px; min-width: auto; }
  .info-slim-tab { padding: 0 14px; font-size: 0.82rem; }
  .info-slim-expand { padding: 0 15px; }
}
`;

const Navbar = ({
  activeTab,
  setActiveTab,
  activeSubtab,
  onSubtabClick,
  activeInfoContent,
  onInfoContentChange,
}: NavbarProps) => {
  const [isMobile, setIsMobile]                   = useState(false);
  const [searchOpen, setSearchOpen]               = useState(false);
  const [expandedTab, setExpandedTab]             = useState<string | null>(null);
  const [mobileOpen, setMobileOpen]               = useState(false);
  const [mobileExpandedTab, setMobileExpandedTab] = useState<string | null>(null);
  const [hubExpanded, setHubExpanded]             = useState(true);
  const [navCollapsed, setNavCollapsed]           = useState(false);
  const { dark: isDark, toggle: toggleDark } = useDarkMode();

  const navContainerRef  = useRef<HTMLDivElement>(null);
  const rafIdRef         = useRef<number | null>(null);
  const autoCloseRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabClickCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabClickOpenRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoExpandedRef  = useRef(false);
  const touchRef         = useRef<{ startX: number; startY: number } | null>(null);
  const lastScrollYRef   = useRef(0);
  const scrollRafRef     = useRef<number | null>(null);
  const navCollapsedRef  = useRef(false);

  const isInfoActive = activeTab === 'information';
  const isExpanded   = expandedTab !== null;

  const handleCollapseNav = useCallback(() => {
    setNavCollapsed(true);
    navCollapsedRef.current = true;
    setExpandedTab(null);

    let hasScrolledAway = window.scrollY > 10;
    const restore = () => {
      if (!hasScrolledAway) {
        if (window.scrollY > 10) hasScrolledAway = true;
        return;
      }
      if (window.scrollY <= 10) {
        setNavCollapsed(false);
        navCollapsedRef.current = false;
        window.removeEventListener('scroll', restore);
      }
    };
    window.addEventListener('scroll', restore, { passive: true });
  }, []);

  const handleShowNav = useCallback(() => {
    setNavCollapsed(false);
    navCollapsedRef.current = false;
  }, []);

  useEffect(() => {
    if (isInfoActive) setHubExpanded(true);
  }, [isInfoActive]);

  useEffect(() => {
    if (!isInfoActive) return;
    lastScrollYRef.current = window.scrollY;
    const onScroll = () => {
      if (scrollRafRef.current !== null) return;
      scrollRafRef.current = requestAnimationFrame(() => {
        scrollRafRef.current = null;
        const y = window.scrollY;
        if (y > 40 && y > lastScrollYRef.current) setHubExpanded(false);
        lastScrollYRef.current = y;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollRafRef.current !== null) cancelAnimationFrame(scrollRafRef.current);
    };
  }, [isInfoActive]);

  useEffect(() => {
    if (!isInfoActive || !hubExpanded) return;
    const onClickOutside = (e: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node))
        setHubExpanded(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [isInfoActive, hubExpanded]);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const check = () => { clearTimeout(t); t = setTimeout(() => setIsMobile(window.innerWidth < 640), 150); };
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener('resize', check); };
  }, []);

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
    return () => {
      document.removeEventListener('mousemove', onMove);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const toggleExpand = useCallback((tabId: string) => {
    if (tabClickCloseRef.current) { clearTimeout(tabClickCloseRef.current); tabClickCloseRef.current = null; }
    if (tabClickOpenRef.current)  { clearTimeout(tabClickOpenRef.current);  tabClickOpenRef.current  = null; }
    setExpandedTab(prev => prev === tabId ? null : tabId);
  }, []);

  const closeExpand = useCallback(() => {
    if (tabClickCloseRef.current) { clearTimeout(tabClickCloseRef.current); tabClickCloseRef.current = null; }
    if (tabClickOpenRef.current)  { clearTimeout(tabClickOpenRef.current);  tabClickOpenRef.current  = null; }
    setExpandedTab(null);
  }, []);

  useEffect(() => {
    if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
    if (expandedTab && !autoExpandedRef.current)
      autoCloseRef.current = setTimeout(() => setExpandedTab(null), 10_000);
    if (!expandedTab) autoExpandedRef.current = false;
    return () => { if (autoCloseRef.current) clearTimeout(autoCloseRef.current); };
  }, [expandedTab]);

  useEffect(() => () => {
    if (tabClickCloseRef.current) clearTimeout(tabClickCloseRef.current);
    if (tabClickOpenRef.current)  clearTimeout(tabClickOpenRef.current);
  }, []);

  const handleTabClick = useCallback((tabId: string) => {
    const isNewTab = tabId !== activeTab;
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (isNewTab) {
      if (tabClickOpenRef.current)  { clearTimeout(tabClickOpenRef.current);  tabClickOpenRef.current  = null; }
      if (tabClickCloseRef.current) { clearTimeout(tabClickCloseRef.current); tabClickCloseRef.current = null; }
      const navItem = NAV_ITEMS.find(i => i.id === tabId);
      if (navItem?.subtabs?.length && tabId !== 'information') {
        tabClickOpenRef.current = setTimeout(() => {
          tabClickOpenRef.current = null;
          autoExpandedRef.current = true;
          setExpandedTab(tabId);
          tabClickCloseRef.current = setTimeout(() => {
            setExpandedTab(prev => prev === tabId ? null : prev);
            tabClickCloseRef.current = null;
          }, 3000);
        }, 3000);
      }
    }
  }, [setActiveTab, activeTab]);

  const handleSubtabClick = useCallback((parentTabId: string, sub: SubtabItem) => {
    setActiveTab(parentTabId);
    onSubtabClick?.(parentTabId, sub.id);
    if (sub.sectionId) {
      requestAnimationFrame(() =>
        document.getElementById(sub.sectionId!)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      );
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [setActiveTab, onSubtabClick]);

  const handleInfoCardClick = useCallback((content: InfoContentType) => {
    onInfoContentChange?.(content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onInfoContentChange]);

  const handleInfoArrowClick = useCallback(() => {
    if (isInfoActive) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setHubExpanded(true);
    } else {
      toggleExpand('information');
    }
  }, [isInfoActive, toggleExpand]);

  const openSearch  = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(p => !p); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSearchNavigate = useCallback((tabId: string, subtabId?: string) => {
    setActiveTab(tabId);
    if (subtabId) onSubtabClick?.(tabId, subtabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setActiveTab, onSubtabClick]);

  const openMobile      = useCallback(() => setMobileOpen(true), []);
  const closeMobile     = useCallback(() => { setMobileOpen(false); setMobileExpandedTab(null); }, []);
  const toggleMobileTab = useCallback((id: string) => setMobileExpandedTab(p => p === id ? null : id), []);

  const handleMobileTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId); setMobileOpen(false); setMobileExpandedTab(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setActiveTab]);

  const handleMobileSubtabClick = useCallback((parentTabId: string, sub: SubtabItem) => {
    setActiveTab(parentTabId); onSubtabClick?.(parentTabId, sub.id);
    setMobileOpen(false); setMobileExpandedTab(null);
    if (sub.sectionId) {
      requestAnimationFrame(() =>
        document.getElementById(sub.sectionId!)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      );
    } else window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setActiveTab, onSubtabClick]);

  const handleMobileSearch = useCallback(() => { setMobileOpen(false); setSearchOpen(true); }, []);

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

  const activeSet = useMemo(() => {
    const set = new Set<string>();
    for (const item of NAV_ITEMS) {
      if (activeTab === item.id) { set.add(item.id); continue; }
      if (activeSubtab && item.subtabs?.some(s => s.id === activeSubtab)) set.add(item.id);
    }
    return set;
  }, [activeTab, activeSubtab]);

  const expandedItem = useMemo(() => NAV_ITEMS.find(i => i.id === expandedTab) ?? null, [expandedTab]);

  const barStyle = useMemo(() => ({
    height: isMobile ? '68px' : '84px',
    paddingLeft:  isMobile ? '16px' : '36px',
    paddingRight: isMobile ? '16px' : '36px',
    gap: isMobile ? '10px' : '16px',
  }), [isMobile]);

  const labelFontStyle = useMemo(() => ({ fontSize: isMobile ? '0.84rem' : '0.97rem' }), [isMobile]);

  return (
    <>
      <style>{NAVBAR_CSS}</style>
      <SearchModal isOpen={searchOpen} onClose={closeSearch} onNavigate={handleSearchNavigate} />

      {/* ══ STICKY REVEAL TAB ══ */}
      <button
        className={`nav-reveal-tab${navCollapsed ? ' tab-visible' : ''}`}
        onClick={handleShowNav}
        aria-label="Show navigation bar"
      >
        <i className="bi bi-eye reveal-tab-icon" style={{ fontSize: '0.9rem' }} />
        {!isMobile && <span>Show Nav</span>}
      </button>

      {/* ══ STICKY THEME TOGGLE TAB ══ */}
      <StickyThemeTab visible={navCollapsed} isMobile={isMobile} />

      <nav ref={navContainerRef} className={`glass-navbar${navCollapsed ? ' nav-collapsed' : ''}`}>

        {/* ══ MAIN BAR ROW ══ */}
        <div className="w-full flex items-center" style={barStyle}>

          <button
            className="logo-mark flex-shrink-0"
            onClick={() => { handleTabClick('home'); closeExpand(); }}
            aria-label="Go to home page"
          >
            <div className="logo-icon">
              <Image src="/assets/Notus-Regalia-logo.svg" alt="Notus Regalia" width={42} height={42} priority />
            </div>
            <div
              className="logo-text"
              style={{ fontSize: isMobile ? '0.95rem' : undefined, letterSpacing: 'normal', textTransform: 'none', margin: 0 }}
            >
              Notus <span style={{ color: '#EB1143', fontWeight: 300 }}>Regalia</span>
            </div>
          </button>

          <div className="nav-divider desktop-only" style={{ height: '32px', alignSelf: 'center' }} />

          <div className="nav-center">
            <div className={`tabs-row${isExpanded ? ' expanded' : ''}`}>
              {NAV_ITEMS.map((item) => {
                const active       = activeSet.has(item.id);
                const thisExpanded = expandedTab === item.id;
                const isInfoItem   = item.id === 'information';
                return (
                  <div key={item.id} className={`tab-item-border${active ? ' is-active' : ''}`}>
                    <div className={`tab-item${active ? ' is-active' : ''}`}>
                      <button
                        className={`tab-label-btn${active ? ' is-active' : ''}`}
                        onClick={() => { if (thisExpanded && !isInfoItem) closeExpand(); else handleTabClick(item.id); }}
                        style={labelFontStyle}
                      >
                        <i className={`bi ${item.icon} text-xs`} />
                        {item.label}
                      </button>
                      <span className="tab-sep" />
                      <button
                        className={[
                          'tab-arrow-btn',
                          thisExpanded && !isInfoItem ? 'active-arrow' : '',
                          isInfoItem && isInfoActive && !hubExpanded ? 'info-expand-hint' : '',
                        ].filter(Boolean).join(' ')}
                        onClick={() => isInfoItem ? handleInfoArrowClick() : toggleExpand(item.id)}
                        aria-label={
                          isInfoItem
                            ? (hubExpanded ? 'Collapse Info Hub' : 'Expand Info Hub cards')
                            : (thisExpanded ? `Close ${item.label} sections` : `Show ${item.label} sections`)
                        }
                      >
                        <i
                          className={`bi ${thisExpanded && !isInfoItem ? 'bi-x-lg' : 'bi-chevron-right'}`}
                          style={{
                            fontSize: '0.65rem',
                            color: isInfoItem && isInfoActive && !hubExpanded
                              ? 'rgba(255,255,255,0.75)'
                              : 'var(--content-secondary)',
                            transition: 'color 0.2s ease',
                          }}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={`subs-row${isExpanded ? ' expanded' : ''}`}>
              {expandedItem && (
                <>
                  <button className="sub-parent" onClick={closeExpand}>
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

          {/* ── RIGHT CONTROLS ── */}
          <div className={`nav-right-controls${isExpanded ? ' controls-hidden' : ''}`}>
            <ThemeToggleTabBtn isMobile={isMobile} />
            <HideNavTabBtn isMobile={isMobile} onClick={handleCollapseNav} />
            <SearchTabBtn isMobile={isMobile} onClick={openSearch} />
            <button className="mobile-burger" onClick={openMobile} aria-label="Open menu">
              <i className="bi bi-list" />
            </button>
          </div>
        </div>

        {/* ══ INFORMATION HUB EXTENSION ══ */}
        <div className={`info-hub-outer${isInfoActive ? ' hub-visible' : ''}`}>
          <div className="info-hub-clip">
            <div className={`info-hub-expanded${hubExpanded ? ' state-visible' : ' state-hidden'}`}>
              <div className="info-hub-grid">
                {informationGrids.map((grid, idx) => {
                  const isActive = activeInfoContent === grid.id;
                  return (
                    <button
                      key={grid.id}
                      className={`info-hub-card${isActive ? ' card-active' : ''}`}
                      style={{ '--ci': idx } as React.CSSProperties}
                      onClick={() => handleInfoCardClick(grid.id)}
                      onMouseMove={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        e.currentTarget.style.setProperty('--cx', `${e.clientX - r.left}px`);
                        e.currentTarget.style.setProperty('--cy', `${e.clientY - r.top}px`);
                      }}
                    >
                      <span className="card-hover-spot" aria-hidden />
                      <span className="card-content">
                        <i className={`bi ${grid.icon} info-hub-card-icon`} />
                        <span className="info-hub-card-title">{grid.title}</span>
                        <span className="info-hub-card-desc">{grid.description}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={`info-hub-slim${!hubExpanded ? ' state-visible' : ' state-hidden'}`}>
              <div className="info-hub-slim-inner">
                <div className="info-slim-label" style={{ color: 'var(--content-muted)' }}>
                  <i className="bi bi-pin" style={{ fontSize: '0.76rem', color: 'currentColor' }} />
                  <span>Info Hub</span>
                </div>
                {informationGrids.map((grid) => {
                  const isActive = activeInfoContent === grid.id;
                  return (
                    <button
                      key={grid.id}
                      className={`info-slim-tab${isActive ? ' slim-active' : ''}`}
                      onClick={() => handleInfoCardClick(grid.id)}
                    >
                      <i className={`bi ${grid.icon}`} style={{ fontSize: '0.81rem' }} />
                      {grid.title}
                    </button>
                  );
                })}
                <button
                  className="info-slim-expand"
                  onClick={() => setHubExpanded(true)}
                  aria-label="Expand Info Hub"
                  title="Expand Info Hub"
                >
                  <i className="bi bi-chevron-down" style={{ fontSize: '0.74rem' }} />
                </button>
              </div>
            </div>
          </div>
        </div>

      </nav>

      {/* MOBILE SIDEBAR */}
      <div className={`mob-overlay${mobileOpen ? ' open' : ''}`} onClick={closeMobile} />
      <div
        className={`mob-sidebar${mobileOpen ? ' open' : ''}`}
        onTouchStart={onSidebarTouchStart}
        onTouchEnd={onSidebarTouchEnd}
      >
        <div className="mob-header">
          <span className="mob-header-title">Menu</span>
          <ThemeToggle />
          <button className="mob-close" onClick={closeMobile} aria-label="Close menu">
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <div className="mob-search" onClick={handleMobileSearch}>
          <i className="bi bi-search" />
          <span>Search…</span>
        </div>
        <div className="mob-nav-list">
          {NAV_ITEMS.map(item => {
            const active        = activeSet.has(item.id);
            const isTabExpanded = mobileExpandedTab === item.id;
            const hasSubtabs    = !!(item.subtabs?.length);
            return (
              <div key={item.id}>
                <button
                  className={`mob-tab-btn${active ? ' is-active' : ''}`}
                  onClick={() => hasSubtabs ? toggleMobileTab(item.id) : handleMobileTabClick(item.id)}
                >
                  <span className="mob-tab-left">
                    <i className={`bi ${item.icon}`} />
                    {item.label}
                  </span>
                  {hasSubtabs && (
                    <i className={`bi bi-chevron-right mob-tab-chevron${isTabExpanded ? ' open' : ''}`} />
                  )}
                </button>
                {hasSubtabs && (
                  <div className={`mob-subtabs ${isTabExpanded ? 'expanded' : 'collapsed'}`}>
                    <button
                      className={`mob-subtab-btn${active && !activeSubtab ? ' is-active' : ''}`}
                      onClick={() => handleMobileTabClick(item.id)}
                    >
                      All {item.label}
                    </button>
                    {item.subtabs!.map(sub => (
                      <button
                        key={sub.id}
                        className={`mob-subtab-btn${activeSubtab === sub.id ? ' is-active' : ''}`}
                        onClick={() => handleMobileSubtabClick(item.id, sub)}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default memo(Navbar);