"use client";
import { memo } from 'react';
import { contentData } from '@/data/information-data';
import ContentSection from './ContentSection';

interface LicensesProps {
  isTransitioning?: boolean;
}

const Licenses = memo(({ isTransitioning = false }: LicensesProps) => {
  return <ContentSection content={contentData.licenses} isTransitioning={isTransitioning} />;
});

Licenses.displayName = 'Licenses';

export default Licenses;