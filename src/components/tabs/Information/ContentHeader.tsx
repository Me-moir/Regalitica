"use client";
import { memo } from 'react';

interface ContentHeaderProps {
  icon: string;
  title: string;
  isTransitioning?: boolean;
}

const ContentHeader = memo(({ icon, title, isTransitioning = false }: ContentHeaderProps) => {
  return (
    <div
      className="mb-8 sm:mb-10 lg:mb-12"
      style={{
        opacity:    isTransitioning ? 0 : 1,
        transform:  isTransitioning ? 'translateY(8px)' : 'translateY(0)',
        transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div
          className="text-2xl sm:text-3xl lg:text-4xl"
          style={{
            background:             'linear-gradient(135deg, rgba(0, 255, 166, 0.9), rgba(59, 130, 246, 0.9))',
            WebkitBackgroundClip:   'text',
            WebkitTextFillColor:    'transparent',
            backgroundClip:         'text',
          }}
        >
          <i className={`bi ${icon}`} />
        </div>

        <h2
          className="text-2xl sm:text-3xl lg:text-5xl font-bold"
          style={{
            background:           'var(--text-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor:  'transparent',
            backgroundClip:       'text',
            lineHeight:           '1.3',
          }}
        >
          {title}
        </h2>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border-dashed)] to-transparent" />
    </div>
  );
});

ContentHeader.displayName = 'ContentHeader';
export default ContentHeader;