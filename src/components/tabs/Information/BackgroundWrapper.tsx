"use client";
import { memo, ReactNode } from 'react';

interface BackgroundWrapperProps {
  children: ReactNode;
  isTransitioning?: boolean;
}

const BackgroundWrapper = memo(({ children, isTransitioning = false }: BackgroundWrapperProps) => {
  return (
    <div 
      className="relative overflow-hidden mb-20"
      style={{
        background: 'linear-gradient(to bottom, rgb(20, 20, 20) 0%, rgb(10, 10, 10) 50%, rgb(0, 0, 0) 100%)',
        borderTop: '1px dashed rgba(255, 255, 255, 0.2)',
        borderBottom: '1px dashed rgba(255, 255, 255, 0.2)',
        borderLeft: '1px dashed rgba(255, 255, 255, 0.2)',
        borderRight: '1px dashed rgba(255, 255, 255, 0.2)',
      }}
    >
      {/* Grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '100px 100px',
        }}
      />

      {/* Content with transition */}
      <div
        className="relative z-10"
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
          transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {children}
      </div>
    </div>
  );
});

BackgroundWrapper.displayName = 'BackgroundWrapper';

export default BackgroundWrapper;