/**
 * Animated Button Component
 * Unified button system with Framer Motion animations and premium interactions
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  fullWidth?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
  fullWidth = false,
}) => {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden';
  
  const variantClasses = {
    primary: 'bg-emerald-500 text-black hover:bg-emerald-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'bg-zinc-900/50 text-emerald-400 hover:bg-zinc-800/50 border border-emerald-500/30 hover:border-emerald-500/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
    outline: 'border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      whileHover={!disabled ? { y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
    >
      <motion.span
        className="relative z-10 flex items-center justify-center"
        initial={{ y: 0 }}
        whileHover={!disabled ? { y: -1 } : {}}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
      
      {/* Glow effect for primary button */}
      {variant === 'primary' && !disabled && (
        <motion.div
          className="absolute inset-0 bg-emerald-400/20 rounded-lg"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Ripple effect on click */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 bg-white/10 opacity-0"
          whileTap={{
            opacity: [0, 0.4, 0],
            scale: [0, 1.5],
          }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.button>
  );
};

export default AnimatedButton;