"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import logoImage from '../assets/Logo.png';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

interface Dot {
  lineIndex: number;
  dotIndex: number;
  position: number;
  direction: number;
  speed: number;
  delay: number;
  startTime: number;
  isDelayed: boolean;
  trail: number[];
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const hasCompletedRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const numberOfLines = 4;
  const dotsPerLine = 1;

  // Initialize dots - outer lines from bottom, inner lines from top
  useEffect(() => {
    const dots: Dot[] = [];
    for (let lineIndex = 0; lineIndex < numberOfLines; lineIndex++) {
      for (let dotIndex = 0; dotIndex < dotsPerLine; dotIndex++) {
        // Speed to travel 90% in 3 seconds (~180 frames at 60fps)
        // 90 units / 180 frames = 0.5 per frame
        const speed = 0.5;
        
        // Outer lines (0 and 3) go UP (start from bottom), inner lines (1 and 2) go DOWN (start from top)
        const isOuterLine = lineIndex === 0 || lineIndex === 3;
        const direction = isOuterLine ? -1 : 1; // -1 = going up, 1 = going down
        const position = isOuterLine ? 100 : 0; // Start at bottom (100) or top (0)
        
        dots.push({
          lineIndex,
          dotIndex,
          position,
          direction,
          speed,
          delay: 0, // No delay - start immediately
          startTime: Date.now(),
          isDelayed: false,
          trail: []
        });
      }
    }
    dotsRef.current = dots;
  }, []);

  // Lock scroll when loading screen is mounted
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, []);

  // Canvas animation - Optimized with RAF
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { 
      alpha: false,
      desynchronized: true
    });
    if (!ctx) return;
    
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    let animationFrame: number;
    const animate = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const linePositions = Array.from({ length: numberOfLines }, (_, i) => 
        ((i + 1) / (numberOfLines + 1)) * window.innerWidth
      );

      // Draw lines with colored paths
      linePositions.forEach((x, lineIndex) => {
        const traveledSegments: number[] = [];
        dotsRef.current
          .filter(dot => dot.lineIndex === lineIndex && !dot.isDelayed)
          .forEach(dot => {
            dot.trail.forEach(trailPos => {
              if (trailPos >= 0 && trailPos <= 100) {
                traveledSegments.push(trailPos);
              }
            });
          });

        const sortedSegments = [...new Set(traveledSegments)].sort((a, b) => a - b);

        // Draw gray base line
        ctx.strokeStyle = 'rgba(55, 65, 81, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, window.innerHeight);
        ctx.stroke();

        // Draw red colored segments
        if (sortedSegments.length > 0) {
          ctx.strokeStyle = 'rgba(229, 43, 80)';
          ctx.lineWidth = 2;
          
          let segmentStart = sortedSegments[0];
          let segmentEnd = sortedSegments[0];
          
          for (let i = 1; i < sortedSegments.length; i++) {
            if (sortedSegments[i] - segmentEnd < 1) {
              segmentEnd = sortedSegments[i];
            } else {
              const yStart = (segmentStart / 100) * window.innerHeight;
              const yEnd = (segmentEnd / 100) * window.innerHeight;
              ctx.beginPath();
              ctx.moveTo(x, yStart);
              ctx.lineTo(x, yEnd);
              ctx.stroke();
              
              segmentStart = sortedSegments[i];
              segmentEnd = sortedSegments[i];
            }
          }
          
          const yStart = (segmentStart / 100) * window.innerHeight;
          const yEnd = (segmentEnd / 100) * window.innerHeight;
          ctx.beginPath();
          ctx.moveTo(x, yStart);
          ctx.lineTo(x, yEnd);
          ctx.stroke();
        }
      });

      // Update and draw dots
      const currentTime = Date.now();
      dotsRef.current.forEach(dot => {
        // Move dot based on direction
        dot.position += dot.speed * dot.direction;
        
        // Clamp position to 0-100 range (don't reset, just stop at edges)
        if (dot.position < 0) dot.position = 0;
        if (dot.position > 100) dot.position = 100;

        // Add to trail
        dot.trail.push(dot.position);

        // Draw the dot
        const x = linePositions[dot.lineIndex];
        const y = (dot.position / 100) * window.innerHeight;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, []);

  // Progress animation - 3 seconds total (2.7s animation + 0.3s transition)
  useEffect(() => {
    if (hasCompletedRef.current) return;

    const duration = 2700; // 2.7 seconds for progress
    const startTime = Date.now();
    let animationFrame: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const linearProgress = Math.min(elapsed / duration, 1);
      const newProgress = linearProgress * 100;
      
      setProgress(newProgress);
      
      if (linearProgress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setProgress(100);
        hasCompletedRef.current = true;
        setTimeout(() => onLoadingComplete(), 300); // 0.3s transition
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [onLoadingComplete]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden">
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
      `}</style>
      
      {/* Canvas for lines and dots */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />
      
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="flex flex-col items-center">

          {/* Logo Frame with Progress Circle */}
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 mb-6 sm:mb-8 p-4">
            <svg 
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 120 120"
              style={{ 
                transform: 'rotate(-90deg)',
                overflow: 'visible'
              }}
            >
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="#1f2937"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="url(#gradient)"
                strokeWidth="4"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ 
                  transition: 'none',
                  filter: 'drop-shadow(0 0 8px rgba(229, 43, 80, 0.8)) drop-shadow(0 0 16px rgba(229, 43, 80, 0.5))'
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E52B50" />
                  <stop offset="50%" stopColor="#E52B50" />
                  <stop offset="100%" stopColor="#E52B50" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Logo Container */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="w-full h-full max-w-[75%] max-h-[75%] rounded-full bg-gray-900 flex items-center justify-center aspect-square shadow-2xl ring-1 ring-gray-800 relative overflow-hidden">
                <Image 
                  src={logoImage} 
                  alt="The Fool Logo" 
                  width={200}
                  height={200}
                  priority
                  className="w-full h-full object-contain p-4 relative z-10"
                />
                {/* Shining Glare Animation */}
                <div 
                  className="absolute inset-0 z-20 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                    animation: 'shine 3s ease-in-out infinite',
                    animationDelay: '0.5s',
                    transform: 'translateX(-100%) skewX(-15deg)',
                    willChange: 'transform'
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Quote Text */}
          <p className="text-gray-300 text-sm sm:text-base md:text-lg mt-1 italic max-w-xs sm:max-w-md text-center px-8 mb-12">
            "We are fools with nothing. We can become Anything."
          </p>
          
          {/* Progress Percentage */}
          <p 
            className="text-xs sm:text-sm font-mono tracking-wider transition-all duration-500"
            style={{ 
              color: Math.round(progress) === 100 ? '#E52B50' : '#9ca3af',
              fontWeight: Math.round(progress) === 100 ? 'bold' : 'normal'
            }}
          >
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;