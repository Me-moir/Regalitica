"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
const logoImage = '/assets/Logo.png';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface NavItem {
  id: string;
  label: string;
  isSpecial?: boolean;
}

interface SidebarSection {
  title: string;
  items: string[];
}

interface ScrollMomentum {
  velocity: number;
  scrollTop: number;
  timestamp: number;
  animationId: number | null;
}

const Navbar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = useState(false);
  const scrollPositionRef = useRef(0);
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarContentRef = useRef<HTMLDivElement>(null);
  const scrollMomentumRef = useRef<ScrollMomentum>({
    velocity: 0,
    scrollTop: 0,
    timestamp: 0,
    animationId: null
  });

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Heavy momentum scrolling for sidebar
  useEffect(() => {
    const sidebarContent = sidebarContentRef.current;
    if (!sidebarContent || !sidebarOpen) return;

    const momentum = scrollMomentumRef.current;

    const applyMomentum = () => {
      const friction = 0.85;
      momentum.velocity *= friction;
      
      if (Math.abs(momentum.velocity) > 0.5) {
        momentum.scrollTop += momentum.velocity;
        
        const maxScroll = sidebarContent.scrollHeight - sidebarContent.clientHeight;
        momentum.scrollTop = Math.max(0, Math.min(momentum.scrollTop, maxScroll));
        
        sidebarContent.scrollTop = momentum.scrollTop;
        momentum.animationId = requestAnimationFrame(applyMomentum);
      } else {
        momentum.velocity = 0;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      momentum.scrollTop = sidebarContent.scrollTop;
      
      const weightMultiplier = 0.08;
      momentum.velocity += e.deltaY * weightMultiplier;
      
      const maxVelocity = 12;
      momentum.velocity = Math.max(-maxVelocity, Math.min(maxVelocity, momentum.velocity));
      
      if (momentum.animationId) {
        cancelAnimationFrame(momentum.animationId);
      }
      momentum.animationId = requestAnimationFrame(applyMomentum);
    };

    sidebarContent.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      sidebarContent.removeEventListener('wheel', handleWheel);
      if (momentum.animationId) {
        cancelAnimationFrame(momentum.animationId);
      }
    };
  }, [sidebarOpen]);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      scrollPositionRef.current = window.scrollY;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (sidebarOpen && !target.closest('.sidebar') && !target.closest('.hamburger-btn')) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setSidebarOpen, sidebarOpen]);

  // Swipe to close sidebar on mobile
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchCurrentX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!sidebarOpen) return;
      
      touchCurrentX.current = e.touches[0].clientX;
      const diff = touchCurrentX.current - touchStartX.current;
      
      if (diff > 0) {
        sidebar.style.transform = `translateX(${diff}px)`;
      }
    };

    const handleTouchEnd = () => {
      if (!sidebarOpen) return;
      
      const diff = touchCurrentX.current - touchStartX.current;
      
      if (diff > 100) {
        setSidebarOpen(false);
      }
      
      sidebar.style.transform = '';
      touchStartX.current = 0;
      touchCurrentX.current = 0;
    };

    sidebar.addEventListener('touchstart', handleTouchStart);
    sidebar.addEventListener('touchmove', handleTouchMove);
    sidebar.addEventListener('touchend', handleTouchEnd);

    return () => {
      sidebar.removeEventListener('touchstart', handleTouchStart);
      sidebar.removeEventListener('touchmove', handleTouchMove);
      sidebar.removeEventListener('touchend', handleTouchEnd);
    };
  }, [sidebarOpen, setSidebarOpen]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      if (prev[section]) {
        return {};
      }
      return { [section]: true };
    });
  };

  // Smooth scroll to section when tab is clicked
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    
    const section = document.getElementById(tabId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navItems: NavItem[] = [
    { id: 'fool', label: 'Home' },
    { id: 'ventures', label: 'Ventures' },
    { id: 'affiliates', label: 'Affiliates' },
    { id: 'sandbox', label: 'Sandbox', isSpecial: true }
  ];

  const sidebarSections: SidebarSection[] = [
    {
      title: 'Home',
      items: []
    },
    {
      title: 'Who we are',
      items: ['About us', 'The Organization', 'Vision', 'Ventures', 'Approach']
    },
    {
      title: 'What we do',
      items: ["The Fool's Sandbox Program"]
    },
    {
      title: 'Official Affiliates',
      items: ['Partners', 'Sponsors', 'Licenses']
    },
    {
      title: 'Reach Out',
      items: ['Contact', 'Support', 'Feedback']
    },
    {
      title: 'Community',
      items: ['Contribute', 'Build With Us', 'Become a Fool']
    }
  ];

  return (
    <>
      <style>{`
        .sandbox-border {
          position: relative;
          padding: 1px;
          background: transparent;
          border-radius: 9999px;
        }

        .sandbox-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          padding: 1px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(229, 43, 80, 0.8) 25%, 
            rgba(229, 43, 80, 1) 50%, 
            rgba(229, 43, 80, 0.8) 75%, 
            transparent 100%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: orbitBorder 3s linear infinite;
          background-size: 200% 100%;
        }

        @keyframes orbitBorder {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }

        .sandbox-loader-wrapper {
          width: 16px;
          height: 16px;
          display: inline-block;
          margin-right: 6px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .sandbox-loader-wrapper {
            width: 12px;
            height: 12px;
            margin-right: 4px;
          }
        }

        .sandbox-loader {
          --color-one: #E52B50;
          --color-two: #C41E3A;
          --color-three: rgba(229, 43, 80, 0.5);
          --color-four: rgba(196, 30, 58, 0.5);
          --color-five: rgba(229, 43, 80, 0.25);
          --time-animation: 2s;
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100px;
          height: 100px;
          margin-left: -50px;
          margin-top: -50px;
          transform: scale(0.16);
          border-radius: 50%;
          animation: colorize calc(var(--time-animation) * 3) ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .sandbox-loader { transform: scale(0.12); }
        }

        .sandbox-loader::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border-top: solid 1px var(--color-one);
          border-bottom: solid 1px var(--color-two);
          background: linear-gradient(180deg, var(--color-five), var(--color-four));
          box-shadow:
            inset 0 8px 8px 0 var(--color-three),
            inset 0 -8px 8px 0 var(--color-four);
        }

        .sandbox-loader .box {
          width: 100px;
          height: 100px;
          background: linear-gradient(180deg, var(--color-one) 30%, var(--color-two) 70%);
          mask: url(#clipping);
          -webkit-mask: url(#clipping);
        }

        .sandbox-loader svg { position: absolute; }
        .sandbox-loader svg #clipping {
          filter: contrast(15);
          animation: roundness calc(var(--time-animation) / 2) linear infinite;
        }
        .sandbox-loader svg #clipping polygon { filter: blur(7px); }
        .sandbox-loader svg #clipping polygon:nth-child(1) { transform-origin: 75% 25%; transform: rotate(90deg); }
        .sandbox-loader svg #clipping polygon:nth-child(2) { transform-origin: 50% 50%; animation: rotation var(--time-animation) linear infinite reverse; }
        .sandbox-loader svg #clipping polygon:nth-child(3) { transform-origin: 50% 60%; animation: rotation var(--time-animation) linear infinite; animation-delay: calc(var(--time-animation) / -3); }
        .sandbox-loader svg #clipping polygon:nth-child(4) { transform-origin: 40% 40%; animation: rotation var(--time-animation) linear infinite reverse; }
        .sandbox-loader svg #clipping polygon:nth-child(5) { transform-origin: 40% 40%; animation: rotation var(--time-animation) linear infinite reverse; animation-delay: calc(var(--time-animation) / -2); }
        .sandbox-loader svg #clipping polygon:nth-child(6) { transform-origin: 60% 40%; animation: rotation var(--time-animation) linear infinite; }
        .sandbox-loader svg #clipping polygon:nth-child(7) { transform-origin: 60% 40%; animation: rotation var(--time-animation) linear infinite; animation-delay: calc(var(--time-animation) / -1.5); }

        @keyframes rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes roundness {
          0%, 100% { filter: contrast(15); }
          20%, 40% { filter: contrast(3); }
          60% { filter: contrast(15); }
        }

        @keyframes colorize {
          0%, 100% { filter: hue-rotate(0deg); }
          20% { filter: hue-rotate(-30deg); }
          40% { filter: hue-rotate(-60deg); }
          60% { filter: hue-rotate(-90deg); }
          80% { filter: hue-rotate(-45deg); }
        }

        .glass-nav {
          background: rgba(15, 15, 15, 0.75);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.6),
            0 12px 48px rgba(0, 0, 0, 0.4),
            inset 0 1px 1px rgba(255, 255, 255, 0.1),
            inset 0 -1px 1px rgba(0, 0, 0, 0.5);
        }

        .nav-button {
          box-shadow: 
            0 2px 8px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }

        .nav-button:hover {
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }

        .nav-button-active {
          box-shadow: 
            0 2px 8px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2);
        }

        /* Sidebar Styles */
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: grayscale(100%);
          -webkit-backdrop-filter: grayscale(100%);
          z-index: 150;
          opacity: 0;
          transition: opacity 0.4s ease, backdrop-filter 0.4s ease;
          pointer-events: none;
        }

        .sidebar-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        .sidebar {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 360px;
          max-width: 85vw;
          background: rgba(15, 15, 15, 0.75);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            -8px 0 32px rgba(0, 0, 0, 0.6),
            -12px 0 48px rgba(0, 0, 0, 0.4),
            inset 1px 0 1px rgba(255, 255, 255, 0.1),
            inset -1px 0 1px rgba(0, 0, 0, 0.5);
          z-index: 200;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }

        .sidebar.open {
          transform: translateX(0);
        }

        /* Heavy, weighted scrolling for sidebar with strong inertia */
        .sidebar-content {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: y proximity;
          overscroll-behavior: contain;
          /* Add momentum scrolling weight */
          scroll-padding: 20px;
        }
        
        /* Add custom scroll momentum for webkit browsers */
        .sidebar-content::-webkit-scrollbar {
          width: 6px;
        }
        
        .sidebar-content::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        
        .sidebar-content::-webkit-scrollbar-thumb {
          background: rgba(229, 43, 80, 0.3);
          border-radius: 3px;
          transition: background 0.3s ease;
        }
        
        .sidebar-content::-webkit-scrollbar-thumb:hover {
          background: rgba(229, 43, 80, 0.5);
        }

        .sidebar-footer {
          background: rgba(15, 15, 15, 0.75);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 
            0 -4px 16px rgba(0, 0, 0, 0.4),
            inset 0 1px 1px rgba(255, 255, 255, 0.1);
        }

        .hamburger-line {
          width: 20px;
          height: 2px;
          background: currentColor;
          transition: all 0.3s ease;
        }

        .hamburger-btn.open .hamburger-line:nth-child(1) {
          transform: translateY(6px) rotate(45deg);
        }

        .hamburger-btn.open .hamburger-line:nth-child(2) {
          opacity: 0;
        }

        .hamburger-btn.open .hamburger-line:nth-child(3) {
          transform: translateY(-6px) rotate(-45deg);
        }

        /* Expandable Section Animations - Weighted and slow */
        .sidebar-section-content {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          transform: translateY(-12px);
          transition: max-height 1.2s cubic-bezier(0.23, 1, 0.32, 1),
                      opacity 1s cubic-bezier(0.23, 1, 0.32, 1) 0.1s,
                      transform 1s cubic-bezier(0.23, 1, 0.32, 1) 0.1s;
          will-change: max-height, opacity, transform;
        }

        .sidebar-section-content.expanded {
          max-height: 500px;
          opacity: 1;
          transform: translateY(0);
        }

        .sidebar-section-content.closing {
          transition: max-height 1.4s cubic-bezier(0.23, 1, 0.32, 1),
                      opacity 1.2s cubic-bezier(0.23, 1, 0.32, 1),
                      transform 1.2s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .sidebar-section-btn {
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .sidebar-section-btn.active {
          color: #E52B50;
        }

        .sidebar-section-btn:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .sidebar-section-btn svg {
          transition: transform 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .home-label {
          font-size: 0.5rem;
          color: rgba(229, 43, 80, 0.8);
          font-weight: 500;
          letter-spacing: 0.02em;
          margin-left: 2rem;
          padding: 2px 8px;
          background: rgba(229, 43, 80, 0.1);
          border-radius: 9999px;
          border: 1px solid rgba(229, 43, 80, 0.3);
        }

        /* Monochrome filter with blur for main content when sidebar is open */
        .content-monochrome {
          filter: grayscale(100%) blur(2px);
          transition: filter 0.4s ease;
        }

        /* Prevent scroll on content when sidebar is open */
        #smooth-content.no-scroll {
          pointer-events: none;
          user-select: none;
        }
      `}</style>

      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div ref={sidebarRef} className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10">
          <Image 
            src={logoImage} 
            alt="Regalitica" 
            width={200} 
            height={56} 
            className="h-14 w-auto mx-auto" 
            priority 
          />
        </div>

        {/* Scrollable Content */}
        <div ref={sidebarContentRef} className="sidebar-content flex-1 overflow-y-auto p-6" style={{ paddingBottom: '100px' }}>
          {sidebarSections.map((section, idx) => (
            <div key={idx} className="mb-3">
              {section.items.length === 0 ? (
                // Home - closes sidebar when clicked with inline "You are here" label
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="sidebar-section-btn w-full text-left flex items-center py-3 px-4 rounded-lg font-semibold text-white hover:bg-white/5"
                >
                  <span>{section.title}</span>
                  <span className="home-label">You are here</span>
                </button>
              ) : (
                // Expandable sections
                <>
                  <button
                    onClick={() => toggleSection(section.title)}
                    className={`sidebar-section-btn w-full text-left flex items-center justify-between py-3 px-4 rounded-lg font-semibold ${
                      expandedSections[section.title] ? 'active' : 'text-white'
                    }`}
                  >
                    <span>{section.title}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-300 ${expandedSections[section.title] ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className={`sidebar-section-content ${expandedSections[section.title] ? 'expanded' : ''}`}>
                    <div className="mt-2 ml-4 space-y-1">
                      {section.items.map((item, itemIdx) => (
                        <a
                          key={itemIdx}
                          href="#"
                          className="block py-2 px-4 text-gray-400 hover:text-red-500 hover:bg-white/5 rounded-lg transition-colors text-sm"
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Fixed Footer Section */}
        <div className="sidebar-footer sticky bottom-0 border-t border-white/0.5">
          {/* Sandbox Button */}
          <div className="p-6 border-b border-white/5">
            <div className="sandbox-border">
              <button className="w-full bg-white/5 hover:bg-white/10 text-white py-3 px-6 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                <div className="sandbox-loader-wrapper">
                  <div className="sandbox-loader">
                    <svg width="100" height="100" viewBox="0 0 100 100">
                      <defs>
                        <mask id="clipping-sidebar">
                          <polygon points="0,0 100,0 100,100 0,100" fill="black"></polygon>
                          <polygon points="25,25 75,25 50,75" fill="white"></polygon>
                          <polygon points="50,25 75,75 25,75" fill="white"></polygon>
                          <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                          <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                          <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                          <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                        </mask>
                      </defs>
                    </svg>
                    <div className="box"></div>
                  </div>
                </div>
                <span>Enter The Fool's Sandbox</span>
              </button>
            </div>
            {/* Alpha Version Text */}
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500">
              <svg 
                className="w-3.5 h-3.5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <span>Alpha version 1.0</span>
            </div>
          </div>

          {/* Help Section - Two full section buttons */}
          <div className="flex">
            <button
              className="flex-1 text-xs text-gray-500 hover:text-gray-400 hover:bg-white/5 transition-all py-3 px-6 text-left border-r border-white/5"
            >
              Need Help?
            </button>
            <button
              className="flex-1 text-xs text-gray-500 hover:text-gray-400 hover:bg-white/5 transition-all py-3 px-6 text-left flex items-center justify-between"
            >
              <span>FAQs</span>
              <svg 
                className="w-3 h-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Copyright Text */}
          <div className="px-6 py-3 text-center border-t border-white/5">
            <p className="text-xs text-gray-600">
              © 2026 The Fool Prime Group. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ${
        scrolled ? 'pt-2' : 'pt-4'
      }`} style={{ paddingLeft: '12px', paddingRight: '12px' }}>
        <div className="w-full max-w-fit flex items-center gap-3">
          {/* Glassmorphic Dock Container */}
          <div className="glass-nav rounded-full border border-white/10">
            <div 
              className="flex items-center gap-2" 
              style={{ 
                padding: isMobile ? '5px 8px' : '7px 10px'
              }}
            >
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                
                if (item.isSpecial) {
                  return (
                    <div key={item.id} className="sandbox-border">
                      <button
                        onClick={() => handleTabClick(item.id)}
                        className={`
                          nav-button relative rounded-full flex items-center
                          font-semibold tracking-wide transition-all duration-300
                          ${isActive 
                            ? 'nav-button-active bg-white/5 text-red-500' 
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                          }
                        `}
                        style={{ 
                          padding: isMobile ? '5px 10px' : '7px 18px',
                          fontSize: isMobile ? '0.75rem' : '0.875rem'
                        }}
                      >
                        <div className="sandbox-loader-wrapper">
                          <div className="sandbox-loader">
                            <svg width="100" height="100" viewBox="0 0 100 100">
                              <defs>
                                <mask id="clipping">
                                  <polygon points="0,0 100,0 100,100 0,100" fill="black"></polygon>
                                  <polygon points="25,25 75,25 50,75" fill="white"></polygon>
                                  <polygon points="50,25 75,75 25,75" fill="white"></polygon>
                                  <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                                  <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                                  <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                                  <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                                </mask>
                              </defs>
                            </svg>
                            <div className="box"></div>
                          </div>
                        </div>
                        {item.label}
                      </button>
                    </div>
                  );
                }
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`
                      nav-button relative rounded-full
                      font-medium tracking-wide transition-all duration-300
                      ${isActive 
                        ? 'nav-button-active bg-white/10 text-red-500' 
                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/10'
                      }
                    `}
                    style={{ 
                      padding: isMobile ? '5px 10px' : '7px 16px',
                      fontSize: isMobile ? '0.75rem' : '0.875rem'
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`hamburger-btn glass-nav rounded-full border border-white/10 p-3 text-gray-300 hover:text-white hover:bg-white/10 transition-all ${sidebarOpen ? 'open' : ''}`}
          >
            <div className="flex flex-col gap-1.5">
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
            </div>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;