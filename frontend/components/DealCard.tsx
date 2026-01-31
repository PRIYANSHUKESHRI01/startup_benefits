'use client';

import React, { memo, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Deal } from '@/lib/types';

interface DealCardProps {
  deal: Deal;
  index?: number;
  featured?: boolean;
}

const categoryColors: Record<string, string> = {
  cloud: 'bg-blue-900/30 text-blue-300',
  marketing: 'bg-purple-900/30 text-purple-300',
  productivity: 'bg-green-900/30 text-green-300',
  analytics: 'bg-orange-900/30 text-orange-300',
  development: 'bg-indigo-900/30 text-indigo-300',
  design: 'bg-pink-900/30 text-pink-300',
};

const DealCard: React.FC<DealCardProps> = ({ deal, index = 0, featured }) => {
  const { user, isAuthenticated } = useAuth();
  // 3D tilt effect
  const cardRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 8; // max 8deg
    const rotateY = ((x - centerX) / centerX) * -8;
    card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.035,1.035,1)`;
  };
  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card) card.style.transform = '';
  };

  // Auth-aware lock logic
  const isLocked = deal.isLocked && !user?.isVerified;

  // CTA logic
  let ctaText = 'View Deal';
  if (!isAuthenticated) ctaText = 'Login to Unlock';
  else if (isLocked) ctaText = 'Verify to Unlock';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
    >
      <div className="relative h-full group">

        {/* CARD */}
        <div
          ref={cardRef}
          onMouseMove={deal.isLocked ? undefined : handleMouseMove}
          onMouseLeave={deal.isLocked ? undefined : handleMouseLeave}
          className={`relative h-full flex flex-col bg-[#111827] rounded-xl border border-white/5 p-5 transition-all duration-300
            ${deal.isLocked ? 'opacity-70 grayscale pointer-events-none' : 'hover:border-emerald-500/40 hover:shadow-emerald-500/20 hover:shadow-2xl'}
            ${!deal.isLocked ? 'hover:scale-[1.035] hover:z-10' : ''}
          `}
          style={{ willChange: 'transform, box-shadow' }}
        >

          {/* FEATURED BADGE */}
          {featured && (
            <span className="absolute top-3 left-3 text-xs px-3 py-1 rounded-full bg-emerald-600 text-white font-semibold">
              Featured
            </span>
          )}

          {/* LOCK BADGE */}
          {isLocked && (
            <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-black/60 text-emerald-300 border border-emerald-500/20">
              Locked
            </span>
          )}

          {/* HEADER */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-lg bg-[#0B0F14] flex items-center justify-center border border-white/10">
              <img
                src={deal.partnerLogo}
                alt={deal.partnerName}
                className="w-8 h-8 object-contain"
                loading="lazy"
              />
            </div>

            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                categoryColors[deal.category] || 'bg-gray-800 text-gray-300'
              }`}
            >
              {deal.category}
            </span>
          </div>

          {/* CONTENT */}
          <h3 className="text-white font-semibold mb-1 line-clamp-1">
            {deal.title}
          </h3>

          <p className="text-emerald-400 text-sm mb-2">
            {deal.partnerName}
          </p>

          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {deal.description}
          </p>

          {/* DISCOUNT */}
          <div className="mb-4">
            <span className="inline-block bg-emerald-900/40 text-emerald-300 px-4 py-1.5 rounded-lg text-sm font-semibold">
              {deal.discountValue}
            </span>
          </div>

          {/* CTA */}
          <div className="mt-auto">
            <Link href={isLocked ? '#' : `/deals/${deal._id}`} tabIndex={isLocked ? -1 : 0}>
              <motion.button
                whileTap={isLocked ? {} : { scale: 0.97 }}
                disabled={isLocked || !isAuthenticated}
                className={`w-full py-2.5 rounded-lg font-medium transition-all
                  ${isLocked || !isAuthenticated
                    ? 'bg-[#0B0F14] text-gray-500 cursor-not-allowed border border-white/10'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500'}
                `}
                style={isLocked || !isAuthenticated ? { pointerEvents: 'none' } : {}}
              >
                {ctaText}
              </motion.button>
            </Link>
          </div>

          {/* CLAIM INFO */}
          {deal.maxClaims && (
            <div className="mt-3 text-xs text-gray-500">
              {deal.currentClaims}/{deal.maxClaims} claimed
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default memo(DealCard);
