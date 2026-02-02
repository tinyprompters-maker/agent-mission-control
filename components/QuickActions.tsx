'use client';

import { motion } from 'framer-motion';

interface QuickActionsProps {
  onAction?: (action: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const actions = [
    { id: 'spawn', label: 'Spawn New Agent', icon: '⚡', color: 'bg-blue-600 hover:bg-blue-700', description: 'Create a new agent instance' },
    { id: 'tasks', label: 'View All Tasks', icon: '📋', color: 'bg-green-600 hover:bg-green-700', description: 'See running and queued tasks' },
    { id: 'report', label: 'Generate Report', icon: '📊', color: 'bg-purple-600 hover:bg-purple-700', description: 'Download usage analytics' },
    { id: 'emergency', label: 'Emergency Stop', icon: '🛑', color: 'bg-red-600 hover:bg-red-700', description: 'Halt all agents immediately' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-4"
    >
      <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
        <span>🎮</span>
        Quick Actions
      </h3>
      
      <div className="space-y-2">
        {actions.map((action, idx) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + idx * 0.1 }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAction?.(action.id)}
            className={`w-full ${action.color} text-white py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 group`}
            title={action.description}
          >
            <span className="text-lg group-hover:scale-110 transition-transform">{action.icon}</span>
            <span>{action.label}</span>
            <svg 
              className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}