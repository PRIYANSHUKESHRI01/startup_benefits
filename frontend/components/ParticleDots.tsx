/**
 * Particle Dots Background Component
 * Premium animated particle effect for SaaS hero section
 */

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: 'emerald' | 'gray';
  duration: number;
  delay: number;
}

const ParticleDots: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Generate particles
    const particleCount = isMobile ? 20 : 40;
    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.4 ? 'emerald' : 'gray',
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, [isMobile]);

  // Track mouse for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  if (isMobile) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ perspective: '1000px' }}
    >
      {particles.map((particle) => {
        // Parallax effect
        const offsetX = (mousePos.x / window.innerWidth - 0.5) * 20;
        const offsetY = (mousePos.y / window.innerHeight - 0.5) * 20;

        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color === 'emerald' ? '#22C55E' : '#9CA3AF',
              boxShadow:
                particle.color === 'emerald'
                  ? `0 0 ${particle.size * 2}px rgba(34, 197, 94, 0.6)`
                  : `0 0 ${particle.size}px rgba(156, 163, 175, 0.4)`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [particle.opacity * 0.5, particle.opacity, particle.opacity * 0.5],
              x: [0, 10, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            initial={{
              x: offsetX,
              y: offsetY,
            }}
          />
        );
      })}
    </div>
  );
};

export default ParticleDots;
