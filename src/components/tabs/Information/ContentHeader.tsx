"use client";
import { memo } from 'react';

interface ContentHeaderProps {
  icon: string;
  title: string;
  isTransitioning?: boolean;
}

const ContentHeader = memo(({ icon, title }: ContentHeaderProps) => {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-4 mb-4">
        <div 
          className="text-4xl"
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
          className="text-4xl lg:text-5xl font-bold"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #d4d4d4 50%, #a3a3a3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '1.3'
          }}
        >
          {title}
        </h2>
      </div>
      
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  );
});

ContentHeader.displayName = 'ContentHeader';

export default ContentHeader;