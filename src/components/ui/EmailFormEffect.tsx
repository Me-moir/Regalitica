"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}

export function EmailFormEffect({
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const newDataRef = useRef<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const startAnimation = () => {
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
  }, [placeholders]);

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
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--content-primary').trim() || '#FFF';
    ctx.fillText(inputRef.current.value, 16, 40);

    const imageData = ctx.getImageData(0, 0, 800, 800);
    const pixelData = imageData.data;
    const newData: any[] = [];

    for (let t = 0; t < 800; t++) {
      let i = 4 * t * 800;
      for (let n = 0; n < 800; n++) {
        let e = i + 4 * n;
        if (
          pixelData[e] !== 0 &&
          pixelData[e + 1] !== 0 &&
          pixelData[e + 2] !== 0
        ) {
          newData.push({
            x: n,
            y: t,
            color: [
              pixelData[e],
              pixelData[e + 1],
              pixelData[e + 2],
              pixelData[e + 3],
            ],
          });
        }
      }
    }

    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }));
  }, []);

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
            const { x: n, y: i, r: s, color: color } = t;
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
        }
      });
    };
    animateFrame(start);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getEmailWithSuffix = (): string => {
    if (showSuffix && !value.includes("@")) {
      return value + "@gmail.com";
    }
    return value;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && showSuffix && value.length > 0 && !value.includes("@")) {
      e.preventDefault();
      setValue(value + "@gmail.com");
      setShowSuffix(false);
      return;
    }

    if (e.key === "Enter" && !animating) {
      e.preventDefault();
      vanishAndSubmit();
    }
  };

  const vanishAndSubmit = () => {
    const finalEmail = getEmailWithSuffix();

    if (!validateEmail(finalEmail)) {
      setValidationError("Please enter a valid email address (e.g., name@domain.com)");
      
      setTimeout(() => {
        setValidationError("");
      }, 5000);
      
      return;
    }

    setValidationError("");
    setShowSuccess(false);
    setSubmittedEmail(finalEmail);
    setShowSuffix(false);
    setAnimating(true);
    draw();

    const value = inputRef.current?.value || "";
    if (value && inputRef.current) {
      const maxX = newDataRef.current.reduce(
        (prev, current) => (current.x > prev ? current.x : prev),
        0
      );
      animate(maxX);
    }
    
    setTimeout(() => {
      setShowSuffix(true);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    vanishAndSubmit();
    onSubmit && onSubmit(e);
  };

  const handleFormMouseMove = useCallback((e: React.MouseEvent<HTMLFormElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  }, []);

  const handleButtonMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--btn-mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--btn-mouse-y', `${y}px`);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!animating) {
      const newValue = e.target.value;
      const hasAtSymbol = newValue.includes("@");

      if (validationError) {
        setValidationError("");
      }

      if (newValue === "") {
        setShowSuffix(true);
      } else if (hasAtSymbol && showSuffix) {
        setShowSuffix(false);
      }

      setValue(newValue);
      onChange && onChange(e);
    }
  };

  const pillboxLeft = value.length * 8.5 + 56;

  return (
    <div className="w-full relative">
      <form
        className="w-full relative max-w-2xl mx-auto h-14 rounded-lg overflow-hidden transition duration-200 group"
        style={{
          backgroundColor: 'var(--button-bg)',
          boxShadow: 'var(--button-shadow)',
          border: 'solid 1px var(--button-border)'
        }}
        onSubmit={handleSubmit}
        onMouseMove={handleFormMouseMove}
      >
        <div 
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'radial-gradient(150px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(34, 197, 94, 0.6), rgba(255, 215, 0, 0.5), rgba(236, 72, 153, 0.5), rgba(147, 51, 234, 0.5), rgba(59, 130, 246, 0.4), transparent 70%)',
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            zIndex: 10
          }}
        />
        
        <canvas
          className={`absolute pointer-events-none text-base transform scale-50 top-[20%] left-2 sm:left-8 origin-top-left filter invert dark:invert-0 pr-20 ${
            !animating ? "opacity-0" : "opacity-100"
          }`}
          ref={canvasRef}
        />
        <input
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          value={value}
          type="text"
          className="w-full relative text-sm sm:text-base z-50 border-none bg-transparent h-full rounded-lg focus:outline-none focus:ring-0 pl-4 sm:pl-10 pr-20"
          style={{
            color: animating ? 'transparent' : 'var(--content-secondary)'
          }}
        />

        {showSuffix && value.length > 0 && !animating && (
          <div
            className="absolute pointer-events-none flex items-center top-1/2 -translate-y-1/2"
            style={{ left: `${pillboxLeft}px` }}
          >
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs whitespace-nowrap" style={{ backgroundColor: 'var(--hover-bg-10)', border: '1px solid var(--border-color)', color: 'var(--content-muted)' }}>
              @gmail.com
            </span>
          </div>
        )}

        <div className="absolute inset-0 flex items-center rounded-lg pointer-events-none">
          <AnimatePresence mode="wait">
            {!value && (
              <motion.p
                initial={{ y: 5, opacity: 0 }}
                key={`current-placeholder-${currentPlaceholder}`}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                transition={{ duration: 0.3, ease: "linear" }}
                className="text-sm sm:text-base font-normal pl-4 sm:pl-12 text-left w-[calc(100%-2rem)] truncate"
                style={{ color: 'var(--content-faint)' }}
              >
                {placeholders[currentPlaceholder]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <button
          type="submit"
          className="absolute right-2 top-1/2 z-50 -translate-y-1/2 h-10 px-6 rounded-lg cursor-pointer flex items-center justify-center group/btn overflow-hidden transition-all duration-200"
          style={{
            backgroundColor: 'var(--button-bg)',
            boxShadow: 'var(--button-shadow)',
            border: 'solid 1px var(--button-border)',
            opacity: 1
          }}
          onMouseMove={handleButtonMouseMove}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--hover-bg-strong)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--button-bg)';
          }}
        >
          <div 
            className="absolute inset-0 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'radial-gradient(80px circle at var(--btn-mouse-x, 50%) var(--btn-mouse-y, 50%), rgba(34, 197, 94, 0.6), rgba(255, 215, 0, 0.5), rgba(236, 72, 153, 0.5), rgba(147, 51, 234, 0.5), rgba(59, 130, 246, 0.4), transparent 70%)',
              padding: '2px',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude'
            }}
          />
          <span className="text-sm font-medium relative z-10" style={{ color: 'var(--content-secondary)' }}>
            Join Initiative
          </span>
        </button>
      </form>

      {showSuccess && (
        <div className="absolute left-0 right-0 flex justify-center mt-3" style={{ top: '100%' }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap"
              style={{
                backgroundColor: 'var(--button-bg)',
                boxShadow: 'var(--button-shadow)',
                border: 'solid 1px var(--border-dashed)'
              }}
            >
              <svg className="w-4 h-4" style={{ color: 'var(--content-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium" style={{ color: 'var(--content-muted)' }}>
                {submittedEmail} successfully registered.
              </span>
            </div>
          </motion.div>
        </div>
      )}

      {validationError && (
        <div className="absolute left-0 right-0 flex justify-center mt-3" style={{ top: '100%' }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap"
              style={{
                backgroundColor: 'var(--button-bg)',
                boxShadow: 'var(--button-shadow)',
                border: 'solid 1px rgba(220, 20, 60, 0.3)'
              }}
            >
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm font-medium text-red-400">
                {validationError}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}