/**
 * API Configuration
 * Axios instance with interceptors for authentication
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create axios instance
const api = axios.create({
  // Prefer explicit NEXT_PUBLIC_API_URL, otherwise use same-origin relative requests.
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - add JWT token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error && (error as any).response) {
      const status = (error as any).response?.status;
      // Handle 401 Unauthorized - token expired
      if (status === 401) {
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } catch (e) {}
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }

      if (status === 403) {
        console.error('Access forbidden');
      }

      if (status === 404) {
        console.error('Resource not found');
      }

      if (status === 500) {
        console.error('Server error occurred');
      }
    } else if (error && (error as any).request) {
      // Network error - no response received
      console.error('Network error - could not reach API');
    } else {
      console.error('Unexpected API error', error);
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/api/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  
  getMe: () => api.get('/api/auth/me'),
  
  verifyAccount: () => api.put('/api/auth/verify'),
};

export const dealsAPI = {
  getAll: (params?: {
    category?: string;
    search?: string;
    locked?: boolean;
    page?: number;
    limit?: number;
  }) => api.get('/api/deals', { params }),
  
  getById: (id: string) => api.get(`/api/deals/${id}`),
  
  // Use /api/deals/categories (backend exposes distinct categories here)
  getCategories: () => api.get('/api/deals/categories'),
  
  create: (data: any) => api.post('/api/deals', data),
  
  update: (id: string, data: any) => api.put(`/api/deals/${id}`, data),
  
  delete: (id: string) => api.delete(`/api/deals/${id}`),
};

export const claimsAPI = {
  claimDeal: (dealId: string) => api.post(`/api/claims/${dealId}`),
  
  getMyClaims: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/api/claims/my', { params }),
  
  getById: (id: string) => api.get(`/api/claims/${id}`),
  
  approve: (id: string, claimCode?: string) =>
    api.put(`/api/claims/${id}/approve`, { claimCode }),
  
  reject: (id: string, reason?: string) =>
    api.put(`/api/claims/${id}/reject`, { reason }),
  
  getAll: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/api/claims/all', { params }),
};

export default api;