"use client";

import React, { useEffect, useRef } from 'react';

const AuthStarfield: React.FC<{ disabledOnMobile?: boolean }> = ({ disabledOnMobile = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.innerWidth < 480;
    if (disabledOnMobile && isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let parent = canvas.parentElement as HTMLElement | null;
    if (!parent) return;
    parent.style.position = parent.style.position || 'relative';

    let w = (canvas.width = parent.clientWidth);
    let h = (canvas.height = parent.clientHeight);

    const stars = Array.from({ length: Math.max(8, Math.floor(w / 60)) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.6 + 0.1,
      twinkle: Math.random() * 0.03 + 0.02,
    }));

    const resize = () => {
      w = canvas.width = parent!.clientWidth;
      h = canvas.height = parent!.clientHeight;
    };
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.alpha += Math.sin(Date.now() * s.twinkle) * 0.005;
        if (s.alpha > 1) s.alpha = 1;
        if (s.alpha < 0.05) s.alpha = 0.05;
        ctx.beginPath();
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 6);
        g.addColorStop(0, `rgba(255,255,255,${s.alpha})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g as unknown as string;
        ctx.fillRect(s.x - s.r * 4, s.y - s.r * 4, s.r * 8, s.r * 8);
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [disabledOnMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.08 }}
    />
  );
};

export default AuthStarfield;
