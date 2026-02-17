"use client";
import { memo, useState, useRef, useEffect, useMemo } from 'react';
import { statements, type Statement } from '@/data/information-data';
import styles from '@/styles/ui.module.css';
import ContentHeader from './ContentHeader';

const ITEMS_PER_PAGE = 10;

interface StatementsProps {
  isTransitioning?: boolean;
}

interface StatementAccordionItemProps {
  statement: Statement;
  isOpen: boolean;
  onToggle: () => void;
}

const StatementAccordionItem = memo(({ statement, isOpen, onToggle }: StatementAccordionItemProps) => {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const handleMouseMove = (e: MouseEvent) => {
      const currentBox = boxRef.current;
      if (!currentBox) return;
      const rect = currentBox.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      currentBox.style.setProperty('--mouse-x', `${x}px`);
      currentBox.style.setProperty('--mouse-y', `${y}px`);
    };

    box.addEventListener('mousemove', handleMouseMove);
    return () => box.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={boxRef} className={`${styles.notificationBox} group`}>
      <div className={styles.boxInner}>
        <button
          onClick={onToggle}
          className="w-full text-left focus:outline-none"
          aria-expanded={isOpen}
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="flex-1 line-clamp-2 pr-4 font-semibold text-sm sm:text-base leading-tight transition-colors duration-300" style={{ color: 'var(--content-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--content-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--content-secondary)'}
            >
              {statement.title}
            </h3>
            <div className="flex-shrink-0 flex items-center gap-3">
              {(statement.pdfUrl || statement.linkUrl) && (
                <div className="flex items-center gap-2">
                  {statement.pdfUrl && (
                    <a
                      href={statement.pdfUrl}
                      onClick={(e) => e.stopPropagation()}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all duration-300 group/pdf"
                      style={{ backgroundColor: 'var(--hover-bg-10)', border: '1px solid var(--border-color)' }}
                      title="Download PDF"
                    >
                      <i className="bi bi-filetype-pdf text-sm sm:text-base transition-all" style={{ color: 'var(--content-muted)' }}></i>
                    </a>
                  )}
                  {statement.linkUrl && (
                    <a
                      href={statement.linkUrl}
                      onClick={(e) => e.stopPropagation()}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all duration-300 group/link"
                      style={{ backgroundColor: 'var(--hover-bg-10)', border: '1px solid var(--border-color)' }}
                      title="Open Link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-link-45deg text-base sm:text-lg transition-all" style={{ color: 'var(--content-muted)' }}></i>
                    </a>
                  )}
                </div>
              )}
              <svg
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs sm:text-sm font-medium" style={{ color: 'var(--content-muted)' }}>{statement.date}</span>
            <span style={{ color: 'var(--content-tertiary)' }}>•</span>
            <div className="flex flex-wrap gap-2">
              {statement.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-md border ${
                    tag === 'Recruitment' 
                      ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-lg shadow-red-500/20' 
                      : 'text-xs sm:text-xs font-semibold rounded-md border'
                  }`}
                  style={tag !== 'Recruitment' ? { backgroundColor: 'var(--hover-bg-10)', color: 'var(--content-muted)', borderColor: 'var(--border-color)' } : undefined}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </button>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-32 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <p className="text-xs sm:text-sm leading-relaxed line-clamp-5" style={{ color: 'var(--content-muted)' }}>
              {statement.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

StatementAccordionItem.displayName = 'StatementAccordionItem';

const Statements = memo(({ isTransitioning = false }: StatementsProps) => {
  const [openStatementId, setOpenStatementId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const searchInput = searchInputRef.current;
    if (!searchInput) return;

    const handleMouseMove = (e: MouseEvent) => {
      const currentInput = searchInputRef.current;
      if (!currentInput) return;
      const rect = currentInput.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      currentInput.style.setProperty('--mouse-x', `${x}px`);
      currentInput.style.setProperty('--mouse-y', `${y}px`);
    };

    searchInput.addEventListener('mousemove', handleMouseMove);
    return () => searchInput.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleToggle = (statementId: string) => {
    setOpenStatementId(prev => prev === statementId ? null : statementId);
  };

  const filteredStatements = useMemo(() => {
    if (!searchQuery.trim()) return statements;
    
    const query = searchQuery.toLowerCase();
    return statements.filter((statement) => 
      statement.title.toLowerCase().includes(query) ||
      statement.tags.some(tag => tag.toLowerCase().includes(query)) ||
      statement.content.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredStatements.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentStatements = filteredStatements.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
    setOpenStatementId(null);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setOpenStatementId(null);
  };

  return (
    <div className="px-4 sm:px-8 lg:px-20 py-8 sm:py-12 lg:py-16">
      <div className="max-w-5xl mx-auto">
        <ContentHeader
          icon="bi-megaphone"
          title="Statements & Notices"
          isTransitioning={false}
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div ref={searchInputRef} className="relative flex-1 sm:max-w-md">
            <div 
              className="relative h-12 sm:h-14 rounded-lg overflow-hidden transition duration-200 group"
              style={{
                backgroundColor: 'var(--button-bg)',
                boxShadow: 'var(--button-shadow)',
                border: 'solid 1px var(--button-border)'
              }}
            >
              <div 
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: 'radial-gradient(150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(34, 197, 94, 0.6), rgba(255, 215, 0, 0.5), rgba(236, 72, 153, 0.5), rgba(147, 51, 234, 0.5), rgba(59, 130, 246, 0.4), transparent 70%)',
                  padding: '1px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  zIndex: 10
                }}
              />
              <div className="relative h-full flex items-center">
                <i className="bi bi-search absolute left-3 sm:left-4 text-base sm:text-lg pointer-events-none z-10" style={{ color: 'var(--content-muted)' }}></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search statements..."
                  className="w-full h-full pl-10 sm:pl-12 pr-3 sm:pr-4 bg-transparent border-none text-sm sm:text-base focus:outline-none focus:ring-0 relative z-50"
                  style={{ color: 'var(--content-secondary)' }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all overflow-hidden group"
                style={{
                  backgroundColor: 'var(--button-bg)',
                  border: '1px solid var(--button-border)',
                  color: 'var(--content-muted)',
                  boxShadow: 'var(--button-shadow)'
                }}
                aria-label="Previous page"
              >
                <div 
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: 'radial-gradient(150px circle at 50% 50%, rgba(0, 255, 166, 0.8), rgba(255, 215, 0, 0.6), rgba(236, 72, 153, 0.6), rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.5), transparent 70%)',
                    padding: '1px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 px-2.5 sm:px-3 flex items-center justify-center rounded-lg font-medium text-xs sm:text-sm transition-all overflow-hidden`}
                    style={{
                      backgroundColor: 'var(--button-bg)',
                      border: currentPage === page ? 'none' : '1px solid var(--button-border)',
                      color: currentPage === page ? 'var(--content-primary)' : 'var(--content-muted)',
                      boxShadow: 'var(--button-shadow)'
                    }}
                  >
                    {currentPage === page && (
                      <div 
                        className="absolute inset-0 rounded-lg pointer-events-none"
                        style={{
                          background: 'radial-gradient(150px circle at 50% 50%, rgba(0, 255, 166, 0.8), rgba(255, 215, 0, 0.6), rgba(236, 72, 153, 0.6), rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.5), transparent 70%)',
                          padding: '1px',
                          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          WebkitMaskComposite: 'xor',
                          maskComposite: 'exclude',
                        }}
                      />
                    )}
                    <span className="relative z-10">{page}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all overflow-hidden group"
                style={{
                  backgroundColor: 'var(--button-bg)',
                  border: '1px solid var(--button-border)',
                  color: 'var(--content-muted)',
                  boxShadow: 'var(--button-shadow)'
                }}
                aria-label="Next page"
              >
                <div 
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: 'radial-gradient(150px circle at 50% 50%, rgba(0, 255, 166, 0.8), rgba(255, 215, 0, 0.6), rgba(236, 72, 153, 0.6), rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.5), transparent 70%)',
                    padding: '1px',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {filteredStatements.length > 0 && (
              <div className="text-xs sm:text-sm" style={{ color: 'var(--content-muted)' }}>
                Showing {startIndex + 1}-{Math.min(endIndex, filteredStatements.length)} of {filteredStatements.length} statement{filteredStatements.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {searchQuery && (
          <div className="mb-4 text-xs sm:text-sm" style={{ color: 'var(--content-muted)' }}>
            Found {filteredStatements.length} statement{filteredStatements.length !== 1 ? 's' : ''}
          </div>
        )}

        <div className="space-y-3 sm:space-y-4">
          {currentStatements.length > 0 ? (
            currentStatements.map((statement) => (
              <StatementAccordionItem
                key={statement.id}
                statement={statement}
                isOpen={openStatementId === statement.id}
                onToggle={() => handleToggle(statement.id)}
              />
            ))
          ) : (
            <div className="flex items-center justify-center py-12 sm:py-16">
              <div 
                className="relative border border-dashed rounded-2xl p-6 sm:p-8 max-w-md"
                style={{
                  borderColor: 'var(--border-dashed)',
                  background: 'var(--gradient-card)'
                }}
              >
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--hover-bg-10)', border: '1px solid var(--border-color)' }}>
                    <i className="bi bi-cup-hot text-2xl sm:text-3xl" style={{ color: 'var(--content-muted)' }}></i>
                  </div>
                  <div className="text-center">
                    <p className="text-base sm:text-lg font-medium mb-2" style={{ color: 'var(--content-secondary)' }}>No statements found</p>
                    <p className="text-xs sm:text-sm" style={{ color: 'var(--content-muted)' }}>Try adjusting your search terms or browse all statements</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

Statements.displayName = 'Statements';

export default Statements;