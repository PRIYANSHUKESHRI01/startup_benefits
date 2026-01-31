/**
 * Navbar Component
 * Main navigation with authentication state and responsive design
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '/deals', label: 'Browse Deals' },
    ...(isAuthenticated ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav 
      className="glass-morphism sticky top-0 z-50 border-b border-emerald-500/20 transition-all duration-300"
      style={{
        backdropFilter: hasScrolled ? 'blur(16px)' : 'blur(12px)',
        WebkitBackdropFilter: hasScrolled ? 'blur(16px)' : 'blur(12px)',
      }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              className="text-2xl font-bold text-gradient"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              StartupBenefits
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-emerald-500'
                    : 'text-gray-400 hover:text-emerald-400'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500"
                    layoutId="navbar-indicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center gap-2 bg-[#111827] px-3 py-1 rounded-full border border-emerald-500/40 hover:shadow-emerald-500/30 transition group">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center text-black font-semibold ring-2 ring-emerald-400 group-hover:ring-4 transition">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-white font-medium">{user?.name}</span>
                  {user?.isVerified && (
                    <span className="flex items-center gap-1 bg-emerald-900/40 text-emerald-400 px-2 py-0.5 rounded-full text-xs">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Verified
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    isActive('/login') ? 'text-emerald-500' : 'text-gray-400 hover:text-emerald-400'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/register') ? 'text-emerald-500' : 'text-gray-400 hover:text-emerald-400'
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-zinc-800/80 text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-emerald-500/20 py-4"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 text-sm font-medium ${
                    isActive(link.href)
                      ? 'text-emerald-500 bg-emerald-500/10'
                      : 'text-gray-400 hover:text-emerald-400'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 border-t border-emerald-500/20 mt-2 pt-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black font-semibold">
                        {user?.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user?.name}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="px-4 py-2 space-y-2 border-t border-emerald-500/20 mt-2 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block w-full px-4 py-2 text-sm font-medium text-center rounded-lg border border-zinc-700 ${
                      isActive('/login') ? 'text-emerald-500' : 'text-gray-400 hover:text-emerald-400 hover:border-emerald-400'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block w-full px-4 py-2 text-sm font-medium text-center rounded-lg ${
                      isActive('/register') ? 'text-emerald-500' : 'text-gray-400 hover:text-emerald-400'
                    }`}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;