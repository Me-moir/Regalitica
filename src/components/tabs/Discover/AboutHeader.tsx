"use client";
import { memo } from "react";

const AboutHeader = memo(() => {
  return (
    <section 
      className="relative"
      style={{
        marginTop: '4rem',
        marginBottom: '0',
      }}
    >
      <style>{`
        /* Desktop-specific margins */
        @media (min-width: 768px) {
          .about-header-section {
            margin-top: 200px;
            margin-bottom: 0;
          }
        }
      `}</style>

      <div 
        className="about-header-section px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-8 sm:py-10 md:py-12 lg:py-16" 
        style={{
          borderBottom: '1px dashed rgba(255, 255, 255, 0.2)',
        }}
      >
        <h2 
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-5 md:mb-6"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #d4d4d4 50%, #a3a3a3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Building Enterprises with Purpose
        </h2>
        <p 
          className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 max-w-4xl"
          style={{ lineHeight: '1.6' }}
        >
          We are a strategic holding company focused on developing high-impact ventures. Guided by clear direction, strong governance, and a culture of excellence, we invest in ideas that shape the future.
        </p>
      </div>
    </section>
  );
});

AboutHeader.displayName = 'AboutHeader';

export default AboutHeader;