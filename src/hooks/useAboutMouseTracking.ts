import { useCallback } from 'react';

/**
 * Custom hook for tracking mouse position and applying CSS variables
 * Used for radial gradient effects on hover in the About section
 */
export const useAboutMouseTracking = () => {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.style.setProperty('--mouse-x', `${x}px`);
      target.style.setProperty('--mouse-y', `${y}px`);
    });
  }, []);

  return { handleMouseMove };
};