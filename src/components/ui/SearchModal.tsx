"use client";
import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   Types & static data — outside component, zero re-allocation
   ═══════════════════════════════════════════════════════════════════════════ */
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tabId: string, subtabId?: string) => void;
}

interface SectionItem {
  label: string;
  tabId: string;
  subtabId?: string;
  icon: string;
}

const FREQUENT: SectionItem[] = [
  { label: 'Home',        tabId: 'discover',    subtabId: 'discover-hero',     icon: 'bi-house' },
  { label: 'About',       tabId: 'discover',    subtabId: 'discover-about',    icon: 'bi-info-circle' },
  { label: 'Features',    tabId: 'discover',    subtabId: 'discover-features', icon: 'bi-stars' },
  { label: 'Team',        tabId: 'discover',    subtabId: 'discover-team',     icon: 'bi-people' },
  { label: 'Information', tabId: 'information',                                icon: 'bi-pin' },
];

const SUGGESTED: SectionItem[] = [
  { label: 'Contact',   tabId: 'discover',    subtabId: 'discover-contact', icon: 'bi-envelope' },
  { label: 'Ventures',  tabId: 'ventures',                                  icon: 'bi-crosshair' },
  { label: 'Docs',      tabId: 'information', subtabId: 'info-docs',        icon: 'bi-file-earmark-text' },
  { label: 'FAQ',       tabId: 'information', subtabId: 'info-faq',         icon: 'bi-question-circle' },
  { label: 'Changelog', tabId: 'information', subtabId: 'info-changelog',   icon: 'bi-clock-history' },
];

/* ═══════════════════════════════════════════════════════════════════════════
   CSS — module-level constant, never re-parsed on React renders
   ═══════════════════════════════════════════════════════════════════════════ */
const MODAL_CSS = `
.search-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  animation: smFadeIn 0.18s ease-out;
}
@keyframes smFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.search-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 101;
  width: min(540px, 92vw);
  max-height: 70vh;
  border-radius: 16px;
  background: var(--surface-secondary);
  border: 1px solid var(--border-color);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45), 0 0 0 1px var(--glass-inset-top);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: smModalIn 0.22s cubic-bezier(0.34, 1.18, 0.64, 1);
}
@keyframes smModalIn {
  from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
.search-header {
  display: flex;
  align-items: center;
  padding: 18px 20px;
  gap: 12px;
  border-bottom: 1px solid var(--border-color);
}
.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1rem;
  font-weight: 500;
  color: var(--content-primary);
  letter-spacing: -0.01em;
}
.search-input::placeholder {
  color: var(--content-faint);
  opacity: 0.7;
}
.search-esc {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--content-faint);
  background: var(--hover-bg);
  border: 1px solid var(--border-color);
  cursor: pointer;
  flex-shrink: 0;
  transition: color 0.12s ease, background 0.12s ease;
  user-select: none;
}
.search-esc:hover {
  color: var(--content-primary);
  background: var(--hover-bg-strong);
}
.search-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}
.search-accordion {
  border-bottom: 1px solid var(--border-color);
}
.search-accordion:last-child {
  border-bottom: none;
}
.search-accordion-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  cursor: pointer;
  user-select: none;
  color: var(--content-secondary);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  transition: color 0.12s ease;
}
.search-accordion-header:hover {
  color: var(--content-primary);
}
.search-accordion-header i.chevron {
  font-size: 0.6rem;
  transition: transform 0.18s ease;
}
.search-accordion-header i.chevron.open {
  transform: rotate(90deg);
}
.search-accordion-items {
  overflow: hidden;
  transition: max-height 0.22s ease, opacity 0.18s ease;
}
.search-accordion-items.collapsed {
  max-height: 0;
  opacity: 0;
}
.search-accordion-items.expanded {
  max-height: 400px;
  opacity: 1;
}
.search-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 28px;
  cursor: pointer;
  color: var(--content-faint);
  font-size: 0.88rem;
  font-weight: 500;
  transition: color 0.12s ease, background 0.12s ease;
  user-select: none;
}
.search-item:hover {
  color: var(--content-primary);
  background: var(--hover-bg);
}
.search-item i {
  font-size: 0.9rem;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}
.search-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 20px;
  color: var(--content-faint);
  font-size: 0.88rem;
  font-style: italic;
}
`;

/* ═══════════════════════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════════════════════ */
const SearchModal = ({ isOpen, onClose, onNavigate }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [frequentOpen, setFrequentOpen] = useState(true);
  const [suggestedOpen, setSuggestedOpen] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Click outside to close
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
  }, [onClose]);

  const handleItemClick = useCallback((item: SectionItem) => {
    onNavigate?.(item.tabId, item.subtabId);
    onClose();
  }, [onNavigate, onClose]);

  // Memoised filtering — only recalculates when query changes
  const filteredFrequent = useMemo(() => {
    if (!query.trim()) return FREQUENT;
    const q = query.toLowerCase();
    return FREQUENT.filter(i => i.label.toLowerCase().includes(q));
  }, [query]);

  const filteredSuggested = useMemo(() => {
    if (!query.trim()) return SUGGESTED;
    const q = query.toLowerCase();
    return SUGGESTED.filter(i => i.label.toLowerCase().includes(q));
  }, [query]);

  if (!isOpen) return null;

  return (
    <>
      <style>{MODAL_CSS}</style>

      <div className="search-backdrop" onClick={handleBackdropClick}>
        <div ref={modalRef} className="search-modal">

          {/* Header */}
          <div className="search-header">
            <i className="bi bi-search" style={{ color: 'var(--content-faint)', fontSize: '0.95rem' }} />
            <input
              ref={inputRef}
              className="search-input"
              type="text"
              placeholder="What are you searching for?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="search-esc" onClick={onClose}>ESC</button>
          </div>

          {/* Body */}
          <div className="search-body">
            {filteredFrequent.length === 0 && filteredSuggested.length === 0 ? (
              <div className="search-empty">No results found</div>
            ) : (
              <>
                {filteredFrequent.length > 0 && (
                  <div className="search-accordion">
                    <div className="search-accordion-header" onClick={() => setFrequentOpen(v => !v)}>
                      <i className={`bi bi-chevron-right chevron${frequentOpen ? ' open' : ''}`} />
                      Frequently Visited
                    </div>
                    <div className={`search-accordion-items ${frequentOpen ? 'expanded' : 'collapsed'}`}>
                      {filteredFrequent.map(item => (
                        <div key={item.label} className="search-item" onClick={() => handleItemClick(item)}>
                          <i className={`bi ${item.icon}`} />
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredSuggested.length > 0 && (
                  <div className="search-accordion">
                    <div className="search-accordion-header" onClick={() => setSuggestedOpen(v => !v)}>
                      <i className={`bi bi-chevron-right chevron${suggestedOpen ? ' open' : ''}`} />
                      Suggested Sections
                    </div>
                    <div className={`search-accordion-items ${suggestedOpen ? 'expanded' : 'collapsed'}`}>
                      {filteredSuggested.map(item => (
                        <div key={item.label} className="search-item" onClick={() => handleItemClick(item)}>
                          <i className={`bi ${item.icon}`} />
                          {item.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(SearchModal);
