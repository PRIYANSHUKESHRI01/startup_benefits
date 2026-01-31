
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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users away from login
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFormLoading(true);

    try {
      await login(email, password);
      router.push('/deals');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
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
          <h1 className="text-4xl font-bold text-white mb-3">Welcome Back</h1>
          <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full mb-4" />
          <p className="text-gray-400">Sign in to access your dashboard</p>
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
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
                <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
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
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300"
                  placeholder="••••••••"
                  disabled={isLoading}
                  minLength={6}
                />
                <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </motion.div>

            {/* Sign In Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <AnimatedButton
                type="submit"
                variant="primary"
                fullWidth
                disabled={formLoading}
              >
                {formLoading ? <ButtonLoader /> : 'Sign In'}
              </AnimatedButton>
            </motion.div>
          </form>

          {/* Divider */}
          {/* Sign Up Link */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-zinc-700" />
            <span className="px-3 text-gray-500 text-xs">OR</span>
            <div className="flex-1 border-t border-zinc-700" />
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Create one
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