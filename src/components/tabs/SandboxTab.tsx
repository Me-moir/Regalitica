"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface HomeTabProps {
  activeCardIndex: number;
  setActiveCardIndex: (index: number) => void;
  textAnimationKey: number;
  isAnimating: boolean;
}

interface TeamMember {
  name: string;
  role: string;
  color: string;
}

interface Industry {
  name: string;
  description: string;
  problem: string;
  valueProposition: string;
  team: TeamMember[];
}

interface Project {
  title: string;
  industryName: string;
  industryDescription: string;
  description: string;
  problem: string;
  valueProposition: string;
  team: TeamMember[];
  domains: string[];
  features: string[];
  timeline: { stage: string; date: string; status: 'complete' | 'current' | 'future' }[];
}

const HomeTab = ({ 
  activeCardIndex, 
  setActiveCardIndex,
  textAnimationKey,
  isAnimating 
}: HomeTabProps) => {
  const [cardRotations, setCardRotations] = useState<Record<number, { rotateX: number; rotateY: number }>>({});
  const [isSection3Visible, setIsSection3Visible] = useState(false);
  const isSection3VisibleRef = useRef(false); // Ref to track latest value
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Industry data with full details - memoized to prevent recreation
  const industries: Industry[] = useMemo(() => [
    {
      name: 'Healthcare',
      description: 'Revolutionary healthcare solutions that make quality care accessible, affordable, and personalized for everyone.',
      problem: 'Rural patients lack access to real-time specialist care, leading to delayed diagnoses and increased healthcare costs. Traditional telemedicine solutions fail to address connectivity issues in underserved areas.',
      valueProposition: 'AI-powered diagnostic assistant that works offline, providing immediate preliminary assessments and prioritizing cases for remote specialist review when connectivity is restored.',
      team: [
        { name: 'Dr. Sarah Chen', role: 'Team Leader', color: 'bg-[#DC143C]' },
        { name: 'Marcus Johnson', role: 'Lead Developer', color: 'bg-blue-500' },
        { name: 'Aisha Patel', role: 'UX Designer', color: 'bg-purple-500' },
        { name: 'David Kim', role: 'Data Scientist', color: 'bg-green-500' },
      ],
    },
    {
      name: 'FinTech',
      description: 'Next-generation financial technology that democratizes access to banking, investing, and wealth management.',
      problem: 'Small businesses in emerging markets lack access to affordable credit and financial services, limiting their growth potential and economic impact.',
      valueProposition: 'Blockchain-based microfinancing platform with AI credit scoring that reduces lending costs by 60% while expanding access to previously unbanked populations.',
      team: [
        { name: 'James Martinez', role: 'CEO & Founder', color: 'bg-[#DC143C]' },
        { name: 'Priya Sharma', role: 'Blockchain Lead', color: 'bg-cyan-500' },
        { name: 'Alex Wong', role: 'Risk Analyst', color: 'bg-indigo-500' },
      ],
    },
    {
      name: 'CleanTech',
      description: 'Sustainable technologies that combat climate change while creating profitable business models.',
      problem: 'Industrial facilities struggle to reduce carbon emissions due to high costs and lack of real-time monitoring systems.',
      valueProposition: 'IoT-enabled carbon capture system with real-time analytics that reduces industrial emissions by 45% while generating tradeable carbon credits.',
      team: [
        { name: 'Dr. Lisa Zhang', role: 'Chief Scientist', color: 'bg-[#DC143C]' },
        { name: 'Robert Green', role: 'Engineering Lead', color: 'bg-teal-500' },
        { name: 'Maya Okafor', role: 'Sustainability Advisor', color: 'bg-lime-500' },
      ],
    },
    {
      name: 'EdTech',
      description: 'Innovative learning platforms powered by AI that provide personalized education pathways.',
      problem: 'Students in developing regions lack access to quality STEM education, with teacher shortages limiting opportunities.',
      valueProposition: 'AI tutor platform with adaptive learning that provides personalized STEM education at scale, proven to improve test scores by 35%.',
      team: [
        { name: 'Prof. Ahmed Hassan', role: 'Chief Educator', color: 'bg-[#DC143C]' },
        { name: 'Jessica Park', role: 'AI/ML Engineer', color: 'bg-violet-500' },
        { name: 'Carlos Rivera', role: 'Content Director', color: 'bg-fuchsia-500' },
      ],
    },
  ], []);

  // Projects data with full card details - memoized to prevent recreation
  const allProjects: Project[] = useMemo(() => [
    {
      title: 'AI Telemedicine Platform',
      industryName: 'Healthcare',
      industryDescription: industries[0].description,
      description: 'An AI-powered diagnostic assistant for remote healthcare delivery in underserved areas.',
      problem: industries[0].problem,
      valueProposition: industries[0].valueProposition,
      team: industries[0].team,
      domains: ['AI', 'SaaS', 'HealthTech'],
      features: ['Offline Mode', 'AI Diagnostics', 'Real-time Sync', 'HIPAA Compliant', 'Multi-language', 'Cloud Backup'],
      timeline: [
        { stage: 'Concept', date: 'Jan 2024', status: 'complete' },
        { stage: 'Development', date: 'Mar 2024', status: 'complete' },
        { stage: 'Private Beta', date: 'Nov 2024', status: 'current' },
        { stage: 'Live', date: 'Q1 2025', status: 'future' },
        { stage: 'Scale', date: 'Q3 2025', status: 'future' },
      ],
    },
    {
      title: 'Micro-Lending Blockchain',
      industryName: 'FinTech',
      industryDescription: industries[1].description,
      description: 'Blockchain-based microfinancing with AI credit scoring for emerging markets.',
      problem: industries[1].problem,
      valueProposition: industries[1].valueProposition,
      team: industries[1].team,
      domains: ['Blockchain', 'DeFi', 'Web3'],
      features: ['Smart Contracts', 'AI Credit Score', 'Multi-currency', 'KYC Integration', 'Mobile First', 'Low Fees'],
      timeline: [
        { stage: 'Concept', date: 'Feb 2024', status: 'complete' },
        { stage: 'Development', date: 'May 2024', status: 'complete' },
        { stage: 'Beta', date: 'Dec 2024', status: 'current' },
        { stage: 'Launch', date: 'Q2 2025', status: 'future' },
        { stage: 'Expand', date: 'Q4 2025', status: 'future' },
      ],
    },
    {
      title: 'Smart Carbon Capture',
      industryName: 'CleanTech',
      industryDescription: industries[2].description,
      description: 'IoT-enabled carbon capture system with real-time analytics and credit generation.',
      problem: industries[2].problem,
      valueProposition: industries[2].valueProposition,
      team: industries[2].team,
      domains: ['IoT', 'CleanTech', 'AI'],
      features: ['Real-time Monitor', 'Carbon Credits', 'Predictive AI', 'Dashboard', 'API Access', 'Compliance'],
      timeline: [
        { stage: 'Research', date: 'Mar 2024', status: 'complete' },
        { stage: 'Prototype', date: 'Jul 2024', status: 'complete' },
        { stage: 'Pilot', date: 'Jan 2025', status: 'current' },
        { stage: 'Deploy', date: 'Q3 2025', status: 'future' },
        { stage: 'Scale', date: 'Q1 2026', status: 'future' },
      ],
    },
    {
      title: 'Adaptive STEM Learning',
      industryName: 'EdTech',
      industryDescription: industries[3].description,
      description: 'AI tutor platform with personalized learning paths for global STEM education.',
      problem: industries[3].problem,
      valueProposition: industries[3].valueProposition,
      team: industries[3].team,
      domains: ['EdTech', 'AI', 'Mobile'],
      features: ['Adaptive Learning', 'Progress Track', 'Gamification', 'Offline Mode', 'Teacher Tools', 'Analytics'],
      timeline: [
        { stage: 'Design', date: 'Apr 2024', status: 'complete' },
        { stage: 'Build', date: 'Aug 2024', status: 'complete' },
        { stage: 'Testing', date: 'Feb 2025', status: 'current' },
        { stage: 'Release', date: 'Q2 2025', status: 'future' },
        { stage: 'Global', date: 'Q4 2025', status: 'future' },
      ],
    },
  ], [industries]);

  // Partner logos - memoized
  const partners = useMemo(() => [
    'TechCorp', 'InnovateLabs', 'FutureVentures', 'AlphaPartners',
    'BetaGroup', 'GammaInvest', 'DeltaFund', 'EpsilonCapital'
  ], []);

  const activeProject = useMemo(() => 
    allProjects[activeCardIndex - 1] || allProjects[0],
    [activeCardIndex, allProjects]
  );

  // 🎯 PERFORMANCE: Track Section 3 visibility - enable rotation when 70% is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Calculate how much of Section 3 is actually visible in viewport
        const rect = entry.boundingClientRect;
        const viewportHeight = window.innerHeight;
        
        // Calculate visible portion of the section
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(viewportHeight, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        // Calculate percentage of section visible
        const sectionHeight = rect.height;
        const visibilityPercentage = (visibleHeight / sectionHeight) * 100;
        
        // Enable rotation when at least 70% of section is visible in viewport
        const isVisible = visibilityPercentage >= 70;
        
        if (isVisible !== isSection3Visible) {
          console.log('🎯 Rotation:', isVisible ? '✅ ENABLED' : '❌ DISABLED', `(${Math.round(visibilityPercentage)}% visible)`);
        }
        
        setIsSection3Visible(isVisible);
        isSection3VisibleRef.current = isVisible; // Update ref immediately
        
        // Reset rotations when section leaves viewport
        if (!isVisible) {
          setCardRotations({});
        }
      },
      { 
        threshold: Array.from({ length: 21 }, (_, i) => i * 0.05), // Check every 5%
        rootMargin: '0px'
      }
    );

    // Observe Section 3
    const section3 = document.getElementById('industries-carousel-section');
    
    if (section3) {
      observer.observe(section3);
    }

    return () => {
      observer.disconnect();
    };
  }, []); // Empty dependencies - only run once on mount

  // Card mouse handlers - optimized with useCallback and throttling
  const lastCardMouseMoveRef = useRef<number>(0);
  
  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, cardIndex: number) => {
    const cardNumber = cardIndex + 1;
    if (cardNumber !== activeCardIndex) return;
    
    // 🎯 PERFORMANCE: Don't process if Section 3 is not visible (using ref for latest value)
    if (!isSection3VisibleRef.current) {
      // CRITICAL FIX: Instantly reset rotation (remove transition temporarily)
      const card = e.currentTarget;
      const wrapper = card.querySelector('.card-inner-wrapper') as HTMLElement;
      if (wrapper) {
        wrapper.style.transition = 'none'; // Disable transition
        wrapper.style.transform = 'rotateX(0deg) rotateY(0deg)'; // Instant reset
        // Re-enable transition after a frame
        requestAnimationFrame(() => {
          wrapper.style.transition = '';
        });
      }
      setCardRotations(prev => ({
        ...prev,
        [cardIndex]: { rotateX: 0, rotateY: 0 }
      }));
      return;
    }
    
    // 🎯 PERFORMANCE: Throttle to ~60fps
    const now = Date.now();
    if (now - lastCardMouseMoveRef.current < 16) return;
    lastCardMouseMoveRef.current = now;
    
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${percentX}%`);
    card.style.setProperty('--mouse-y', `${percentY}%`);
    
    setCardRotations(prev => ({
      ...prev,
      [cardIndex]: { rotateX, rotateY }
    }));
  }, [activeCardIndex]);

  const handleCardMouseLeave = useCallback((cardIndex: number) => {
    const cardNumber = cardIndex + 1;
    if (cardNumber !== activeCardIndex) return;
    
    // Reset rotation
    setCardRotations(prev => ({
      ...prev,
      [cardIndex]: { rotateX: 0, rotateY: 0 }
    }));
  }, [activeCardIndex]);

  // Auto-carousel timer ref
  const carouselTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isManualInteraction, setIsManualInteraction] = useState(false);

  // Optimized goToCard function
  const goToCard = useCallback((cardIndex: number, manual: boolean = false) => {
    const clampedIndex = Math.max(1, Math.min(cardIndex, allProjects.length));
    setActiveCardIndex(clampedIndex);
    
    if (manual) {
      setIsManualInteraction(true);
      if (carouselTimerRef.current) {
        clearTimeout(carouselTimerRef.current);
      }
      carouselTimerRef.current = setTimeout(() => {
        setIsManualInteraction(false);
      }, 10000);
    }
  }, [allProjects.length, setActiveCardIndex]);

  // Auto-advance carousel - optimized and visibility-aware
  useEffect(() => {
    // 🎯 PERFORMANCE: Don't auto-advance if section is not visible
    if (!isSection3VisibleRef.current) {
      console.log('⏸️ Auto-scroll paused - section not visible enough');
      return;
    }
    
    const autoAdvanceDelay = isManualInteraction ? 10000 : 5000;
    
    const timer = setTimeout(() => {
      const next = activeCardIndex >= allProjects.length ? 1 : activeCardIndex + 1;
      setActiveCardIndex(next);
    }, autoAdvanceDelay);
    
    return () => clearTimeout(timer);
  }, [activeCardIndex, isManualInteraction, allProjects.length, setActiveCardIndex, isSection3Visible]); // Added isSection3Visible

  // Cleanup carousel timer on unmount
  useEffect(() => {
    return () => {
      if (carouselTimerRef.current) {
        clearTimeout(carouselTimerRef.current);
      }
    };
  }, []);

  // Update card styles - optimized with requestAnimationFrame
  useEffect(() => {
    const container = cardsContainerRef.current;
    const cards = cardsRef.current.filter(Boolean);
    
    if (!container || cards.length === 0) return;

    requestAnimationFrame(() => {
      const cardWidth = 400;
      const gap = 80;
      
      const rightPadding = window.innerWidth >= 1024 ? 64 : 32;
      const rightContainerWidth = (window.innerWidth * 0.5) - rightPadding;
      const centerPosition = rightContainerWidth / 2;
      
      const cardArrayIndex = activeCardIndex - 1;
      const offsetToCard = cardArrayIndex * (cardWidth + gap);
      const targetX = -offsetToCard + centerPosition - (cardWidth / 2);
      
      container.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      container.style.transform = `translate3d(${targetX}px, 0, 0)`;
      
      cards.forEach((card, index) => {
        if (!card) return;
        
        const cardNumber = index + 1;
        let scale: number;
        
        if (cardNumber === activeCardIndex) {
          scale = 1.1;
        } else if (Math.abs(cardNumber - activeCardIndex) === 1) {
          scale = 0.95;
        } else {
          scale = 0.85;
        }
        
        card.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.transform = `scale(${scale})`;
      });
    });
  }, [activeCardIndex]);

  return (
    <>
      <style>{`
        /* Performance optimizations */
        html, body {
          overflow-x: hidden;
          font-display: swap;
        }

        @supports (font-variation-settings: normal) {
          * {
            font-feature-settings: 'kern' 1;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }

        .project-card, .card-outer, .card-inner-wrapper {
          will-change: transform, opacity;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          perspective: 1000px;
        }

        .cards-scroll-container {
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
        }

        .noselect {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        .project-card {
          flex-shrink: 0;
          width: 400px;
          height: 500px;
          transform: translate3d(0, 0, 0);
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                      opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      filter 0.4s ease;
        }

        .project-card.card-inactive {
          opacity: 0.3;
          /* Removed blur - too GPU intensive */
        }

        .project-card.card-inactive * {
          animation-play-state: paused !important;
        }

        .project-card.card-inactive .card-inner-wrapper::before {
          opacity: 0 !important;
        }

        .project-card.card-active {
          opacity: 1;
        }

        /* Glowing Effect Box Styles */
        .notification-box {
          position: relative;
          height: auto;
          border-radius: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.5rem;
        }

        .notification-box::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: 1.5rem;
          padding: 2px;
          background: radial-gradient(
            400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
            rgba(34, 197, 94, 0.6),
            rgba(59, 130, 246, 0.5),
            transparent 50%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 1;
          will-change: opacity;
        }

        .notification-box:hover::before {
          opacity: 1;
        }

        .notification-box:hover .box-line-gradient {
          opacity: 1;
        }

        .notification-box:hover .box-icon-gradient {
          opacity: 1;
        }

        .box-line-gradient,
        .box-icon-gradient {
          transition: opacity 0.3s ease;
        }

        /* Smooth color transitions for all text elements */
        .text-white,
        .text-gray-400,
        .text-gray-500,
        .text-gray-300,
        .text-gray-200 {
          transition: color 0.3s ease;
        }

        .box-inner {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 0;
          height: auto;
          overflow: hidden;
          border-radius: 0.75rem;
          padding: 1.25rem;
          background: rgba(24, 24, 27, 0.5);
          border: 0.75px solid rgba(255, 255, 255, 0.05);
          z-index: 2;
        }

        .notititle {
          color: white;
          font-weight: 600;
          font-size: 1rem;
          line-height: 1.25rem;
          margin: 0;
          transition: color 0.3s ease;
        }

        .notibody {
          color: rgb(163, 163, 163);
          font-size: 0.875rem;
          line-height: 1.25rem;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 3.75rem;
          max-height: 3.75rem;
          transition: color 0.3s ease;
        }

        /* Card Outer Styles */
        .card-outer {
          width: 100%;
          height: 100%;
          border-radius: 24px;
          padding: 0;
          background: transparent;
          position: relative;
          perspective: 3500px;
          overflow: visible;
        }

        .card-inner-wrapper {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
          transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-style: preserve-3d;
          border-radius: 24px;
          padding: 0.9px;
          background: transparent;
          overflow: visible;
          border: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 1;
        }

        .card-inner-wrapper::before {
          content: "";
          position: absolute;
          inset: -2px;
          border-radius: 24px;
          padding: 2px;
          background: radial-gradient(
            500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
            rgba(34, 197, 94, 0.8),
            rgba(59, 130, 246, 0.6),
            transparent 60%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
          z-index: 10;
          will-change: opacity;
        }

        .project-card:hover .card-inner-wrapper::before {
          opacity: 1;
        }

        .card-inner {
          z-index: 1;
          width: 100%;
          height: 100%;
          border-radius: 23px;
          border: 0.75px solid rgba(255, 255, 255, 0.05);
          background: linear-gradient(135deg, #0f0f0f 0%, #050505 100%);
          backdrop-filter: blur(20px);
          display: flex;
          flex-direction: column;
          position: relative;
          padding: 24px;
          transform-style: preserve-3d;
        }

        /* Domain Tag Hover Effect */
        .domain-tag {
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .domain-tag::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 4px;
          padding: 1px;
          background: radial-gradient(
            100px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(34, 197, 94, 0.5),
            transparent 70%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          will-change: opacity;
        }

        .domain-tag:hover::before {
          opacity: 1;
        }

        /* Simple White Bullet */
        .prism-bullet {
          display: inline-block;
          font-size: 6px;
          margin-top: 0.125rem;
          color: white;
          text-shadow: 0 0 2px rgba(255, 255, 255, 0.15);
        }

        /* Tech Checkpoints */
        .tech-checkpoint {
          position: relative;
          width: 14px;
          height: 14px;
          cursor: pointer;
          z-index: 10;
        }

        .tech-checkpoint::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
          clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
        }

        .checkpoint-inner {
          position: absolute;
          inset: 3px;
          background: linear-gradient(135deg, #ffffff, #e5e5e5);
          clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
        }

        .tech-checkpoint-complete::before {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.6), rgba(59, 130, 246, 0.5));
        }

        .tech-checkpoint-current {
          width: 10px;
          height: 10px;
        }

        .tech-checkpoint-current::before {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(236, 72, 153, 0.7));
          animation: checkpoint-glow 2s ease-in-out infinite;
        }

        .checkpoint-pulse {
          position: absolute;
          inset: -4px;
          clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
          border: 1.5px solid rgba(255, 255, 255, 0.7);
          transform: rotate(45deg);
          animation: checkpoint-pulse-ring 2s ease-in-out infinite;
        }

        @keyframes checkpoint-glow {
          0%, 100% { 
            /* Removed filter for performance - was: filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.5)); */
            opacity: 1;
          }
          50% { 
            /* Removed filter for performance - was: filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.8)); */
            opacity: 0.7;
          }
        }

        @keyframes checkpoint-pulse-ring {
          0%, 100% { opacity: 0.6; transform: rotate(45deg) scale(1); }
          50% { opacity: 1; transform: rotate(45deg) scale(1.2); }
        }

        .tech-checkpoint-future::before {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
        }

        .tech-checkpoint-future .checkpoint-inner {
          background: linear-gradient(135deg, #d4d4d4, #a3a3a3);
        }

        /* Timeline Grid Box */
        .timeline-grid-box {
          --mouse-x: 50%;
          --mouse-y: 50%;
        }

        .relative:hover > .timeline-grid-border {
          opacity: 1 !important;
        }

        /* Premium Button */
        .premium-btn {
          --border-radius: 8px;
          --button-color: #101010;
          position: relative;
          user-select: none;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          background-color: var(--button-color);
          box-shadow:
            inset 0px 1px 1px rgba(255, 255, 255, 0.2),
            inset 0px 2px 2px rgba(255, 255, 255, 0.15),
            inset 0px 4px 4px rgba(255, 255, 255, 0.1);
          border: solid 1px #fff2;
          border-radius: var(--border-radius);
          cursor: pointer;
          overflow: hidden;
        }

        .premium-btn-letter {
          position: relative;
          display: inline-block;
          color: #fff5;
          z-index: 2;
          animation: premium-letter-anim 2s ease-in-out infinite;
        }

        @keyframes premium-letter-anim {
          50% {
            text-shadow: 0 0 3px #fff8;
            color: #fff;
          }
        }

        .premium-btn-svg {
          flex-shrink: 0;
          height: 16px;
          width: 16px;
          margin-right: 0.5rem;
          fill: none;
          stroke: #e8e8e8;
          stroke-width: 1.5;
          z-index: 2;
          animation: premium-flicker 2s linear infinite;
          filter: drop-shadow(0 0 2px #fff9);
        }

        @keyframes premium-flicker {
          50% { opacity: 0.3; }
        }

        .premium-btn-border {
          position: absolute;
          inset: -1px;
          border-radius: var(--border-radius);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 3;
        }

        .premium-btn:hover .premium-btn-border {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .project-card {
            width: 300px;
            height: 400px;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden pt-20 pb-12 px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto text-center z-10 relative">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-green-500">
            The Fool&apos;s Journey
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-400 mb-8 max-w-3xl mx-auto">
            &quot;We are fools with nothing. We can become Anything.&quot;
          </p>
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto mb-12">
            Every master was once a beginner. Every expert started as a fool. The journey of a thousand miles begins with a single step into the unknown.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105 hover:bg-green-500">
              Begin Journey
            </button>
            <button className="bg-gray-800/80 text-gray-200 px-8 py-4 rounded-full text-lg font-semibold border border-gray-700 hover:border-green-500 transition-all">
              Discover More
            </button>
          </div>
        </div>
      </section>

      {/* Static Logo Section */}
      <section className="relative py-16 sm:py-20 flex items-center justify-center overflow-hidden border-t border-b border-white/10 bg-[#0a0a0a]">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          <h3 className="text-center text-gray-500 text-sm mb-8 uppercase tracking-wider">Trusted By</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-xl px-6 py-4 hover:border-green-500/50 transition-all text-center"
              >
                <span className="text-gray-400 font-semibold">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section - Carousel */}
      <section 
        id="industries-carousel-section"
        className="relative h-screen overflow-hidden border-t border-b border-white/10"
        style={{
          background: 'linear-gradient(to bottom, rgb(20, 20, 20) 0%, rgb(10, 10, 10) 50%, rgb(0, 0, 0) 100%)',
        }}
      >
        {/* Simplified grain overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '100px 100px',
          }}
        />

        {/* Left Panel - Industry Info */}
        <div className="absolute left-0 top-0 bottom-0 w-[50%] z-20 flex items-start pl-12 pr-8 py-6 lg:pl-20 lg:pr-12 border-r border-white/10">
          <div className="w-full flex flex-col h-full">
            {/* Industry Header */}
            <div className="flex-1 flex flex-col">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Industry</p>
              
              <div className="vanish-crossfade-container mb-3">
                <h2 
                  key={`industry-name-${textAnimationKey}`}
                  className="text-3xl lg:text-4xl font-bold text-white vanish-content leading-tight"
                  data-animating={isAnimating ? "true" : "false"}
                  data-delay="0"
                >
                  {activeProject.industryName}
                </h2>
              </div>
              
              <div className="vanish-crossfade-container mb-5">
                <p 
                  key={`industry-desc-${textAnimationKey}`}
                  className="text-sm lg:text-base text-gray-400 leading-relaxed vanish-content line-clamp-3 min-h-[4.5rem] max-h-[4.5rem]"
                  data-animating={isAnimating ? "true" : "false"}
                  data-delay="1"
                >
                  {activeProject.industryDescription}
                </p>
              </div>

              {/* Problem Box */}
              <div className="notification-box mb-3">
                <div className="box-inner">
                  <div className="relative flex flex-col">
                    <div className="relative box-icon-container mb-3 w-fit rounded-lg border border-gray-600 p-2">
                      <div 
                        className="absolute inset-0 rounded-lg opacity-0 box-icon-gradient"
                        style={{
                          background: `radial-gradient(
                            150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                            rgba(34, 197, 94, 0.8),
                            rgba(59, 130, 246, 0.7),
                            rgba(236, 72, 153, 0.7),
                            rgba(234, 179, 8, 0.6),
                            transparent 60%
                          )`,
                          padding: '1px',
                          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          WebkitMaskComposite: 'xor',
                          maskComposite: 'exclude'
                        }}
                      />
                      <svg className="w-4 h-4 text-neutral-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    
                    <div className="relative w-full h-px mb-3 box-divider-line">
                      <div className="absolute inset-0 bg-white/10" />
                      <div 
                        className="absolute inset-0 opacity-0 box-line-gradient"
                        style={{
                          background: `radial-gradient(
                            200px circle at var(--mouse-x, 50%) 0px,
                            rgba(34, 197, 94, 0.8),
                            rgba(59, 130, 246, 0.7),
                            rgba(236, 72, 153, 0.7),
                            rgba(234, 179, 8, 0.6),
                            transparent 60%
                          )`
                        }}
                      />
                    </div>
                    <h3 className="notititle mb-3">Problem Statement</h3>
                    <div className="vanish-crossfade-container">
                      <p 
                        key={`problem-${textAnimationKey}`}
                        className="notibody vanish-content"
                        data-animating={isAnimating ? "true" : "false"}
                        data-delay="2"
                      >
                        {activeProject.problem}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Value Proposition Box */}
              <div className="notification-box mb-3">
                <div className="box-inner">
                  <div className="relative flex flex-col">
                    <div className="relative box-icon-container mb-3 w-fit rounded-lg border border-gray-600 p-2">
                      <div 
                        className="absolute inset-0 rounded-lg opacity-0 box-icon-gradient"
                        style={{
                          background: `radial-gradient(
                            150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
                            rgba(34, 197, 94, 0.8),
                            rgba(59, 130, 246, 0.7),
                            rgba(236, 72, 153, 0.7),
                            rgba(234, 179, 8, 0.6),
                            transparent 60%
                          )`,
                          padding: '1px',
                          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          WebkitMaskComposite: 'xor',
                          maskComposite: 'exclude'
                        }}
                      />
                      <svg className="w-4 h-4 text-neutral-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    
                    <div className="relative w-full h-px mb-3 box-divider-line">
                      <div className="absolute inset-0 bg-white/10" />
                      <div 
                        className="absolute inset-0 opacity-0 box-line-gradient"
                        style={{
                          background: `radial-gradient(
                            200px circle at var(--mouse-x, 50%) 0px,
                            rgba(34, 197, 94, 0.8),
                            rgba(59, 130, 246, 0.7),
                            rgba(236, 72, 153, 0.7),
                            rgba(234, 179, 8, 0.6),
                            transparent 60%
                          )`
                        }}
                      />
                    </div>
                    <h3 className="notititle mb-3">Value Proposition</h3>
                    <div className="vanish-crossfade-container">
                      <p 
                        key={`value-prop-${textAnimationKey}`}
                        className="notibody vanish-content"
                        data-animating={isAnimating ? "true" : "false"}
                        data-delay="3"
                      >
                        {activeProject.valueProposition}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Section */}
            <div className="pt-4 border-t border-white/10 mt-auto">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Project Team</p>
              <div className="flex items-center">
                <div className="flex items-center relative">
                  {activeProject.team.map((member, idx) => (
                    <div 
                      key={idx}
                      className="relative group hover:z-50 transition-all duration-300"
                      style={{ 
                        zIndex: 50 - (idx * 10),
                        marginLeft: idx === 0 ? 0 : '-1.25rem'
                      }}
                    >
                      <div className={`w-12 h-12 rounded-full ${member.color} border-2 border-white/20 flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg`}>
                        <span className="text-white text-xs font-bold">
                          {idx === 0 ? 'TL' : `M${idx}`}
                        </span>
                      </div>
                      <div className="absolute -top-20 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                        <div className="bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-2xl border border-white/20">
                          <p className="text-sm font-semibold">{member.name}</p>
                          <p className="text-xs text-gray-400">{member.role}</p>
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-gray-900 border-r border-b border-white/20 rotate-45" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Scrolling Cards Container */}
        <div className="absolute left-[50%] right-0 top-0 bottom-0 flex items-center z-10 overflow-hidden bg-transparent pr-8 lg:pr-16">
          <div 
            ref={cardsContainerRef}
            className="flex gap-20 items-center bg-transparent cards-scroll-container"
          >
            {allProjects.map((project, index) => {
              const cardNumber = index + 1;
              const isActive = cardNumber === activeCardIndex;
              // 🎯 CRITICAL: Only use rotation state if section is visible, otherwise force 0
              const rotation = (isActive && isSection3Visible) 
                ? (cardRotations[index] || { rotateX: 0, rotateY: 0 }) 
                : { rotateX: 0, rotateY: 0 };
              
              return (
                <div
                  key={index}
                  ref={(el) => { cardsRef.current[index] = el; }}
                  className={`project-card noselect ${!isActive ? 'card-inactive' : 'card-active'}`}
                  onMouseMove={isActive ? (e) => handleCardMouseMove(e, index) : undefined}
                  onMouseLeave={isActive ? () => handleCardMouseLeave(index) : undefined}
                  style={{ pointerEvents: isActive ? 'auto' : 'none' }}
                >
                  <div className="card-outer">
                    <div 
                      className="card-inner-wrapper"
                      style={{
                        transform: `rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg)`
                      }}
                    >
                      <div className="card-inner">
                        <div className="absolute top-6 right-6 w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center z-10">
                          <span className="text-white/40 text-xs">LOGO</span>
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="space-y-2.5">
                            <h3 className="text-lg lg:text-xl font-bold text-white leading-tight pr-16">
                              {project.title}
                            </h3>
                            
                            <div className="text-xs text-gray-500">
                              <span className="font-semibold text-gray-400">{project.industryName}</span>
                            </div>
                            
                            <p className="text-xs text-gray-400 leading-relaxed">
                              {project.description}
                            </p>
                            
                            <div className="h-px bg-white/10" />
                            
                            <div className="flex flex-wrap gap-2 mb-2.5">
                              {project.domains.map((domain, idx) => (
                                <span key={idx} className="domain-tag px-2.5 py-1 bg-white/5 rounded text-xs text-gray-300 border border-white/10">
                                  {domain}
                                </span>
                              ))}
                            </div>
                            
                            <div className="mb-2">
                              <p className="text-xs text-gray-500 mb-2 font-medium">Features</p>
                              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                                {project.features.map((feature, idx) => (
                                  <div key={idx} className="flex items-start gap-1.5">
                                    <span className="prism-bullet">●</span>
                                    <span className="text-xs text-gray-400">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2.5">
                            <div className="relative">
                              <div 
                                className="timeline-grid-border absolute inset-0 rounded-lg pointer-events-none"
                                style={{
                                  background: 'radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(34, 197, 94, 0.6), rgba(59, 130, 246, 0.5), transparent 60%)',
                                  padding: '1px',
                                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                  WebkitMaskComposite: 'xor',
                                  maskComposite: 'exclude',
                                  opacity: 0,
                                  transition: 'opacity 0.3s ease',
                                  willChange: 'opacity'
                                }}
                              />
                              <div className="timeline-grid-box relative bg-gray-900/80 rounded-lg p-5" style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                {/* Simplified grid - no vignette */}
                                <div 
                                  className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden opacity-30"
                                  style={{
                                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                                    backgroundSize: '16px 16px',
                                  }}
                                />

                                <div className="relative h-14">
                                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <div className="w-full h-[0.5px] bg-white" />
                                    <div 
                                      className="absolute left-0 top-0 h-[0.5px] shadow-lg"
                                      style={{ 
                                        width: `${(project.timeline.filter(t => t.status === 'complete').length / project.timeline.length) * 100}%`,
                                        background: 'linear-gradient(to right, rgba(34, 197, 94, 1), rgba(59, 130, 246, 1), rgba(236, 72, 153, 1))',
                                        boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)'
                                      }}
                                    />
                                  </div>
                                  
                                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
                                    <div className="relative flex justify-between items-center">
                                      {project.timeline.map((stage, idx) => (
                                        <div key={idx} className="relative group">
                                          <div className={`tech-checkpoint tech-checkpoint-${stage.status}`}>
                                            <div className={`checkpoint-inner ${stage.status === 'current' ? 'checkpoint-inner-current' : ''}`}></div>
                                            {stage.status === 'current' && <div className="checkpoint-pulse"></div>}
                                          </div>
                                          <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                                            <div className="bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded shadow-xl border border-white/20">
                                              <div className="font-semibold">{stage.stage}</div>
                                              <div className="text-[10px] text-gray-400">{stage.date}</div>
                                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 bg-gray-900 border-r border-b border-white/20 rotate-45" />
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="pt-3 border-t border-white/10">
                              <div className="relative join-button-wrapper">
                                <button className="premium-btn">
                                  <svg className="premium-btn-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                                    />
                                  </svg>
                                  <div className="premium-txt-wrapper">
                                    <div className="premium-txt-1">
                                      {'Join Our Initiative'.split('').map((letter, i) => (
                                        <span key={i} className="premium-btn-letter" style={{ animationDelay: `${i * 0.08}s` }}>
                                          {letter === ' ' ? '\u00A0' : letter}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div 
                                    className="premium-btn-border"
                                    style={{
                                      background: 'radial-gradient(150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(34, 197, 94, 0.6), rgba(59, 130, 246, 0.4), transparent 70%)',
                                      padding: '2px',
                                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                      WebkitMaskComposite: 'xor',
                                      maskComposite: 'exclude'
                                    } as React.CSSProperties}
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-6 sm:bottom-8 z-20 lg:left-[50%] lg:right-0 left-0 right-0 px-8 lg:px-12">
          <div className="flex gap-2">
            {allProjects.map((project, index) => {
              const segmentIndex = index + 1;
              const isActive = segmentIndex <= activeCardIndex;
              const isCurrent = segmentIndex === activeCardIndex;
              
              const gradientStart = (index / allProjects.length) * 100;
              const gradientEnd = ((index + 1) / allProjects.length) * 100;
              
              return (
                <button 
                  key={index}
                  className="flex-1 relative cursor-pointer group"
                  onClick={() => goToCard(segmentIndex, true)}
                  aria-label={`Go to ${project.title}`}
                >
                  <div 
                    className={`h-2 rounded-full overflow-hidden border transition-all duration-300 group-hover:border-white/50 group-hover:scale-y-125 ${
                      isCurrent 
                        ? 'border-white/60 shadow-lg' 
                        : isActive 
                          ? 'border-white/30' 
                          : 'border-white/10'
                    }`}
                    style={{
                      background: 'rgba(31, 41, 55, 0.6)',
                      backdropFilter: 'blur(4px)',
                      boxShadow: isCurrent 
                        ? '0 0 12px rgba(255, 255, 255, 0.2), 0 0 24px rgba(59, 130, 246, 0.15)' 
                        : 'none'
                    }}
                  >
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ease-out ${isActive ? 'w-full' : 'w-0'}`}
                      style={{ 
                        background: isActive 
                          ? `linear-gradient(to right, 
                              hsl(${142 - (gradientStart * 2.5)}, 70%, 50%), 
                              hsl(${142 - (gradientEnd * 2.5)}, 70%, 50%)
                            )`
                          : 'transparent'
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>
              {activeCardIndex === 0 ? 'Start' : activeCardIndex > allProjects.length ? allProjects.length : activeCardIndex} / {allProjects.length}
            </span>
            <span>{activeCardIndex === 0 ? 'Begin' : allProjects[activeCardIndex - 1]?.industryName || ''}</span>
          </div>
        </div>
      </section>

      {/* Journey Steps Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12 py-24">
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16 text-white">
            The Three Stages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-green-500/50 transition-all">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white">Begin</h3>
              <p className="text-gray-400 text-sm sm:text-base">Start with curiosity and courage. The first step is always the hardest, but also the most important.</p>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-green-500/50 transition-all">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white">Transform</h3>
              <p className="text-gray-400 text-sm sm:text-base">Through trials and experiences, transform yourself. Growth happens outside your comfort zone.</p>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-green-500/50 transition-all">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white">Transcend</h3>
              <p className="text-gray-400 text-sm sm:text-base">Reach heights you never imagined. The fool who persists becomes the master.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-6 sm:px-8 lg:px-12 py-24">
        <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join us in building the future. Together, we can become anything.
          </p>
          <button className="bg-green-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105 hover:bg-green-500">
            Start Now
          </button>
        </div>
      </section>
    </>
  );
};

export default HomeTab;