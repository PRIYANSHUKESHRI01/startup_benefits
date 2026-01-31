
'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import AnimatedButton from '@/components/AnimatedButton';

const ThreeHero = dynamic(() => import('@/components/ThreeHero'), {
  ssr: false,
  loading: () => null,
});

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const subtitleVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.4, duration: 0.8 },
  },
};

const buttonVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.6, duration: 0.6 },
  },
  hover: {
    scale: 1.05,
    boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)',
  },
};

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  return (
    <div className="overflow-hidden min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Three.js Canvas - Background Layer */}
        <div 
          className="absolute inset-0 z-5 w-full h-full pointer-events-none opacity-10"
          style={{ filter: 'blur(3px)' }}
        >
          <Suspense fallback={null}>
            <ThreeHero />
          </Suspense>
        </div>

        {/* Content Layer */}
        <div className="container-custom relative z-20 w-full">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial="initial"
              animate="animate"
              className="space-y-6"
            >
              <motion.h1 
                className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight"
                variants={{
                  initial: { opacity: 0, y: 30 },
                  animate: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.8,
                      ease: [0.34, 1.56, 0.64, 1],
                    },
                  },
                }}
              >
                Unlock Exclusive{' '}
                <span className="text-gradient">Startup Benefits</span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-gray-400 mb-8"
                variants={subtitleVariants}
              >
                Access premium tools, exclusive deals, and partnerships designed to
                accelerate your startup's growth.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                variants={buttonVariants}
                initial="initial"
                animate="animate"
              >
                <Link href="/deals">
                  <AnimatedButton variant="primary">
                    <span className="flex items-center gap-2">
                      Browse Deals
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </AnimatedButton>
                </Link>
                <AnimatedButton
                  variant="outline"
                  onClick={() => {
                    if (isAuthenticated) router.push('/dashboard');
                    else router.push('/register');
                  }}
                >
                  Get Started Free
                </AnimatedButton>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-16 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-emerald-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-emerald-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Instant access
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg
            className="w-6 h-6 text-emerald-500/50"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#0B0F14]">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose StartupBenefits?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to save money and scale faster
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                icon: '🚀',
                title: 'Exclusive Partnerships',
                description:
                  'Access deals from top SaaS providers, cloud platforms, and development tools.',
              },
              {
                icon: '💰',
                title: 'Massive Savings',
                description:
                  'Save thousands on tools you need. Up to $500k in credits and discounts.',
              },
              {
                icon: '⚡',
                title: 'Instant Access',
                description:
                  'Claim deals instantly. No lengthy approval processes or waiting periods.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="card card-hover text-center border border-emerald-500/20 transition-all duration-300"
                style={{
                  boxShadow: '0 0 20px rgba(34, 197, 94, 0)',
                }}
                variants={fadeInUp}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 40px rgba(34, 197, 94, 0.2)',
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-[#0B0F14] border-t border-emerald-500/10">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Explore Categories
            </h2>
            <p className="text-xl text-gray-400">
              Find deals across multiple categories
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {['Cloud', 'Marketing', 'Productivity', 'Analytics', 'Development', 'Design'].map(
              (category, i) => (
                <motion.div
                  key={i}
                  className="bg-[#0B0F14] border border-emerald-500/20 p-6 rounded-xl text-center cursor-pointer transition-all duration-300"
                  style={{
                    boxShadow: '0 0 20px rgba(34, 197, 94, 0)',
                  }}
                  variants={fadeInUp}
                  whileHover={{ 
                    y: -5,
                    boxShadow: '0 0 30px rgba(34, 197, 94, 0.3)',
                    borderColor: 'rgba(34, 197, 94, 1)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <div className="text-3xl mb-2">
                    {['☁️', '📈', '✅', '📊', '💻', '🎨'][i]}
                  </div>
                  <p className="font-semibold text-white">{category}</p>
                </motion.div>
              )
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0B0F14] border-t border-emerald-500/30">
        <div className="container-custom text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Save Thousands?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of startups already benefiting
            </p>
            <AnimatedButton
              variant="primary"
              onClick={() => {
                if (isAuthenticated) router.push('/dashboard');
                else router.push('/register');
              }}
            >
              Get Started Now
            </AnimatedButton>
          </motion.div>
        </div>
      </section>
    </div>
  );
}