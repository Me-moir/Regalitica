"use client";
import { memo } from 'react';
import { contentData } from '@/data/information-data';
import ContentSection from './ContentSection';

interface PrivacyProps {
  isTransitioning?: boolean;
}

const Privacy = memo(({ isTransitioning = false }: PrivacyProps) => {
  return <ContentSection content={contentData.privacy} isTransitioning={isTransitioning} />;
});

Privacy.displayName = 'Privacy';

export default Privacy;