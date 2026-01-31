/**
 * Skeleton Loader Components
 * Loading placeholders for various content types
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const DealCardSkeleton = () => {
  return (
    <div className="bg-[#111827] rounded-xl border border-white/5 p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-11 w-11 bg-[#0B0F14] rounded-lg" />
        <div className="h-5 w-20 bg-[#0B0F14] rounded-full" />
      </div>

      <div className="h-5 w-3/4 bg-[#0B0F14] rounded mb-2" />
      <div className="h-4 w-1/2 bg-[#0B0F14] rounded mb-3" />

      <div className="h-4 w-full bg-[#0B0F14] rounded mb-4" />

      <div className="h-7 w-32 bg-[#0B0F14] rounded mb-4" />

      <div className="h-10 w-full bg-[#0B0F14] rounded" />
    </div>
  );
};


export const DealCardSkeletonGrid = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10">
      {Array.from({ length: count }).map((_, i) => (
        <DealCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const ClaimCardSkeleton = () => {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 space-y-3">
          <div className="skeleton h-6 w-48 rounded" />
          <div className="skeleton h-5 w-32 rounded" />
        </div>
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
      </div>
      <div className="flex items-center justify-between">
        <div className="skeleton h-4 w-32 rounded" />
        <div className="skeleton h-9 w-24 rounded-lg" />
      </div>
    </div>
  );
};

export const ProfileCardSkeleton = () => {
  return (
    <div className="card">
      <div className="flex items-center space-x-4 mb-4">
        <div className="skeleton h-16 w-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-6 w-40 rounded" />
          <div className="skeleton h-4 w-56 rounded" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
      </div>
    </div>
  );
};

export const PageLoader = () => {
  return (
    <motion.div
      className="flex items-center justify-center min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">
        <div className="spinner mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </motion.div>
  );
};

export const InlineLoader = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="spinner" />
    </div>
  );
};

export const ButtonLoader = () => {
  return (
    <svg
      className="animate-spin h-5 w-5 mx-auto"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

export default DealCardSkeleton;