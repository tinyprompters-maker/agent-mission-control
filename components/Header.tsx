'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  totalCost: number;
  totalTokens: number;
}

export function Header({ totalCost, totalTokens }: HeaderProps) {
  const { logout } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/90 backdrop-blur-lg border-b border-gray-700 px-6 py-4 sticky top-0 z-50"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 10 }}
            className="text-3xl cursor-pointer"
          >
            🦞
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-white">Agent Mission Control</h1>
            <p className="text-sm text-gray-400">Big Bang Interactive</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:block text-right">
            <p className="text-xs text-gray-400">Total Cost Today</p>
            <motion.p
              key={totalCost}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-lg font-bold text-green-400"
            >
              ${totalCost.toFixed(3)}
            </motion.p>
          </div>
          
          <div className="hidden sm:block text-right">
            <p className="text-xs text-gray-400">Tokens Used</p>
            <motion.p
              key={totalTokens}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-lg font-bold text-blue-400"
            >
              {totalTokens.toLocaleString()}
            </motion.p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="bg-red-600/90 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}