"use client";
import { lazy, Suspense } from 'react';

// Eager load: These are preloaded during LoadingScreen
import HeroSection from './HeroSection';
import BufferSection from './BufferSection';
import Overview from './Overview';
import InsideOurWorld from './InsideOurWorld';
import ProjectHighlightsTitle from './ProjectHighlightsTitle';
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
      
      {/* Inside Our World Section */}
      <InsideOurWorld />
      
      {/* Project Highlights Section */}
      <ProjectHighlightsTitle />
      <Suspense fallback={<div className="h-screen bg-gradient-to-b from-[#141414] via-[#0a0a0a] to-black" />}>
        <FeatureSection
          activeCardIndex={activeCardIndex}
          setActiveCardIndex={setActiveCardIndex}
          textAnimationKey={textAnimationKey}
          isAnimating={isAnimating}
        />
      </Suspense>
      
      {/* Our Team Section */}
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <Team />
      </Suspense>
      
      {/* Reach Out Section */}
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <Contact />
      </Suspense>

    </>
  );
};

export default Discover;