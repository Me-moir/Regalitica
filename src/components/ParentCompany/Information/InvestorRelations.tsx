"use client";
import { memo } from 'react';
import { contentData } from '@/data/information-data';
import ContentSection from './ContentSection';

interface InvestorRelationsProps {
  isTransitioning?: boolean;
}

const InvestorRelations = memo(({ isTransitioning = false }: InvestorRelationsProps) => {
  return <ContentSection content={contentData['investor-relations']} isTransitioning={isTransitioning} />;
});

InvestorRelations.displayName = 'InvestorRelations';

export default InvestorRelations;