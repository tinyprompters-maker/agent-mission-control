'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      router.push('/login');
    } else if (!requireAuth && isAuthenticated && pathname === '/login') {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, requireAuth, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}