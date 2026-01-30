"use client";
import { memo } from 'react';
import { contentData } from '@/data/information-data';
import ContentSection from './ContentSection';

interface TermsProps {
  isTransitioning?: boolean;
}

const Terms = memo(({ isTransitioning = false }: TermsProps) => {
  return <ContentSection content={contentData.terms} isTransitioning={isTransitioning} />;
});

Terms.displayName = 'Terms';

export default Terms;