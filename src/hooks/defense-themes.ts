"use client";

import { useEffect, useState } from 'react';

// ── Globe theme tokens ─────────────────────────────────────────────────────
export interface GlobeTheme {
  ocean0: string; ocean50: string; ocean100: string;
  spec0: string; spec100: string;
  atm96: string; atm100: string;
  starFill: string; starMaxOpacity: number;
  hexStroke: string;
  gratF: string; gratM: string;
  equatorStroke: string; tropicStroke: string;
  scanStroke: string;
  landKnown: string; landUnknown: string;
  landKnownStroke: string; landUnknownStroke: string;
  landHoverFill: string; landHoverStroke: string;
  landSelectedFill: string;
  borderStroke: string;
  ring1: string; ring2: string; ring3: string;
  tickCardinal: string; tickMajor: string; tickMinor: string;
  poleStroke: string; poleDot: string;
  issColor: string; issTrack: string;
  beaconDot: string; beaconPulse: string;
  tooltipBg: string; tooltipBorder: string; tooltipAccent: string;
  tooltipText: string; tooltipSubtext: string; tooltipMeta: string;
  hudText: string; hudBracket: string;
  bgGrid: string; panelBg: string;
}

export const DARK_THEME: GlobeTheme = {
  ocean0: '#0d1017', ocean50: '#08090d', ocean100: '#030405',
  spec0: '#1c2535', spec100: '#0a0c12',
  atm96: '#7a8fa8', atm100: '#9bb0c4',
  starFill: '#dde8f0', starMaxOpacity: 0.28,
  hexStroke: 'rgba(140,165,200,0.048)',
  gratF: 'rgba(120,140,170,0.03)', gratM: 'rgba(150,170,200,0.065)',
  equatorStroke: 'rgba(227,27,84,0.13)', tropicStroke: 'rgba(160,175,195,0.03)',
  scanStroke: 'rgba(227,27,84,0.4)',
  landKnown: 'rgba(24,29,40,0.92)', landUnknown: 'rgba(18,21,30,0.88)',
  landKnownStroke: 'rgba(110,130,165,0.22)', landUnknownStroke: 'rgba(70,85,110,0.1)',
  landHoverFill: 'rgba(155,180,215,0.25)', landHoverStroke: 'rgba(220,235,255,1.0)',
  landSelectedFill: 'rgba(227,27,84,0.18)',
  borderStroke: 'rgba(130,155,190,0.18)',
  ring1: 'rgba(140,160,185,0.1)', ring2: 'rgba(120,140,170,0.07)', ring3: 'rgba(227,27,84,0.12)',
  tickCardinal: 'rgba(227,27,84,0.65)', tickMajor: 'rgba(150,170,200,0.28)', tickMinor: 'rgba(110,130,160,0.1)',
  poleStroke: 'rgba(227,27,84,0.3)', poleDot: 'rgba(227,27,84,0.5)',
  issColor: '#00dcff', issTrack: 'rgba(0,220,255,0.18)',
  beaconDot: '#00c8ff', beaconPulse: 'rgba(0,200,255,0.5)',
  tooltipBg: 'rgba(3,6,12,0.96)', tooltipBorder: 'rgba(0,200,255,0.14)',
  tooltipAccent: 'rgba(0,200,255,0.55)', tooltipText: 'rgba(255,255,255,0.94)',
  tooltipSubtext: 'rgba(255,255,255,0.72)', tooltipMeta: 'rgba(255,255,255,0.22)',
  hudText: 'rgba(130,155,185,0.28)', hudBracket: 'rgba(227,27,84,0.35)',
  bgGrid: 'rgba(120,145,175,0.03)', panelBg: '#010308',
};

export const LIGHT_THEME: GlobeTheme = {
  ocean0: '#f8f9fa', ocean50: '#f0f2f4', ocean100: '#e8eaec',
  spec0: '#ffffff', spec100: '#e0e4e8',
  atm96: '#c0c8d0', atm100: '#a0aab4',
  starFill: '#c0c8d0', starMaxOpacity: 0.0,
  hexStroke: 'rgba(80,90,100,0.055)',
  gratF: 'rgba(60,70,80,0.07)', gratM: 'rgba(60,70,80,0.15)',
  equatorStroke: 'rgba(227,27,84,0.28)', tropicStroke: 'rgba(60,70,80,0.06)',
  scanStroke: 'rgba(227,27,84,0.38)',
  landKnown: 'rgba(208,212,216,0.97)', landUnknown: 'rgba(190,195,200,0.90)',
  landKnownStroke: 'rgba(90,100,112,0.3)', landUnknownStroke: 'rgba(90,100,112,0.13)',
  landHoverFill: 'rgba(155,165,175,0.97)', landHoverStroke: 'rgba(30,40,55,0.85)',
  landSelectedFill: 'rgba(227,27,84,0.1)',
  borderStroke: 'rgba(80,90,102,0.22)',
  ring1: 'rgba(80,90,100,0.12)', ring2: 'rgba(80,90,100,0.07)', ring3: 'rgba(227,27,84,0.14)',
  tickCardinal: 'rgba(227,27,84,0.7)', tickMajor: 'rgba(70,80,90,0.35)', tickMinor: 'rgba(70,80,90,0.14)',
  poleStroke: 'rgba(227,27,84,0.4)', poleDot: 'rgba(227,27,84,0.6)',
  issColor: '#00c8ff', issTrack: 'rgba(0,200,255,0.2)',
  beaconDot: '#00c8ff', beaconPulse: 'rgba(0,200,255,0.5)',
  tooltipBg: 'rgba(248,249,250,0.97)', tooltipBorder: 'rgba(0,200,255,0.18)',
  tooltipAccent: 'rgba(0,200,255,0.65)', tooltipText: 'rgba(15,18,22,0.92)',
  tooltipSubtext: 'rgba(15,18,22,0.62)', tooltipMeta: 'rgba(15,18,22,0.36)',
  hudText: 'rgba(70,80,90,0.42)', hudBracket: 'rgba(227,27,84,0.4)',
  bgGrid: 'rgba(60,70,80,0.045)', panelBg: '#f4f5f6',
};

// ── Hook: sync with site-wide night/light mode ─────────────────────────────
export function useSiteThemeIsLight(): boolean {
  const [isLight, setIsLight] = useState(() => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('light');
  });

  useEffect(() => {
    const root = document.documentElement;
    setIsLight(root.classList.contains('light'));
    const observer = new MutationObserver(() => {
      setIsLight(root.classList.contains('light'));
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isLight;
}
