"use client";

import { useEffect, useRef, useState } from 'react';
import type { GlobeTheme } from '@/hooks/defense-themes';
import {
  type CountryInfo,
  type BeaconTooltip,
  type ISSTooltip,
  type PhSatellite,
  type MilBase,
  type ConflictStatus,
  COUNTRY_DATA,
  CAPITALS,
  ISS_INFO,
  PH_SATELLITES,
  PH_MILITARY_BASES,
  BASE_TYPE_COLORS,
  WPS_CONFLICT_ZONES,
  CONFLICT_STATUS_COLORS,
} from '@/data/defense-data';

// ── Globe ──────────────────────────────────────────────────────────────────
const GlobeD3 = ({ onCountrySelect, theme, deselectSignal, focusSignal }: { onCountrySelect: (info: CountryInfo | null) => void; theme: GlobeTheme; deselectSignal: number; focusSignal: { productId: string; active: boolean } }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{ issT: number; selected: string | null; hoveredCountry: string | null; argosActive: boolean; zoomScale: number; targetZoom: number; tweenFromZoom: number; tweenIsZoomOut: boolean; tweening: boolean; tweenStart: number; tweenFrom: [number,number,number]; tweenTo: [number,number,number]; tweenFromTrans: [number,number]; tweenToTrans: [number,number]; trackedSatIdx: number | null; issTracked: boolean }>({ issT: 0, selected: null, hoveredCountry: null, argosActive: false, zoomScale: 1, targetZoom: 1, tweenFromZoom: 1, tweenIsZoomOut: false, tweening: false, tweenStart: 0, tweenFrom: [-20,-28,0], tweenTo: [-20,-28,0], tweenFromTrans: [0,0], tweenToTrans: [0,0], trackedSatIdx: null, issTracked: false });
  const satScreenPosRef = useRef<([number,number] | null)[]>(PH_SATELLITES.map(() => null));
  const issScreenPosRef = useRef<[number,number] | null>(null);
  const themeRef = useRef<GlobeTheme>(theme);
  const countriesLayerRef = useRef<any>(null);
  const ID_TO_NAME_ref = useRef<Record<number, string>>({});
  const argosLayerRef = useRef<any>(null);
  const d3ModuleRef = useRef<any>(null);
  const projectionRef = useRef<any>(null);
  const [baseTooltip, setBaseTooltip] = useState<{ base: MilBase; x: number; y: number } | null>(null);

  useEffect(() => { themeRef.current = theme; }, [theme]);

  useEffect(() => {
    if (deselectSignal === 0) return;
    const prev = stateRef.current.selected;
    if (!prev || !countriesLayerRef.current) return;

    const t = themeRef.current;
    const ID_TO_NAME = ID_TO_NAME_ref.current;

    countriesLayerRef.current.selectAll('.country')
      .filter((dd: any) => (ID_TO_NAME[+dd.id] || '') === prev)
      .attr('fill', COUNTRY_DATA[prev] ? t.landKnown : t.landUnknown)
      .attr('stroke', COUNTRY_DATA[prev] ? t.landKnownStroke : t.landUnknownStroke)
      .attr('stroke-width', 0.5)
      .attr('filter', null);

    stateRef.current.selected = null;
  }, [deselectSignal]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const t = theme;

    const oceanStops = svg.querySelectorAll('#def-ocean stop');
    if (oceanStops[0]) (oceanStops[0] as SVGStopElement).style.stopColor = t.ocean0;
    if (oceanStops[1]) (oceanStops[1] as SVGStopElement).style.stopColor = t.ocean50;
    if (oceanStops[2]) (oceanStops[2] as SVGStopElement).style.stopColor = t.ocean100;

    const specStops = svg.querySelectorAll('#def-spec stop');
    if (specStops[0]) (specStops[0] as SVGStopElement).style.stopColor = t.spec0;
    if (specStops[1]) (specStops[1] as SVGStopElement).style.stopColor = t.spec100;

    const atmStops = svg.querySelectorAll('#def-atm stop');
    if (atmStops[1]) (atmStops[1] as SVGStopElement).style.stopColor = t.atm96;
    if (atmStops[2]) (atmStops[2] as SVGStopElement).style.stopColor = t.atm100;

    svg.querySelectorAll('.star-pt').forEach((el) => {
      const s = el as SVGCircleElement;
      s.style.fill = t.starFill;
      const baseO = parseFloat(s.dataset.baseO ?? '0.15');
      s.style.opacity = String(baseO * (t.starMaxOpacity / 0.28));
    });

    const gf = svg.querySelector('.grat-f') as SVGPathElement | null;
    const gm = svg.querySelector('.grat-m') as SVGPathElement | null;
    const eq = svg.querySelector('.equator') as SVGPathElement | null;
    if (gf) gf.style.stroke = t.gratF;
    if (gm) gm.style.stroke = t.gratM;
    if (eq) eq.style.stroke = t.equatorStroke;
    svg.querySelectorAll('[class^="tropic-"]').forEach(el => {
      (el as SVGPathElement).style.stroke = t.tropicStroke;
    });

    const sr = svg.querySelector('.scan-ring') as SVGCircleElement | null;
    if (sr) sr.style.stroke = t.scanStroke;

    svg.querySelectorAll('.country').forEach(el => {
      const p = el as SVGPathElement;
      const name = (p as any).__countryName;
      const isSel = stateRef.current.selected === name;
      const isHov = stateRef.current.hoveredCountry === name;
      if (isSel) return;
      if (isHov) {
        p.style.fill = t.landHoverFill;
        p.style.stroke = t.landHoverStroke;
        return;
      }
      const hasData = p.dataset.hasData === 'true';
      p.style.fill = hasData ? t.landKnown : t.landUnknown;
      p.style.stroke = hasData ? t.landKnownStroke : t.landUnknownStroke;
    });

    const borders = svg.querySelector('.borders') as SVGPathElement | null;
    if (borders) borders.style.stroke = t.borderStroke;

    svg.querySelectorAll('[data-ring]').forEach(el => {
      const idx = (el as SVGCircleElement).dataset.ring;
      const c = idx === '1' ? t.ring1 : idx === '2' ? t.ring2 : t.ring3;
      (el as SVGCircleElement).style.stroke = c;
    });

    svg.querySelectorAll('[data-tick]').forEach(el => {
      const kind = (el as SVGLineElement).dataset.tick;
      const c = kind === 'cardinal' ? t.tickCardinal : kind === 'major' ? t.tickMajor : t.tickMinor;
      (el as SVGLineElement).style.stroke = c;
    });

    svg.querySelectorAll('[data-pole-line]').forEach(el => {
      (el as SVGLineElement).style.stroke = t.poleStroke;
    });
    const poleDot = svg.querySelector('[data-pole-dot]') as SVGCircleElement | null;
    if (poleDot) poleDot.style.stroke = t.poleDot;

    const issTrack = svg.querySelector('.iss-track') as SVGPathElement | null;
    if (issTrack) issTrack.style.stroke = t.issTrack;
    svg.querySelectorAll('.iss-group line').forEach(el => {
      (el as SVGLineElement).style.stroke = t.issColor;
    });
    svg.querySelectorAll('.iss-group circle').forEach((el, i) => {
      const c = el as SVGCircleElement;
      if (i === 0) { c.style.fill = t.issColor; c.style.stroke = 'none'; }
      else { c.style.fill = 'none'; c.style.stroke = t.issColor; }
    });
    const issText = svg.querySelector('.iss-group text') as SVGTextElement | null;
    if (issText) issText.style.fill = t.issColor;

    svg.querySelectorAll('.beacon-pulse').forEach(el => {
      (el as SVGCircleElement).style.stroke = t.beaconPulse;
    });
    svg.querySelectorAll('[data-beacon-dot]').forEach(el => {
      (el as SVGCircleElement).style.fill = t.beaconDot;
    });
  }, [theme]);

  const [isLoading, setIsLoading] = useState(true);
  const [tooltip, setTooltip] = useState<BeaconTooltip | null>(null);
  const [issTooltip, setIssTooltip] = useState<ISSTooltip | null>(null);
  const [satTooltip, setSatTooltip] = useState<{ sat: PhSatellite; x: number; y: number } | null>(null);
  const [legendVisible, setLegendVisible] = useState(false);
  const [trackedSat, setTrackedSat] = useState<number | null>(null);
  const [trackedIss, setTrackedIss] = useState(false);
  const trackedSatTooltipRef = useRef<HTMLDivElement>(null);
  const trackedIssTooltipRef = useRef<HTMLDivElement>(null);

  // ── ARGOS/MEGIDDO mode switch ──
  useEffect(() => {
    const state = stateRef.current;
    const isArgos = focusSignal.productId === 'argos' && focusSignal.active;

    // Only trigger tween when the argos state actually changes
    if (state.argosActive === isArgos) return;
    state.argosActive = isArgos;

    if (isArgos) {
      // Tween rotation to WPS center (lon 116, lat 13)
      const fromRot = projectionRef.current ? [...projectionRef.current.rotate()] as [number, number, number] : [...state.tweenTo] as [number, number, number];
      state.tweenTo = [-116, -13, 0];
      state.tweenFromZoom = state.zoomScale;
      state.targetZoom = 3.8;
      state.tweenIsZoomOut = false;
      state.tweening = true;
      state.tweenStart = performance.now();
      state.tweenFrom = fromRot;
      // Tween translate: current → SVG center
      const curTrans = projectionRef.current ? projectionRef.current.translate() : [0, 0];
      const svgEl = svgRef.current;
      const W = svgEl?.clientWidth ?? 800;
      const H = svgEl?.clientHeight ?? 800;
      state.tweenFromTrans = [curTrans[0], curTrans[1]];
      state.tweenToTrans = [W / 2, H / 2];
    } else {
      setLegendVisible(false);
      setTrackedSat(null);
      state.trackedSatIdx = null;
      setTrackedIss(false);
      state.issTracked = false;
      // Tween back to default
      const fromRot = projectionRef.current ? [...projectionRef.current.rotate()] as [number, number, number] : [...state.tweenTo] as [number, number, number];
      state.tweenTo = [-20, -28, 0];
      state.tweenFromZoom = state.zoomScale;
      state.targetZoom = 1;
      state.tweenIsZoomOut = true;
      state.tweening = true;
      state.tweenStart = performance.now();
      state.tweenFrom = fromRot;
      // Tween translate back
      const curTrans = projectionRef.current ? projectionRef.current.translate() : [0, 0];
      const svgEl = svgRef.current;
      const W = svgEl?.clientWidth ?? 800;
      const H = svgEl?.clientHeight ?? 800;
      state.tweenFromTrans = [curTrans[0], curTrans[1]];
      state.tweenToTrans = [W * 0.68, H * 0.72];
    }

    // Show/hide argos layer with entrance/exit animation
    if (argosLayerRef.current) {
      if (isArgos) {
        argosLayerRef.current
          .attr('display', 'block')
          .attr('opacity', 0)
          .transition().duration(800).delay(400)
          .attr('opacity', 1);
      } else {
        argosLayerRef.current
          .transition().duration(500)
          .attr('opacity', 0)
          .on('end', function() {
            // @ts-ignore
            d3ModuleRef.current?.select(this).attr('display', 'none');
          });
      }
    }
    if (!isArgos) setBaseTooltip(null);
  }, [focusSignal]);

  useEffect(() => {
    let d3: any, topojson: any;
    let mounted = true;
    let animFrame: number;
    let isDragging = false;
    let lastX = 0, lastY = 0;
    let rotation = [-20, -28, 0];

    const loadAndInit = async () => {
      const theme = themeRef.current;
      await Promise.all([
        new Promise<void>(res => {
          if ((window as any).d3) { d3 = (window as any).d3; res(); return; }
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js';
          s.onload = () => { d3 = (window as any).d3; res(); };
          document.head.appendChild(s);
        }),
        new Promise<void>(res => {
          if ((window as any).topojson) { topojson = (window as any).topojson; res(); return; }
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js';
          s.onload = () => { topojson = (window as any).topojson; res(); };
          document.head.appendChild(s);
        }),
      ]);
      if (!mounted) return;
      d3ModuleRef.current = d3;

      // ── Mobile / low-power detection ──────────────────────────────────
      const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
        || (navigator.maxTouchPoints > 1 && window.innerWidth < 1024);
      const ORBIT_PTS    = isMobile ? 180 : 720;
      const STAR_COUNT   = isMobile ? 60  : 200;
      const GEO_CIRCLE_N = isMobile ? 36  : 72;
      // On mobile, only do a full SVG‐path redraw every Nth frame
      const FRAME_SKIP       = isMobile ? 2   : 1;
      const FRAME_SKIP_TWEEN = isMobile ? 3   : 1; // even more aggressive during tweens

      const world = await fetch('/world-110m.json').then(r => r.json());
      const countriesGeo = topojson.feature(world, world.objects.countries);
      const bordersGeo = topojson.mesh(world, world.objects.countries, (a: any, b: any) => a !== b);

      const ID_TO_NAME: Record<number, string> = {
        840: 'United States of America', 124: 'Canada', 484: 'Mexico',
        192: 'Cuba', 320: 'Guatemala', 340: 'Honduras', 222: 'El Salvador',
        558: 'Nicaragua', 188: 'Costa Rica', 591: 'Panama',
        214: 'Dominican Republic', 332: 'Haiti', 630: 'Puerto Rico',
        76: 'Brazil', 32: 'Argentina', 152: 'Chile', 170: 'Colombia',
        604: 'Peru', 862: 'Venezuela', 218: 'Ecuador', 68: 'Bolivia',
        600: 'Paraguay', 858: 'Uruguay', 328: 'Guyana', 740: 'Suriname',
        826: 'United Kingdom', 250: 'France', 276: 'Germany', 380: 'Italy',
        724: 'Spain', 528: 'Netherlands', 56: 'Belgium', 756: 'Switzerland',
        40: 'Austria', 752: 'Sweden', 578: 'Norway', 208: 'Denmark',
        246: 'Finland', 300: 'Greece', 620: 'Portugal', 616: 'Poland',
        203: 'Czech Republic', 348: 'Hungary', 642: 'Romania', 804: 'Ukraine',
        792: 'Turkey', 703: 'Slovakia', 705: 'Slovenia', 191: 'Croatia',
        688: 'Serbia', 100: 'Bulgaria', 498: 'Moldova', 112: 'Belarus',
        807: 'North Macedonia', 8: 'Albania', 70: 'Bosnia and Herzegovina',
        499: 'Montenegro', 352: 'Iceland', 372: 'Ireland', 470: 'Malta',
        442: 'Luxembourg', 233: 'Estonia', 428: 'Latvia', 440: 'Lithuania',
        643: 'Russia', 398: 'Kazakhstan', 268: 'Georgia', 51: 'Armenia',
        31: 'Azerbaijan', 860: 'Uzbekistan', 417: 'Kyrgyzstan',
        762: 'Tajikistan', 795: 'Turkmenistan', 496: 'Mongolia',
        156: 'China', 364: 'Iran', 682: 'Saudi Arabia', 784: 'United Arab Emirates',
        634: 'Qatar', 414: 'Kuwait', 512: 'Oman', 400: 'Jordan',
        376: 'Israel', 275: 'Palestine', 368: 'Iraq', 760: 'Syria',
        422: 'Lebanon', 887: 'Yemen', 48: 'Bahrain',
        356: 'India', 586: 'Pakistan', 50: 'Bangladesh', 144: 'Sri Lanka',
        524: 'Nepal', 64: 'Bhutan', 462: 'Maldives', 4: 'Afghanistan',
        392: 'Japan', 410: 'South Korea', 408: 'North Korea', 158: 'Taiwan',
        608: 'Philippines', 360: 'Indonesia', 458: 'Malaysia',
        702: 'Singapore', 764: 'Thailand', 704: 'Vietnam', 104: 'Myanmar',
        116: 'Cambodia', 418: 'Laos', 96: 'Brunei', 626: 'Timor-Leste',
        36: 'Australia', 554: 'New Zealand', 598: 'Papua New Guinea',
        242: 'Fiji', 90: 'Solomon Islands',
        710: 'South Africa', 818: 'Egypt', 566: 'Nigeria', 231: 'Ethiopia',
        404: 'Kenya', 288: 'Ghana', 834: 'Tanzania', 504: 'Morocco',
        12: 'Algeria', 24: 'Angola', 180: 'DR Congo', 729: 'Sudan',
        434: 'Libya', 686: 'Senegal', 800: 'Uganda', 716: 'Zimbabwe',
        788: 'Tunisia', 706: 'Somalia', 148: 'Chad', 466: 'Mali',
        508: 'Mozambique', 894: 'Zambia', 454: 'Malawi', 854: 'Burkina Faso',
        120: 'Cameroon', 204: 'Benin', 384: 'Ivory Coast', 266: 'Gabon',
        624: 'Guinea-Bissau', 324: 'Guinea', 430: 'Liberia', 478: 'Mauritania',
        562: 'Niger', 694: 'Sierra Leone', 768: 'Togo', 646: 'Rwanda',
        108: 'Burundi', 140: 'Central African Republic', 728: 'South Sudan',
        232: 'Eritrea', 72: 'Botswana', 516: 'Namibia',
        748: 'Eswatini', 426: 'Lesotho', 174: 'Comoros', 450: 'Madagascar',
      };

      ID_TO_NAME_ref.current = ID_TO_NAME;

      if (!mounted || !svgRef.current || !containerRef.current) return;
      const container = containerRef.current;
      const W = container.clientWidth;
      const H = container.clientHeight;

      const R = W * 0.52;
      const cx = W * 0.68;
      const cy = H * 0.72;

      const ISS_ALT_FACTOR = 1.048;

      const svg = d3.select(svgRef.current).attr('width', W).attr('height', H);
      svg.selectAll('*').remove();
      const defs = svg.append('defs');

      const oceanGrad = defs.append('radialGradient').attr('id', 'def-ocean').attr('cx', '40%').attr('cy', '36%').attr('r', '62%');
      oceanGrad.append('stop').attr('offset', '0%').attr('stop-color', theme.ocean0);
      oceanGrad.append('stop').attr('offset', '50%').attr('stop-color', theme.ocean50);
      oceanGrad.append('stop').attr('offset', '100%').attr('stop-color', theme.ocean100);

      const specGrad = defs.append('radialGradient').attr('id', 'def-spec').attr('cx', '28%').attr('cy', '26%').attr('r', '48%');
      specGrad.append('stop').attr('offset', '0%').attr('stop-color', theme.spec0).attr('stop-opacity', 0.6);
      specGrad.append('stop').attr('offset', '100%').attr('stop-color', theme.spec100).attr('stop-opacity', 0);

      const atmGrad = defs.append('radialGradient').attr('id', 'def-atm').attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
      atmGrad.append('stop').attr('offset', '86%').attr('stop-color', 'transparent').attr('stop-opacity', 0);
      atmGrad.append('stop').attr('offset', '96%').attr('stop-color', theme.atm96).attr('stop-opacity', 0.14);
      atmGrad.append('stop').attr('offset', '100%').attr('stop-color', theme.atm100).attr('stop-opacity', 0.28);

      const rimGrad = defs.append('radialGradient').attr('id', 'def-rim').attr('cx', '50%').attr('cy', '88%').attr('r', '50%');
      rimGrad.append('stop').attr('offset', '0%').attr('stop-color', '#E31B54').attr('stop-opacity', 0.12);
      rimGrad.append('stop').attr('offset', '100%').attr('stop-color', '#E31B54').attr('stop-opacity', 0);

      const selGlow = defs.append('filter').attr('id', 'def-sel-glow').attr('x', '-30%').attr('y', '-30%').attr('width', '160%').attr('height', '160%');
      selGlow.append('feGaussianBlur').attr('stdDeviation', '1.6').attr('result', 'b');
      const fm = selGlow.append('feMerge');
      fm.append('feMergeNode').attr('in', 'b');
      fm.append('feMergeNode').attr('in', 'SourceGraphic');

      const hoverGlow = defs.append('filter').attr('id', 'def-hover-glow').attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
      hoverGlow.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'b');
      const hfm = hoverGlow.append('feMerge');
      hfm.append('feMergeNode').attr('in', 'b');
      hfm.append('feMergeNode').attr('in', 'SourceGraphic');

      const scanFilter = defs.append('filter').attr('id', 'def-scan-blur').attr('x', '-8%').attr('y', '-8%').attr('width', '116%').attr('height', '116%');
      scanFilter.append('feGaussianBlur').attr('stdDeviation', '1.8');

      const beaconGlow = defs.append('filter').attr('id', 'def-beacon-glow').attr('x', '-100%').attr('y', '-100%').attr('width', '300%').attr('height', '300%');
      beaconGlow.append('feGaussianBlur').attr('stdDeviation', '1.5').attr('result', 'blur');
      const bfm = beaconGlow.append('feMerge');
      bfm.append('feMergeNode').attr('in', 'blur');
      bfm.append('feMergeNode').attr('in', 'SourceGraphic');

      const issGlow = defs.append('filter').attr('id', 'def-iss-glow').attr('x', '-150%').attr('y', '-150%').attr('width', '400%').attr('height', '400%');
      issGlow.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
      const ifm = issGlow.append('feMerge');
      ifm.append('feMergeNode').attr('in', 'blur');
      ifm.append('feMergeNode').attr('in', 'SourceGraphic');

      const issTrailGlow = defs.append('filter').attr('id', 'def-iss-trail-glow').attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
      issTrailGlow.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'blur');
      const itfm = issTrailGlow.append('feMerge');
      itfm.append('feMergeNode').attr('in', 'blur');
      itfm.append('feMergeNode').attr('in', 'SourceGraphic');

      const projection = d3.geoOrthographic().scale(R).translate([cx, cy]).clipAngle(90).rotate(rotation);
      projectionRef.current = projection;
      const path = d3.geoPath().projection(projection);

      const issProjection = d3.geoOrthographic()
        .scale(R * ISS_ALT_FACTOR)
        .translate([cx, cy])
        .clipAngle(90)
        .rotate(rotation);
      const issPath = d3.geoPath().projection(issProjection);

      const g = svg.append('g');

      Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * W, y: Math.random() * H * 0.62,
        r: Math.random() * 0.7 + 0.1, o: Math.random() * 0.28 + 0.06,
      })).forEach(s => {
        g.append('circle').attr('class', 'star-pt').attr('data-base-o', s.o).attr('cx', s.x).attr('cy', s.y).attr('r', s.r).attr('fill', theme.starFill).attr('opacity', s.o * theme.starMaxOpacity / 0.28);
      });

      const globeBodyG = g.append('g').attr('class', 'globe-body');

      globeBodyG.append('circle').attr('cx', cx).attr('cy', cy).attr('r', R * 1.045).attr('fill', 'none')
        .attr('stroke', 'rgba(160,185,210,0.07)').attr('stroke-width', R * 0.038).attr('pointer-events', 'none');
      globeBodyG.append('circle').attr('cx', cx).attr('cy', cy).attr('r', R * 1.19).attr('fill', 'url(#def-atm)').attr('pointer-events', 'none');
      globeBodyG.append('circle').attr('cx', cx).attr('cy', cy).attr('r', R * 1.12).attr('fill', 'url(#def-rim)').attr('pointer-events', 'none');
      globeBodyG.append('circle').attr('cx', cx).attr('cy', cy).attr('r', R).attr('fill', 'url(#def-ocean)').attr('stroke', 'rgba(120,145,175,0.07)').attr('stroke-width', 0.6);
      globeBodyG.append('circle').attr('cx', cx).attr('cy', cy).attr('r', R).attr('fill', 'url(#def-spec)').attr('pointer-events', 'none');

      const hS = 20; const hH = hS * Math.sqrt(3);
      const hexPat = defs.append('pattern').attr('id', 'def-hex').attr('width', hS * 3).attr('height', hH)
        .attr('patternUnits', 'userSpaceOnUse').attr('patternTransform', `translate(${cx - R},${cy - R})`);
      const hexPath = (ox: number, oy: number) => {
        const pts = Array.from({ length: 6 }, (_, i) => {
          const a = (Math.PI / 180) * (60 * i - 30);
          return `${ox + hS * Math.cos(a)},${oy + hS * Math.sin(a)}`;
        });
        return 'M' + pts.join('L') + 'Z';
      };
      [[hS, hH / 2], [hS * 2.5, hH]].forEach(([ox, oy]) => {
        hexPat.append('path').attr('d', hexPath(ox, oy)).attr('fill', 'none').attr('stroke', theme.hexStroke).attr('stroke-width', 0.5);
      });
      const clipCircle = defs.append('clipPath').attr('id', 'def-sphere-clip').append('circle').attr('cx', cx).attr('cy', cy).attr('r', R - 1);
      const hexBgRect = globeBodyG.append('rect').attr('x', cx - R).attr('y', cy - R).attr('width', R * 2).attr('height', R * 2)
        .attr('fill', 'url(#def-hex)').attr('clip-path', 'url(#def-sphere-clip)').attr('pointer-events', 'none');

      g.append('path').datum(d3.geoGraticule().step([10, 10])()).attr('d', path).attr('fill', 'none')
        .attr('stroke', theme.gratF).attr('stroke-width', 0.3).attr('class', 'grat-f')
        .attr('display', isMobile ? 'none' : 'block');
      g.append('path').datum(d3.geoGraticule().step([30, 30])()).attr('d', path).attr('fill', 'none')
        .attr('stroke', theme.gratM).attr('stroke-width', 0.55).attr('class', 'grat-m');

      g.append('path')
        .datum({ type: 'LineString', coordinates: Array.from({ length: 361 }, (_, i) => [i - 180, 0]) })
        .attr('d', path).attr('fill', 'none').attr('stroke', theme.equatorStroke).attr('stroke-width', 0.6)
        .attr('stroke-dasharray', '4,7').attr('class', 'equator');

      [-23.5, 23.5].forEach((lat, i) => {
        g.append('path')
          .datum({ type: 'LineString', coordinates: Array.from({ length: 361 }, (_, j) => [j - 180, lat]) })
          .attr('d', path).attr('fill', 'none').attr('stroke', theme.tropicStroke)
          .attr('stroke-width', 0.35).attr('stroke-dasharray', '2,9').attr('class', `tropic-${i}`);
      });

      const scanRing = globeBodyG.append('circle').attr('cx', cx).attr('cy', cy).attr('r', R * 0.25).attr('fill', 'none')
        .attr('stroke', theme.scanStroke).attr('stroke-width', 0.7)
        .attr('filter', 'url(#def-scan-blur)').attr('pointer-events', 'none').attr('class', 'scan-ring');

      const getFill = (name: string, hovered: boolean, selected: boolean, t: GlobeTheme = themeRef.current) => {
        if (selected) return t.landSelectedFill;
        if (hovered) return t.landHoverFill;
        return COUNTRY_DATA[name] ? t.landKnown : t.landUnknown;
      };
      const getStroke = (name: string, hovered: boolean, selected: boolean, t: GlobeTheme = themeRef.current) => {
        if (selected) return 'rgba(227,27,84,0.85)';
        if (hovered) return t.landHoverStroke;
        return COUNTRY_DATA[name] ? t.landKnownStroke : t.landUnknownStroke;
      };

      const setCountryHover = (name: string, hovered: boolean) => {
        if (!name) return;
        const t = themeRef.current;
        const isSel = stateRef.current.selected === name;
        if (isSel) return;
        countriesLayer.selectAll('.country')
          .filter((dd: any) => (ID_TO_NAME[+dd.id] || '') === name)
          .attr('fill', getFill(name, hovered, false, t))
          .attr('stroke', getStroke(name, hovered, false, t))
          .attr('stroke-width', hovered ? 2.2 : 0.5)
          .attr('filter', hovered ? 'url(#def-hover-glow)' : null);
        stateRef.current.hoveredCountry = hovered ? name : null;
      };

      const countriesLayer = g.append('g').attr('class', 'countries-layer');
      countriesLayerRef.current = countriesLayer;

      countriesLayer.selectAll('.country').data(countriesGeo.features).join('path').attr('class', 'country')
        .attr('d', path as any)
        .attr('data-has-data', (d: any) => COUNTRY_DATA[ID_TO_NAME[+d.id] || ''] ? 'true' : 'false')
        .attr('fill', (d: any) => getFill(ID_TO_NAME[+d.id] || '', false, false))
        .attr('stroke', (d: any) => getStroke(ID_TO_NAME[+d.id] || '', false, false))
        .attr('stroke-width', 0.5).attr('cursor', 'pointer')
        .each(function(d: any) { (this as any).__countryName = ID_TO_NAME[+d.id] || ''; })
        .on('mouseenter', function(e: any, d: any) {
          const name = ID_TO_NAME[+d.id] || '';
          if (stateRef.current.selected === name) return;
          setCountryHover(name, true);
        })
        .on('mouseleave', function(e: any, d: any) {
          const name = ID_TO_NAME[+d.id] || '';
          if (stateRef.current.selected === name) return;
          setCountryHover(name, false);
        })
        .on('click', function(e: any, d: any) {
          const name = ID_TO_NAME[+d.id] || '';
          const prev = stateRef.current.selected;

          if (prev) {
            const t = themeRef.current;
            countriesLayer.selectAll('.country')
              .filter((dd: any) => (ID_TO_NAME[+dd.id] || '') === prev)
              .attr('fill', getFill(prev, false, false, t))
              .attr('stroke', getStroke(prev, false, false, t))
              .attr('stroke-width', 0.5)
              .attr('filter', null);
          }

          if (!name || prev === name) {
            stateRef.current.selected = null;
            onCountrySelect(null);
          } else {
            stateRef.current.selected = name;
            clearAllTooltips();
            const info = COUNTRY_DATA[name] ?? {
              name, iso: '???', region: 'UNKNOWN', threat: 'LOW' as const, partners: 0, contracts: 0,
            };
            onCountrySelect(info);
            d3.select(this)
              .attr('fill', getFill(name, false, true))
              .attr('stroke', 'rgba(227,27,84,0.85)')
              .attr('stroke-width', 2.0)
              .attr('filter', 'url(#def-sel-glow)');
          }
        });

      g.append('path').datum(bordersGeo).attr('d', path).attr('fill', 'none')
        .attr('stroke', theme.borderStroke).attr('stroke-width', 0.45)
        .attr('pointer-events', 'none').attr('class', 'borders');

      globeBodyG.append('circle').attr('cx', cx).attr('cy', cy).attr('r', R + 8).attr('fill', 'none').attr('stroke', theme.ring1).attr('data-ring', '1').attr('stroke-width', 0.5).attr('stroke-dasharray', '3,8').attr('pointer-events', 'none');
      globeBodyG.append('circle').attr('cx', cx).attr('cy', cy).attr('r', R + 20).attr('fill', 'none').attr('stroke', theme.ring2).attr('data-ring', '2').attr('stroke-width', 0.4).attr('stroke-dasharray', '6,10').attr('pointer-events', 'none');
      globeBodyG.append('circle').attr('cx', cx).attr('cy', cy).attr('r', R + 34).attr('fill', 'none').attr('stroke', theme.ring3).attr('data-ring', '3').attr('stroke-width', 0.5).attr('stroke-dasharray', '2,6').attr('pointer-events', 'none');

      const tR = R + 42;
      for (let a = 0; a < 360; a += 10) {
        const rad = (a * Math.PI) / 180;
        const isCardinal = a % 90 === 0; const isMajor = a % 30 === 0;
        const len = isCardinal ? 10 : isMajor ? 5 : 2.5;
        const tickKind = isCardinal ? 'cardinal' : isMajor ? 'major' : 'minor';
        const strokeC = isCardinal ? theme.tickCardinal : isMajor ? theme.tickMajor : theme.tickMinor;
        globeBodyG.append('line')
          .attr('x1', cx + (tR - len) * Math.cos(rad)).attr('y1', cy + (tR - len) * Math.sin(rad))
          .attr('x2', cx + tR * Math.cos(rad)).attr('y2', cy + tR * Math.sin(rad))
          .attr('stroke', strokeC).attr('data-tick', tickKind).attr('stroke-width', isCardinal ? 1.1 : 0.5);
      }

      const rhLen = 18;
      globeBodyG.append('line').attr('x1', cx - rhLen).attr('y1', cy - R).attr('x2', cx + rhLen).attr('y2', cy - R).attr('stroke', theme.poleStroke).attr('data-pole-line', '1').attr('stroke-width', 0.6);
      globeBodyG.append('line').attr('x1', cx).attr('y1', cy - R - rhLen).attr('x2', cx).attr('y2', cy - R + rhLen).attr('stroke', theme.poleStroke).attr('data-pole-line', '2').attr('stroke-width', 0.6);
      globeBodyG.append('circle').attr('cx', cx).attr('cy', cy - R).attr('r', 2.5).attr('fill', 'none').attr('stroke', theme.poleDot).attr('data-pole-dot', '1').attr('stroke-width', 0.6);

      // ── Helper: dismiss all tooltips at once ──
      const clearAllTooltips = () => {
        setTooltip(null);
        setIssTooltip(null);
        setSatTooltip(null);
        setBaseTooltip(null);
      };

      const beaconsLayer = g.append('g').attr('class', 'beacons-layer');
      const beaconSelections: ReturnType<typeof beaconsLayer.append>[] = [];

      // Pre-cache each beacon's inner fill circle to avoid selectAll+filter per frame
      const beaconFillCircles: any[] = [];
      CAPITALS.forEach((cap, idx) => {
        const bg = beaconsLayer.append('g')
          .attr('cursor', 'pointer')
          .attr('pointer-events', 'all');
        beaconSelections[idx] = bg;

        bg.append('circle').attr('r', 10).attr('fill', 'transparent');
        bg.append('circle').attr('class', 'beacon-pulse').attr('r', 5).attr('fill', 'none')
          .attr('stroke', theme.beaconPulse).attr('stroke-width', 0.7);
        const fillC = bg.append('circle').attr('r', 1.5).attr('fill', theme.beaconDot).attr('data-beacon-dot', '1').attr('filter', 'url(#def-beacon-glow)');
        beaconFillCircles[idx] = fillC;

        bg.on('mouseenter', function(event: any) {
          const [mx, my] = d3.pointer(event, svgRef.current);
          if (mounted) { clearAllTooltips(); setTooltip({ capital: cap, x: mx, y: my }); }
          if (cap.countryMapName) setCountryHover(cap.countryMapName, true);
        }).on('mousemove', function(event: any) {
          const [mx, my] = d3.pointer(event, svgRef.current);
          if (mounted) setTooltip({ capital: cap, x: mx, y: my });
        }).on('mouseleave', function() {
          if (mounted) setTooltip(null);
          if (cap.countryMapName) setCountryHover(cap.countryMapName, false);
        });
      });

      const ISS_PERIOD_MS = 180000;
      const ISS_INC_DEG = 51.6;

      const buildISSOrbitGeoLine = (issT: number) => {
        const N = ORBIT_PTS;
        const coords: [number, number][] = [];
        for (let i = 0; i <= N; i++) {
          const frac = i / N;
          const lon = (((issT + frac) % 1) * 360) - 180;
          const lat = ISS_INC_DEG * Math.sin(frac * 2 * Math.PI);
          coords.push([lon, lat]);
        }
        return { type: 'LineString' as const, coordinates: coords };
      };

      const issOrbitShadow = g.append('path')
        .attr('class', 'iss-orbit-shadow')
        .attr('fill', 'none')
        .attr('stroke', theme.issColor)
        .attr('stroke-width', 4)
        .attr('stroke-opacity', 0.08)
        .attr('stroke-dasharray', '4,10')
        .attr('pointer-events', 'none')
        .style('transition', 'stroke-width 0.3s ease, stroke-opacity 0.3s ease, filter 0.3s ease');

      const issOrbitPath = g.append('path')
        .attr('class', 'iss-orbit-path')
        .attr('fill', 'none')
        .attr('stroke', theme.issColor)
        .attr('stroke-width', 0.9)
        .attr('stroke-opacity', 0.55)
        .attr('stroke-dasharray', '4,10')
        .attr('pointer-events', 'none')
        .style('transition', 'stroke-width 0.3s ease, stroke-opacity 0.3s ease');

      // ISS orbit invisible hit area for hover/click
      const issOrbitHitPath = g.append('path')
        .attr('class', 'iss-orbit-hit')
        .attr('fill', 'none')
        .attr('stroke', 'transparent')
        .attr('stroke-width', 14)
        .attr('pointer-events', 'stroke')
        .attr('cursor', 'pointer');
      issOrbitHitPath.on('mouseenter', function() {
        issOrbitPath.attr('stroke-width', 2.2).attr('stroke-opacity', 0.9);
        issOrbitShadow.attr('stroke-width', 6).attr('stroke-opacity', 0.14).attr('filter', 'url(#def-iss-trail-glow)');
      }).on('mouseleave', function() {
        issOrbitPath.attr('stroke-width', 0.9).attr('stroke-opacity', 0.55);
        issOrbitShadow.attr('stroke-width', 4).attr('stroke-opacity', 0.08).attr('filter', null);
      }).on('click', function(event: any) {
        event.stopPropagation();
        const st = stateRef.current;
        if (st.issTracked) {
          st.issTracked = false;
          if (mounted) setTrackedIss(false);
        } else {
          st.issTracked = true;
          st.trackedSatIdx = null;
          if (mounted) { clearAllTooltips(); setTrackedIss(true); setTrackedSat(null); }
        }
      });

      const issGroup = g.append('g').attr('class', 'iss-group').attr('pointer-events', 'visiblePainted').attr('cursor', 'pointer');
      issGroup.append('line').attr('stroke', theme.issColor).attr('stroke-width', 1.4)
        .attr('x1', -10).attr('x2', 10).attr('y1', 0).attr('y2', 0);
      issGroup.append('line').attr('stroke', theme.issColor).attr('stroke-width', 0.9)
        .attr('x1', 0).attr('x2', 0).attr('y1', -5).attr('y2', 5);
      issGroup.append('circle').attr('r', 2.5).attr('fill', theme.issColor).attr('filter', 'url(#def-iss-glow)');
      issGroup.append('circle').attr('r', 5.5).attr('fill', 'none')
        .attr('stroke', theme.issColor).attr('stroke-width', 0.6).attr('stroke-opacity', 0.6);
      issGroup.append('text').attr('x', 9).attr('y', -7)
        .attr('font-family', 'ui-monospace,Menlo,monospace').attr('font-size', '7px')
        .attr('fill', theme.issColor).attr('letter-spacing', '0.08em').text('ISS');

      issGroup.on('mouseenter', function(event: any) {
        const [mx, my] = d3.pointer(event, svgRef.current);
        if (mounted) { clearAllTooltips(); setIssTooltip({ x: mx, y: my }); }
      }).on('mousemove', function(event: any) {
        const [mx, my] = d3.pointer(event, svgRef.current);
        if (mounted) setIssTooltip({ x: mx, y: my });
      }).on('mouseleave', function() {
        if (mounted && !stateRef.current.issTracked) setIssTooltip(null);
      }).on('click', function(event: any) {
        event.stopPropagation();
        const st = stateRef.current;
        if (st.issTracked) {
          st.issTracked = false;
          if (mounted) setTrackedIss(false);
        } else {
          st.issTracked = true;
          st.trackedSatIdx = null;
          if (mounted) { clearAllTooltips(); setTrackedIss(true); setTrackedSat(null); }
        }
      });

      // ── Philippine Satellite orbits (Diwata-2 & Maya-6/Agila) ──────────
      const PH_SAT_ALT_FACTOR = 1.06;
      const phSatProjection = d3.geoOrthographic()
        .scale(R * PH_SAT_ALT_FACTOR).translate([cx, cy]).clipAngle(90).rotate(rotation);
      const phSatPath = d3.geoPath().projection(phSatProjection);

      const buildSatOrbitGeoLine = (satT: number, incDeg: number) => {
        const N = ORBIT_PTS;
        const coords: [number, number][] = [];
        for (let i = 0; i <= N; i++) {
          const frac = i / N;
          const lon = (((satT + frac) % 1) * 360) - 180;
          const lat = incDeg * Math.sin(frac * 2 * Math.PI);
          coords.push([lon, lat]);
        }
        return { type: 'LineString' as const, coordinates: coords };
      };

      const phSatOrbitPaths: any[] = [];
      const phSatOrbitHitPaths: any[] = [];
      const phSatGroups: any[] = [];
      const phSatT: number[] = PH_SATELLITES.map((_, i) => i * 0.35);

      PH_SATELLITES.forEach((sat, i) => {
        const orbitP = g.append('path')
          .attr('class', `ph-sat-orbit-${sat.id}`)
          .attr('fill', 'none')
          .attr('stroke', sat.color)
          .attr('stroke-width', 0.7)
          .attr('stroke-opacity', 0.35)
          .attr('stroke-dasharray', '3,8')
          .attr('pointer-events', 'none')
          .style('transition', 'stroke-width 0.3s ease, stroke-opacity 0.3s ease');
        phSatOrbitPaths.push(orbitP);

        // Wider invisible hit area for clicking/hovering satellite orbit paths
        const hitP = g.append('path')
          .attr('class', `ph-sat-orbit-hit-${sat.id}`)
          .attr('fill', 'none')
          .attr('stroke', 'transparent')
          .attr('stroke-width', 14)
          .attr('pointer-events', 'stroke')
          .attr('cursor', 'pointer');
        hitP.on('mouseenter', function() {
          orbitP.attr('stroke-width', 2).attr('stroke-opacity', 0.8);
        }).on('mouseleave', function() {
          orbitP.attr('stroke-width', 0.7).attr('stroke-opacity', 0.35);
        }).on('click', function(event: any) {
          event.stopPropagation();
          const st = stateRef.current;
          if (st.trackedSatIdx === i) {
            st.trackedSatIdx = null;
            if (mounted) setTrackedSat(null);
          } else {
            st.trackedSatIdx = i;
            st.issTracked = false;
            if (mounted) { clearAllTooltips(); setTrackedSat(i); setTrackedIss(false); }
          }
        });
        phSatOrbitHitPaths.push(hitP);

        const sg = g.append('g').attr('class', `ph-sat-group-${sat.id}`)
          .attr('pointer-events', 'visiblePainted').attr('cursor', 'pointer');
        sg.append('circle').attr('r', 3).attr('fill', sat.color).attr('filter', 'url(#def-beacon-glow)');
        sg.append('circle').attr('r', 6.5).attr('fill', 'none')
          .attr('stroke', sat.color).attr('stroke-width', 0.6).attr('stroke-opacity', 0.5);
        sg.append('text').attr('x', 9).attr('y', -7)
          .attr('font-family', 'ui-monospace,Menlo,monospace').attr('font-size', '8px')
          .attr('fill', sat.color).attr('letter-spacing', '0.1em').attr('font-weight', '600').text(sat.name);
        phSatGroups.push(sg);

        sg.on('mouseenter', function(event: any) {
          const [mx, my] = d3.pointer(event, svgRef.current);
          if (mounted) { clearAllTooltips(); setSatTooltip({ sat, x: mx, y: my }); }
        }).on('mousemove', function(event: any) {
          const [mx, my] = d3.pointer(event, svgRef.current);
          if (mounted) setSatTooltip({ sat, x: mx, y: my });
        }).on('mouseleave', function() {
          if (mounted && stateRef.current.trackedSatIdx !== i) setSatTooltip(null);
        }).on('click', function(event: any) {
          event.stopPropagation();
          const st = stateRef.current;
          if (st.trackedSatIdx === i) {
            st.trackedSatIdx = null;
            if (mounted) { setTrackedSat(null); setSatTooltip(null); }
          } else {
            st.trackedSatIdx = i;
            st.issTracked = false;
            if (mounted) { clearAllTooltips(); setTrackedSat(i); setTrackedIss(false); }
          }
        });
      });

      // Cache beacon pulse selection to avoid selectAll on every frame
      const _beaconPulses = beaconsLayer.selectAll('.beacon-pulse');
      // Count frames since last pulse update; on mobile only update pulse every 3rd frame
      let pulseFrameCount = 0;
      const PULSE_SKIP = isMobile ? 3 : 1;

      let cachedLonR = 0, cachedLatR = 0;
      let cachedCosLat = 1, cachedSinLat = 0;

      const refreshRotationCache = () => {
        const rot = projection.rotate();
        cachedLonR = -rot[0] * (Math.PI / 180);
        cachedLatR = -rot[1] * (Math.PI / 180);
        cachedCosLat = Math.cos(cachedLatR);
        cachedSinLat = Math.sin(cachedLatR);
        issProjection.rotate(rot);
      };

      const isVisible = (lonDeg: number, latDeg: number) => {
        const lonP = lonDeg * (Math.PI / 180);
        const latP = latDeg * (Math.PI / 180);
        return Math.cos(latP) * cachedCosLat * Math.cos(lonP - cachedLonR) + Math.sin(latP) * cachedSinLat;
      };

      // Cache D3 selections to avoid repeated DOM queries on every frame
      const _gratF   = g.select('.grat-f');
      const _gratM   = g.select('.grat-m');
      const _equator = g.select('.equator');
      const _tropic0 = g.select('.tropic-0');
      const _tropic1 = g.select('.tropic-1');
      const _countries = g.selectAll('.country');
      const _borders = g.select('.borders');

      // Dirty flag: track whether projection changed so we can skip expensive
      // path recalculation when the globe is static (e.g. Argos zoomed-in idle).
      let projectionDirty = true;
      let lastRotX = rotation[0], lastRotY = rotation[1];
      let lastScale = R;
      let lastTx = cx, lastTy = cy;
      const markProjectionDirty = () => {
        const r = projection.rotate();
        const s = projection.scale();
        const [tx, ty] = projection.translate();
        if (r[0] !== lastRotX || r[1] !== lastRotY || s !== lastScale || tx !== lastTx || ty !== lastTy) {
          lastRotX = r[0]; lastRotY = r[1]; lastScale = s; lastTx = tx; lastTy = ty;
          projectionDirty = true;
        }
      };

      const redraw = () => {
        refreshRotationCache();
        phSatProjection.rotate(projection.rotate());

        // Shift + scale the globe body group (atmosphere, rings, ticks etc.) to match live projection
        const [ptx, pty] = projection.translate();
        const z = stateRef.current.zoomScale;
        // translate to projection center, then scale from the original cx,cy anchor
        globeBodyG.attr('transform', `translate(${ptx - cx},${pty - cy}) translate(${cx},${cy}) scale(${z}) translate(${-cx},${-cy})`);
        clipCircle.attr('cx', ptx).attr('cy', pty).attr('r', (R - 1) * z);

        // Skip expensive SVG path recalculation when projection hasn't changed
        if (!projectionDirty) return;
        projectionDirty = false;

        if (!isMobile) _gratF.attr('d', path as any);
        _gratM.attr('d', path as any);
        _equator.attr('d', path as any);
        _tropic0.attr('d', path as any);
        _tropic1.attr('d', path as any);
        _countries.attr('d', path as any);
        _borders.attr('d', path as any);

        for (let i = 0; i < CAPITALS.length; i++) {
          const cap = CAPITALS[i];
          const dot = isVisible(cap.lon, cap.lat);
          if (dot > 0.08) {
            const proj = projection([cap.lon, cap.lat]);
            if (proj) {
              const t = themeRef.current;
              beaconSelections[i].attr('display', 'block').attr('transform', `translate(${proj[0]},${proj[1]})`);
              beaconFillCircles[i].attr('fill', t.beaconDot);
              continue;
            }
          }
          beaconSelections[i].attr('display', 'none');
        }

        // On mobile in Argos mode, skip ISS/satellite orbit updates (offscreen/irrelevant)
        if (isMobile && stateRef.current.argosActive) return;

        const issT = stateRef.current.issT;
        const orbitGeo = buildISSOrbitGeoLine(issT);

        const orbitD = issPath(orbitGeo as any);
        if (orbitD) {
          issOrbitPath.attr('d', orbitD).attr('stroke', themeRef.current.issColor);
          issOrbitShadow.attr('d', orbitD).attr('stroke', themeRef.current.issColor);
        }

        const issLon = (issT % 1) * 360 - 180;
        const issLat = 0;
        const issDot = isVisible(issLon, issLat);
        const issProj = issDot > 0.02 ? issProjection([issLon, issLat]) : null;
        if (issProj) {
          issGroup.attr('display', 'block').attr('transform', `translate(${issProj[0]},${issProj[1]})`);
          issScreenPosRef.current = [issProj[0], issProj[1]];
        } else {
          issGroup.attr('display', 'none');
          issScreenPosRef.current = null;
        }
        // Update ISS orbit hit area
        if (orbitD) issOrbitHitPath.attr('d', orbitD);

        // ── Philippine satellites ──
        phSatProjection.translate(projection.translate());
        phSatProjection.scale(R * PH_SAT_ALT_FACTOR * stateRef.current.zoomScale);
        PH_SATELLITES.forEach((sat, i) => {
          const orbitGeo = buildSatOrbitGeoLine(phSatT[i], sat.inclinationDeg);
          const d = phSatPath(orbitGeo as any);
          if (d) {
            phSatOrbitPaths[i].attr('d', d).attr('stroke', sat.color);
            phSatOrbitHitPaths[i].attr('d', d);
          }

          const satLon = (phSatT[i] % 1) * 360 - 180;
          const satLat = 0;
          const satDot = isVisible(satLon, satLat);
          const satProj = satDot > 0.02 ? phSatProjection([satLon, satLat]) : null;
          if (satProj) {
            phSatGroups[i].attr('display', 'block').attr('transform', `translate(${satProj[0]},${satProj[1]})`);
            satScreenPosRef.current[i] = [satProj[0], satProj[1]];
          } else {
            phSatGroups[i].attr('display', 'none');
            satScreenPosRef.current[i] = null;
          }
        });
      };

      let didDrag = false;
      svg.call(d3.drag()
        .on('start', (e: any) => {
          if (stateRef.current.argosActive) return;  // lock globe in Argos mode
          isDragging = true; didDrag = false; lastX = e.x; lastY = e.y; clearAllTooltips();
        })
        .on('drag', (e: any) => {
          if (stateRef.current.argosActive) return;  // lock globe in Argos mode
          didDrag = true;
          if (stateRef.current.trackedSatIdx !== null) {
            stateRef.current.trackedSatIdx = null;
            setTrackedSat(null);
          }
          if (stateRef.current.issTracked) {
            stateRef.current.issTracked = false;
            setTrackedIss(false);
          }
          rotation[0] += (e.x - lastX) * 0.32;
          rotation[1] = Math.max(-75, Math.min(75, rotation[1] - (e.y - lastY) * 0.32));
          lastX = e.x; lastY = e.y; projection.rotate(rotation); redraw();
        })
        .on('end', () => { isDragging = false; }) as any);

      // Click on empty globe area → cancel any active tracking
      svg.on('click', function(event: any) {
        if (didDrag) { didDrag = false; return; }
        const st = stateRef.current;
        if (st.trackedSatIdx !== null) {
          st.trackedSatIdx = null;
          if (mounted) { setTrackedSat(null); setSatTooltip(null); }
        }
        if (st.issTracked) {
          st.issTracked = false;
          if (mounted) { setTrackedIss(false); setIssTooltip(null); }
        }
      });

      stateRef.current = { issT: 0, selected: null, hoveredCountry: null, argosActive: false, zoomScale: 1, targetZoom: 1, tweenFromZoom: 1, tweenIsZoomOut: false, tweening: false, tweenStart: 0, tweenFrom: [-20,-28,0] as [number,number,number], tweenTo: [-20,-28,0] as [number,number,number], tweenFromTrans: [cx, cy] as [number,number], tweenToTrans: [cx, cy] as [number,number], trackedSatIdx: null, issTracked: false };
      let lastTime = performance.now();
      let scanT = 0;

      // ── ARGOS overlay layer ──
      const geoCircle = (lon: number, lat: number, radiusKm: number, steps = GEO_CIRCLE_N) => {
        const R_EARTH = 6371;
        const angRad = radiusKm / R_EARTH;
        const coords: [number, number][] = [];
        for (let i = 0; i <= steps; i++) {
          const bearing = (i / steps) * 2 * Math.PI;
          const latR = lat * (Math.PI / 180);
          const lonR = lon * (Math.PI / 180);
          const destLat = Math.asin(
            Math.sin(latR) * Math.cos(angRad) +
            Math.cos(latR) * Math.sin(angRad) * Math.cos(bearing)
          );
          const destLon = lonR + Math.atan2(
            Math.sin(bearing) * Math.sin(angRad) * Math.cos(latR),
            Math.cos(angRad) - Math.sin(latR) * Math.sin(destLat)
          );
          coords.push([destLon * (180 / Math.PI), destLat * (180 / Math.PI)]);
        }
        return { type: 'Feature' as const, geometry: { type: 'Polygon' as const, coordinates: [coords] }, properties: {} };
      };

      const argosLayer = g.append('g').attr('class', 'argos-layer').attr('display', 'none');
      argosLayerRef.current = argosLayer;

      const ringGroup = argosLayer.append('g').attr('class', 'argos-rings');
      const markerGroup = argosLayer.append('g').attr('class', 'argos-markers');
      const argosRingPaths: any[] = [];
      const argosMarkerGroups: any[] = [];

      // Cache the argos ring fill selections to avoid selectAll in animation loop
      const argosRingFillPaths: any[] = [];

      PH_MILITARY_BASES.forEach((base, i) => {
        const c = BASE_TYPE_COLORS[base.type];
        const ringGeo = geoCircle(base.lon, base.lat, base.rangeKm);

        const rfp = ringGroup.append('path')
          .datum(ringGeo)
          .attr('fill', c)
          .attr('fill-opacity', 0.02)
          .attr('stroke', c)
          .attr('stroke-width', 0.4)
          .attr('stroke-opacity', 0.10)
          .attr('stroke-dasharray', '3,5')
          .attr('pointer-events', 'none')
          .attr('class', `argos-ring-fill-${i}`);
        argosRingFillPaths.push(rfp);

        const rp = ringGroup.append('path')
          .datum(ringGeo)
          .attr('fill', 'none')
          .attr('stroke', c)
          .attr('stroke-width', 0.7)
          .attr('stroke-opacity', 0.30)
          .attr('stroke-dasharray', '6,8')
          .attr('stroke-dashoffset', 0)
          .attr('pointer-events', 'none')
          .attr('class', `argos-ring-${i}`);
        argosRingPaths.push(rp);

        // Marker group
        const mg = markerGroup.append('g')
          .attr('cursor', 'pointer')
          .attr('class', `argos-marker-${i}`);

        mg.append('circle').attr('r', 12).attr('fill', 'transparent');
        mg.append('circle').attr('class', 'argos-pulse').attr('r', 7)
          .attr('fill', 'none').attr('stroke', c).attr('stroke-width', 0.7).attr('stroke-opacity', 0.5);
        mg.append('line').attr('x1', -6).attr('x2', 6).attr('y1', 0).attr('y2', 0)
          .attr('stroke', c).attr('stroke-width', 0.8);
        mg.append('line').attr('x1', 0).attr('x2', 0).attr('y1', -6).attr('y2', 6)
          .attr('stroke', c).attr('stroke-width', 0.8);
        mg.append('circle').attr('r', 2.5).attr('fill', c);
        mg.append('text')
          .attr('x', 9).attr('y', -8)
          .attr('font-family', 'ui-monospace,Menlo,monospace')
          .attr('font-size', '6.5px')
          .attr('fill', c)
          .attr('letter-spacing', '0.12em')
          .text(base.shortName);

        mg.on('mouseenter', function(event: any) {
          const [mx, my] = d3.pointer(event, svgRef.current);
          if (mounted) { clearAllTooltips(); setBaseTooltip({ base, x: mx, y: my }); }
        }).on('mousemove', function(event: any) {
          const [mx, my] = d3.pointer(event, svgRef.current);
          if (mounted) setBaseTooltip({ base, x: mx, y: my });
        }).on('mouseleave', function() {
          if (mounted) setBaseTooltip(null);
        });

        argosMarkerGroups.push(mg);
      });

      // ── WPS Conflict Zones layer ──────────────────────────────────────────
      const wpsLayer = argosLayer.append('g').attr('class', 'wps-layer');
      const wpsRingPaths: any[] = [];
      const wpsMarkerGroups: any[] = [];
      const wpsFillPaths: any[] = [];
      const wpsGlowPaths: any[] = [];

      WPS_CONFLICT_ZONES.forEach((zone, i) => {
        const c = CONFLICT_STATUS_COLORS[zone.status];
        const ringGeo = geoCircle(zone.lon, zone.lat, zone.radiusKm);

        wpsLayer.append('path')
          .datum(ringGeo)
          .attr('class', `wps-fill-${i}`)
          .attr('fill', c)
          .attr('fill-opacity', zone.status === 'CHN_MILITARIZED' ? 0.10 : 0.06)
          .attr('stroke', 'none')
          .attr('pointer-events', 'none');
        wpsFillPaths.push(wpsLayer.select(`.wps-fill-${i}`));

        wpsLayer.append('path')
          .datum(ringGeo)
          .attr('class', `wps-glow-${i}`)
          .attr('fill', 'none')
          .attr('stroke', c)
          .attr('stroke-width', 3)
          .attr('stroke-opacity', 0.08)
          .attr('pointer-events', 'none');
        wpsGlowPaths.push(wpsLayer.select(`.wps-glow-${i}`));

        const rp = wpsLayer.append('path')
          .datum(ringGeo)
          .attr('class', `wps-ring-${i}`)
          .attr('fill', 'none')
          .attr('stroke', c)
          .attr('stroke-width', zone.status === 'CHN_MILITARIZED' ? 1.2 : 0.8)
          .attr('stroke-opacity', 0.7)
          .attr('stroke-dasharray', zone.status === 'CHN_MILITARIZED' ? 'none' : '3,4')
          .attr('pointer-events', 'none');
        wpsRingPaths.push(rp);

        // Zone marker
        const mg = wpsLayer.append('g')
          .attr('class', `wps-marker-${i}`)
          .attr('cursor', 'pointer');

        mg.append('circle').attr('r', 14).attr('fill', 'transparent');

        if (zone.status === 'CHN_MILITARIZED') {
          mg.append('polygon')
            .attr('points', '0,-7 5,0 0,7 -5,0')
            .attr('fill', c)
            .attr('fill-opacity', 0.9)
            .attr('stroke', 'none');
        } else {
          mg.append('circle').attr('class', 'wps-pulse').attr('r', 6)
            .attr('fill', 'none').attr('stroke', c).attr('stroke-width', 0.8).attr('stroke-opacity', 0.6);
          mg.append('circle').attr('r', 3).attr('fill', c).attr('fill-opacity', 0.85);
        }

        // Label
        mg.append('text')
          .attr('x', 0).attr('y', -11)
          .attr('font-family', 'ui-monospace,Menlo,monospace')
          .attr('font-size', '6px')
          .attr('fill', c)
          .attr('text-anchor', 'middle')
          .attr('letter-spacing', '0.1em')
          .text(zone.shortName);

        mg.on('mouseenter', function(event: any) {
          const [mx, my] = d3.pointer(event, svgRef.current);
          if (mounted) { clearAllTooltips(); setBaseTooltip({ base: { ...zone, isConflictZone: true } as any, x: mx, y: my }); }
        }).on('mousemove', function(event: any) {
          const [mx, my] = d3.pointer(event, svgRef.current);
          if (mounted) setBaseTooltip({ base: { ...zone, isConflictZone: true } as any, x: mx, y: my });
        }).on('mouseleave', () => { if (mounted) setBaseTooltip(null); });

        wpsMarkerGroups.push(mg);
      });

      // ── Easing function (ease-in-out cubic) ──────────────────────────────
      const easeInOutCubic = (t: number) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;

      // Cache argos/wps pulse selections (must be after argos layer is populated)
      const _argosPulses = argosLayer.selectAll('.argos-pulse');
      const _wpsPulses   = wpsLayer.selectAll('.wps-pulse');

      const TWEEN_DURATION = 1800;
      const ZOOM_OUT_DURATION = 2400;
      let frameCount = 0;
      let lastTooltipUpdate = 0;
      const TOOLTIP_THROTTLE_MS = isMobile ? 100 : 0; // throttle setState from anim loop

      const animate = () => {
        if (!mounted) return;
        animFrame = requestAnimationFrame(animate);
        const now = performance.now();
        const dt = now - lastTime; lastTime = now;
        frameCount++;

        // ── Tween handling ──────────────────────────────────────────────
        const state = stateRef.current;
        if (state.tweening) {
          const duration = state.tweenIsZoomOut ? ZOOM_OUT_DURATION : TWEEN_DURATION;
          const elapsed = now - state.tweenStart;
          const t = Math.min(elapsed / duration, 1);

          if (state.tweenIsZoomOut) {
            // Two-phase zoom-out
            const zoomE = easeInOutCubic(Math.min(t / 0.5, 1));
            const panT  = Math.max((t - 0.35) / 0.65, 0);
            const panE  = easeInOutCubic(panT);

            rotation[0] = state.tweenFrom[0] + (state.tweenTo[0] - state.tweenFrom[0]) * panE;
            rotation[1] = state.tweenFrom[1] + (state.tweenTo[1] - state.tweenFrom[1]) * panE;
            projection.rotate(rotation);

            const tx = state.tweenFromTrans[0] + (state.tweenToTrans[0] - state.tweenFromTrans[0]) * panE;
            const ty = state.tweenFromTrans[1] + (state.tweenToTrans[1] - state.tweenFromTrans[1]) * panE;
            projection.translate([tx, ty]);
            issProjection.translate([tx, ty]);

            state.zoomScale = state.tweenFromZoom + (state.targetZoom - state.tweenFromZoom) * zoomE;
            projection.scale(R * state.zoomScale);
            issProjection.scale(R * ISS_ALT_FACTOR * state.zoomScale);
          } else {
            // Zoom-in tween
            const e = easeInOutCubic(t);

            rotation[0] = state.tweenFrom[0] + (state.tweenTo[0] - state.tweenFrom[0]) * e;
            rotation[1] = state.tweenFrom[1] + (state.tweenTo[1] - state.tweenFrom[1]) * e;
            projection.rotate(rotation);

            const tx = state.tweenFromTrans[0] + (state.tweenToTrans[0] - state.tweenFromTrans[0]) * e;
            const ty = state.tweenFromTrans[1] + (state.tweenToTrans[1] - state.tweenFromTrans[1]) * e;
            projection.translate([tx, ty]);
            issProjection.translate([tx, ty]);

            state.zoomScale = state.tweenFromZoom + (state.targetZoom - state.tweenFromZoom) * e;
            projection.scale(R * state.zoomScale);
            issProjection.scale(R * ISS_ALT_FACTOR * state.zoomScale);
          }

          if (t >= 1) {
            state.tweening = false;
            state.zoomScale = state.targetZoom;
            rotation[0] = state.tweenTo[0];
            rotation[1] = state.tweenTo[1];
            if (state.argosActive && mounted) setLegendVisible(true);
          }
        }

        // Reduce hex pattern opacity when zoomed into Philippines
        const targetHexO = state.argosActive ? 0.12 : 1;
        const curHexO = parseFloat(hexBgRect.attr('opacity') ?? '1');
        hexBgRect.attr('opacity', curHexO + (targetHexO - curHexO) * 0.04);

        scanT = (scanT + 0.004) % 1;
        scanRing.attr('r', R * (0.15 + scanT * 0.85)).attr('stroke-opacity', (1 - scanT) * 0.45);

        stateRef.current.issT = (stateRef.current.issT + dt / ISS_PERIOD_MS) % 1;
        PH_SATELLITES.forEach((sat, i) => {
          phSatT[i] = (phSatT[i] + dt / sat.periodMs) % 1;
        });

        const phase = now / 800;
        pulseFrameCount++;
        if (pulseFrameCount % PULSE_SKIP === 0) {
          const pulseR = 3 + 4 * ((Math.sin(phase) + 1) / 2);
          const pulseO = 0.3 + 0.4 * ((Math.cos(phase) + 1) / 2);
          _beaconPulses.attr('r', pulseR).attr('stroke-opacity', pulseO).attr('stroke', themeRef.current.beaconPulse);
          _argosPulses.attr('r', 5 + 3 * ((Math.sin(phase * 1.3) + 1) / 2)).attr('stroke-opacity', 0.3 + 0.4 * ((Math.cos(phase * 1.3) + 1) / 2));
        }

        if (!isDragging && !state.tweening) {
          if (state.trackedSatIdx !== null) {
            const idx = state.trackedSatIdx;
            const satLon = (phSatT[idx] % 1) * 360 - 180;
            const tRotX = -satLon;
            rotation[0] += (tRotX - rotation[0]) * 0.06;
            rotation[1] += (0 - rotation[1]) * 0.06;
            projection.rotate(rotation);
          } else if (state.issTracked) {
            const issLon = (state.issT % 1) * 360 - 180;
            const tRotX = -issLon;
            rotation[0] += (tRotX - rotation[0]) * 0.06;
            rotation[1] += (0 - rotation[1]) * 0.06;
            projection.rotate(rotation);
          } else if (!state.argosActive) {
            rotation[0] += 0.07;
            projection.rotate(rotation);
          }
        }

        // On mobile, skip expensive path redraws on intermediate frames
        // Use more aggressive skipping during tween animations
        const curSkip = state.tweening ? FRAME_SKIP_TWEEN : FRAME_SKIP;
        markProjectionDirty();
        const wasDirty = projectionDirty;
        if (frameCount % curSkip === 0) {
          redraw();
        }

        // Throttle tracked-object tooltip setState to avoid React re-render churn
        const canUpdateTooltip = now - lastTooltipUpdate > TOOLTIP_THROTTLE_MS;
        if (canUpdateTooltip && state.trackedSatIdx !== null) {
          const pos = satScreenPosRef.current[state.trackedSatIdx];
          if (pos && mounted) {
            const sat = PH_SATELLITES[state.trackedSatIdx];
            setSatTooltip({ sat, x: pos[0], y: pos[1] });
            lastTooltipUpdate = now;
          }
        }
        if (canUpdateTooltip && state.issTracked) {
          const pos = issScreenPosRef.current;
          if (pos && mounted) {
            setIssTooltip({ x: pos[0], y: pos[1] });
            lastTooltipUpdate = now;
          }
        }

        // Redraw ARGOS overlays if active (gated by frame-skip like redraw)
        if (state.argosActive && frameCount % curSkip === 0 && wasDirty) {
          // Redraw range ring fills using cached selections
          argosRingFillPaths.forEach(rfp => rfp.attr('d', (d: any) => path(d)));
          // Redraw ring outlines
          argosRingPaths.forEach(rp => rp.attr('d', (d: any) => path(d)));
          // Reposition markers
          PH_MILITARY_BASES.forEach((base, i) => {
            const dot = isVisible(base.lon, base.lat);
            if (dot > 0.02) {
              const proj = projection([base.lon, base.lat]);
              if (proj) {
                argosMarkerGroups[i].attr('display', 'block').attr('transform', `translate(${proj[0]},${proj[1]})`);
                return;
              }
            }
            argosMarkerGroups[i].attr('display', 'none');
          });

          // Redraw WPS conflict zones using cached selections
          wpsFillPaths.forEach(fp => fp.attr('d', (d: any) => path(d)));
          wpsGlowPaths.forEach(gp => gp.attr('d', (d: any) => path(d)));
          wpsRingPaths.forEach(rp => rp.attr('d', (d: any) => path(d)));
          WPS_CONFLICT_ZONES.forEach((zone, i) => {
            const dot = isVisible(zone.lon, zone.lat);
            if (dot > 0.02) {
              const proj = projection([zone.lon, zone.lat]);
              if (proj) {
                wpsMarkerGroups[i].attr('display', 'block').attr('transform', `translate(${proj[0]},${proj[1]})`);
                return;
              }
            }
            wpsMarkerGroups[i].attr('display', 'none');
          });

        }

        // Always update pulse & dash animation (cheap ops)
        if (state.argosActive) {
          if (pulseFrameCount % PULSE_SKIP === 0) {
            _wpsPulses.attr('r', 4 + 3 * ((Math.sin(phase * 0.9) + 1) / 2)).attr('stroke-opacity', 0.3 + 0.4 * ((Math.cos(phase * 0.9) + 1) / 2));
          }

          // Animate range-ring dash rotation (circling effect)
          const dashOff = (now * 0.012) % 100;
          argosRingPaths.forEach(rp => rp.attr('stroke-dashoffset', -dashOff));
        }
      };
      animate();

      const t = themeRef.current;
      svgRef.current?.querySelectorAll('.country').forEach(el => {
        const p = el as SVGPathElement;
        if (p.getAttribute('filter')) return;
        const hasData = p.dataset.hasData === 'true';
        p.style.fill = hasData ? t.landKnown : t.landUnknown;
        p.style.stroke = hasData ? t.landKnownStroke : t.landUnknownStroke;
      });
      const borders = svgRef.current?.querySelector('.borders') as SVGPathElement | null;
      if (borders) borders.style.stroke = t.borderStroke;

      setIsLoading(false);
    };

    loadAndInit();
    return () => { mounted = false; cancelAnimationFrame(animFrame); };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {isLoading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
          <div style={{ width: 32, height: 32, border: '1.5px solid rgba(227,27,84,0.2)', borderTop: '1.5px solid #E31B54', borderRadius: '50%', animation: 'dvSpin 1s linear infinite' }} />
          <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.55rem', color: 'rgba(227,27,84,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>LOADING GEO DATA...</span>
        </div>
      )}
      <svg ref={svgRef} style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none', willChange: 'transform' }} />

      {/* Capital city tooltip */}
      {tooltip && (() => {
        const svgW = svgRef.current?.clientWidth ?? 600;
        const svgH = svgRef.current?.clientHeight ?? 600;
        const TW = 215; const TH = 115; const margin = 12;
        let tx = tooltip.x + 16;
        let ty = tooltip.y - 16;
        if (tx + TW > svgW - margin) tx = tooltip.x - TW - 16;
        if (ty + TH > svgH - margin) ty = tooltip.y - TH - 4;
        if (ty < margin) ty = margin;
        const cap = tooltip.capital;
        return (
          <div style={{ position: 'absolute', left: tx, top: ty, width: TW, pointerEvents: 'none', zIndex: 30, animation: 'dvFade 0.12s ease' }}>
            {(() => {
              const b = `1px solid ${themeRef.current.tooltipAccent}`;
              return [
                { top: 0, left: 0, borderTop: b, borderLeft: b },
                { top: 0, right: 0, borderTop: b, borderRight: b },
                { bottom: 0, left: 0, borderBottom: b, borderLeft: b },
                { bottom: 0, right: 0, borderBottom: b, borderRight: b },
              ].map((s, i) => <div key={i} style={{ position: 'absolute', width: 8, height: 8, ...s }} />);
            })()}
            <div style={{ margin: '4px', background: themeRef.current.tooltipBg, border: `1px solid ${themeRef.current.tooltipBorder}`, borderRadius: 2, backdropFilter: 'blur(16px)', overflow: 'hidden' }}>
              <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${themeRef.current.tooltipAccent}, transparent)` }} />
              <div style={{ padding: '8px 10px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
                  <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.44rem', fontWeight: 700, letterSpacing: '0.2em', color: themeRef.current.tooltipAccent, border: `1px solid ${themeRef.current.tooltipBorder}`, padding: '1px 5px', borderRadius: 2 }}>{cap.iso}</span>
                  <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.42rem', color: themeRef.current.tooltipMeta, letterSpacing: '0.14em', textTransform: 'uppercase' }}>CAPITAL SIG</span>
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: themeRef.current.beaconDot, boxShadow: `0 0 5px ${themeRef.current.beaconDot}`, animation: 'dvPulse 1.8s ease infinite' }} />
                    <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.4rem', color: themeRef.current.tooltipMeta, letterSpacing: '0.1em' }}>LIVE</span>
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: themeRef.current.tooltipText, letterSpacing: '0.01em', lineHeight: 1.1, marginBottom: 1 }}>{cap.country}</div>
                <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.48rem', color: themeRef.current.tooltipAccent, letterSpacing: '0.12em', marginBottom: 8 }}>{cap.name.toUpperCase()}</div>
                <div style={{ height: 1, background: themeRef.current.tooltipBorder, marginBottom: 8 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 8px' }}>
                  <div>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.38rem', color: themeRef.current.tooltipMeta, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 2 }}>{cap.title}</div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 600, color: themeRef.current.tooltipSubtext, lineHeight: 1.25 }}>{cap.leader}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.38rem', color: themeRef.current.tooltipMeta, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 2 }}>Gov. Type</div>
                    <div style={{ fontSize: '0.53rem', fontWeight: 500, color: themeRef.current.tooltipMeta, lineHeight: 1.25 }}>{cap.gov}</div>
                  </div>
                </div>
              </div>
              <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${themeRef.current.tooltipBorder}, transparent)` }} />
            </div>
          </div>
        );
      })()}

      {/* ISS Tooltip */}
      {issTooltip && (() => {
        const svgW = svgRef.current?.clientWidth ?? 600;
        const svgH = svgRef.current?.clientHeight ?? 600;
        const TW = 248; const TH = 200; const margin = 12;
        let tx = issTooltip.x + 24;
        let ty = issTooltip.y + 18;
        if (tx + TW > svgW - margin) tx = issTooltip.x - TW - 24;
        if (ty + TH > svgH - margin) ty = issTooltip.y - TH - 24;
        if (ty < margin) ty = margin;
        const t = themeRef.current;
        return (
          <div style={{ position: 'absolute', left: tx, top: ty, width: TW, pointerEvents: 'none', zIndex: 30, animation: 'dvFade 0.12s ease' }}>
            {(() => {
              const b = `1px solid ${t.issColor}`;
              return [
                { top: 0, left: 0, borderTop: b, borderLeft: b },
                { top: 0, right: 0, borderTop: b, borderRight: b },
                { bottom: 0, left: 0, borderBottom: b, borderLeft: b },
                { bottom: 0, right: 0, borderBottom: b, borderRight: b },
              ].map((s, i) => <div key={i} style={{ position: 'absolute', width: 8, height: 8, ...s }} />);
            })()}
            <div style={{ margin: '4px', background: t.tooltipBg, border: `1px solid rgba(0,220,255,0.12)`, borderRadius: 2, backdropFilter: 'blur(16px)', overflow: 'hidden' }}>
              <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${t.issColor}, transparent)` }} />
              <div style={{ padding: '8px 10px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
                  <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.44rem', fontWeight: 700, letterSpacing: '0.2em', color: t.issColor, border: `1px solid rgba(0,220,255,0.22)`, padding: '1px 5px', borderRadius: 2 }}>ISS</span>
                  <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.42rem', color: t.tooltipMeta, letterSpacing: '0.14em', textTransform: 'uppercase' }}>ORBIT SIG</span>
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: t.issColor, boxShadow: `0 0 5px ${t.issColor}`, animation: 'dvPulse 1.8s ease infinite' }} />
                    <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.4rem', color: t.tooltipMeta, letterSpacing: '0.1em' }}>LIVE</span>
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: t.tooltipText, letterSpacing: '0.01em', lineHeight: 1.1, marginBottom: 2 }}>{ISS_INFO.fullName}</div>
                <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.44rem', color: t.issColor, letterSpacing: '0.1em', marginBottom: 8 }}>SINCE {ISS_INFO.launched} · CREW CAP. {ISS_INFO.crewCapacity}</div>
                <div style={{ height: 1, background: `rgba(0,220,255,0.1)`, marginBottom: 8 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 8px', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.36rem', color: t.tooltipMeta, letterSpacing: '0.12em', marginBottom: 2 }}>ALTITUDE</div>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.62rem', fontWeight: 700, color: t.issColor }}>{ISS_INFO.altitude}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.36rem', color: t.tooltipMeta, letterSpacing: '0.12em', marginBottom: 2 }}>VELOCITY</div>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.62rem', fontWeight: 700, color: t.issColor }}>{ISS_INFO.speed}</div>
                  </div>
                </div>
                <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.36rem', color: t.tooltipMeta, letterSpacing: '0.12em', marginBottom: 4 }}>PARTNER NATIONS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {ISS_INFO.countries.map(c => (
                    <span key={c} style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.38rem', color: t.tooltipSubtext, background: `rgba(0,220,255,0.06)`, border: `1px solid rgba(0,220,255,0.12)`, padding: '1px 4px', borderRadius: 2 }}>{c}</span>
                  ))}
                </div>
              </div>
              <div style={{ height: 1, background: `linear-gradient(90deg, transparent, rgba(0,220,255,0.12), transparent)` }} />
            </div>
          </div>
        );
      })()}
      {/* Philippine Satellite Tooltip */}
      {satTooltip && (() => {
        const svgW = svgRef.current?.clientWidth ?? 600;
        const svgH = svgRef.current?.clientHeight ?? 600;
        const TW = 230; const TH = 160; const margin = 12;
        let tx = satTooltip.x + 24;
        let ty = satTooltip.y + 18;
        if (tx + TW > svgW - margin) tx = satTooltip.x - TW - 24;
        if (ty + TH > svgH - margin) ty = satTooltip.y - TH - 24;
        if (ty < margin) ty = margin;
        const sat = satTooltip.sat;
        const t = themeRef.current;
        return (
          <div style={{ position: 'absolute', left: tx, top: ty, width: TW, pointerEvents: 'none', zIndex: 30, animation: 'dvFade 0.12s ease' }}>
            {(() => {
              const b = `1px solid ${sat.color}`;
              return [
                { top: 0, left: 0, borderTop: b, borderLeft: b },
                { top: 0, right: 0, borderTop: b, borderRight: b },
                { bottom: 0, left: 0, borderBottom: b, borderLeft: b },
                { bottom: 0, right: 0, borderBottom: b, borderRight: b },
              ].map((s, i) => <div key={i} style={{ position: 'absolute', width: 8, height: 8, ...s }} />);
            })()}
            <div style={{ margin: '4px', background: t.tooltipBg, border: `1px solid ${sat.color}22`, borderRadius: 2, backdropFilter: 'blur(16px)', overflow: 'hidden' }}>
              <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${sat.color}, transparent)` }} />
              <div style={{ padding: '8px 10px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
                  <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.44rem', fontWeight: 700, letterSpacing: '0.2em', color: sat.color, border: `1px solid ${sat.color}44`, padding: '1px 5px', borderRadius: 2 }}>PHL</span>
                  <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.42rem', color: t.tooltipMeta, letterSpacing: '0.14em', textTransform: 'uppercase' }}>SAT SIG</span>
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: sat.color, boxShadow: `0 0 5px ${sat.color}`, animation: 'dvPulse 1.8s ease infinite' }} />
                    <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.4rem', color: t.tooltipMeta, letterSpacing: '0.1em' }}>{sat.status}</span>
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: t.tooltipText, letterSpacing: '0.01em', lineHeight: 1.1, marginBottom: 2 }}>{sat.fullName}</div>
                <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.44rem', color: sat.color, letterSpacing: '0.1em', marginBottom: 8 }}>SINCE {sat.launched} · {sat.operator}</div>
                <div style={{ height: 1, background: `${sat.color}18`, marginBottom: 8 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 8px', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.36rem', color: t.tooltipMeta, letterSpacing: '0.12em', marginBottom: 2 }}>ALTITUDE</div>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.62rem', fontWeight: 700, color: sat.color }}>{sat.altitude}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.36rem', color: t.tooltipMeta, letterSpacing: '0.12em', marginBottom: 2 }}>VELOCITY</div>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.62rem', fontWeight: 700, color: sat.color }}>{sat.speed}</div>
                  </div>
                </div>
                <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.38rem', color: t.tooltipMeta, lineHeight: 1.55 }}>{sat.notes}</div>
              </div>
              <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${sat.color}22, transparent)` }} />
            </div>
          </div>
        );
      })()}
      {/* ARGOS Military Base / WPS Conflict Zone Tooltip */}
      {baseTooltip && (() => {
        const svgW = svgRef.current?.clientWidth ?? 600;
        const svgH = svgRef.current?.clientHeight ?? 600;
        const TW = 252; const TH = 180; const margin = 12;
        let tx = baseTooltip.x + 16;
        let ty = baseTooltip.y - 16;
        if (tx + TW > svgW - margin) tx = baseTooltip.x - TW - 16;
        if (ty + TH > svgH - margin) ty = baseTooltip.y - TH - 4;
        if (ty < margin) ty = margin;
        const item = baseTooltip.base as any;
        const isZone = !!item.isConflictZone;
        const c = isZone ? CONFLICT_STATUS_COLORS[item.status as ConflictStatus] : BASE_TYPE_COLORS[(item as MilBase).type];
        const t = themeRef.current;
        return (
          <div style={{ position: 'absolute', left: tx, top: ty, width: TW, pointerEvents: 'none', zIndex: 35, animation: 'dvFade 0.1s ease' }}>
            {[
              { top: 0, left: 0, borderTop: `1px solid ${c}`, borderLeft: `1px solid ${c}` },
              { top: 0, right: 0, borderTop: `1px solid ${c}`, borderRight: `1px solid ${c}` },
              { bottom: 0, left: 0, borderBottom: `1px solid ${c}`, borderLeft: `1px solid ${c}` },
              { bottom: 0, right: 0, borderBottom: `1px solid ${c}`, borderRight: `1px solid ${c}` },
            ].map((s, i) => <div key={i} style={{ position: 'absolute', width: 8, height: 8, ...s }} />)}
            <div style={{ margin: '4px', background: t.tooltipBg, border: `1px solid ${c}22`, borderRadius: 2, backdropFilter: 'blur(16px)', overflow: 'hidden' }}>
              <div style={{ height: 1.5, background: `linear-gradient(90deg, transparent, ${c}, transparent)` }} />
              <div style={{ padding: '8px 10px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                  <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.42rem', fontWeight: 700, letterSpacing: '0.18em', color: c, border: `1px solid ${c}44`, padding: '1px 5px', borderRadius: 2 }}>
                    {isZone ? item.status.replace('_', ' ') : (item as MilBase).type}
                  </span>
                  <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.4rem', color: t.tooltipMeta, letterSpacing: '0.12em' }}>
                    {isZone ? 'CONFLICT ZONE' : 'MILITARY INSTALLATION'}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: t.tooltipText, lineHeight: 1.2, marginBottom: 2 }}>{item.name}</div>
                {isZone && item.chineseName && (
                  <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.4rem', color: 'rgba(227,27,84,0.6)', letterSpacing: '0.08em', marginBottom: 3 }}>CHN: {item.chineseName}</div>
                )}
                <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.44rem', color: c, letterSpacing: '0.1em', marginBottom: 7 }}>
                  {item.shortName} · {isZone ? 'WEST PHILIPPINE SEA' : 'PHILIPPINES'}
                </div>
                <div style={{ height: 1, background: `${c}22`, marginBottom: 7 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.36rem', color: t.tooltipMeta, letterSpacing: '0.12em', marginBottom: 2 }}>{isZone ? 'ZONE RADIUS' : 'OP. RANGE'}</div>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.62rem', fontWeight: 700, color: c }}>{item.radiusKm} km</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.36rem', color: t.tooltipMeta, letterSpacing: '0.12em', marginBottom: 2 }}>COORDS</div>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.46rem', color: t.tooltipSubtext }}>{item.lat.toFixed(2)}°N {item.lon.toFixed(2)}°E</div>
                  </div>
                </div>
                <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.38rem', color: t.tooltipMeta, lineHeight: 1.55, marginBottom: isZone && item.incidents ? 5 : 0 }}>{item.description}</div>
                {isZone && item.incidents && (
                  <>
                    <div style={{ height: 1, background: `${c}18`, marginBottom: 5 }} />
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.36rem', color: c, letterSpacing: '0.1em', marginBottom: 3 }}>RECENT INCIDENTS</div>
                    <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.37rem', color: t.tooltipMeta, lineHeight: 1.5 }}>{item.incidents}</div>
                  </>
                )}
              </div>
              <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${c}22, transparent)` }} />
            </div>
          </div>
        );
      })()}



      {/* ARGOS Legend — bottom-left corner, shown after Philippines zoom-in */}
      {legendVisible && (
        <div style={{ position: 'absolute', bottom: '6%', left: '4%', zIndex: 20, pointerEvents: 'none' }}>
          <div style={{ opacity: 0, animation: 'dvLegendFadeUp 0.35s ease forwards', animationDelay: '600ms', fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.52rem', color: 'rgba(0,220,255,0.4)', letterSpacing: '0.18em', marginBottom: 7, textTransform: 'uppercase' }}>ARGOS // WPS OPERATIONAL GRID</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 9 }}>
            {(['AIR','NAVAL','ARMY','JOINT'] as const).map((type, idx) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0, animation: 'dvLegendFadeUp 0.35s ease forwards', animationDelay: `${540 - idx * 60}ms` }}>
                <div style={{ width: 12, height: 2, background: BASE_TYPE_COLORS[type], borderRadius: 999 }} />
                <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.46rem', color: BASE_TYPE_COLORS[type], letterSpacing: '0.1em' }}>PHL {type}</span>
              </div>
            ))}
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 8, opacity: 0, animation: 'dvLegendFadeUp 0.35s ease forwards', animationDelay: '300ms' }} />
          <div style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.46rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.14em', marginBottom: 6, opacity: 0, animation: 'dvLegendFadeUp 0.35s ease forwards', animationDelay: '240ms' }}>WPS CONFLICT ZONES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {([
              ['CHN_MILITARIZED', '◆ CHN MILITARIZED'],
              ['INCIDENT_ZONE',   '● ACTIVE INCIDENTS'],
              ['DISPUTED',        '○ DISPUTED'],
              ['PHL_CONTROLLED',  '● PHL CONTROLLED'],
            ] as const).map(([status, label], idx) => (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0, animation: 'dvLegendFadeUp 0.35s ease forwards', animationDelay: `${180 - idx * 60}ms` }}>
                <div style={{ width: 12, height: 2, background: CONFLICT_STATUS_COLORS[status as ConflictStatus], borderRadius: 999 }} />
                <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '0.44rem', color: CONFLICT_STATUS_COLORS[status as ConflictStatus], letterSpacing: '0.08em' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobeD3;
