/**
 * Three.js Hero Component
 * Optimized 3D visualization with subtle floating animation
 */

'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state: any) => {
    if (meshRef.current) {
      // Slow rotation
      meshRef.current.rotation.x += 0.0002;
      meshRef.current.rotation.y += 0.0003;
      
      // Subtle floating animation (y-axis only)
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} scale={1.8}>
      <icosahedronGeometry args={[1, 4]} />
      <meshPhongMaterial
        color={new THREE.Color().setHSL(0.55, 0.8, 0.6)}
        emissive={new THREE.Color().setHSL(0.55, 0.6, 0.4)}
        emissiveIntensity={0.3}
        shininess={100}
        wireframe={false}
      />
    </mesh>
  );
};

const ThreeHero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Disable Three.js on mobile for performance
  if (isMobile) {
    return null;
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 75 }}
      style={{ 
        background: 'transparent',
        width: '100%',
        height: '100%',
      }}
      dpr={Math.min(window.devicePixelRatio, 1.5)}
    >
      {/* Soft ambient light only */}
      <ambientLight intensity={0.6} color="#ffffff" />
      
      {/* Subtle directional light */}
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={0.4}
        color="#e0e7ff"
      />
      
      {/* Remove point light for cleaner look */}
      <AnimatedSphere />
    </Canvas>
  );
};

export default ThreeHero;