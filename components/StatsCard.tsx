'use client';

import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  delay?: number;
}

export function StatsCard({ title, value, icon, color, delay = 0 }: StatsCardProps) {
  const colorClasses = {
    green: 'from-green-500/20 to-green-600/20 text-green-400 border-green-500/30',
    gray: 'from-gray-500/20 to-gray-600/20 text-gray-400 border-gray-500/30',
    blue: 'from-blue-500/20 to-blue-600/20 text-blue-400 border-blue-500/30',
    purple: 'from-purple-500/20 to-purple-600/20 text-purple-400 border-purple-500/30',
    yellow: 'from-yellow-500/20 to-yellow-600/20 text-yellow-400 border-yellow-500/30',
    red: 'from-red-500/20 to-red-600/20 text-red-400 border-red-500/30'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-4 border backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <motion.p
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold"
          >
            {value}
          </motion.p>
        </div>
        <span className="text-3xl opacity-50">{icon}</span>
      </div>
    </motion.div>
  );
}