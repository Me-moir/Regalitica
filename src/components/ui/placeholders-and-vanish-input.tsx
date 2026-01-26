"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

export function PlaceholdersAndVanishInput({
  placeholders,
  onChange,
  onSubmit,
}: {
  placeholders: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);
  const [showSuffix, setShowSuffix] = useState(true);
  const [validationError, setValidationError] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const startAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else if (document.visibilityState === "visible") {
      startAnimation();
    }
  };

  useEffect(() => {
    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [placeholders.length]); // Changed dependency

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const newDataRef = useRef<any[]>([]);
  const [animationComplete, setAnimationComplete] = useState(false);

  const draw = useCallback(() => {
    if (!inputRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);
    const computedStyles = getComputedStyle(inputRef.current);

    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = "#FFF";
    ctx.fillText(value, 16, 40);

    const imageData = ctx.getImageData(0, 0, 800, 800);
    const pixelData = imageData.data;
    const newData: any[] = [];

    for (let t = 0; t < 800; t++) {
      let i = 4 * t * 800;
      for (let n = 0; n < 800; n++) {
        if (pixelData[i] !== 0) {
          newData.push({
            x: n,
            y: t,
            color: [
              pixelData[i],
              pixelData[i + 1],
              pixelData[i + 2],
              pixelData[i + 3],
            ],
          });
        }
        i += 4;
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }));
  }, [value]);

  useEffect(() => {
    draw();
  }, [value, draw]);

  const animate = (start: number) => {
    const animateFrame = (pos: number = 0) => {
      requestAnimationFrame(() => {
        const newArr = [];
        for (let i = 0; i < newDataRef.current.length; i++) {
          const current = newDataRef.current[i];
          if (current.x < pos) {
            newArr.push(current);
          } else {
            if (current.r <= 0) {
              current.r = 0;
              continue;
            }
            current.x += Math.random() > 0.5 ? 1 : -1;
            current.y += Math.random() > 0.5 ? 1 : -1;
            current.r -= 0.05 * Math.random();
            newArr.push(current);
          }
        }
        newDataRef.current = newArr;
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(pos, 0, 800, 800);
          newDataRef.current.forEach((t) => {
            const { x: n, y: i, r: s, color } = t;
            if (n > pos) {
              ctx.beginPath();
              ctx.rect(n, i, s, s);
              ctx.fillStyle = color;
              ctx.strokeStyle = color;
              ctx.stroke();
            }
          });
        }
        if (newDataRef.current.length > 0) {
          animateFrame(pos - 8);
        } else {
          setValue("");
          setAnimating(false);
          setAnimationComplete(true);
        }
      });
    };
    animateFrame(start);
  };

  const validateEmail = (email: string): boolean => {
    // Email regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Delete the entire @gmail.com pill with one backspace
    if (e.key === "Backspace" && value === "" && showSuffix) {
      e.preventDefault();
      setShowSuffix(false);
      return;
    }
    
    // Handle Enter key - validate before submitting
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      
      const finalEmail = getEmailWithSuffix();
      if (!validateEmail(finalEmail)) {
        setValidationError("Please enter a valid email address (e.g., name@domain.com)");
        return;
      }
      
      // If valid, trigger submit
      setValidationError("");
      const form = e.currentTarget.form;
      if (form) {
        const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
      }
    }
  };

  const getEmailWithSuffix = (): string => {
    // If user typed email without @, and suffix is still showing, use @gmail.com
    if (showSuffix && !value.includes("@")) {
      return value + "@gmail.com";
    }
    return value;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const finalEmail = getEmailWithSuffix();
    
    // Validate email
    if (!validateEmail(finalEmail)) {
      setValidationError("Please enter a valid email address (e.g., name@domain.com)");
      return;
    }
    
    setValidationError("");
    setAnimating(true);
    draw();

    if (finalEmail && inputRef.current) {
      const maxX = newDataRef.current.reduce(
        (prev, current) => (current.x > prev ? current.x : prev),
        0
      );
      animate(maxX);
    }

    // Create a modified event with the final email
    const modifiedEvent = {
      ...e,
      target: { ...e.target, value: finalEmail }
    };
    onSubmit(modifiedEvent as any);

    setTimeout(() => {
      setAnimationComplete(false);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Clear validation error when user types
    if (validationError) {
      setValidationError("");
    }
    
    // If user clears the input completely, respawn the suffix pill
    if (newValue === "" && !showSuffix) {
      setShowSuffix(true);
    }
    
    // If user types @, remove the suffix pill
    if (newValue.includes("@") && showSuffix) {
      setShowSuffix(false);
    }
    
    setValue(newValue);
    onChange(e);
  };

  return (
    <div className="w-full">
      <form
        className="w-full relative max-w-2xl mx-auto flex items-center gap-3"
        onSubmit={handleSubmit}
      >
        {/* Input Container with Gradient Border */}
        <div 
          className="flex-1 relative group"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
            e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
          }}
          style={{ '--mouse-x': '50%', '--mouse-y': '50%' } as React.CSSProperties}
        >
          {/* Gradient Border on Hover */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
            style={{
              background: 'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(34, 197, 94, 0.8), rgba(59, 130, 246, 0.6), rgba(236, 72, 153, 0.4), transparent 50%)',
              padding: '2px',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude'
            }}
          />
          
          <div 
            className="relative bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.15)] border border-white/20"
          >
            <canvas
              className={`absolute pointer-events-none text-base transform scale-50 top-[20%] left-2 origin-top-left filter invert dark:invert-0 pr-20 ${
                animating ? "opacity-100" : "opacity-0"
              }`}
              ref={canvasRef}
            />
            <div className="flex items-center relative">
              <input
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                value={value}
                type="text"
                className={`w-full relative text-sm sm:text-base z-50 border-none bg-transparent text-white h-14 rounded-2xl focus:outline-none focus:ring-0 pl-6 pr-32 ${
                  animating ? "text-transparent" : ""
                }`}
              />
              
              {/* @gmail.com pill - only show when user has typed something */}
              {showSuffix && value.length > 0 && (
                <div className="absolute pointer-events-none flex items-center" style={{ left: `${24 + (value.length * 8.5)}px` }}>
                  <span className="inline-block w-3" />
                  <span 
                    className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/10 border border-white/20 text-xs text-gray-400 whitespace-nowrap"
                  >
                    @gmail.com
                  </span>
                </div>
              )}

              <div className="absolute inset-0 flex items-center rounded-2xl pointer-events-none pl-6 pr-32">
                <AnimatePresence mode="popLayout">
                  {!value && (
                    <motion.div
                      initial={{ y: 5, opacity: 0 }}
                      key={currentPlaceholder}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -15, opacity: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        ease: "easeInOut",
                        opacity: { duration: 0.2 }
                      }}
                      className="flex items-center gap-3 text-zinc-500 text-sm sm:text-base font-normal"
                    >
                      <span>{placeholders[currentPlaceholder]}</span>
                      {showSuffix && (
                        <span 
                          className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/10 border border-white/20 text-xs text-gray-400 whitespace-nowrap"
                        >
                          @gmail.com
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {animationComplete && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.p
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-white text-sm font-semibold"
                  >
                    ✓ Submitted
                  </motion.p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Join Venture Button - Same height as input (h-14) with max opacity always */}
        <div className="relative pointer-events-auto h-14">
          <button
            disabled={!value}
            type="submit"
            className="premium-btn h-14 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'rgba(16, 16, 16, 1)',
              boxShadow: 'inset 0px 1px 1px rgba(255, 255, 255, 0.25), inset 0px 2px 2px rgba(255, 255, 255, 0.2), inset 0px 4px 4px rgba(255, 255, 255, 0.15), 0 0 20px rgba(0, 0, 0, 0.5)',
              opacity: 1
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
              e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
            }}
          >
            <svg className="premium-btn-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
              />
            </svg>
            <div className="premium-txt-wrapper">
              <div className="premium-txt-1">
                {'Join Venture'.split('').map((letter, i) => (
                  <span key={i} className="premium-btn-letter" style={{ animationDelay: `${i * 0.08}s` }}>
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </div>
            </div>
            <div 
              className="premium-btn-border"
              style={{
                background: 'radial-gradient(150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(34, 197, 94, 1), rgba(59, 130, 246, 0.9), rgba(236, 72, 153, 0.8), transparent 70%)',
                padding: '2px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude'
              } as React.CSSProperties}
            />
          </button>
        </div>
      </form>
      
      {/* Validation Error Message */}
      {validationError && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs sm:text-sm mt-2 text-center max-w-2xl mx-auto"
        >
          ⚠️ {validationError}
        </motion.p>
      )}
    </div>
  );
}