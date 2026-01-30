"use client";
import { memo } from 'react';
import { contentData } from '@/data/information-data';
import ContentSection from './ContentSection';

interface NewsMediaProps {
  isTransitioning?: boolean;
}

const NewsMedia = memo(({ isTransitioning = false }: NewsMediaProps) => {
  return <ContentSection content={contentData.news} isTransitioning={isTransitioning} />;
});

NewsMedia.displayName = 'NewsMedia';

export default NewsMedia;