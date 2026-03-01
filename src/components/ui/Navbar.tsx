"use client";
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import SearchModal from './SearchModal';
import ThemeToggle from './ThemeToggle';
import { type InfoContentType } from '@/data/information-data';

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
      { id: 'discover-overview',      label: 'Overview',      sectionId: 'section-overview' },
      { id: 'discover-thecompany',    label: 'The Company',   sectionId: 'section-TheCompany' },
      { id: 'discover-theorganization',  label: 'The Organization',  sectionId: 'section-TheOrganization' },
      { id: 'discover-strategiccapital',  label: 'Strategic Capital',  sectionId: 'section-StrategicCapital' },
    ],
  },
  {
    id: 'information',
    label: 'Information',
    icon: 'bi-pin',
    subtabs: [
      { id: 'statements',          label: 'Releases' },
      { id: 'news',                label: 'Media' },
      { id: 'investor-relations',  label: 'Investor Relations' },
      { id: 'attributions',        label: 'Attributions' },
      { id: 'licenses',            label: 'Licenses' },
      { id: 'terms',               label: 'Terms' },
      { id: 'policies',            label: 'Policies' },
      { id: 'documents',           label: 'Documents' },

    ],
  },
  {
    id: 'ventures',
    label: 'Ventures',
    icon: 'bi-crosshair',
    isSpecial: true,
    subtabs: [
      { id: 'ventures-defense',         label: 'Defense Sector' },
      { id: 'ventures-healthcare',       label: 'Healthcare Sector' },
      { id: 'ventures-civic-operations', label: 'Civic Integration' },
    ],
  },
];

// ── Shared night-mode hook ──
function useNightMode() {
  const [night, setNight] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    setNight(root.classList.contains('night'));
    const obs = new MutationObserver(() => setNight(root.classList.contains('night')));
    obs.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  const toggle = useCallback(() => {
    const root = document.documentElement;
    root.classList.toggle('night');
    root.classList.toggle('light');
    setNight(prev => !prev);
  }, []);
  return { night, toggle };
}

// ── Theme toggle button ──
const ThemeToggleTabBtn = ({ isMobile }: { isMobile: boolean }) => {
  const { night, toggle } = useNightMode();
  return (
    <div
      className="tab-item-border nav-icon-btn-wrap"
      data-tooltip={night ? 'Light mode' : 'Night mode'}
    >
      <div className="tab-item">
        <button
          className="tab-label-btn"
          onClick={toggle}
          aria-label={night ? 'Switch to light mode' : 'Switch to night mode'}
          style={{ padding: '11px 13px' }}
        >
          <i className={`bi ${night ? 'bi-sun' : 'bi-moon'}`} style={{ fontSize: '0.85rem' }} />
        </button>
      </div>
    </div>
  );
};

// ── Hide-navbar button — icon only with tooltip ──
const HideNavTabBtn = ({
  isMobile,
  onClick,
}: {
  isMobile: boolean;
  onClick: () => void;
}) => (
  <div
    className="tab-item-border collapse-btn-desktop nav-icon-btn-wrap"
    data-tooltip="Hide nav"
  >
    <div className="tab-item">
      <button
        className="tab-label-btn collapse-btn-desktop"
        onClick={onClick}
        aria-label="Hide navigation bar"
        style={{ padding: '11px 13px' }}
      >
        <i className="bi bi-eye-slash" style={{ fontSize: '0.85rem' }} />
      </button>
    </div>
  </div>
);

// ── Search button ──
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

const StickyThemeTab = ({ visible, isMobile }: { visible: boolean; isMobile: boolean }) => {
  const handleClick = useCallback(() => {
    const root = document.documentElement;
    root.classList.toggle('night');
    root.classList.toggle('light');
  }, []);

  return (
    <button
      className={`nav-theme-tab${visible ? ' tab-visible' : ''}`}
      onClick={handleClick}
      aria-label="Toggle light/night mode"
    >
      <span className="sticky-theme-icon reveal-tab-icon" aria-hidden>
        <i className="bi bi-moon sticky-icon-moon" />
        <i className="bi bi-sun  sticky-icon-sun" />
      </span>
      {!isMobile && (
        <span className="sticky-theme-label">
          <span className="sticky-label-night">Night</span>
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
@keyframes slimTabIn {
  from { opacity: 0; transform: translateX(8px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* ── Light-mode navbar ── */
:root.light .glass-navbar {
  background: linear-gradient(to bottom, #f8fafc 0%, #eef2f6 60%);
  border-bottom: 1px solid rgba(0,0,0,0.08);
}
:root.light .glass-navbar::before { display: none; }

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
  background: radial-gradient(400px circle at var(--mouse-x, 50%) 100%,
    rgba(0,255,166,0.45), rgba(255,215,0,0.35), rgba(236,72,153,0.35),
    rgba(147,51,234,0.28), rgba(59,130,246,0.22), transparent 70%);
  opacity: 0; transition: opacity 0.35s ease; pointer-events: none;
}
.glass-navbar:hover::before { opacity: 1; }

/* ── Logo ── */
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
.logo-text { font-size: 1.18rem; font-weight: 800; letter-spacing: -0.03em; color: var(--content-primary); line-height: 1; }

/* ── Sticky reveal + theme tabs ── */
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
.nav-reveal-tab, .nav-theme-tab { min-width: 118px; justify-content: flex-start; }
.nav-reveal-tab.tab-visible,
.nav-theme-tab.tab-visible  { opacity: 1; pointer-events: auto; transform: translateX(0); }
.nav-reveal-tab:hover,
.nav-theme-tab:hover { color: var(--content-primary); box-shadow: -6px 4px 28px rgba(0,0,0,0.35); }
.nav-reveal-tab:hover .reveal-tab-icon,
.nav-theme-tab:hover  .reveal-tab-icon { transform: translateX(-2px); }
.reveal-tab-icon { font-size: 0.82rem; transition: transform 0.2s cubic-bezier(0.34,1.18,0.64,1); }

.sticky-theme-icon { position: relative; display: inline-flex; width: 0.9rem; height: 0.9rem; font-size: 0.9rem; flex-shrink: 0; }
.sticky-icon-moon, .sticky-icon-sun { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; transition: opacity 0.18s ease; }
.sticky-icon-moon { opacity: 1; }
.sticky-icon-sun  { opacity: 0; }
:root.night .sticky-icon-moon { opacity: 0; }
:root.night .sticky-icon-sun  { opacity: 1; }
.sticky-theme-label { position: relative; display: inline-block; min-width: 2.6rem; }
.sticky-label-night, .sticky-label-light { transition: opacity 0.18s ease; }
.sticky-label-night { opacity: 1; position: relative; }
.sticky-label-light { opacity: 0; position: absolute; left: 0; top: 0; pointer-events: none; }
:root.night .sticky-label-night { opacity: 0; pointer-events: none; }
:root.night .sticky-label-light { opacity: 1; pointer-events: auto; }
.nav-reveal-tab::before,
.nav-theme-tab::before {
  content: ''; position: absolute; left: 0; top: 4px; bottom: 4px; width: 2.5px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(220,20,60,1) 0%, rgba(200,15,50,0.9) 50%, rgba(180,10,40,0.75) 100%);
  opacity: 0.9; box-shadow: 0 0 6px rgba(220,20,60,0.6);
}

/* ── Tooltip (bottom) ── */
.nav-icon-btn-wrap { position: relative; }
.nav-icon-btn-wrap::after {
  content: attr(data-tooltip);
  position: absolute; top: calc(100% + 8px); left: 50%;
  transform: translateX(-50%) translateY(-4px);
  background: rgba(20,20,28,0.96); color: rgba(255,255,255,0.88);
  font-size: 0.72rem; font-weight: 600; letter-spacing: 0.03em; white-space: nowrap;
  padding: 5px 9px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 4px 16px rgba(0,0,0,0.4); pointer-events: none; opacity: 0;
  transition: opacity 0.18s ease, transform 0.18s ease; z-index: 100;
}
.nav-icon-btn-wrap:hover::after { opacity: 1; transform: translateX(-50%) translateY(0); }
:root.light .nav-icon-btn-wrap::after {
  background: rgba(255,255,255,0.97); color: rgba(0,0,0,0.8);
  border-color: rgba(0,0,0,0.12); box-shadow: 0 4px 16px rgba(0,0,0,0.14);
}

/* ── Layout ── */
.nav-divider {
  width: 1px;
  background: linear-gradient(to bottom, transparent, var(--border-color), transparent);
  margin: 0 4px; flex-shrink: 0;
}
.nav-center { position: relative; flex: 1; min-width: 0; display: flex; align-items: center; overflow: visible; }
.tabs-row { display: flex; align-items: center; gap: 12px; width: 100%; pointer-events: auto; }
.nav-right-controls {
  display: flex; align-items: center; gap: 8px;
  flex-shrink: 0; margin-left: auto; position: relative; z-index: 20;
}

/* ── Tab pill ── */
.tab-item-border {
  display: inline-flex; flex-shrink: 0;
  border-radius: 10.5px; padding: 0.5px; position: relative; background: transparent;
}
.tab-item-border::before {
  content: ''; position: absolute; inset: 0; border-radius: 10.5px;
  background: linear-gradient(90deg,
    rgba(0,255,166,0.0) 0%, rgba(0,255,166,0.55) 15%,
    rgba(255,215,0,0.45) 30%, rgba(236,72,153,0.45) 45%,
    rgba(147,51,234,0.45) 60%, rgba(59,130,246,0.4) 75%,
    rgba(0,255,166,0.0) 90%);
  background-size: 200% 100%;
  animation: orbitBorder 3s linear infinite;
  opacity: 0; transition: opacity 0.3s ease; pointer-events: none;
}
.tab-item-border:hover::before,
.tab-item-border.is-active::before { opacity: 1; }

.tab-item {
  display: inline-flex; align-items: stretch; border-radius: 9.5px; overflow: hidden;
  box-shadow: inset 0 1px 0 var(--glass-inset-top); transition: box-shadow 0.2s ease;
  flex-shrink: 0; background: var(--navbar-bg, #0f0f0f); position: relative; width: 100%; z-index: 1;
}
.tab-item-border:hover .tab-item { box-shadow: 0 2px 6px rgba(0,0,0,0.12), inset 0 1px 0 var(--glass-inset-top); }
.tab-item.is-active { background: var(--navbar-bg-active, #1a1a1a); }

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
  padding: 11px 14px 11px 20px; font-size: 0.97rem; line-height: 1;
  transition: color 0.15s ease; user-select: none;
}
.tab-label-btn:hover, .tab-label-btn.is-active { color: var(--content-primary); }
.tab-label-btn.is-active { font-weight: 600; }

.tab-sep { width: 1px; margin: 6px 0; background: var(--border-color); opacity: 0.45; flex-shrink: 0; pointer-events: none; }

/* ── Arrow down button on each tab pill ── */
.tab-arrow-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; border: none; background: transparent; cursor: pointer;
  color: var(--content-faint); transition: color 0.15s ease, background 0.15s ease;
  flex-shrink: 0; padding: 0; border-radius: 0 8px 8px 0;
}
.tab-arrow-btn:hover { color: var(--content-primary); background: rgba(255,255,255,0.08); }
.tab-arrow-btn .arrow-icon {
  font-size: 0.62rem;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.15s ease;
}
.tab-arrow-btn.arrow-open .arrow-icon { transform: rotate(180deg); }
.tab-arrow-btn.arrow-open { color: var(--content-primary); background: rgba(255,255,255,0.06); }

/* ── Subtab strip — below main bar row, per-tab ── */
.subtab-strip-outer {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  pointer-events: none;
  border-top: 1px solid transparent;
  transition:
    grid-template-rows 0.38s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.28s ease,
    border-top-color 0.3s ease;
}
.subtab-strip-outer.strip-visible {
  grid-template-rows: 1fr;
  opacity: 1;
  border-top-color: var(--border-color);
  pointer-events: auto;
}
.subtab-strip-clip { overflow: hidden; min-height: 0; }
.subtab-strip-inner {
  display: flex;
  align-items: stretch;
  height: 50px;
  overflow: hidden;
}

/* ── Tab buttons track (relative container for the sliding indicator) ── */
.strip-tabs-track {
  position: relative;
  display: flex;
  align-items: stretch;
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.strip-tabs-track::-webkit-scrollbar { display: none; }

/* ── Individual subtab button in the strip ── */
.strip-tab {
  position: relative;
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0 22px;
  border: none; background: transparent;
  color: var(--content-muted); font-size: 0.88rem; font-weight: 500;
  cursor: pointer; flex-shrink: 0; white-space: nowrap;
  transition: color 0.22s ease;
  border-right: 1px solid var(--border-color);
  letter-spacing: 0.01em;
  z-index: 1;
}
.strip-tab:hover { color: var(--content-primary); }
.strip-tab.strip-tab-active { color: var(--content-primary); font-weight: 600; }

/* ── Sliding active indicator (pill bg + underline) ──
   Lives absolutely inside .strip-tabs-track so it slides
   across the full track width as left/width are updated.  */
.strip-indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  /* left + width set via inline style from JS */
  transition: left 0.32s cubic-bezier(0.4, 0, 0.2, 1),
              width 0.32s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.18s ease;
}
.strip-indicator-bg {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.06);
  transition: background 0.2s ease;
}
:root.light .strip-indicator-bg { background: rgba(0,0,0,0.065); }
.strip-indicator-line {
  position: absolute;
  bottom: 0;
  left: 14px;
  right: 14px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg,
    transparent 0%, rgba(0,255,166,0.6) 15%, rgba(255,215,0,0.45) 30%,
    rgba(236,72,153,0.45) 45%, rgba(147,51,234,0.45) 60%,
    rgba(59,130,246,0.4) 75%, transparent 90%);
  background-size: 200% 100%;
  animation: orbitBorder 2.5s linear infinite;
}
:root.light .strip-indicator-line { display: none; }

/* Staggered entrance animation for strip tabs — only on initial open */
.subtab-strip-outer.strip-entering .strip-tab {
  animation: slimTabIn 0.22s cubic-bezier(0.34,1.18,0.64,1) both;
  animation-delay: calc(var(--si, 0) * 0.035s + 0.04s);
}

/* ── Collapse chevron at the far right of strip ── */
.strip-collapse {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 0 20px;
  border: none; background: transparent;
  color: var(--content-muted); cursor: pointer; flex-shrink: 0;
  transition: color 0.14s ease, background 0.14s ease;
  border-left: 1px solid var(--border-color);
  margin-left: auto;
}
.strip-collapse:hover { color: var(--content-primary); background: rgba(255,255,255,0.03); }
.strip-collapse i { font-size: 0.7rem; transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1); }
.strip-collapse:hover i { transform: translateY(-2px); }

/* ── Search shortcut badge ── */
.search-shortcut {
  display: inline-flex; align-items: center; padding: 2px 6px; border-radius: 5px;
  font-size: 0.72rem; font-weight: 600; color: var(--content-faint);
  background: var(--hover-bg); border: 1px solid var(--border-color);
  opacity: 0.7; letter-spacing: 0.03em; margin-left: 2px;
}

/* ── Spring press keyframe ── */
@keyframes tabPress {
  0%   { transform: scale(1); }
  15%  { transform: scale(0.96); }
  50%  { transform: scale(1.02); }
  72%  { transform: scale(0.992); }
  88%  { transform: scale(1.004); }
  100% { transform: scale(1); }
}
.tab-pressed {
  animation: tabPress 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
  transform-origin: center !important;
}
.tab-item-border,
.tab-label-btn,
.tab-arrow-btn,
.strip-tab,
.strip-collapse,
.logo-mark,
.mob-tab-btn,
.mob-subtab-btn,
.mob-close,
.mob-search,
.nav-reveal-tab,
.nav-theme-tab,
.mobile-burger { transform-origin: center; }

.tab-item-border:active { animation: tabPress 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.tab-label-btn:active   { animation: tabPress 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.tab-arrow-btn:active   { animation: tabPress 0.72s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.strip-tab:active       { animation: tabPress 0.72s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.strip-collapse:active  { animation: tabPress 0.68s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.logo-mark:active       { animation: tabPress 0.8s  cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.mobile-burger:active   { animation: tabPress 0.68s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.mob-tab-btn:active,
.mob-subtab-btn:active  { animation: tabPress 0.7s  cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.mob-close:active       { animation: tabPress 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.mob-search:active      { animation: tabPress 0.7s  cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.nav-reveal-tab:active,
.nav-theme-tab:active   { animation: tabPress 0.72s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

/* ── Mobile ── */
@media (max-width: 640px) {
  .nav-center, .nav-divider.desktop-only { display: none; }
  .tab-sep, .tab-arrow-btn { display: none; }
  .tab-label-btn { padding: 6px 11px; font-size: 0.84rem; }
  .collapse-btn-desktop { display: none !important; }
  .nav-reveal-tab { top: 12px; padding: 7px 11px 7px 10px; font-size: 0.74rem; }
  .nav-theme-tab  { top: calc(12px + 34px + 5px); padding: 7px 11px 7px 10px; font-size: 0.74rem; }
  .nav-icon-btn-wrap::after { display: none; }
  .strip-tab { padding: 0 14px; font-size: 0.82rem; }
  .strip-collapse { padding: 0 14px; }
  .strip-collapse:hover i { transform: translateX(2px); }
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

/* ── Mobile sidebar ── */
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
.mob-subtabs.expanded { max-height: 400px; opacity: 1; }
.mob-subtab-btn { display: flex; align-items: center; gap: 8px; width: 100%; padding: 12px 20px 12px 50px; border: none; background: transparent; color: var(--content-faint); font-size: 0.93rem; font-weight: 400; cursor: pointer; transition: color 0.12s ease, background 0.12s ease; user-select: none; }
.mob-subtab-btn:hover { color: var(--content-primary); background: var(--hover-bg); }
.mob-subtab-btn.is-active { color: var(--content-primary); font-weight: 600; position: relative; }
.mob-subtab-btn.is-active::before { content: ''; position: absolute; left: 36px; top: 50%; transform: translateY(-50%); width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.8); }
`;

// ─────────────────────────────────────────────────────────────
//  StripRow — subtab strip with a single sliding indicator
// ─────────────────────────────────────────────────────────────
interface StripRowProps {
  item: NavItem;
  isVisible: boolean;
  activeSubtabId: string | null;
  onSubtabClick: (sub: SubtabItem) => void;
  onCollapse: () => void;
  isMobile?: boolean;
}

const StripRow = memo(({
  item, isVisible, activeSubtabId, onSubtabClick, onCollapse, isMobile,
}: StripRowProps) => {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [indStyle, setIndStyle] = useState<{ left: number; width: number } | null>(null);
  const [animate, setAnimate] = useState(false);
  const [entering, setEntering] = useState(false);
  const hasPlacedRef = useRef(false);
  const [atEnd, setAtEnd] = useState(false);

  // Track scroll position to determine arrow direction
  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setAtEnd(maxScroll > 2 && track.scrollLeft >= maxScroll - 2);
  }, []);

  // Listen for scroll events on the track
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const handler = () => updateScrollState();
    track.addEventListener('scroll', handler, { passive: true });
    // initial check
    updateScrollState();
    return () => track.removeEventListener('scroll', handler);
  }, [isVisible, updateScrollState]);

  // Auto-scroll the active subtab button into center view
  useEffect(() => {
    if (!activeSubtabId || !isVisible) return;
    const idx = item.subtabs!.findIndex(s => s.id === activeSubtabId);
    if (idx < 0) return;
    const btn = btnRefs.current[idx];
    const track = trackRef.current;
    if (!btn || !track) return;

    // Wait a frame for layout to settle
    requestAnimationFrame(() => {
      const trackRect = track.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const btnCenter = btnRect.left + btnRect.width / 2 - trackRect.left + track.scrollLeft;
      const targetScroll = btnCenter - trackRect.width / 2;
      track.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
    });
  }, [activeSubtabId, isVisible, item.subtabs]);

  const place = useCallback((shouldAnimate: boolean) => {
    if (!activeSubtabId) return;
    const idx = item.subtabs!.findIndex(s => s.id === activeSubtabId);
    if (idx < 0) return;
    const btn = btnRefs.current[idx];
    const track = trackRef.current;
    if (!btn || !track) return;

    let left = 0;
    let el: HTMLElement | null = btn;
    while (el && el !== track) {
      left += el.offsetLeft;
      el = el.offsetParent as HTMLElement | null;
    }
    const width = btn.offsetWidth;

    if (!shouldAnimate) {
      setAnimate(false);
      setIndStyle({ left, width });
      requestAnimationFrame(() => setAnimate(true));
    } else {
      setAnimate(true);
      setIndStyle({ left, width });
    }

    hasPlacedRef.current = true;
  }, [activeSubtabId, item.subtabs]);

  useEffect(() => {
    place(hasPlacedRef.current);
  }, [activeSubtabId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isVisible) {
      hasPlacedRef.current = false;
      setAnimate(false);
      setIndStyle(null);
      setEntering(false);
      return;
    }
    setEntering(true);
    const enterTimer = setTimeout(() => setEntering(false), 400);
    const t = setTimeout(() => place(false), 40);
    return () => { clearTimeout(t); clearTimeout(enterTimer); };
  }, [isVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  const indicatorCSSStyle: React.CSSProperties = {
    left: indStyle?.left ?? 0,
    width: indStyle?.width ?? 0,
    opacity: indStyle ? 1 : 0,
    transition: animate
      ? 'left 0.32s cubic-bezier(0.4, 0, 0.2, 1), width 0.32s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.18s ease'
      : 'none',
  };

  const handleArrowClick = useCallback(() => {
    if (isMobile && trackRef.current) {
      const track = trackRef.current;
      if (atEnd) {
        // Arrow is pointing left — scroll back to start
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Arrow is pointing right — scroll forward
        const maxScroll = track.scrollWidth - track.clientWidth;
        const newLeft = Math.min(track.scrollLeft + track.clientWidth * 0.65, maxScroll);
        track.scrollTo({ left: newLeft, behavior: 'smooth' });
      }
    } else {
      onCollapse();
    }
  }, [isMobile, atEnd, onCollapse]);

  const arrowIcon = isMobile
    ? (atEnd ? 'bi-chevron-left' : 'bi-chevron-right')
    : 'bi-chevron-up';

  return (
    <div className={`subtab-strip-outer${isVisible ? ' strip-visible' : ''}${entering ? ' strip-entering' : ''}`}>
      <div className="subtab-strip-clip">
        <div className="subtab-strip-inner">

          <div className="strip-tabs-track" ref={trackRef}>
            <div
              className="strip-indicator"
              style={indicatorCSSStyle}
              aria-hidden
            >
              <div className="strip-indicator-bg" />
              <div className="strip-indicator-line" />
            </div>

            {item.subtabs!.map((sub, idx) => (
              <button
                key={sub.id}
                ref={el => { btnRefs.current[idx] = el; }}
                className={`strip-tab${activeSubtabId === sub.id ? ' strip-tab-active' : ''}`}
                style={{ '--si': idx } as React.CSSProperties}
                onClick={() => onSubtabClick(sub)}
              >
                {sub.label}
              </button>
            ))}
          </div>

          <button
            className="strip-collapse"
            onClick={handleArrowClick}
            aria-label={isMobile ? `Scroll ${item.label} sections` : `Hide ${item.label} sections`}
          >
            <i className={`bi ${arrowIcon}`} />
          </button>

        </div>
      </div>
    </div>
  );
});
StripRow.displayName = 'StripRow';

// ─────────────────────────────────────────────────────────────
//  Main component
// ─────────────────────────────────────────────────────────────
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
  const [stripOpen, setStripOpen]                 = useState(false);
  const [mobileOpen, setMobileOpen]               = useState(false);
  const [mobileExpandedTab, setMobileExpandedTab] = useState<string | null>(null);
  const [navCollapsed, setNavCollapsed]           = useState(false);

  const navContainerRef          = useRef<HTMLDivElement>(null);
  const rafIdRef                 = useRef<number | null>(null);
  const touchRef                 = useRef<{ startX: number; startY: number } | null>(null);
  const navCollapsedRef          = useRef(false);
  const manualOpenRef            = useRef(false);
  const isProgrammaticScrollRef  = useRef(false);
  const programmaticScrollTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [scrollSpySubtab, setScrollSpySubtab] = useState<string | null>(null);

  // ── Collapse / show nav ──
  const handleCollapseNav = useCallback(() => {
    setNavCollapsed(true);
    navCollapsedRef.current = true;
    setStripOpen(false);
    manualOpenRef.current = false;
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

  // ── Responsive ──
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const check = () => { clearTimeout(t); t = setTimeout(() => setIsMobile(window.innerWidth < 640), 150); };
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener('resize', check); };
  }, []);

  // ── Mouse-position for gradient accent ──
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

  // When active tab changes: open strip, reset scroll-spy to first subtab
  useEffect(() => {
    manualOpenRef.current = false;
    const item = NAV_ITEMS.find(i => i.id === activeTab);
    if (!item?.subtabs?.length) { setStripOpen(false); setScrollSpySubtab(null); return; }
    setStripOpen(true);
    setScrollSpySubtab(activeSubtab ?? item.subtabs[0].id);
  }, [activeTab, activeSubtab]);

  // Scroll-spy
  useEffect(() => {
    const item = NAV_ITEMS.find(i => i.id === activeTab);
    if (!item?.subtabs?.length) return;

    const sectionSubtabs = item.subtabs.filter(s => s.sectionId);
    if (!sectionSubtabs.length) return;

    const computeActive = () => {
      const scrollY = window.scrollY + 120;
      let active = sectionSubtabs[0].id;
      for (const sub of sectionSubtabs) {
        const el = document.getElementById(sub.sectionId!);
        if (el && el.getBoundingClientRect().top + window.scrollY <= scrollY) {
          active = sub.id;
        }
      }
      return active;
    };

    const onScroll = () => {
      if (isProgrammaticScrollRef.current) return;
      setScrollSpySubtab(computeActive());
    };

    setScrollSpySubtab(computeActive());
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [activeTab]);

  useEffect(() => () => {
    if (programmaticScrollTimer.current) clearTimeout(programmaticScrollTimer.current);
  }, []);

  // ── Tab label click ──
  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setActiveTab]);

  // ── Arrow click ──
  const handleArrowToggle = useCallback((tabId: string) => {
    if (tabId !== activeTab) {
      setActiveTab(tabId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setStripOpen(prev => {
      const next = !prev;
      manualOpenRef.current = next;
      return next;
    });
  }, [activeTab, setActiveTab]);

  // ── Subtab click inside the strip ──
  const handleSubtabClick = useCallback((parentTabId: string, sub: SubtabItem) => {
    setActiveTab(parentTabId);
    onSubtabClick?.(parentTabId, sub.id);
    if (sub.sectionId) {
      setScrollSpySubtab(sub.id);
      isProgrammaticScrollRef.current = true;
      if (programmaticScrollTimer.current) clearTimeout(programmaticScrollTimer.current);
      programmaticScrollTimer.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 1200);
      requestAnimationFrame(() =>
        document.getElementById(sub.sectionId!)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      );
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [setActiveTab, onSubtabClick]);

  // ── Info tab subtab click — sub.id is the InfoContentType value directly ──
  const handleInfoSubtabClick = useCallback((sub: SubtabItem) => {
    onInfoContentChange?.(sub.id as InfoContentType);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onInfoContentChange]);

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
    setActiveTab(tabId);
    if (subtabId) onSubtabClick?.(tabId, subtabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setActiveTab, onSubtabClick]);

  // ── Mobile sidebar ──
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

  const handleMobileInfoSubtabClick = useCallback((sub: SubtabItem) => {
    setActiveTab('information');
    onInfoContentChange?.(sub.id as InfoContentType);
    setMobileOpen(false); setMobileExpandedTab(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setActiveTab, onInfoContentChange]);

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

  // ── Spring press listener ──
  useEffect(() => {
    const SELECTORS = [
      '.tab-item-border', '.tab-label-btn', '.tab-arrow-btn',
      '.strip-tab', '.strip-collapse',
      '.logo-mark', '.mob-tab-btn', '.mob-subtab-btn',
      '.mob-close', '.mob-search', '.nav-reveal-tab', '.nav-theme-tab', '.mobile-burger',
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

  // ── Derived state ──
  const activeSet = useMemo(() => {
    const set = new Set<string>();
    for (const item of NAV_ITEMS) {
      if (activeTab === item.id) { set.add(item.id); continue; }
      if (activeSubtab && item.subtabs?.some(s => s.id === activeSubtab)) set.add(item.id);
    }
    return set;
  }, [activeTab, activeSubtab]);

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
            onClick={() => handleTabClick('home')}
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

          {/* ── Tab pills ── */}
          <div className="nav-center">
            <div className="tabs-row">
              {NAV_ITEMS.map((item) => {
                const active      = activeSet.has(item.id);
                const hasSubtabs  = !!(item.subtabs?.length);
                const isActiveTab = item.id === activeTab;
                const arrowOpen   = isActiveTab && stripOpen;
                return (
                  <div
                    key={item.id}
                    className={`tab-item-border${active ? ' is-active' : ''}`}
                  >
                    <div className={`tab-item${active ? ' is-active' : ''}`}>
                      {/* ── Tab label — icon removed ── */}
                      <button
                        className={`tab-label-btn${active ? ' is-active' : ''}`}
                        onClick={() => handleTabClick(item.id)}
                        style={labelFontStyle}
                      >
                        {item.label}
                      </button>

                      {hasSubtabs && (
                        <>
                          <span className="tab-sep" />
                          <button
                            className={`tab-arrow-btn${arrowOpen ? ' arrow-open' : ''}`}
                            onClick={() => handleArrowToggle(item.id)}
                            aria-label={isActiveTab
                              ? (arrowOpen ? `Hide ${item.label} sections` : `Show ${item.label} sections`)
                              : `Go to ${item.label}`}
                          >
                            <i className="bi bi-chevron-down arrow-icon" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right controls ── */}
          <div className="nav-right-controls">
            <ThemeToggleTabBtn isMobile={isMobile} />
            <HideNavTabBtn isMobile={isMobile} onClick={handleCollapseNav} />
            <SearchTabBtn isMobile={isMobile} onClick={openSearch} />
            <button className="mobile-burger" onClick={openMobile} aria-label="Open menu">
              <i className="bi bi-list" />
            </button>
          </div>
        </div>

        {/* ══ SUBTAB STRIP — active tab only ══ */}
        {NAV_ITEMS.filter(item => item.subtabs?.length).map((item) => {
          const isActiveItem   = item.id === activeTab;
          const isVisible      = isActiveItem && stripOpen;
          const isInfoTab      = item.id === 'information';
          const activeSubtabId = isInfoTab
            ? (activeInfoContent as string | undefined)
            : (isActiveItem ? (activeSubtab ?? scrollSpySubtab) : undefined);

          return (
            <StripRow
              key={`strip-${item.id}`}
              item={item}
              isVisible={isVisible}
              activeSubtabId={activeSubtabId ?? null}
              onSubtabClick={(sub) => isInfoTab ? handleInfoSubtabClick(sub) : handleSubtabClick(item.id, sub)}
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
            const isInfoTab     = item.id === 'information';
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
                      className={`mob-subtab-btn${active && !activeSubtab && !(isInfoTab && activeInfoContent) ? ' is-active' : ''}`}
                      onClick={() => handleMobileTabClick(item.id)}
                    >
                      All {item.label}
                    </button>
                    {item.subtabs!.map(sub => {
                      const isSubActive = isInfoTab
                        ? activeInfoContent === sub.id
                        : activeSubtab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          className={`mob-subtab-btn${isSubActive ? ' is-active' : ''}`}
                          onClick={() => isInfoTab ? handleMobileInfoSubtabClick(sub) : handleMobileSubtabClick(item.id, sub)}
                        >
                          {sub.label}
                        </button>
                      );
                    })}
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