
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { dealsAPI } from '@/lib/api';
import { Deal, CategoryType } from '@/lib/types';
import DealCard from '@/components/DealCard';
import { DealCardSkeletonGrid } from '@/components/LoaderSkeleton';
import AnimatedButton from '@/components/AnimatedButton';
import { AxiosError } from 'axios';

const containerAnim = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [categories, setCategories] = useState<string[]>([]);

  // FETCH FUNCTIONS

  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory !== 'all') params.category = selectedCategory;

      const res = await dealsAPI.getAll(params);
      setDeals(res?.data?.data?.deals || []);
    } catch (err) {
      const axiosErr = err as AxiosError<any>;
      setError(axiosErr.response?.data?.message || 'Failed to load deals');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const res = await dealsAPI.getCategories();
      const cats = res?.data?.data?.categories || [];
      setCategories(['all', ...cats]);
    } catch {
      setCategories(['all']);
    }
  };

  // EFFECTS
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchDeals();
    }, 350);

    return () => clearTimeout(timeout);
  }, [fetchDeals]);

  const hasFilters = useMemo(
    () => searchQuery.length > 0 || selectedCategory !== 'all',
    [searchQuery, selectedCategory]
  );

  // Featured deals logic
  const featuredDeals = useMemo(() => deals.slice(0, 3), [deals]);
  const otherDeals = useMemo(() => deals.slice(3), [deals]);

  return (
    <div className="min-h-screen bg-[#0B0F14] py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* HEADER */}
        <motion.div {...fadeUp} className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            Browse Deals
          </h1>
          <p className="text-lg text-gray-400">
            Discover exclusive SaaS offers for startups
          </p>
        </motion.div>

        {}
        <motion.div
          {...fadeUp}
          className="sticky top-4 z-20 bg-[#111827] rounded-xl px-4 py-2 mb-8 border border-white/5 flex flex-col md:flex-row gap-3 shadow-md shadow-black/30"
        >
          {}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search tools, partners, discounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0F14] text-white pl-11 pr-4 py-2 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500 text-base transition-all"
              style={{ minHeight: 44 }}
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as CategoryType)}
            className="bg-[#0B0F14] text-white px-5 py-2 rounded-xl border border-white/10 focus:ring-2 focus:ring-emerald-500 cursor-pointer text-base"
            style={{ minHeight: 44 }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </motion.div>
        {hasFilters && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-gray-500 text-sm">Filters:</span>
            {searchQuery && (
              <span className="px-3 py-1 bg-emerald-900/40 text-emerald-300 rounded-full text-sm">
                "{searchQuery}"
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="px-3 py-1 bg-emerald-900/40 text-emerald-300 rounded-full text-sm">
                {selectedCategory}
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-sm text-emerald-400 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-500/30 p-4 rounded text-red-400">
            {error}
          </div>
        )}

        {!loading && featuredDeals.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17.75L18.2 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.44 4.73L5.8 21z" /></svg>
              Featured Deals
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {featuredDeals.map((deal, idx) => (
                <DealCard key={deal._id} deal={deal} index={idx} featured />
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <DealCardSkeletonGrid count={8} />
        ) : otherDeals.length > 0 ? (
          <motion.div
            variants={containerAnim}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10"
          >
            {otherDeals.map((deal, index) => (
              <DealCard key={deal._id} deal={deal} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <svg className="w-20 h-20 mb-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <h3 className="text-2xl font-semibold text-white mb-2">
              No deals found
            </h3>
            <p className="text-gray-400 mb-6">
              We couldn't find any deals. Try clearing your filters or searching for something else!
            </p>
            {hasFilters && (
              <AnimatedButton
                variant="primary"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </AnimatedButton>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
