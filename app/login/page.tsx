'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/LoginForm';
import { AuthGuard } from '@/components/AuthGuard';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <LoginForm onSubmit={login} error={error} isLoading={isLoading} />
      </div>
    </AuthGuard>
  );
}