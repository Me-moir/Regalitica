"use client";

import { memo, useEffect, useState } from "react";
import { StarfieldBackground } from "@/components/ui/starfield-background"; // adjust path if needed

const PHRASES = ["Manila, Philippines.", "14.5995° N, 120.9842° E"];
const TYPING_SPEED = 100;    // ms per character typed
const DELETING_SPEED = 60;  // ms per character deleted
const PAUSE_AFTER_TYPE = 2500; // ms to pause after fully typed
const PAUSE_AFTER_DELETE = 600; // ms to pause after fully deleted

function useTypingLoop(phrases: string[]) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];

    if (!isDeleting && displayed === current) {
      // Fully typed — pause then start deleting
      const timeout = setTimeout(() => setIsDeleting(true), PAUSE_AFTER_TYPE);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayed === "") {
      // Fully deleted — pause then move to next phrase
      const timeout = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((i) => (i + 1) % phrases.length);
      }, PAUSE_AFTER_DELETE);
      return () => clearTimeout(timeout);
    }

    const speed = isDeleting ? DELETING_SPEED : TYPING_SPEED;
    const timeout = setTimeout(() => {
      setDisplayed(
        isDeleting ? current.slice(0, displayed.length - 1) : current.slice(0, displayed.length + 1)
      );
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, phraseIndex, phrases]);

  return displayed;
}

const DiscoverHeader = memo(() => {
  const typedText = useTypingLoop(PHRASES);

  return (
    <section className="relative" style={{ marginBottom: 0 }}>
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          height: "clamp(280px, 45vh, 500px)",
          paddingTop: "72px",
          borderBottom: "1px dashed var(--border-dashed)",
        }}
      >
        <StarfieldBackground
          position="absolute"
          count={300}
          speed={0.4}
          starColor="#ffffff"
          twinkle={true}
        />

        <div className="relative z-10 flex flex-col items-center gap-3">
          <h1
            className="select-none text-4xl font-bold tracking-[0.35em] sm:text-5xl md:text-6xl lg:text-7xl"
            style={{
              background:
                "linear-gradient(180deg, #ffffff 0%, #b0b0b0 40%, #8a8a8a 70%, #a0a0a0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textAlign: "center",
            }}
          >
            NOTUS REGALIA
          </h1>

          <p
            className="select-none font-mono text-xs tracking-[0.15em] sm:text-sm"
            style={{ color: "rgba(180,180,190,0.7)" }}
          >
            Based in{" "}
            <span
              style={{ color: "rgba(220,220,230,0.9)" }}
              aria-label="Location"
            >
              {typedText}
              {/* Blinking cursor */}
              <span
                style={{
                  display: "inline-block",
                  width: "1px",
                  height: "1em",
                  backgroundColor: "rgba(220,220,230,0.8)",
                  marginLeft: "2px",
                  verticalAlign: "text-bottom",
                  animation: "blink 1s step-end infinite",
                }}
              />
            </span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
});

DiscoverHeader.displayName = "DiscoverHeader";

export default DiscoverHeader;