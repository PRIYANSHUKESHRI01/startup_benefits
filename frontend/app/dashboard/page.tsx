
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { claimsAPI } from '@/lib/api';
import { Claim } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AnimatedButton from '@/components/AnimatedButton';
import { ClaimCardSkeleton, ProfileCardSkeleton, ButtonLoader } from '@/components/LoaderSkeleton';
import { AxiosError } from 'axios';

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

function DashboardContent() {
  const searchParams = useSearchParams();
  const { user, verifyAccount } = useAuth();

  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  // Optimistic claim row
  const optimisticDealId = searchParams.get('optimisticDealId');
  const optimisticDealTitle = searchParams.get('optimisticDealTitle');
  const optimisticStatus = searchParams.get('optimisticStatus');
  const optimisticDate = searchParams.get('optimisticDate');

  useEffect(() => {
    const loadClaims = async () => {
      try {
        const res = await claimsAPI.getMyClaims();
        setClaims(res.data.data.claims || []);
      } catch (err) {
        const axiosErr = err as AxiosError<any>;
        setError(axiosErr.response?.data?.message || 'Failed to load claims');
      } finally {
        setLoading(false);
      }
    };

    // If redirected from claim, force reload
    if (searchParams.get('refresh')) {
      setLoading(true);
      setTimeout(loadClaims, 400); // allow for backend propagation
    } else {
      loadClaims();
    }
  }, [searchParams]);

  const handleVerify = async () => {
    try {
      setVerifying(true);
      await verifyAccount();
    } catch {
      setError('Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const stats = [
    {
      label: 'Total Claims',
      value: claims.length,
      color: 'text-blue-400',
    },
    {
      label: 'Pending',
      value: claims.filter((c) => c.status === 'pending').length,
      color: 'text-yellow-400',
    },
    {
      label: 'Approved',
      value: claims.filter((c) => c.status === 'approved').length,
      color: 'text-emerald-400',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F14] py-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <motion.div {...fadeIn} className="mb-8">
          <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your profile and claimed benefits
          </p>
        </motion.div>

        {/* TOP GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">

          {/* PROFILE CARD */}
          <motion.div {...fadeIn}>
            {loading ? (
              <ProfileCardSkeleton />
            ) : (
              <div className="bg-[#111827] rounded-xl p-5 border border-white/5">

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-linear-to-tr from-emerald-500 to-green-600 flex items-center justify-center text-black font-bold text-lg">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="text-white font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">Account Status</span>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      user?.isVerified
                        ? 'bg-emerald-900/40 text-emerald-400'
                        : 'bg-yellow-900/40 text-yellow-300'
                    }`}
                  >
                    {user?.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>

                {!user?.isVerified && (
                  <AnimatedButton
                    variant="primary"
                    fullWidth
                    disabled={verifying}
                    onClick={handleVerify}
                  >
                    {verifying ? <ButtonLoader /> : 'Verify Account'}
                  </AnimatedButton>
                )}
              </div>
            )}
          </motion.div>

          {/* KPI ROW */}
          <motion.div
            {...fadeIn}
            className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {stats.map((item) => (
              <div
                key={item.label}
                className="bg-[#111827] rounded-xl p-5 border border-white/5 hover:border-emerald-500/30 transition"
              >
                <p className="text-gray-400 text-sm mb-1">{item.label}</p>
                <p className={`text-3xl font-semibold ${item.color}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* CLAIMS SECTION */}
        <motion.div {...fadeIn} className="bg-[#111827] rounded-xl p-6 border border-white/5">

          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-white">
              Your Claims
            </h2>

            <Link href="/deals">
              <AnimatedButton variant="secondary">
                Browse Deals
              </AnimatedButton>
            </Link>
          </div>

          {error && (
            <div className="mb-4 text-red-400 bg-red-900/20 border border-red-500/20 p-3 rounded">
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <ClaimCardSkeleton key={i} />
              ))}
            </div>
          ) : claims.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 mb-5">
                You haven't claimed any deals yet
              </p>
              <Link href="/deals">
                <AnimatedButton variant="primary">
                  Explore Deals
                </AnimatedButton>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="py-3 text-left text-gray-400">Deal</th>
                    <th className="py-3 text-left text-gray-400">Status</th>
                    <th className="py-3 text-left text-gray-400">Date</th>
                    <th className="py-3 text-left text-gray-400">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {/* Optimistic claim row if redirected from claim */}
                  {optimisticDealId && (
                    <motion.tr
                      key={optimisticDealId}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="border-b border-white/5 hover:bg-[#0B0F14] bg-emerald-900/10"
                    >
                      <td className="py-3 text-white">
                        {optimisticDealTitle || 'Deal'}
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold capitalize tracking-wide bg-yellow-900/40 text-yellow-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" /></svg>
                          pending
                        </span>
                      </td>
                      <td className="py-3 text-gray-400">
                        {optimisticDate ? new Date(optimisticDate).toLocaleDateString() : ''}
                      </td>
                      <td className="py-3">
                        <span className="text-emerald-400">Processing...</span>
                      </td>
                    </motion.tr>
                  )}
                  {claims.map((claim) => {
                    const deal =
                      typeof claim.dealId === 'object'
                        ? claim.dealId
                        : null;

                    return (
                      <motion.tr
                        key={claim._id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="border-b border-white/5 hover:bg-[#0B0F14]"
                      >
                        <td className="py-3 text-white">
                          {deal?.title || 'Deal'}
                        </td>

                        <td className="py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold capitalize tracking-wide
                              ${claim.status === 'approved'
                                ? 'bg-emerald-900/40 text-emerald-400'
                                : claim.status === 'pending'
                                ? 'bg-yellow-900/40 text-yellow-300'
                                : 'bg-red-900/40 text-red-400'}
                            `}
                            aria-label={`Claim status: ${claim.status}`}
                          >
                            {claim.status === 'approved' && (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            )}
                            {claim.status === 'pending' && (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" /></svg>
                            )}
                            {claim.status === 'rejected' && (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            )}
                            {claim.status}
                          </span>
                        </td>

                        <td className="py-3 text-gray-400">
                          {new Date(claim.claimedAt).toLocaleDateString()}
                        </td>

                        <td className="py-3">
                          {deal && (
                            <Link
                              href={`/deals/${deal._id}`}
                              className="text-emerald-400 hover:underline"
                            >
                              View
                            </Link>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
