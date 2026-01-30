"use client";
import { memo } from 'react';
import { contentData } from '@/data/information-data';
import ContentSection from './ContentSection';

interface AttributionsProps {
  isTransitioning?: boolean;
}

const Attributions = memo(({ isTransitioning = false }: AttributionsProps) => {
  return <ContentSection content={contentData.attributions} isTransitioning={isTransitioning} />;
});

Attributions.displayName = 'Attributions';

export default Attributions;