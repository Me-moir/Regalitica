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
          borderBottom: '1px dashed var(--border-dashed)',
        }}
      >
        <h2 
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 md:mb-6"
          style={{
            background: 'var(--text-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Building Enterprises with Purpose
        </h2>
        <p 
          className="text-sm sm:text-base md:text-lg lg:text-xl max-w-4xl"
          style={{ lineHeight: '1.6', color: 'var(--content-muted)' }}
        >
          We are a strategic holding company focused on developing high-impact ventures. Guided by clear direction, strong governance, and a culture of excellence, we invest in ideas that shape the future.
        </p>
      </div>
    </section>
  );
});

AboutHeader.displayName = 'AboutHeader';

export default AboutHeader;