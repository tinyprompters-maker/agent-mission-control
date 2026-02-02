'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthState, User } from '@/types';

const AUTH_KEY = 'amc_auth';
const MOCK_PASSWORD = 'mission-control-2024';

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null
  });

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const stored = localStorage.getItem(AUTH_KEY);
        if (stored) {
          const user: User = { sub: 'admin', role: 'admin' };
          setState({
            isAuthenticated: true,
            user,
            isLoading: false,
            error: null
          });
        } else {
          setState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        setState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: 'Failed to check authentication'
        });
      }
    };

    // Small delay to prevent flash
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  const login = useCallback(async (password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (password === MOCK_PASSWORD) {
      try {
        localStorage.setItem(AUTH_KEY, 'true');
        const user: User = { sub: 'admin', role: 'admin' };
        setState({
          isAuthenticated: true,
          user,
          isLoading: false,
          error: null
        });
        return true;
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to save session'
        }));
        return false;
      }
    }

    setState(prev => ({
      ...prev,
      isLoading: false,
      error: 'Invalid password'
    }));
    return false;
  }, []);

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      });
      router.push('/login');
    }
  }, [router]);

  return {
    ...state,
    login,
    logout
  };
}
