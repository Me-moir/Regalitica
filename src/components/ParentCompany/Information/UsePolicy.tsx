"use client";
import { memo } from 'react';
import { contentData } from '@/data/information-data';
import ContentSection from './ContentSection';

interface UsePolicyProps {
  isTransitioning?: boolean;
}

const UsePolicy = memo(({ isTransitioning = false }: UsePolicyProps) => {
  return <ContentSection content={contentData['acceptable-use']} isTransitioning={isTransitioning} />;
});

UsePolicy.displayName = 'UsePolicy';

export default UsePolicy;