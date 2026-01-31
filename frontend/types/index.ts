/**
 * Type Definitions
 * TypeScript interfaces and types for the application
 */

export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Deal {
  _id: string;
  id?: string;
  title: string;
  description: string;
  category: 'cloud' | 'marketing' | 'productivity' | 'analytics' | 'development' | 'design';
  partnerName: string;
  partnerLogo?: string;
  discountValue: string;
  eligibilityRules: string[];
  isLocked: boolean;
  expiryDate?: string;
  websiteUrl?: string;
  claimInstructions?: string;
  maxClaims?: number;
  currentClaims: number;
  isExpired?: boolean;
  isMaxedOut?: boolean;
  isClaimable?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Claim {
  _id: string;
  id?: string;
  userId: string | User;
  dealId: string | Deal;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  claimedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  notes?: string;
  claimCode?: string;
  daysSinceClaim?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyAccount: () => Promise<void>;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  results?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ErrorResponse {
  status: 'error';
  message: string;
  errors?: string[];
}

export type CategoryType = 'all' | 'cloud' | 'marketing' | 'productivity' | 'analytics' | 'development' | 'design';

export type StatusType = 'all' | 'pending' | 'approved' | 'rejected' | 'expired';