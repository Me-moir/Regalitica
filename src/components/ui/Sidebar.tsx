"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const logoImage = '/assets/Logo.png';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
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

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
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

  // Heavy momentum scrolling for sidebar
  useEffect(() => {
    const sidebarContent = sidebarContentRef.current;
    if (!sidebarContent || !isOpen) return;

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
  }, [isOpen]);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest('.sidebar') && !target.closest('.hamburger-btn')) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Swipe to close sidebar on mobile
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchCurrentX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isOpen) return;
      
      touchCurrentX.current = e.touches[0].clientX;
      const diff = touchCurrentX.current - touchStartX.current;
      
      if (diff > 0) {
        sidebar.style.transform = `translateX(${diff}px)`;
      }
    };

    const handleTouchEnd = () => {
      if (!isOpen) return;
      
      const diff = touchCurrentX.current - touchStartX.current;
      
      if (diff > 100) {
        onClose();
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
  }, [isOpen, onClose]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      if (prev[section]) {
        return {};
      }
      return { [section]: true };
    });
  };

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
          background: var(--glass-bg);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-left: 1px solid var(--border-color);
          box-shadow: 
            -8px 0 32px var(--glass-shadow-1),
            -12px 0 48px var(--glass-shadow-2),
            inset 1px 0 1px var(--glass-inset-top),
            inset -1px 0 1px var(--glass-inset-bottom);
          z-index: 200;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .sidebar-content {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: y proximity;
          overscroll-behavior: contain;
          scroll-padding: 20px;
        }
        
        .sidebar-content::-webkit-scrollbar {
          width: 6px;
        }
        
        .sidebar-content::-webkit-scrollbar-track {
          background: var(--scrollbar-track);
          border-radius: 3px;
        }
        
        .sidebar-content::-webkit-scrollbar-thumb {
          background: var(--scrollbar-thumb);
          border-radius: 3px;
          transition: background 0.3s ease;
        }
        
        .sidebar-content::-webkit-scrollbar-thumb:hover {
          background: var(--scrollbar-thumb-hover);
        }

        .sidebar-footer {
          background: var(--glass-bg);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 
            0 -4px 16px var(--glass-shadow-2),
            inset 0 1px 1px var(--glass-inset-top);
        }

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
          background: var(--hover-bg);
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
          mask: url(#clipping-sidebar);
          -webkit-mask: url(#clipping-sidebar);
        }

        .sandbox-loader svg { position: absolute; }
        .sandbox-loader svg #clipping-sidebar {
          filter: contrast(15);
          animation: roundness calc(var(--time-animation) / 2) linear infinite;
        }
        .sandbox-loader svg #clipping-sidebar polygon { filter: blur(7px); }
        .sandbox-loader svg #clipping-sidebar polygon:nth-child(1) { transform-origin: 75% 25%; transform: rotate(90deg); }
        .sandbox-loader svg #clipping-sidebar polygon:nth-child(2) { transform-origin: 50% 50%; animation: rotation var(--time-animation) linear infinite reverse; }
        .sandbox-loader svg #clipping-sidebar polygon:nth-child(3) { transform-origin: 50% 60%; animation: rotation var(--time-animation) linear infinite; animation-delay: calc(var(--time-animation) / -3); }
        .sandbox-loader svg #clipping-sidebar polygon:nth-child(4) { transform-origin: 40% 40%; animation: rotation var(--time-animation) linear infinite reverse; }
        .sandbox-loader svg #clipping-sidebar polygon:nth-child(5) { transform-origin: 40% 40%; animation: rotation var(--time-animation) linear infinite reverse; animation-delay: calc(var(--time-animation) / -2); }
        .sandbox-loader svg #clipping-sidebar polygon:nth-child(6) { transform-origin: 60% 40%; animation: rotation var(--time-animation) linear infinite; }
        .sandbox-loader svg #clipping-sidebar polygon:nth-child(7) { transform-origin: 60% 40%; animation: rotation var(--time-animation) linear infinite; animation-delay: calc(var(--time-animation) / -1.5); }

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
      `}</style>

      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div ref={sidebarRef} className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo Section */}
        <div className="p-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
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
                  onClick={onClose}
                  className="sidebar-section-btn w-full text-left flex items-center py-3 px-4 rounded-lg font-semibold"
                  style={{ color: 'var(--content-primary)' }}
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
                      expandedSections[section.title] ? 'active' : ''
                    }`}
                    style={{ color: expandedSections[section.title] ? undefined : 'var(--content-primary)' }}
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
                          className="block py-2 px-4 rounded-lg transition-colors text-sm"
                          style={{ color: 'var(--content-muted)' }}
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
        <div className="sidebar-footer sticky bottom-0" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          {/* Sandbox Button */}
          <div className="p-6" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="sandbox-border">
              <button className="w-full py-3 px-6 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2" style={{ background: 'var(--hover-bg)', color: 'var(--content-primary)' }}>
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
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs" style={{ color: 'var(--content-tertiary)' }}>
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

          {/* Help Section */}
          <div className="flex">
            <button
              className="flex-1 text-xs transition-all py-3 px-6 text-left"
              style={{ color: 'var(--content-tertiary)', borderRight: '1px solid var(--border-subtle)' }}
            >
              Need Help?
            </button>
            <button
              className="flex-1 text-xs transition-all py-3 px-6 text-left flex items-center justify-between"
              style={{ color: 'var(--content-tertiary)' }}
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
          <div className="px-6 py-3 text-center" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <p className="text-xs" style={{ color: 'var(--content-tertiary)' }}>
              © 2026 The Fool Prime Group. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;