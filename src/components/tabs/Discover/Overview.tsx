"use client";
import { memo } from 'react';
import { FeatureSections } from '@/data/Discover-data';
import styles from '@/styles/ui.module.css';

const Overview = memo(() => {
  return (
    <section 
      className="relative overflow-hidden mb-12 md:mb-20"
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

      <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-12 md:py-16 lg:py-20">
        {/* 2x3 Grid on mobile/tablet, 3x2 on desktop with adjusted gaps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {FeatureSections.map((feature, index) => (
            <div 
              key={index}
              className="relative backdrop-blur-sm transition-all group overflow-hidden"
              style={{
                borderRadius: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.25rem',
                minHeight: '180px',
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
                  borderRadius: '1rem',
                  padding: '1px',
                  background: 'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 166, 0.8), rgba(255, 215, 0, 0.6), rgba(236, 72, 153, 0.6), rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.5), transparent 70%)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  zIndex: 1,
                }}
              />

              <div 
                className="relative z-10 h-full"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  gap: 0,
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  background: 'linear-gradient(135deg, #0f0f0f 0%, #050505 100%)',
                  border: '0.75px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div className="mb-4 text-2xl md:text-3xl lg:text-4xl text-white/80 transition-transform duration-300 group-hover:-translate-y-2">
                  <i className={`bi ${feature.icon}`}></i>
                </div>
                
                <h3 
                  className="text-base md:text-lg lg:text-xl mb-3 leading-tight transition-transform duration-300 group-hover:-translate-y-2"
                  style={{
                    color: 'white',
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  {feature.title}
                </h3>
                
                <p 
                  className="text-sm md:text-base lg:text-lg transition-transform duration-300 group-hover:-translate-y-2"
                  style={{
                    color: 'rgb(163, 163, 163)',
                    lineHeight: '2rem',
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
              borderRadius: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.25rem',
              minHeight: '180px',
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
                borderRadius: '1rem',
                padding: '1px',
                background: 'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 166, 0.8), rgba(255, 215, 0, 0.6), rgba(236, 72, 153, 0.6), rgba(147, 51, 234, 0.6), rgba(59, 130, 246, 0.5), transparent 70%)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                zIndex: 1,
              }}
            />

            <div 
              className="relative z-10 h-full flex items-center justify-center"
              style={{
                borderRadius: '0.75rem',
                background: '#000000',
                border: '0.75px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                <h3 
                  className="text-xl md:text-2xl lg:text-3xl font-semibold transition-all duration-300 group-hover:scale-110"
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
                  className="bi bi-arrow-up-right-square text-xl md:text-2xl lg:text-3xl transition-all duration-300 group-hover:scale-110"
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