"use client";
import { lazy, Suspense } from 'react';

// Eager load: These are preloaded during LoadingScreen
import HeroSection from './HeroSection';
import BufferSection from './BufferSection';
import Overview from './Overview';
import AboutHeader from './AboutHeader';
import InsideOurWorld from './About';
import FeatureSection from './FeatureSection';

// Lazy load: Load on-demand as user scrolls
const Team = lazy(() => import('./Team'));
const Contact = lazy(() => import('./Contact'));

interface DiscoverProps {
  activeCardIndex: number;
  setActiveCardIndex: (index: number) => void;
  textAnimationKey: number;
  isAnimating: boolean;
}

const Discover = ({ 
  activeCardIndex, 
  setActiveCardIndex,
  textAnimationKey,
  isAnimating 
}: DiscoverProps) => {
  return (
    <>
      {/* Home - Hero Section */}
      <HeroSection />
      
      {/* Buffer Section - "What's in Regalitica?" */}
      <BufferSection />
      
      {/* Overview Section - 4x2 Grid */}
      <Overview />
      
      {/* About Header Section - "Building Enterprises with Purpose" */}
      <AboutHeader />
      
      {/* Inside Our World Section */}
      <InsideOurWorld />
      
      {/* Feature Section - Interactive Cards */}
      <Suspense fallback={<div className="h-screen" style={{ background: 'var(--gradient-section)' }} />}>
        <FeatureSection
          activeCardIndex={activeCardIndex}
          setActiveCardIndex={setActiveCardIndex}
          textAnimationKey={textAnimationKey}
          isAnimating={isAnimating}
        />
      </Suspense>
      
      {/* Our Team Section */}
      <Suspense fallback={<div className="min-h-screen" style={{ background: 'var(--surface-primary)' }} />}>
        <Team />
      </Suspense>
      
      {/* Reach Out Section */}
      <Suspense fallback={<div className="min-h-screen" style={{ background: 'var(--surface-primary)' }} />}>
        <Contact />
      </Suspense>

    </>
  );
};

export default Discover;