"use client";
import { memo } from 'react';
import { FeatureSections } from '@/data/Discover-data';
import styles from '@/styles/ui.module.css';

const Overview = memo(() => {
  return (
    <section 
      className="relative overflow-hidden mb-8 md:mb-12"
      style={{
        background: 'linear-gradient(to bottom, rgb(20, 20, 20) 0%, rgb(10, 10, 10) 50%, rgb(0, 0, 0) 100%)',
        borderTop: '1px dashed rgba(255, 255, 255, 0.2)',
        borderBottom: '1px dashed rgba(255, 255, 255, 0.2)',
      }}
    >
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '100px 100px',
        }}
      />

      <div className="relative z-10 px-3 sm:px-4 md:px-6 lg:px-12 xl:px-20 py-8 md:py-12 lg:py-16">
        {/* 2 columns on mobile, 3 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {FeatureSections.map((feature, index) => (
            <div 
              key={index}
              className="relative backdrop-blur-sm transition-all group overflow-hidden"
              style={{
                borderRadius: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.25rem',
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
              }}
            >
              {/* Hover gradient border effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  borderRadius: '0.75rem',
                  padding: '1px',
                  background: 'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 166, 0.8), rgba(255, 215, 0, 0.6), rgba(236, 72, 153, 0.6), rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.5), transparent 70%)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  zIndex: 1,
                }}
              />

              <div 
                className="relative z-10 h-full md:!p-8 lg:!p-10 md:!min-h-[240px] lg:!min-h-[280px]"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  gap: 0,
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  background: 'linear-gradient(135deg, #0f0f0f 0%, #050505 100%)',
                  border: '0.75px solid rgba(255, 255, 255, 0.05)',
                  minHeight: '140px',
                }}
              >
                <div className="mb-2 md:mb-4 lg:mb-5 text-lg md:text-2xl lg:text-3xl xl:text-4xl text-white/80 transition-transform duration-300 group-hover:-translate-y-1">
                  <i className={`bi ${feature.icon}`}></i>
                </div>
                
                <h3 
                  className="text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl mb-2 md:mb-3 lg:mb-4 leading-tight transition-transform duration-300 group-hover:-translate-y-1"
                  style={{
                    color: 'white',
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  {feature.title}
                </h3>
                
                <p 
                  className="text-[10px] sm:text-xs md:text-base lg:text-lg transition-transform duration-300 group-hover:-translate-y-1 !leading-relaxed md:!leading-relaxed lg:!leading-relaxed"
                  style={{
                    color: 'rgb(163, 163, 163)',
                    lineHeight: '1.4',
                    margin: 0,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            </div>
          ))}

          {/* Learn More Card */}
          <div 
            className="relative backdrop-blur-sm transition-all group overflow-hidden cursor-pointer"
            style={{
              borderRadius: '0.75rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.25rem',
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
              e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
            }}
          >
            {/* Hover gradient border effect */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                borderRadius: '0.75rem',
                padding: '1px',
                background: 'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 166, 0.8), rgba(255, 215, 0, 0.6), rgba(236, 72, 153, 0.6), rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.5), transparent 70%)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                zIndex: 1,
              }}
            />

            <div 
              className="relative z-10 h-full flex items-center justify-center md:min-h-[240px] lg:min-h-[280px]"
              style={{
                borderRadius: '0.5rem',
                background: '#000000',
                border: '0.75px solid rgba(255, 255, 255, 0.05)',
                minHeight: '140px',
              }}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                <h3 
                  className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-semibold transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #d4d4d4 50%, #a3a3a3 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Learn More
                </h3>
                <i 
                  className="bi bi-arrow-up-right-square text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #d4d4d4 50%, #a3a3a3 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Overview.displayName = 'Overview';

export default Overview;