
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { dealsAPI, claimsAPI } from '@/lib/api';
import { Deal } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { PageLoader, ButtonLoader } from '@/components/LoaderSkeleton';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

export default function DealDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDeal() {
      try {
        const res = await dealsAPI.getById(id as string);
        setDeal(res.data.data.deal);
      } catch (err) {
        const axiosErr = err as AxiosError<any>;
        setError(axiosErr.response?.data?.message || 'Failed to load deal');
      } finally {
        setLoading(false);
      }
    }

    fetchDeal();
  }, [id]);

  const handleClaim = async () => {
    setError('');

    if (!isAuthenticated) {
      return router.push('/login');
    }

    if (!deal) return setError('Deal not found');

    // Preconditions
    if (deal.expiryDate && new Date() > new Date(deal.expiryDate)) {
      return setError('This deal has expired');
    }

    if (deal.isLocked && !user?.isVerified) {
      return setError('Please verify your account to unlock this deal');
    }

    if (deal.maxClaims && deal.currentClaims >= deal.maxClaims) {
      return setError('Max claims reached for this deal');
    }

    try {
      setClaiming(true);
      await claimsAPI.claimDeal(id as string);

      toast.success('Deal claimed! Redirecting to dashboard...');

      setTimeout(() => {
        router.push(`/dashboard?refresh=1&optimisticDealId=${deal._id}&optimisticDealTitle=${encodeURIComponent(deal.title)}&optimisticStatus=pending&optimisticDate=${encodeURIComponent(new Date().toISOString())}`);
      }, 1200);
    } catch (err) {
      const axiosErr = err as AxiosError<any>;
      setError(axiosErr.response?.data?.message || 'Claim failed');
      toast.error(axiosErr.response?.data?.message || 'Claim failed');
    } finally {
      setClaiming(false);
    }
  };


  const isExpired = deal?.expiryDate
    ? new Date() > new Date(deal.expiryDate)
    : false;

  const isLocked = Boolean(deal?.isLocked && !user?.isVerified);

  const notExpired = !isExpired;
  const notLockedOrVerified = !deal?.isLocked || Boolean(user?.isVerified);
  const underLimit = !deal?.maxClaims || (deal && deal.currentClaims < deal.maxClaims);

  const canClaim = Boolean(notExpired && notLockedOrVerified && underLimit);

  const progress = useMemo(() => {
    if (!deal?.maxClaims) return 0;
    return Math.min(
      100,
      Math.round((deal.currentClaims / deal.maxClaims) * 100)
    );
  }, [deal]);

  const progressColor =
    progress >= 90
      ? 'bg-yellow-400'
      : isExpired
      ? 'bg-red-500'
      : 'bg-emerald-500';

  // ================= UI =================

  if (loading) return <PageLoader />;

  if (!deal)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F14]">
        <p className="text-white">Deal not found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0F14] to-[#111827] py-10">
      <div className="max-w-6xl mx-auto px-4">

        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-6">
          <Link href="/deals" className="hover:text-emerald-400">
            Browse Deals
          </Link>{' '}
          / <span className="capitalize">{deal.category}</span> /{' '}
          <span className="text-white">{deal.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            {/* Back Button */}
            <div className="sticky top-0 z-30 mb-4 -ml-1">
              <Link
                href="/deals"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium w-max px-1 py-1 rounded transition hover:underline hover:shadow-emerald-400/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Back to Deals
              </Link>
            </div>

            {/* Header */}
            <div className="flex items-center gap-4 mb-5">
              <img
                src={deal.partnerLogo}
                alt={deal.partnerName}
                className="w-14 h-14 object-contain bg-[#111827] p-2 rounded-xl border border-white/10"
              />

              <span className="px-3 py-1 bg-emerald-900/40 text-emerald-300 rounded-full text-sm">
                {deal.category}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">
              {deal.title}
            </h1>

            <p className="text-gray-400 mb-6">
              {deal.partnerName}
            </p>

            {/* Description */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
              <h3 className="text-white font-semibold mb-3">About this deal</h3>
              <p className="text-gray-400 leading-relaxed">
                {deal.description}
              </p>
            </div>
          </motion.div>

          {/* RIGHT CARD */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full lg:w-[360px] lg:sticky top-24"
          >
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md shadow-xl">

              {/* Discount */}
              <div className="text-center mb-5">
                <div className="inline-block bg-gradient-to-r from-emerald-500 to-emerald-400 text-white px-5 py-2 rounded-lg font-bold text-lg">
                  {deal.discountValue}
                </div>
              </div>

              {/* Progress */}
              {deal.maxClaims && (
                <>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Claimed</span>
                    <span>{progress}%</span>
                  </div>

                  <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className={`h-full ${progressColor}`}
                    />
                  </div>
                </>
              )}

              {/* Expiry */}
              {deal.expiryDate && (
                <p className="text-xs text-gray-400 mb-4">
                  Expires on:{' '}
                  {new Date(deal.expiryDate).toLocaleDateString()}
                </p>
              )}

              {/* Error */}
              {error && (
                <div className="text-red-400 text-sm mb-3">
                  {error}
                </div>
              )}

              {/* CTA */}
              <button
                onClick={handleClaim}
                disabled={!canClaim || claiming}
                className={`w-full py-3 rounded-lg font-semibold transition-all
                  ${isLocked
                    ? 'bg-emerald-900/40 text-emerald-300 cursor-not-allowed'
                    : isExpired
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-white'}
                `}
              >
                {claiming ? (
                  <ButtonLoader />
                ) : isExpired ? (
                  'Deal Expired'
                ) : (
                  'Claim Deal'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
