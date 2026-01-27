"use client";
import { useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

const HeroSection = () => {
  const [isMounted, setIsMounted] = useState(false);

  const placeholders = [
    "Valid Email Address",
    "The Best Way to Reach You",
    "Company or Personal email, either works",
    "Join Our Initiative!",
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Email changed:', e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log('Email submitted:', e);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Spline 3D Scene Background with Vignette Overlay */}
      <main className="absolute inset-0 w-full h-full scale-[1.15] z-0" style={{ transform: 'translateY(-20%)' }}>
        <Spline
          scene="https://prod.spline.design/4UafzF3exFxPPgi6/scene.splinecode" 
        />
        
        {/* Vignette overlay on Spline container - tight corners only */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at bottom left, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.6) 10%, rgba(0, 0, 0, 0.3) 20%, transparent 30%),
              radial-gradient(ellipse at bottom right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 1) 25%, transparent 20%)
            `
          }}
        />
      </main>
      
      {/* Text Overlay */}
      <div className="relative z-20 max-w-6xl mx-auto text-center px-6 sm:px-8 lg:px-12 mt-24">
        {/* First line with animated text */}
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-6 max-w-4xl mx-auto drop-shadow-lg font-bold leading-tight">
          <div className="flex items-center justify-center gap-x-2 pl-8">
            <span className="whitespace-nowrap bg-gradient-to-b from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">We build systems that build</span>
            {isMounted && (
              <span className="inline-flex justify-start items-center overflow-hidden" style={{ minWidth: '350px' }}>
                <ContainerTextFlip 
                  words={["Companies", "Possibilities", "Dominance"]} 
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl" 
                />
              </span>
            )}
          </div>
        </div>
        
        {/* Second paragraph */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto drop-shadow-lg leading-relaxed mb-10">
          <strong className="font-bold text-gray-200">Regalitica</strong> is a holding company designed to accelerate innovation that drives progress. From proven assets to frontier ventures, we engineer growth at every scale.
        </p>

        {/* Email Input - Use the fixed PlaceholdersAndVanishInput component */}
        {isMounted && (
          <div className="max-w-2xl mx-auto pointer-events-auto relative z-30">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          </div>
        )}

{/* Logo Row - Tech Stack */}
<div className="mt-32 flex items-center justify-center gap-3 sm:gap-5 md:gap-7 opacity-40 hover:opacity-70 transition-opacity duration-500 flex-wrap px-4">
  <img src="/assets/nextjs.png" alt="Next.js" className="grayscale hover:grayscale-0 transition-all duration-300 h-7 sm:h-9 md:h-11" style={{ width: 'auto', objectFit: 'contain' }} />
  <img src="/assets/react.png" alt="React" className="grayscale hover:grayscale-0 transition-all duration-300 h-7 sm:h-9 md:h-11" style={{ width: 'auto', objectFit: 'contain' }} />
  <img src="/assets/framer.png" alt="Framer Motion" className="grayscale hover:grayscale-0 transition-all duration-300 h-7 sm:h-9 md:h-11" style={{ width: 'auto', objectFit: 'contain' }} />
  <img src="/assets/gsap.png" alt="GSAP" className="grayscale hover:grayscale-0 transition-all duration-300 h-7 sm:h-9 md:h-11" style={{ width: 'auto', objectFit: 'contain' }} />
  <img src="/assets/spline.png" alt="Spline" className="grayscale hover:grayscale-0 transition-all duration-300 h-7 sm:h-9 md:h-11" style={{ width: 'auto', objectFit: 'contain' }} />
  <img src="/assets/tailwind.png" alt="Tailwind CSS" className="grayscale hover:grayscale-0 transition-all duration-300 h-7 sm:h-9 md:h-11" style={{ width: 'auto', objectFit: 'contain' }} />
  <img src="/assets/aceternity.png" alt="Aceternity UI" className="grayscale hover:grayscale-0 transition-all duration-300 h-7 sm:h-9 md:h-11" style={{ width: 'auto', objectFit: 'contain' }} />
</div>
      </div>
    </section>
  );
};

export default HeroSection;