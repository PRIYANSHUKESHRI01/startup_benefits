// AnimationProvider.tsx
'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function AnimationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.35, ease: [0.4, 0.0, 0.2, 1] }}
        className="min-h-screen flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
