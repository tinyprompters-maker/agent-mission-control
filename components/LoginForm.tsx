'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginFormProps {
  onSubmit: (password: string) => Promise<boolean>;
  error: string | null;
  isLoading: boolean;
}

export function LoginForm({ onSubmit, error, isLoading }: LoginFormProps) {
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!password.trim()) {
      setLocalError('Password is required');
      return;
    }

    const success = await onSubmit(password);
    if (!success) {
      setPassword('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800/90 backdrop-blur-lg p-8 rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg"
        >
          <span className="text-4xl">🦞</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-white mb-1"
        >
          Agent Mission Control
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 text-sm"
        >
          Big Bang Interactive
        </motion.p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label 
            htmlFor="password" 
            className="block text-gray-300 text-sm font-medium mb-2"
          >
            Password
          </label>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your password..."
              autoFocus
              autoComplete="current-password"
              aria-invalid={!!(error || localError)}
              aria-describedby={(error || localError) ? 'error-message' : undefined}
            />
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {(error || localError) && (
            <motion.div
              id="error-message"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3"
              role="alert"
            >
              <p className="text-red-400 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error || localError}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Authenticating...
            </>
          ) : (
            'Sign In'
          )}
        </motion.button>
      </form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-gray-500 text-xs text-center mt-6 flex items-center justify-center gap-1"
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        Secure Server-Side Authentication
      </motion.p>
    </motion.div>
  );
}