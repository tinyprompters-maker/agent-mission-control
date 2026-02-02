'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthState, User } from '@/types';

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
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/verify', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setState({
            isAuthenticated: true,
            user: data.user,
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

    checkAuth();
  }, []);

  const login = useCallback(async (password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok) {
        // Verify the token was set
        const verifyResponse = await fetch('/api/verify', {
          method: 'GET',
          credentials: 'include'
        });

        if (verifyResponse.ok) {
          const userData = await verifyResponse.json();
          setState({
            isAuthenticated: true,
            user: userData.user,
            isLoading: false,
            error: null
          });
          return true;
        }
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: data.error || 'Login failed'
      }));
      return false;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Network error. Please try again.'
      }));
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
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