"use client";
import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';

/* ═══════════════════════════════════════════════════════════════════════════
   Types & static data — outside component, zero re-allocation
   ═══════════════════════════════════════════════════════════════════════════ */
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tabId: string, subtabId?: string, infoContent?: string) => void;
}

interface SectionItem {
  label: string;
  tabId: string;
  subtabId?: string;
  infoContent?: string;
  icon: string;
  aka?: string;
  keywords: string[];
}

/* ── Comprehensive searchable sections with keyword mappings ── */
const ALL_SECTIONS: SectionItem[] = [
  // Landing
  { label: 'Home',              tabId: 'home',                                                                  icon: 'bi-house',           aka: 'Landing, Main Page',                          keywords: ['home', 'landing', 'main', 'start', 'welcome', 'hero', 'portfolio', 'convergence'] },

  // Discover
  { label: 'Overview',          tabId: 'discover',    subtabId: 'discover-overview',                            icon: 'bi-grid',            aka: 'Summary, Dashboard',                          keywords: ['overview', 'summary', 'dashboard', 'about', 'discover', 'grids'] },
  { label: 'The Company',       tabId: 'discover',    subtabId: 'discover-thecompany',                          icon: 'bi-building',        aka: 'About Us, Company Profile',                   keywords: ['company', 'about us', 'profile', 'mission', 'vision', 'who we are', 'notus', 'regalia', 'corporation', 'entity', 'holding', 'firm'] },
  { label: 'The Organization',  tabId: 'discover',    subtabId: 'discover-theorganization',                     icon: 'bi-people',          aka: 'Teams, Leadership, Founders',                 keywords: ['organization', 'team', 'teams', 'leadership', 'founders', 'ceo', 'cto', 'cfo', 'coo', 'executives', 'management', 'people', 'staff', 'directors', 'board', 'officers', 'personnel'] },
  { label: 'Strategic Capital', tabId: 'discover',    subtabId: 'discover-strategiccapital',                    icon: 'bi-graph-up-arrow',  aka: 'Investments, Seed, Investors',                keywords: ['capital', 'strategic', 'investments', 'investors', 'seed', 'funding', 'finance', 'venture capital', 'vc', 'fundraise', 'round', 'valuation'] },

  // Information
  { label: 'Releases',          tabId: 'information', infoContent: 'statements',                                icon: 'bi-bell',            aka: 'Statements, Announcements',                   keywords: ['releases', 'statements', 'announcements', 'press', 'notice', 'disclosure', 'public'] },
  { label: 'News & Media',      tabId: 'information', infoContent: 'news',                                      icon: 'bi-images',          aka: 'Media, Coverage, Press',                      keywords: ['news', 'media', 'coverage', 'press', 'articles', 'blog', 'updates'] },
  { label: 'Attributions',      tabId: 'information', infoContent: 'attributions',                               icon: 'bi-award',           aka: 'Credits, Acknowledgments',                    keywords: ['attributions', 'credits', 'acknowledgments', 'thanks', 'recognition'] },
  { label: 'Licenses',          tabId: 'information', infoContent: 'licenses',                                   icon: 'bi-patch-check',     aka: 'Software Licensing, Open Source',              keywords: ['licenses', 'licensing', 'open source', 'software', 'mit', 'apache', 'gpl'] },
  { label: 'Terms & Conditions',tabId: 'information', infoContent: 'terms',                                      icon: 'bi-unlock2',         aka: 'Terms of Service, TOS, Agreement',            keywords: ['terms', 'conditions', 'tos', 'terms of service', 'agreement', 'usage', 'rules'] },
  { label: 'Policies',          tabId: 'information', infoContent: 'policies',                                   icon: 'bi-shield-check',    aka: 'Privacy, Cookie, Acceptable Use',             keywords: ['policies', 'policy', 'privacy', 'cookie', 'cookies', 'acceptable use', 'data', 'gdpr', 'data protection', 'consent', 'tracking', 'analytics'] },
  { label: 'Documents',         tabId: 'information', infoContent: 'documents',                                  icon: 'bi-folder',          aka: 'Legal Documents, Filings',                    keywords: ['documents', 'filings', 'legal', 'paperwork', 'files', 'official'] },
  { label: 'Investor Relations',tabId: 'information', infoContent: 'investor-relations',                         icon: 'bi-graph-up-arrow',  aka: 'Financial, Reports, Shareholders',            keywords: ['investor', 'investors', 'relations', 'financial', 'shareholders', 'equity', 'stock', 'dividends', 'ir', 'quarterly', 'annual report'] },
  { label: 'Report a Problem',  tabId: 'information', infoContent: 'report',                                     icon: 'bi-flag',            aka: 'Issue, Bug, Complaint',                       keywords: ['report', 'problem', 'issue', 'bug', 'complaint', 'feedback', 'abuse', 'security', 'vulnerability', 'contact legal'] },

  // Ventures
  { label: 'Defense',           tabId: 'ventures',    subtabId: 'defense',                                      icon: 'bi-shield',          aka: 'Military, Security, Intelligence',            keywords: ['defense', 'military', 'security', 'intelligence', 'warfare', 'weapons', 'tactical', 'army', 'navy'] },
  { label: 'Healthcare',        tabId: 'ventures',    subtabId: 'healthcare',                                   icon: 'bi-heart-pulse',     aka: 'Medical, Biotech, Health',                    keywords: ['healthcare', 'health', 'medical', 'biotech', 'pharma', 'hospital', 'clinical', 'patient', 'wellness'] },
  { label: 'Civic Operations',  tabId: 'ventures',    subtabId: 'civic-operations',                             icon: 'bi-buildings',       aka: 'Government, Infrastructure, Public',          keywords: ['civic', 'operations', 'government', 'infrastructure', 'public', 'urban', 'city', 'municipal', 'community'] },
];

const TRENDING: SectionItem[] = ALL_SECTIONS.filter(i =>
  ['The Company', 'The Organization', 'Strategic Capital'].includes(i.label)
);

const SUGGESTED: SectionItem[] = ALL_SECTIONS.filter(i =>
  ['Home', 'Overview', 'Releases', 'Ventures', 'Policies'].includes(i.label)
).map(i => {
  // For Ventures without a subtab, just point to the tab
  if (i.label === 'Ventures') return { ...i, subtabId: undefined };
  return i;
});
// Add a general Ventures entry
const VENTURES_ENTRY: SectionItem = { label: 'Ventures', tabId: 'ventures', icon: 'bi-crosshair', aka: 'Portfolio Companies', keywords: ['ventures', 'portfolio'] };
if (!SUGGESTED.find(s => s.label === 'Ventures')) {
  SUGGESTED.push(VENTURES_ENTRY);
}
// Also add Information general entry
const INFO_ENTRY: SectionItem = { label: 'Information', tabId: 'information', icon: 'bi-pin', aka: 'Info Hub', keywords: ['information', 'info'] };
SUGGESTED.push(INFO_ENTRY);


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
  const [searchResultsOpen, setSearchResultsOpen] = useState(true);
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
    onNavigate?.(item.tabId, item.subtabId, item.infoContent);
    onClose();
  }, [onNavigate, onClose]);

  // True if any search query is present
  const hasQuery = query.trim().length > 0;

  // Memoised keyword-based search across ALL_SECTIONS
  const searchResults = useMemo(() => {
    if (!hasQuery) return [];
    const q = query.toLowerCase().trim();
    const tokens = q.split(/\s+/);

    return ALL_SECTIONS
      .map(item => {
        let score = 0;
        const labelLower = item.label.toLowerCase();
        const akaLower = (item.aka || '').toLowerCase();

        // Exact label match
        if (labelLower === q) score += 100;
        // Label starts with query
        else if (labelLower.startsWith(q)) score += 50;
        // Label contains query
        else if (labelLower.includes(q)) score += 30;
        // AKA contains query
        if (akaLower.includes(q)) score += 20;

        // Keyword matching
        for (const kw of item.keywords) {
          for (const token of tokens) {
            if (kw === token) score += 40;
            else if (kw.startsWith(token)) score += 25;
            else if (kw.includes(token)) score += 15;
          }
        }

        return { item, score };
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(r => r.item);
  }, [query, hasQuery]);

  // When no query, show the Trending and Suggested sections
  const filteredTrending = useMemo(() => {
    if (hasQuery) return [];
    return TRENDING;
  }, [hasQuery]);

  const filteredSuggested = useMemo(() => {
    if (hasQuery) return [];
    return SUGGESTED;
  }, [hasQuery]);

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
            {/* When searching: show keyword results */}
            {hasQuery ? (
              searchResults.length === 0 ? (
                <div className="search-empty">No results found</div>
              ) : (
                <div className="search-accordion">
                  <div className="search-accordion-header" onClick={() => setSearchResultsOpen(v => !v)}>
                    <i className={`bi bi-chevron-right chevron${searchResultsOpen ? ' open' : ''}`} />
                    Results
                  </div>
                  <div className={`search-accordion-items ${searchResultsOpen ? 'expanded' : 'collapsed'}`}>
                    {searchResults.map(item => (
                      <div key={`${item.tabId}-${item.subtabId || ''}-${item.infoContent || ''}`} className="search-item" onClick={() => handleItemClick(item)}>
                        <i className={`bi ${item.icon}`} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span>{item.label}</span>
                          {item.aka && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--content-faint)', opacity: 0.6, fontWeight: 400 }}>
                              {item.aka}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ) : (
              /* When not searching: show Trending and Suggested */
              <>
                {filteredTrending.length > 0 && (
                  <div className="search-accordion">
                    <div className="search-accordion-header" onClick={() => setFrequentOpen(v => !v)}>
                      <i className={`bi bi-chevron-right chevron${frequentOpen ? ' open' : ''}`} />
                      Trending
                    </div>
                    <div className={`search-accordion-items ${frequentOpen ? 'expanded' : 'collapsed'}`}>
                      {filteredTrending.map(item => (
                        <div key={item.label} className="search-item" onClick={() => handleItemClick(item)}>
                          <i className={`bi ${item.icon}`} />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span>{item.label}</span>
                            {item.aka && (
                              <span style={{ fontSize: '0.72rem', color: 'var(--content-faint)', opacity: 0.6, fontWeight: 400 }}>
                                {item.aka}
                              </span>
                            )}
                          </div>
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
