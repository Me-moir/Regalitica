"use client";
import { memo } from 'react';
import { contentData } from '@/data/information-data';
import ContentSection from './ContentSection';

interface DisclaimerProps {
  isTransitioning?: boolean;
}

const Disclaimer = memo(({ isTransitioning = false }: DisclaimerProps) => {
  return <ContentSection content={contentData.disclaimer} isTransitioning={isTransitioning} />;
});

Disclaimer.displayName = 'Disclaimer';

export default Disclaimer;