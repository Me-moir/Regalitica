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
    <div className="px-12 lg:px-20 py-16">
      <div className="max-w-5xl mx-auto">
        <ContentHeader
          icon={content.icon}
          title={content.title}
          isTransitioning={false}
        />

        {/* Content sections */}
        <div className="space-y-8">
          {content.sections.map((section, index) => (
            <div key={index} className="space-y-4">
              {section.heading && (
                <h3 className="text-2xl font-semibold text-white/90">
                  {section.heading}
                </h3>
              )}
              
              <div className="space-y-4">
                {section.content.map((paragraph, pIndex) => (
                  <p 
                    key={pIndex}
                    className="text-base text-gray-400 leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Divider between sections (except last) */}
              {index < content.sections.length - 1 && (
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-8" />
              )}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-gray-500 text-center">
            Last updated: January 2026 • For questions or concerns, please contact our legal team
          </p>
        </div>
      </div>
    </div>
  );
});

ContentSection.displayName = 'ContentSection';

export default ContentSection;