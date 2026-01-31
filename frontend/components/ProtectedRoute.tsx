/**
 * Protected Route Component
 * HOC to protect routes requiring authentication
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PageLoader } from './LoaderSkeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerified?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireVerified = false,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (requireVerified && !user?.isVerified) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, requireVerified, user, router]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireVerified && !user?.isVerified) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;