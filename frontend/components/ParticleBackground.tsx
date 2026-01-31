"use client";

import React, { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  hue: number;
};

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const fpsCapRef = useRef(40); // cap to ~40 FPS
  const hiddenRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Performance checks
    const prefersReduced = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const lowPerf = (navigator as any)?.deviceMemory && (navigator as any).deviceMemory <= 1;
    if (prefersReduced || lowPerf) return; // disable heavy animation

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Styling: fixed, full-screen, behind content
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '1';

    const DPR = Math.min(window.devicePixelRatio || 1, 1.5); // low DPI scaling

    const resize = () => {
      const w = Math.max(1, Math.floor(window.innerWidth));
      const h = Math.max(1, Math.floor(window.innerHeight));
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      if (ctx) ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      initParticles();
    };

    // Particle init according to density rules
    const initParticles = () => {
      const maxCount = isMobile() ? 25 : 60;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const count = Math.min(Math.max(Math.floor((w * h) / (1920 * 1080) * maxCount), 8), maxCount);
      const arr: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const size = 1 + Math.random() * 1.5; // 1 - 2.5
        const alpha = 0.15 + Math.random() * 0.2; // 0.15 - 0.35
        // Color mix: 80% white, 20% green hue tweak
        const hue = Math.random() < 0.2 ? 140 + Math.random() * 20 : 0; // subtle greenish or white
        arr.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.12,
          vy: 0.05 + Math.random() * 0.25, // slow vertical drift
          size,
          alpha,
          hue,
        });
      }
      particlesRef.current = arr;
    };

    // Movement using delta-time and smooth easing
    const updateAndDraw = (t: number) => {
      if (hiddenRef.current) {
        lastTimeRef.current = t;
        rafRef.current = requestAnimationFrame(updateAndDraw);
        return;
      }

      const last = lastTimeRef.current ?? t;
      const dt = Math.min(100, t - last);
      const step = dt / 16.6667; // relative to 60fps

      // FPS cap: skip frames if running too fast
      const msPerFrame = 1000 / fpsCapRef.current;
      if (dt < msPerFrame) {
        rafRef.current = requestAnimationFrame(updateAndDraw);
        return;
      }

      lastTimeRef.current = t;

      const ctxLocal = ctx;
      const w = canvas.width / DPR;
      const h = canvas.height / DPR;

      // clear with flat dark base (transparent so underlying body bg shows)
      ctxLocal.clearRect(0, 0, w, h);

      // draw each particle as soft circle using radial gradient
      for (const p of particlesRef.current) {
        // update
        // Smooth horizontal noise, small sinusoidal wobble to avoid jitter
        p.x += p.vx * step + Math.sin((t + p.x) * 0.0005) * 0.02;
        p.y += p.vy * step;

        // wrap vertically and horizontally softly
        if (p.y - p.size > h) p.y = -p.size;
        if (p.x - p.size > w) p.x = -p.size;
        if (p.x + p.size < 0) p.x = w + p.size;

        const grad = ctxLocal.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        const colorAlpha = p.alpha;
        if (p.hue === 0) {
          grad.addColorStop(0, `rgba(255,255,255,${colorAlpha})`);
        } else {
          // subtle green accent
          grad.addColorStop(0, `rgba(196,255,218,${colorAlpha * 0.9})`);
        }
        grad.addColorStop(1, `rgba(255,255,255,0)`);

        ctxLocal.globalCompositeOperation = 'screen';
        ctxLocal.fillStyle = grad as unknown as string;
        ctxLocal.beginPath();
        // draw a small rect covered by gradient for performance instead of arc
        const s = Math.max(1, p.size * 2);
        ctxLocal.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      }

      rafRef.current = requestAnimationFrame(updateAndDraw);
    };

    const handleVisibility = () => {
      hiddenRef.current = document.hidden;
      if (!hiddenRef.current) {
        lastTimeRef.current = performance.now();
      }
    };

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibility);

    resize();
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(updateAndDraw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // render only canvas; it will be fixed and behind content
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none"
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
    />
  );
}

