"use client";
import { useEffect, useState, memo } from 'react';
import Prism from '@/components/ui/Prism';
import { ContainerTextFlip } from "@/components/ui/container-text-flip";

// Memoize the logo data to prevent recreating on each render
const LOGOS = [
  { src: "/assets/nextjs.png", alt: "Next.js" },
  { src: "/assets/react.png", alt: "React" },
  { src: "/assets/framer.png", alt: "Framer Motion" },
  { src: "/assets/gsap.png", alt: "GSAP" },
  { src: "/assets/spline.png", alt: "Spline" },
  { src: "/assets/tailwind.png", alt: "Tailwind CSS" },
  { src: "/assets/aceternity.png", alt: "Aceternity UI" },
] as const;

// Extract Logo component for better performance
const Logo = memo<{ src: string; alt: string }>(({ src, alt }) => (
  <img 
    src={src} 
    alt={alt} 
    className="grayscale hover:grayscale-0 transition-all duration-300 h-4 sm:h-5 md:h-7 lg:h-9 hover:scale-110 flex-shrink-0" 
    style={{ width: 'auto', objectFit: 'contain' }}
    loading="lazy"
    decoding="async"
  />
));
Logo.displayName = 'Logo';

const HeroSection = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'var(--surface-primary)' }}>
      <style jsx>{`
        @media (max-width: 768px) {
          section {
            min-height: 0 !important;
            height: fit-content !important;
            padding-top: 8rem;
            padding-bottom: 1rem;
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes liquidFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Use transform and opacity for better performance */
        .animate-shimmer {
          animation: shimmer 3s infinite;
          will-change: transform;
        }

        .animate-liquid {
          animation: liquidFlow 8s ease infinite;
          will-change: background-position;
        }

        /* Optimize for GPU acceleration */
        .gpu-accelerated {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
      
      {/* Prism Background - use pointer-events-none to prevent interaction overhead */}
      <div 
        className="gpu-accelerated" 
        style={{ 
          width: '100%', 
          height: '100%', 
          position: 'absolute', 
          top: 0, 
          left: 0,
          pointerEvents: 'none'
        }}
      >
        <Prism
          animationType="hover"
          timeScale={1}
          height={3}
          baseWidth={5}
          scale={2.5}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={1}
        />
      </div>
      
      {/* Text Overlay */}
      <div className="relative z-20 w-full max-w-6xl mx-auto text-center px-3 sm:px-4 md:px-6 lg:px-12 mt-8 sm:mt-12 md:mt-16">
        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-3 sm:mb-4 md:mb-5 max-w-4xl mx-auto drop-shadow-lg font-bold leading-tight overflow-visible">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-x-2 px-2 sm:px-3 md:px-6 overflow-visible">
            <span className="whitespace-nowrap bg-clip-text text-transparent" style={{ backgroundImage: 'var(--text-gradient-hero)' }}>
              We build systems that build
            </span>
            {isMounted && (
              <span 
                className="inline-flex justify-center sm:justify-start items-center w-full sm:w-auto overflow-visible" 
                style={{ 
                  minWidth: 'auto', 
                  maxWidth: '100%', 
                  minHeight: '1.5em', 
                  paddingTop: '0.1em', 
                  paddingBottom: '0.1em' 
                }}
              >
                <div className="overflow-visible w-full">
                  <ContainerTextFlip 
                    words={["Companies", "Possibilities", "Dominance"]} 
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl overflow-visible" 
                  />
                </div>
              </span>
            )}
          </div>
        </div>
        
        <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl max-w-3xl mx-auto drop-shadow-lg leading-relaxed mb-4 sm:mb-6 md:mb-8 px-2" style={{ color: 'var(--content-tertiary)' }}>
          <strong className="font-bold" style={{ color: 'var(--content-secondary)' }}>Regalitica</strong> is a holding and venture-building entity focused on developing early-stage systems.
        </p>

        <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-24 mb-0 pb-0 flex items-center justify-center px-2 sm:px-3">
          {/* Liquid Glass Container */}
          <div className="relative group w-full max-w-5xl">
            {/* Glass Effect - use will-change sparingly */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-2xl sm:rounded-3xl blur-xl"></div>
            
            {/* Main Glass Container */}
            <div 
              className="relative backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 gpu-accelerated"
              style={{
                background: 'var(--hover-bg)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Shimmer Effect - optimize with will-change on hover only */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
                  style={{
                    backgroundSize: '200% 100%',
                  }}
                ></div>
              </div>

              {/* Liquid Gradient Border Animation - limit will-change scope */}
              <div 
                className="absolute inset-0 opacity-50 group-hover:opacity-75 transition-opacity duration-700 rounded-2xl sm:rounded-3xl animate-liquid pointer-events-none"
                style={{
                  background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1), rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1))',
                  backgroundSize: '400% 400%',
                }}
              ></div>

              {/* Logos Container - Single Row Centered */}
              <div className="relative flex items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8 px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 md:py-5">
                {LOGOS.map((logo) => (
                  <Logo key={logo.alt} src={logo.src} alt={logo.alt} />
                ))}
              </div>

              {/* Bottom Reflection */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white/5 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(HeroSection);