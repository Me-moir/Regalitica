import { useState, useCallback, useRef, useEffect } from 'react';

type WorldContentType = "company" | "philosophy" | "ecosystem" | "direction" | "governance" | "ethics";

interface UseAboutNavigationReturn {
  activeContent: WorldContentType;
  displayContent: WorldContentType;
  isTransitioning: boolean;
  selectorPosition: number;
  activeSubsection: Record<WorldContentType, string>;
  displaySubsection: Record<WorldContentType, string>;
  isTabTransitioning: boolean;
  handleContentChange: (newContent: WorldContentType) => void;
  handleSubsectionChange: (subsectionKey: string) => void;
}

const INITIAL_SUBSECTIONS: Record<WorldContentType, string> = {
  company: 'about-us',
  philosophy: 'core-beliefs',
  ecosystem: 'subsidiaries',
  direction: 'mission',
  governance: 'org-structure',
  ethics: 'ethical-framework'
};

export const useAboutNavigation = (gridItems: any[]): UseAboutNavigationReturn => {
  const [activeContent, setActiveContent] = useState<WorldContentType>("company");
  const [displayContent, setDisplayContent] = useState<WorldContentType>("company");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectorPosition, setSelectorPosition] = useState(0);
  const [activeSubsection, setActiveSubsection] = useState<Record<WorldContentType, string>>(INITIAL_SUBSECTIONS);
  const [displaySubsection, setDisplaySubsection] = useState<Record<WorldContentType, string>>(INITIAL_SUBSECTIONS);
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const tabTransitionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      if (tabTransitionTimeoutRef.current) {
        clearTimeout(tabTransitionTimeoutRef.current);
      }
    };
  }, []);

  // Handle main content change
  const handleContentChange = useCallback((newContent: WorldContentType) => {
    if (newContent === displayContent) return;
    
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    
    const index = gridItems.findIndex(item => item.key === newContent);
    setSelectorPosition(index);
    setDisplayContent(newContent);
    setIsTransitioning(true);
    
    transitionTimeoutRef.current = setTimeout(() => {
      setActiveContent(newContent);
      setIsTransitioning(false);
    }, 350);
  }, [displayContent, gridItems]);

  // Handle subsection tab change
  const handleSubsectionChange = useCallback((subsectionKey: string) => {
    if (subsectionKey === activeSubsection[activeContent]) return;
    
    setActiveSubsection(prev => ({
      ...prev,
      [activeContent]: subsectionKey
    }));
    
    if (tabTransitionTimeoutRef.current) {
      clearTimeout(tabTransitionTimeoutRef.current);
    }
    
    setIsTabTransitioning(true);
    
    tabTransitionTimeoutRef.current = setTimeout(() => {
      setDisplaySubsection(prev => ({
        ...prev,
        [activeContent]: subsectionKey
      }));
      setIsTabTransitioning(false);
    }, 350);
  }, [activeContent, activeSubsection]);

  return {
    activeContent,
    displayContent,
    isTransitioning,
    selectorPosition,
    activeSubsection,
    displaySubsection,
    isTabTransitioning,
    handleContentChange,
    handleSubsectionChange,
  };
};