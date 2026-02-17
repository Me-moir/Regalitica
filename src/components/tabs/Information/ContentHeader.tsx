"use client";
import { memo } from 'react';

interface ContentHeaderProps {
  icon: string;
  title: string;
  isTransitioning?: boolean;
}

const ContentHeader = memo(({ icon, title }: ContentHeaderProps) => {
  return (
    <div className="mb-8 sm:mb-10 lg:mb-12">
      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div 
          className="text-2xl sm:text-3xl lg:text-4xl"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 166, 0.9), rgba(59, 130, 246, 0.9))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          <i className={`bi ${icon}`}></i>
        </div>
        
        <h2 
          className="text-2xl sm:text-3xl lg:text-5xl font-bold"
          style={{
            background: 'var(--text-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '1.3'
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