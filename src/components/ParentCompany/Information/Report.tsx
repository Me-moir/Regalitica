"use client";
import { memo } from 'react';
import { contentData } from '@/data/information-data';
import ContentSection from './ContentSection';

interface ReportProps {
  isTransitioning?: boolean;
}

const Report = memo(({ isTransitioning = false }: ReportProps) => {
  return <ContentSection content={contentData.report} isTransitioning={isTransitioning} />;
});

Report.displayName = 'Report';

export default Report;
