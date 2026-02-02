'use client';

import { motion } from 'framer-motion';
import type { Agent } from '@/types';

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

export function AgentCard({ agent, isSelected, onClick, index }: AgentCardProps) {
  const statusColors = {
    active: 'bg-green-500',
    idle: 'bg-gray-500',
    error: 'bg-red-500',
    stopped: 'bg-gray-700'
  };

  const statusGlow = {
    active: 'shadow-green-500/20',
    idle: 'shadow-gray-500/10',
    error: 'shadow-red-500/20',
    stopped: 'shadow-gray-700/10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative bg-gray-800 rounded-xl p-4 border-2 cursor-pointer transition-all duration-200
        hover:shadow-lg ${statusGlow[agent.status]}
        ${isSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-700 hover:border-gray-600'}
      `}
      role="button"
      tabIndex={0}
      aria-label={`${agent.name} - ${agent.status}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* Status Indicator */}
      <div className="absolute top-3 right-3">
        <motion.span
          animate={agent.status === 'active' ? {
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className={`w-3 h-3 rounded-full ${statusColors[agent.status]} block`}
        />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl" role="img" aria-label={agent.type}>{agent.emoji}</span>
        <div>
          <h3 className="font-semibold text-white">{agent.name}</h3>
          <p className="text-xs text-gray-400">{agent.type}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-300 truncate" title={agent.task}>
          {agent.task || 'No active task'}
        </p>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>{agent.runtime || '-'}</span>
          <span className={agent.cost > 0 ? 'text-green-400' : ''}>
            ${agent.cost.toFixed(3)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex-1 bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((agent.tokens / 50000) * 100, 100)}%` }}
              transition={{ duration: 1, delay: index * 0.05 }}
              className={`h-full rounded-full ${agent.color}`}
            />
          </div>
          <span className="text-gray-400 min-w-[60px] text-right">
            {(agent.tokens / 1000).toFixed(1)}k
          </span>
        </div>
      </div>
    </motion.div>
  );
}