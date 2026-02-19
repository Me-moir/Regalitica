"use client";
import { memo } from 'react';
import ContentHeader from './ContentHeader';
import type { ContentData } from '@/data/information-data';

interface ContentSectionProps {
  content: ContentData;
  isTransitioning?: boolean;
}

const ContentSection = memo(({ content, isTransitioning = false }: ContentSectionProps) => {
  return (
    <div className="px-4 sm:px-8 lg:px-20 py-8 sm:py-12 lg:py-16">
      <div className="max-w-5xl mx-auto">
        {/* id used by Information.tsx autoscroll to land exactly at the title */}
        <div id="info-section-title">
          <ContentHeader
            icon={content.icon}
            title={content.title}
            isTransitioning={isTransitioning}
          />
        </div>

        <div className="space-y-6 sm:space-y-8">
          {content.sections.map((section, index) => (
            <div key={index} className="space-y-3 sm:space-y-4">
              {section.heading && (
                <h3
                  className="text-xl sm:text-2xl lg:text-3xl font-semibold"
                  style={{ color: 'var(--content-primary)' }}
                >
                  {section.heading}
                </h3>
              )}

              <div className="space-y-3 sm:space-y-4">
                {section.content.map((paragraph, pIndex) => (
                  <p
                    key={pIndex}
                    className="text-base sm:text-lg lg:text-xl leading-relaxed"
                    style={{ color: 'var(--content-muted)' }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {index < content.sections.length - 1 && (
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent mt-6 sm:mt-8" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8" style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-sm sm:text-base text-center" style={{ color: 'var(--content-muted)' }}>
            Last updated: January 2026 • For questions or concerns, please contact our legal team
          </p>
        </div>
      </div>
    </div>
  );
});

ContentSection.displayName = 'ContentSection';
export default ContentSection;