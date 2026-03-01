"use client";
import React, { useEffect, useRef, useMemo } from 'react';
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl';

interface ThreadsProps {
  color?: [number, number, number];
  amplitude?: number;
  distance?: number;
  enableMouseInteraction?: boolean;
}

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform vec3 uColor;
uniform float uAmplitude;
uniform float uDistance;
uniform vec2 uMouse;

#define PI 3.1415926538

// Signature gradient palette
const vec3 cGreen  = vec3(0.0, 1.0, 0.651);   // #00ffa6
const vec3 cGold   = vec3(1.0, 0.843, 0.0);    // #ffd700
const vec3 cPink   = vec3(0.925, 0.282, 0.6);  // #ec4899
const vec3 cPurple = vec3(0.576, 0.2, 0.918);  // #9333ea
const vec3 cBlue   = vec3(0.231, 0.51, 0.965); // #3b82f6

vec3 getThreadColor(float t) {
    // Cycle through 5 colors smoothly
    float segment = t * 5.0;
    float idx = floor(segment);
    float frac = fract(segment);
    
    if (idx < 1.0) return mix(cGreen, cGold, frac);
    if (idx < 2.0) return mix(cGold, cPink, frac);
    if (idx < 3.0) return mix(cPink, cPurple, frac);
    if (idx < 4.0) return mix(cPurple, cBlue, frac);
    return mix(cBlue, cGreen, frac);
}

const int u_line_count = 24;
const float u_line_width = 7.0;
const float u_line_blur = 10.0;

float Perlin2D(vec2 P) {
    vec2 Pi = floor(P);
    vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
    vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
    Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
    Pt += vec2(26.0, 161.0).xyxy;
    Pt *= Pt;
    Pt = Pt.xzxz * Pt.yyww;
    vec4 hash_x = fract(Pt * (1.0 / 951.135664));
    vec4 hash_y = fract(Pt * (1.0 / 642.949883));
    vec4 grad_x = hash_x - 0.49999;
    vec4 grad_y = hash_y - 0.49999;
    vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y)
        * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
    grad_results *= 1.4142135623730950;
    vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy
               * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
    vec4 blend2 = vec4(blend, vec2(1.0 - blend));
    return dot(grad_results, blend2.zxzx * blend2.wwyy);
}

float lineFn(vec2 st, float width, float perc, vec2 mouse, float time, float amplitude, float distance, float pxSize) {
    float split_point = 0.1 + perc * 0.4;

    float finalAmplitude = smoothstep(split_point, 0.7, st.x) * 0.5
                           * amplitude * (1.0 + (mouse.y - 0.5) * 0.2);

    float time_scaled = time * 0.1 + (mouse.x - 0.5);
    float blur = smoothstep(split_point, split_point + 0.05, st.x) * perc;
    float blurWidth = u_line_blur * pxSize * blur;

    float xnoise = mix(
        Perlin2D(vec2(time_scaled, st.x + perc) * 2.5),
        Perlin2D(vec2(time_scaled, st.x + time_scaled) * 3.5) * 0.6667,
        st.x * 0.3
    );

    float y = 0.5 + (perc - 0.5) * distance + xnoise * 0.5 * finalAmplitude;
    float halfW = width * 0.5;

    float line_start = smoothstep(y + halfW + blurWidth, y, st.y);
    float line_end = smoothstep(y, y - halfW - blurWidth, st.y);

    return clamp(
        (line_start - line_end) * (1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3))),
        0.0,
        1.0
    );
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    float pxSize = 1.0 / max(iResolution.x, iResolution.y);
    float invCount = 1.0 / float(u_line_count);

    vec3 col = vec3(0.0);
    float alpha = 0.0;

    for (int i = 0; i < u_line_count; i++) {
        float p = float(i) * invCount;
        float lineVal = lineFn(
            uv,
            u_line_width * pxSize * (1.0 - p),
            p,
            uMouse,
            iTime,
            uAmplitude,
            uDistance,
            pxSize
        );
        vec3 threadCol = getThreadColor(fract(uv.x + iTime * 0.05));
        col += threadCol * lineVal;
        alpha += lineVal;
    }

    alpha = clamp(alpha, 0.0, 1.0);
    col = clamp(col, 0.0, 1.0);
    fragColor = vec4(col, alpha);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

const Threads: React.FC<ThreadsProps> = ({
  color = [1, 1, 1],
  amplitude = 1,
  distance = 0,
  enableMouseInteraction = false,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>(0);
  // Stabilize color array reference to prevent WebGL context recreation
  const stableColor = useMemo(() => color, [color[0], color[1], color[2]]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Cap pixel ratio at 1.5 to reduce fragment count on retina displays
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const renderer = new Renderer({ alpha: true, dpr });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height)
        },
        uColor: { value: new Color(...stableColor) },
        uAmplitude: { value: amplitude },
        uDistance: { value: distance },
        uMouse: { value: new Float32Array([0.5, 0.5]) }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      const w = clientWidth * dpr;
      const h = clientHeight * dpr;
      program.uniforms.iResolution.value.r = w;
      program.uniforms.iResolution.value.g = h;
      program.uniforms.iResolution.value.b = w / h;
    }

    let resizeTimer: ReturnType<typeof setTimeout>;
    function debouncedResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 100);
    }
    window.addEventListener('resize', debouncedResize);
    resize();

    let currentMouse = [0.5, 0.5];
    let targetMouse = [0.5, 0.5];

    function handleMouseMove(e: MouseEvent) {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMouse = [x, y];
    }
    function handleMouseLeave() {
      targetMouse = [0.5, 0.5];
    }
    if (enableMouseInteraction) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    function update(t: number) {
      if (enableMouseInteraction) {
        const smoothing = 0.05;
        currentMouse[0] += smoothing * (targetMouse[0] - currentMouse[0]);
        currentMouse[1] += smoothing * (targetMouse[1] - currentMouse[1]);
        program.uniforms.uMouse.value[0] = currentMouse[0];
        program.uniforms.uMouse.value[1] = currentMouse[1];
      } else {
        program.uniforms.uMouse.value[0] = 0.5;
        program.uniforms.uMouse.value[1] = 0.5;
      }
      program.uniforms.iTime.value = t * 0.001;

      renderer.render({ scene: mesh });
      animationFrameId.current = requestAnimationFrame(update);
    }
    animationFrameId.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', debouncedResize);

      if (enableMouseInteraction) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [stableColor, amplitude, distance, enableMouseInteraction]);

  return <div ref={containerRef} className="w-full h-full relative" {...rest} />;
};

export default Threads;
