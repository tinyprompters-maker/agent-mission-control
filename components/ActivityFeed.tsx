'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { ActivityItem } from '@/types';

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-500/50 bg-green-500/10';
      case 'complete':
        return 'border-blue-500/50 bg-blue-500/10';
      case 'error':
        return 'border-red-500/50 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-500/10';
      default:
        return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'complete':
        return '✨';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4"
    >
      <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
        <span>📜</span>
        Activity Feed
        <span className="ml-auto text-xs text-gray-500">Live</span>
      </h3>
      
      <div className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <AnimatePresence mode="popLayout">
          {activities.map((item, idx) => (
            <motion.div
              key={`${item.time}-${idx}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              layout
              className={`text-sm border-l-2 pl-3 py-2 rounded-r-lg ${getTypeStyles(item.type)}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-500 text-xs font-mono">{item.time}</span>
                <span className="text-xs">{getTypeIcon(item.type)}</span>
              </div>
              <p className="text-gray-300 font-medium">{item.agent}</p>
              <p className="text-gray-400 text-xs leading-relaxed">{item.action}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {activities.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No recent activity
          </div>
        )}
      </div>
    </motion.div>
  );
}