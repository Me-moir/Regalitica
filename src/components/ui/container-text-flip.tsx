"use client";
import React, { useState, useEffect, useId } from "react";
import { motion } from "framer-motion";

// Inline cn utility to avoid import issues
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export function ContainerTextFlip({
  words = ["better", "modern", "beautiful", "awesome"],
  interval = 3000,
  className,
  textClassName,
  animationDuration = 700
}: {
  words?: string[];
  interval?: number;
  className?: string;
  textClassName?: string;
  animationDuration?: number;
}) {
  const id = useId();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [width, setWidth] = useState(100);
  const textRef = React.useRef<HTMLDivElement>(null);

  const updateWidthForWord = () => {
    if (textRef.current) {
      // Add some padding to the text width (30px on each side)
      const textWidth = textRef.current.scrollWidth + 30;
      setWidth(textWidth);
    }
  };

  useEffect(() => {
    // Update width whenever the word changes
    updateWidthForWord();
  }, [currentWordIndex]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      // Width will be updated in the effect that depends on currentWordIndex
    }, interval);

    return () => clearInterval(intervalId);
  }, [words.length, interval]);

  return (
    <motion.span
      layout
      layoutId={`words-here-${id}`}
      animate={{ width }}
      transition={{ duration: animationDuration / 2000 }}
      className={cn(
        "relative inline-block rounded-lg pt-2 pb-3 px-4 font-bold origin-left",
        "[background:linear-gradient(to_bottom,rgba(0,0,0,0.05),rgba(0,0,0,0.03))]",
        "shadow-[inset_0_-1px_rgba(0,0,0,0.08),inset_0_0_0_1px_rgba(0,0,0,0.08),_0_4px_8px_rgba(0,0,0,0.1)]",
        "dark:[background:linear-gradient(to_bottom,rgba(255,255,255,0.1),rgba(255,255,255,0.05))]",
        "dark:shadow-[inset_0_-1px_rgba(255,255,255,0.1),inset_0_0_0_1px_rgba(255,255,255,0.1),_0_4px_8px_rgba(0,0,0,0.2)]",
        className
      )}
      style={{ textAlign: 'left' }}
      key={words[currentWordIndex]}>
      <motion.span
        transition={{
          duration: animationDuration / 1000,
          ease: "easeInOut",
        }}
        className={cn("inline-block text-left", textClassName)}
        ref={textRef}
        layoutId={`word-div-${words[currentWordIndex]}-${id}`}>
        <motion.span className="inline-block">
          {words[currentWordIndex].split("").map((letter, index) => (
            <motion.span
              key={index}
              initial={{
                opacity: 0,
                filter: "blur(10px)",
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
              }}
              transition={{
                delay: index * 0.02,
              }}>
              {letter}
            </motion.span>
          ))}
        </motion.span>
      </motion.span>
    </motion.span>
  );
}