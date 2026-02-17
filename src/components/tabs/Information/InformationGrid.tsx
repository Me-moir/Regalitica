"use client";
import { memo } from 'react';
import { informationGrids, type InfoContentType } from '@/data/information-data';

interface InformationGridProps {
  onContentChange: (content: InfoContentType) => void;
  activeContent: InfoContentType;
}

const InformationGrid = memo(({ onContentChange, activeContent }: InformationGridProps) => {
  return (
    <section 
      className="relative overflow-hidden"
      style={{
        background: 'var(--surface-secondary)',
        paddingTop: 'env(safe-area-inset-top)'
      }}
    >
      <style>{`
        @keyframes orbitBorder {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
      `}</style>

      {/* Grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '100px 100px',
        }}
      />

      <div className="relative z-10 px-4 sm:px-8 lg:px-20 pt-24 pb-8 sm:pt-28 sm:pb-12 lg:pt-32 lg:pb-16">
        {/* Section Header */}
        <div className="mb-6 sm:mb-10 lg:mb-12 text-center">
          <h2 
            className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-3 sm:mb-4"
            style={{
              background: 'var(--text-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: '1.3'
            }}
          >
            Information Hub
          </h2>
          <div className="w-24 sm:w-32 h-px mx-auto" style={{ background: `linear-gradient(to right, transparent, var(--border-dashed), transparent)` }} />
        </div>

        {/* Grid Container with Complete Border Frame */}
        <div 
          className="max-w-7xl mx-auto"
          style={{
            border: '1px dashed var(--border-dashed)'
          }}
        >
          {/* 4x2 Grid */}
          <div className="grid grid-cols-4 grid-rows-2 gap-0">
          {informationGrids.map((grid, index) => {
            const isActive = activeContent === grid.id;
            
            return (
              <button
                key={grid.id}
                onClick={() => onContentChange(grid.id)}
                className="relative backdrop-blur-sm p-3 sm:p-5 lg:p-8 transition-all group overflow-hidden text-left"
                style={{
                  background: 'var(--gradient-card)',
                  borderBottom: index < 4 ? '1px dashed var(--border-dashed)' : 'none',
                  borderRight: (index + 1) % 4 !== 0 ? '1px dashed var(--border-dashed)' : 'none'
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                }}
              >
                {/* Hover background overlay */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                {/* Mouse-following gradient border - Only on hover when not active */}
                {!isActive && (
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: 'radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 166, 0.8), rgba(255, 215, 0, 0.7), rgba(236, 72, 153, 0.7), rgba(147, 51, 234, 0.7), rgba(59, 130, 246, 0.6), transparent 70%)',
                      padding: '1px',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude'
                    }}
                  />
                )}

                {/* Orbiting gradient border - Always shows when active */}
                {isActive && (
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      padding: '1px',
                      background: 'linear-gradient(90deg, transparent 0%, rgba(0, 255, 166, 0.8) 15%, rgba(255, 215, 0, 0.6) 30%, rgba(236, 72, 153, 0.6) 45%, rgba(147, 51, 234, 0.6) 60%, rgba(59, 130, 246, 0.5) 75%, transparent 90%)',
                      backgroundSize: '200% 100%',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      animation: 'orbitBorder 3s linear infinite'
                    }}
                  />
                )}
                
                {/* Icon */}
                <div 
                  className="mb-2 sm:mb-4 lg:mb-6 text-base sm:text-xl lg:text-2xl transition-all duration-300 relative z-10"
                  style={{
                    color: isActive ? 'rgba(0, 255, 166, 0.9)' : 'var(--content-secondary)',
                    transform: isActive ? 'translateY(-4px)' : 'translateY(0)'
                  }}
                >
                  <i className={`bi ${grid.icon}`}></i>
                </div>
                
                {/* Title */}
                <h3 
                  className="text-xs sm:text-sm lg:text-lg font-semibold mb-1 sm:mb-2 lg:mb-3 leading-tight transition-all duration-300 relative z-10"
                  style={{
                    color: isActive ? 'var(--content-primary)' : 'var(--content-secondary)',
                    transform: isActive ? 'translateY(-4px)' : 'translateY(0)'
                  }}
                >
                  {grid.title}
                </h3>
                
                {/* Description */}
                <p 
                  className="text-[10px] sm:text-xs lg:text-sm leading-relaxed transition-all duration-300 relative z-10"
                  style={{
                    color: isActive ? 'var(--content-secondary)' : 'var(--content-muted)',
                    transform: isActive ? 'translateY(-4px)' : 'translateY(0)'
                  }}
                >
                  {grid.description}
                </p>
              </button>
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
});

InformationGrid.displayName = 'InformationGrid';

export default InformationGrid;