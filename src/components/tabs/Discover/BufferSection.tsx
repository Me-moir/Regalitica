"use client";
import { memo } from 'react';
import styles from '@/styles/ui.module.css';

const BufferSection = memo(() => {
  return (
    <section 
      className="relative py-8 md:py-12"
      style={{
        background: 'linear-gradient(to bottom, rgb(20, 20, 20) 0%, rgb(10, 10, 10) 50%, rgb(0, 0, 0) 100%)',
        borderTop: '1px dashed rgba(255, 255, 255, 0.2)',
      }}
    >
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold inline">
            {'What\'s in Regalitica? '.split('').map((letter, i) => (
              <span 
                key={i} 
                className={styles.premiumBtnLetter}
                style={{ 
                  animationDelay: `${i * 0.08}s`,
                  background: 'linear-gradient(135deg, #ffffff 0%, #d4d4d4 50%, #a3a3a3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block',
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </h2>
          <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl inline">
            {'Everything. Structured.'.split('').map((letter, i) => (
              <span 
                key={i} 
                className={styles.premiumBtnLetter}
                style={{ 
                  animationDelay: `${(i + 20) * 0.08}s`,
                  color: 'rgba(255, 255, 255, 0.6)',
                  display: 'inline-block',
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </span>
        </div>
      </div>
    </section>
  );
});

BufferSection.displayName = 'BufferSection';

export default BufferSection;