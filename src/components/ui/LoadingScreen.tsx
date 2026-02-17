"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
const logoImage = '/assets/Logo.png';

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

  useEffect(() => {
    const dots: Dot[] = [];
    for (let lineIndex = 0; lineIndex < numberOfLines; lineIndex++) {
      for (let dotIndex = 0; dotIndex < dotsPerLine; dotIndex++) {
        const speed = 0.5;
        const isOuterLine = lineIndex === 0 || lineIndex === 3;
        const direction = isOuterLine ? -1 : 1;
        const position = isOuterLine ? 100 : 0;
        dots.push({
          lineIndex, dotIndex, position, direction, speed,
          delay: 0, startTime: Date.now(), isDelayed: false, trail: []
        });
      }
    }
    dotsRef.current = dots;
  }, []);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;
    
    // Read theme from document
    const getCanvasBg = () => {
      const style = getComputedStyle(document.documentElement);
      return style.getPropertyValue('--loading-canvas-bg').trim() || '#000000';
    };
    const getLineBase = () => {
      const style = getComputedStyle(document.documentElement);
      return style.getPropertyValue('--loading-line-base').trim() || 'rgba(55, 65, 81, 0.6)';
    };
    const getLineActive = () => {
      const style = getComputedStyle(document.documentElement);
      return style.getPropertyValue('--loading-line-active').trim() || 'rgba(229, 43, 80, 1)';
    };
    const getDotColor = () => {
      const style = getComputedStyle(document.documentElement);
      return style.getPropertyValue('--content-primary').trim() || '#ffffff';
    };

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
      ctx.fillStyle = getCanvasBg();
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const linePositions = Array.from({ length: numberOfLines }, (_, i) => 
        ((i + 1) / (numberOfLines + 1)) * window.innerWidth
      );

      linePositions.forEach((x, lineIndex) => {
        const traveledSegments: number[] = [];
        dotsRef.current
          .filter(dot => dot.lineIndex === lineIndex && !dot.isDelayed)
          .forEach(dot => {
            dot.trail.forEach(trailPos => {
              if (trailPos >= 0 && trailPos <= 100) traveledSegments.push(trailPos);
            });
          });

        const sortedSegments = [...new Set(traveledSegments)].sort((a, b) => a - b);

        ctx.strokeStyle = getLineBase();
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, window.innerHeight);
        ctx.stroke();

        if (sortedSegments.length > 0) {
          ctx.strokeStyle = getLineActive();
          ctx.lineWidth = 2;
          let segmentStart = sortedSegments[0];
          let segmentEnd = sortedSegments[0];
          for (let i = 1; i < sortedSegments.length; i++) {
            if (sortedSegments[i] - segmentEnd < 1) {
              segmentEnd = sortedSegments[i];
            } else {
              const yStart = (segmentStart / 100) * window.innerHeight;
              const yEnd = (segmentEnd / 100) * window.innerHeight;
              ctx.beginPath(); ctx.moveTo(x, yStart); ctx.lineTo(x, yEnd); ctx.stroke();
              segmentStart = sortedSegments[i];
              segmentEnd = sortedSegments[i];
            }
          }
          const yStart = (segmentStart / 100) * window.innerHeight;
          const yEnd = (segmentEnd / 100) * window.innerHeight;
          ctx.beginPath(); ctx.moveTo(x, yStart); ctx.lineTo(x, yEnd); ctx.stroke();
        }
      });

      dotsRef.current.forEach(dot => {
        dot.position += dot.speed * dot.direction;
        if (dot.position < 0) dot.position = 0;
        if (dot.position > 100) dot.position = 100;
        dot.trail.push(dot.position);

        const x = linePositions[dot.lineIndex];
        const y = (dot.position / 100) * window.innerHeight;
        ctx.fillStyle = getDotColor();
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animationFrame); resizeObserver.disconnect(); };
  }, []);

  useEffect(() => {
    if (hasCompletedRef.current) return;
    const duration = 2700;
    const startTime = Date.now();
    let animationFrame: number;
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const linearProgress = Math.min(elapsed / duration, 1);
      setProgress(linearProgress * 100);
      if (linearProgress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setProgress(100);
        hasCompletedRef.current = true;
        setTimeout(() => onLoadingComplete(), 300);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [onLoadingComplete]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" style={{ background: 'var(--loading-bg)' }}>
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
      `}</style>
      
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="flex flex-col items-center">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 mb-6 sm:mb-8 p-4">
            <svg 
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 120 120"
              style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
            >
              <circle cx="60" cy="60" r={radius} stroke="var(--loading-circle-track)" strokeWidth="4" fill="none" />
              <circle
                cx="60" cy="60" r={radius}
                stroke="url(#gradient)" strokeWidth="4" fill="none"
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'none', filter: 'drop-shadow(0 0 8px rgba(229, 43, 80, 0.8)) drop-shadow(0 0 16px rgba(229, 43, 80, 0.5))' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E52B50" />
                  <stop offset="50%" stopColor="#E52B50" />
                  <stop offset="100%" stopColor="#E52B50" />
                </linearGradient>
              </defs>
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div 
                className="w-full h-full max-w-[75%] max-h-[75%] rounded-full flex items-center justify-center aspect-square shadow-2xl relative overflow-hidden"
                style={{ 
                  background: 'var(--loading-logo-bg)', 
                  boxShadow: `0 0 0 1px var(--loading-logo-ring)` 
                }}
              >
                <Image src={logoImage} alt="The Fool Logo" width={200} height={200} priority className="w-full h-full object-contain p-4 relative z-10" />
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
          
          <p style={{ color: 'var(--content-tertiary)' }} className="text-sm sm:text-base md:text-lg mt-1 italic max-w-xs sm:max-w-md text-center px-8 mb-12">
            "Loading contents..."
          </p>
          
          <p 
            className="text-xs sm:text-sm font-mono tracking-wider transition-all duration-500"
            style={{ 
              color: Math.round(progress) === 100 ? '#E52B50' : 'var(--content-muted)',
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