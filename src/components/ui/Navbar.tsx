"use client";
import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  isSpecial?: boolean;
}

const Navbar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const rafIdRef = useRef<number | null>(null);

  // Memoize nav items to prevent recreation on every render
  const navItems: NavItem[] = useMemo(() => [
    { id: 'discover', label: 'Discover', icon: 'bi-rocket-takeoff' },
    { id: 'information', label: 'Information', icon: 'bi-pin' },
    { id: 'ventures', label: 'Ventures', icon: 'bi-stars', isSpecial: true }
  ], []);

  // Check for mobile on mount and resize with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const checkMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 640);
      }, 150); // Debounce resize events
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Scroll detection with requestAnimationFrame throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Optimized mouse tracking for gradient effects with RAF throttling
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Cancel previous frame if still pending
      if (rafIdRef.current !== null) return;

      rafIdRef.current = requestAnimationFrame(() => {
        // Update navbar container
        if (navContainerRef.current) {
          try {
            const rect = navContainerRef.current.getBoundingClientRect();
            if (rect && rect.width && rect.height) {
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              navContainerRef.current.style.setProperty('--mouse-x', `${x}%`);
              navContainerRef.current.style.setProperty('--mouse-y', `${y}%`);
            }
          } catch (err) {
            // Silently handle any errors during mouse tracking
          }
        }

        // Update menu button
        if (menuButtonRef.current) {
          try {
            const rect = menuButtonRef.current.getBoundingClientRect();
            if (rect && rect.width && rect.height) {
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              menuButtonRef.current.style.setProperty('--mouse-x', `${x}%`);
              menuButtonRef.current.style.setProperty('--mouse-y', `${y}%`);
            }
          } catch (err) {
            // Silently handle any errors during mouse tracking
          }
        }

        rafIdRef.current = null;
      });
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Memoize tab click handler
  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setActiveTab]);

  // Memoize sidebar toggle
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen, setSidebarOpen]);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, [setSidebarOpen]);

  return (
    <>
      <style>{`
        .nav-button-active-border {
          position: relative;
          padding: 1px;
          background: transparent;
          border-radius: 9999px;
        }

        .nav-button-active-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          padding: 1px;
          background: linear-gradient(90deg, 
            transparent 0%,
            rgba(0, 255, 166, 0.8) 15%,
            rgba(255, 215, 0, 0.6) 30%,
            rgba(236, 72, 153, 0.6) 45%,
            rgba(147, 51, 234, 0.6) 60%,
            rgba(59, 130, 246, 0.5) 75%,
            transparent 90%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          animation: orbitBorder 3s linear infinite;
          background-size: 200% 100%;
          will-change: background-position;
        }

        .sandbox-border {
          position: relative;
          padding: 0px;
          background: transparent;
          border-radius: 9999px;
        }

        .sandbox-border::before {
          display: none;
        }

        @keyframes orbitBorder {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }

        .sphere-loader-wrapper {
          width: 16px;
          height: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 6px;
          position: relative;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .sphere-loader-wrapper {
            width: 14px;
            height: 14px;
            margin-right: 4px;
          }
        }

        .loader-container {
          position: absolute;
          width: 100%;
          height: 100%;
          perspective: 800px;
          transform-style: preserve-3d;
        }

        .sphere-core {
          position: absolute;
          width: 60%;
          height: 60%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle at 40% 40%, rgba(220, 220, 220, 0.8), rgba(180, 180, 180, 0.7));
          border-radius: 50%;
          box-shadow: 0 0 4px rgba(200, 200, 200, 0.5);
          animation: pulse 2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          will-change: transform, box-shadow;
        }

        .orbit-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 1px solid rgba(220, 220, 220, 0.6);
          border-radius: 50%;
          box-shadow: 0 0 3px rgba(200, 200, 200, 0.4);
          transform-style: preserve-3d;
        }

        .orbit-ring-1 {
          animation: rotateX 2.5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }

        .orbit-ring-2 {
          animation: rotateY 2s cubic-bezier(0.55, 0, 0.45, 1) infinite;
          width: 80%;
          height: 80%;
          top: 10%;
          left: 10%;
          border-color: rgba(220, 220, 220, 0.5);
        }

        .orbit-ring-3 {
          animation: rotateXY 3s cubic-bezier(0.7, 0, 0.3, 1) infinite;
          width: 60%;
          height: 60%;
          top: 20%;
          left: 20%;
          border-color: rgba(220, 220, 220, 0.4);
        }

        @keyframes rotateX {
          0% { transform: rotateX(0deg); }
          50% { transform: rotateX(180deg); }
          100% { transform: rotateX(360deg); }
        }

        @keyframes rotateY {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(180deg); }
          100% { transform: rotateY(360deg); }
        }

        @keyframes rotateXY {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          50% { transform: rotateX(90deg) rotateY(180deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }

        @keyframes pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 4px rgba(200, 200, 200, 0.5);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            box-shadow: 0 0 6px rgba(200, 200, 200, 0.6);
          }
        }

        .glass-nav {
          position: relative;
          background: var(--glass-bg);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 
            0 8px 32px var(--glass-shadow-1),
            0 12px 48px var(--glass-shadow-2),
            inset 0 1px 1px var(--glass-inset-top),
            inset 0 -1px 1px var(--glass-inset-bottom);
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }

        /* Active state for Ventures icon - Teal/Aurora */
        .nav-button-active .sphere-core {
          background: radial-gradient(circle at 40% 40%, #00ffcc, #00d9b8);
          box-shadow: 0 0 8px rgba(0, 255, 204, 0.6);
        }

        .nav-button-active .orbit-ring {
          border-color: rgba(0, 255, 204, 0.8);
          box-shadow: 0 0 5px rgba(0, 255, 204, 0.4);
        }

        .nav-button-active .orbit-ring-2 {
          border-color: rgba(0, 255, 204, 0.6);
        }

        .nav-button-active .orbit-ring-3 {
          border-color: rgba(0, 255, 204, 0.4);
        }

        /* Navbar hover gradient effect */
        .glass-nav::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 0.5px;
          background: radial-gradient(
            150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(0, 255, 166, 0.8),
            rgba(255, 215, 0, 0.6),
            rgba(236, 72, 153, 0.6),
            rgba(147, 51, 234, 0.6),
            rgba(59, 130, 246, 0.5),
            transparent 70%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s ease-in-out;
          pointer-events: none;
          z-index: -1;
          will-change: opacity;
        }

        .glass-nav:hover::before {
          opacity: 1;
        }

        /* Menu button hover gradient effect */
        .hamburger-btn {
          position: relative;
        }

        .hamburger-btn::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 0.5px;
          background: radial-gradient(
            120px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(0, 255, 166, 0.8),
            rgba(255, 215, 0, 0.6),
            rgba(236, 72, 153, 0.6),
            rgba(147, 51, 234, 0.6),
            rgba(59, 130, 246, 0.5),
            transparent 70%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s ease-in-out;
          pointer-events: none;
          z-index: -1;
          will-change: opacity;
        }

        .hamburger-btn:hover::before {
          opacity: 1;
        }

        .nav-button {
          box-shadow: 
            0 2px 8px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 var(--glass-inset-top);
          transition: all 0.3s ease;
          will-change: transform, box-shadow;
        }

        .nav-button:hover {
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 var(--glass-inset-top);
          transform: translateY(-1px);
        }

        .nav-button-active {
          background: var(--hover-bg-strong);
          box-shadow: 
            0 2px 8px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 var(--glass-inset-top),
            inset 0 -1px 0 var(--glass-inset-bottom);
          color: var(--content-primary);
        }

        .nav-button-inactive {
          color: var(--content-faint);
        }

        .nav-button-active-text {
          color: var(--content-primary);
        }
      `}</style>

      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ${
        scrolled ? 'pt-2' : 'pt-4'
      }`} style={{ paddingLeft: '8px', paddingRight: '8px' }}>
        <div className="w-full max-w-fit flex items-center gap-2">
          {/* Glassmorphic Dock Container */}
          <div ref={navContainerRef} className="glass-nav rounded-full" style={{ border: '1px solid var(--border-color)' }}>
            <div 
              className="flex items-center gap-1.5" 
              style={{ 
                padding: isMobile ? '4px 6px' : '7px 10px'
              }}
            >
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                
                if (item.isSpecial) {
                  return (
                    <div key={item.id} className={isActive ? 'nav-button-active-border' : ''}>
                      <button
                        onClick={() => handleTabClick(item.id)}
                        className={`
                          nav-button relative rounded-full flex items-center
                          font-semibold tracking-wide transition-all duration-300
                          ${isActive 
                            ? 'nav-button-active' 
                            : ''
                          }
                        `}
                        style={{ 
                          padding: isMobile ? '4px 8px' : '7px 18px',
                          fontSize: isMobile ? '0.7rem' : '0.875rem',
                          color: isActive ? undefined : 'var(--content-faint)',
                        }}
                      >
                        <div className="sphere-loader-wrapper">
                          <div className="loader-container">
                            <div className="sphere-core"></div>
                            <div className="orbit-ring orbit-ring-1"></div>
                            <div className="orbit-ring orbit-ring-2"></div>
                            <div className="orbit-ring orbit-ring-3"></div>
                          </div>
                        </div>
                        <span className={isActive ? 'nav-button-active-text' : ''}>{item.label}</span>
                      </button>
                    </div>
                  );
                }
                
                return (
                  <div key={item.id} className={isActive ? 'nav-button-active-border' : ''}>
                    <button
                      onClick={() => handleTabClick(item.id)}
                      className={`
                        nav-button relative rounded-full
                        font-medium tracking-wide transition-all duration-300
                        ${isActive 
                          ? 'nav-button-active' 
                          : ''
                        }
                      `}
                      style={{ 
                        padding: isMobile ? '4px 8px' : '7px 16px',
                        fontSize: isMobile ? '0.7rem' : '0.875rem',
                        color: isActive ? undefined : 'var(--content-faint)',
                      }}
                    >
                      <i className={`bi ${item.icon} ${isMobile ? 'text-[10px]' : 'text-sm'} mr-1`}></i>
                      <span className={isActive ? 'nav-button-active-text' : ''}>{item.label}</span>
                    </button>
                  </div>
                );
              })}

              {/* Vertical Divider */}
              <div 
                className="h-6 w-px"
                style={{
                  margin: isMobile ? '0 2px' : '0 4px',
                  background: 'linear-gradient(to bottom, transparent, var(--border-dashed), transparent)',
                }}
              ></div>

              {/* Theme Toggle */}
              {!isMobile && <ThemeToggle />}

              {/* More Button */}
              <div className={sidebarOpen ? 'nav-button-active-border' : ''}>
                <button
                  ref={menuButtonRef}
                  onClick={toggleSidebar}
                  className={`
                    nav-button hamburger-btn relative rounded-full
                    font-medium tracking-wide transition-all duration-300
                    ${sidebarOpen 
                      ? 'nav-button-active' 
                      : ''
                    }
                  `}
                  style={{ 
                    padding: isMobile ? '4px 8px' : '7px 16px',
                    fontSize: isMobile ? '0.7rem' : '0.875rem',
                    color: sidebarOpen ? undefined : 'var(--content-faint)',
                  }}
                >
                  <i className={`bi ${sidebarOpen ? 'bi-dash-square' : 'bi-grid'} ${isMobile ? 'text-[10px]' : 'text-sm'} mr-1`}></i>
                  <span className={sidebarOpen ? 'nav-button-active-text' : ''}>More</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default memo(Navbar);