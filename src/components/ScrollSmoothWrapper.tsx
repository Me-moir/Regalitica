"use client";
import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollSmoothWrapperProps {
  children: ReactNode;
}

interface GSAPInstance {
  registerPlugin: (...plugins: unknown[]) => void;
  ticker: {
    fps: (fps: number) => void;
    lagSmoothing: (threshold: number, adjustedLag: number) => void;
  };
  matchMedia: () => MatchMediaInstance;
  config: (options: { force3D: boolean; nullTargetWarn: boolean }) => void;
}

interface MatchMediaInstance {
  add: (conditions: Record<string, string>, callback: (context: MatchMediaContext) => (() => void) | void) => void;
  revert: () => void;
}

interface MatchMediaContext {
  conditions: Record<string, boolean>;
}

interface ScrollSmootherInstance {
  create: (config: ScrollSmootherConfig) => ScrollSmootherObject;
  get: () => ScrollSmootherObject | null;
}

interface ScrollSmootherConfig {
  wrapper: string;
  content: string;
  smooth: number;
  effects: boolean;
  smoothTouch: number | boolean;
  normalizeScroll: boolean;
  ignoreMobileResize: boolean;
  onUpdate?: (self: ScrollSmootherObject) => void;
}

interface ScrollSmootherObject {
  kill: () => void;
  scrollTo: (target: number | string | Element, smooth?: boolean, position?: string) => void;
  scrollTop: () => number;
  progress: number;
}

interface ScrollTriggerInstance {
  refresh: () => void;
  getAll: () => { kill: () => void }[];
  normalizeScroll: (enabled: boolean) => void;
  config: (options: { limitCallbacks: boolean; ignoreMobileResize: boolean }) => void;
}

declare global {
  interface Window {
    gsap: GSAPInstance;
    ScrollSmoother: ScrollSmootherInstance;
    ScrollTrigger: ScrollTriggerInstance;
  }
}

const ScrollSmoothWrapper = ({ children }: ScrollSmoothWrapperProps) => {
  const smoother = useRef<ScrollSmootherObject | null>(null);
  const mm = useRef<MatchMediaInstance | null>(null);
  const [gsapLoaded, setGsapLoaded] = useState(false);

  // Lazy load GSAP modules
  useEffect(() => {
    // Only load on desktop
    const isDesktop = window.matchMedia("(min-width: 769px)").matches;
    if (!isDesktop) return;

    Promise.all([
      import('gsap'),
      import('gsap/ScrollSmoother'),
      import('gsap/ScrollTrigger')
    ]).then(([gsapModule, ScrollSmootherModule, ScrollTriggerModule]) => {
      const gsap = gsapModule.gsap || gsapModule.default;
      const ScrollSmoother = ScrollSmootherModule.ScrollSmoother || ScrollSmootherModule.default;
      const ScrollTrigger = ScrollTriggerModule.ScrollTrigger || ScrollTriggerModule.default;
      
      gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
      
      // Optimize GSAP for performance
      gsap.config({
        force3D: true, // Force GPU acceleration
        nullTargetWarn: false
      });
      
      // Use native refresh rate instead of capping at 60fps
      gsap.ticker.lagSmoothing(500, 33); // Smooth out lag spikes
      
      // Configure ScrollTrigger for performance
      ScrollTrigger.config({
        limitCallbacks: true, // Limit callbacks during scroll for performance
        ignoreMobileResize: true
      });
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gsap = gsap;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).ScrollSmoother = ScrollSmoother;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).ScrollTrigger = ScrollTrigger;
      
      setGsapLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!gsapLoaded) return;

    const styleId = 'gsap-smoother-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        html, body { 
          height: 100%; 
          overscroll-behavior: none;
        }
        #smooth-wrapper { 
          height: 100vh;
          overflow: hidden; 
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        #smooth-content { 
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          perspective: 1000px;
          -webkit-perspective: 1000px;
        }
      `;
      document.head.appendChild(style);
    }

    mm.current = window.gsap.matchMedia();

    mm.current.add({
      isDesktop: "(min-width: 769px)"
    }, (context) => {
      if (!context.conditions.isDesktop) return;

      smoother.current = window.ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 0.8, // Reduced from 1.2 - lighter, more responsive feel
        effects: false, // Disabled for better performance
        smoothTouch: false, // Native touch scrolling
        normalizeScroll: true, // Prevents address bar issues
        ignoreMobileResize: true,
        onUpdate: () => {
          // Force repaint on each frame for smoother visuals
        }
      });

      // Refresh after a short delay to ensure DOM is ready
      requestAnimationFrame(() => {
        window.ScrollTrigger.refresh();
      });

      return () => {
        if (smoother.current) {
          smoother.current.kill();
          smoother.current = null;
        }
      };
    });

    return () => {
      if (mm.current) {
        mm.current.revert();
        mm.current = null;
      }
      if (smoother.current) {
        smoother.current.kill();
        smoother.current = null;
      }
      // Clean up styles
      const style = document.getElementById(styleId);
      if (style) style.remove();
    };
  }, [gsapLoaded]);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        {children}
      </div>
    </div>
  );
};

export default ScrollSmoothWrapper;

