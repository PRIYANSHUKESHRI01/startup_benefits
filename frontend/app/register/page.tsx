
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import AnimatedButton from '@/components/AnimatedButton';
import AuthStarfield from '@/components/AuthStarfield';
import { ButtonLoader } from '@/components/LoaderSkeleton';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const { register, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users away from register
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setFormLoading(true);

    try {
      await register(name, email, password);
      router.push('/deals');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <motion.div
        className="max-w-md w-full relative z-10"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-4xl font-bold text-white mb-3">Create Account</h1>
          <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full mb-4" />
          <p className="text-gray-400">Join thousands of startups saving money</p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          className="bg-[#0B0F14] rounded-2xl p-8 border border-emerald-500/20 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            boxShadow: '0 0 40px rgba(34, 197, 94, 0.1)',
          }}
        >
          <AuthStarfield />
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            {/* Name Input */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300"
                placeholder="John Doe"
                disabled={formLoading}
                minLength={2}
              />
            </motion.div>

            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300"
                placeholder="you@example.com"
                disabled={formLoading}
              />
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300"
                placeholder="••••••••"
                disabled={formLoading}
                minLength={6}
              />
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 6 characters
              </p>
            </motion.div>

            {/* Confirm Password Input */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300"
                placeholder="••••••••"
                disabled={formLoading}
                minLength={6}
              />
            </motion.div>

            {/* Create Account Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-2"
            >
              <AnimatedButton
                type="submit"
                variant="primary"
                fullWidth
                disabled={isLoading}
              >
                {formLoading ? <ButtonLoader /> : 'Create Account'}
              </AnimatedButton>
            </motion.div>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-zinc-700" />
            <span className="px-3 text-gray-500 text-xs">OR</span>
            <div className="flex-1 border-t border-zinc-700" />
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/" className="text-sm text-gray-500 hover:text-emerald-400 transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}