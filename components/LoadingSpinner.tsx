'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export function LoadingSpinner({ size = 'md', fullScreen = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };

  const container = fullScreen ? 'min-h-screen' : 'h-full';

  return (
    <div className={`${container} bg-gray-900 flex flex-col items-center justify-center`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizeClasses[size]} border-4 border-gray-700 border-t-blue-500 rounded-full`}
      />
      {fullScreen && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-gray-400"
        >
          Loading...
        </motion.p>
      )}
    </div>
  );
}