"use client";

import { useEffect, useState } from 'react';

// ── Isolated blink ────────────────────────────────────────────────────────
export const SigBlink = () => {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn(v => !v), 1400);
    return () => clearInterval(id);
  }, []);
  return <>{on ? 'SIG ●●●●○' : 'SIG ●●●○○'}</>;
};

// ── AcronymTagline ──
export const AcronymTagline = ({ text, isLight }: { text: string; isLight: boolean }) => {
  const tagline = text.split('\n\n')[0].trim();

  // MEGIDDO acronym letter indices: M(0) E(2) G(3) I(5) D(6) D(8) O(9)
  const acronymWordIndices = new Set([0, 2, 3, 5, 6, 8, 9]);

  // Tokenise preserving whitespace
  const tokens = tagline.split(/(\s+)/);
  let wordCount = 0;

  const rendered = tokens.map((token, i) => {
    if (/^\s+$/.test(token)) return <span key={i}>{token}</span>;
    // It's a word token, possibly with trailing punctuation like ","
    const thisWordIndex = wordCount++;
    if (acronymWordIndices.has(thisWordIndex) && token.length > 0) {
      return (
        <span key={i}>
          <span style={{
            color: '#E31B54',
            fontWeight: 700,
            textShadow: '0 0 12px rgba(227,27,84,0.4)',
          }}>{token[0]}</span>
          {token.slice(1)}
        </span>
      );
    }
    return <span key={i}>{token}</span>;
  });

  return <>{rendered}</>;
};
