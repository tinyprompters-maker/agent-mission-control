'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { Agent } from '@/types';

interface AgentDetailProps {
  agent: Agent | null;
  onClose: () => void;
  onAction: (action: string, agentId: string) => void;
}

export function AgentDetail({ agent, onClose, onAction }: AgentDetailProps) {
  if (!agent) return null;

  const statusConfig = {
    active: { color: 'text-green-400', bg: 'bg-green-500/20', label: 'Active' },
    idle: { color: 'text-gray-400', bg: 'bg-gray-500/20', label: 'Idle' },
    error: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Error' },
    stopped: { color: 'text-gray-500', bg: 'bg-gray-700/20', label: 'Stopped' }
  };

  const status = statusConfig[agent.status];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-800 rounded-2xl border border-gray-700 max-w-md w-full overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className={`${status.bg} p-6 border-b border-gray-700`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{agent.emoji}</span>
                <div>
                  <h2 className="text-xl font-bold text-white">{agent.name}</h2>
                  <p className="text-gray-400 text-sm">{agent.type}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-4 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${status.color.replace('text-', 'bg-')}`}></span>
              <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Tokens Used</p>
                <p className="text-lg font-semibold text-white">{agent.tokens.toLocaleString()}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Cost</p>
                <p className="text-lg font-semibold text-green-400">${agent.cost.toFixed(3)}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Runtime</p>
                <p className="text-lg font-semibold text-white">{agent.runtime || 'N/A'}</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Task</p>
                <p className="text-lg font-semibold text-white truncate">{agent.task || 'None'}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-700">
              <button
                onClick={() => onAction('restart', agent.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Restart
              </button>
              <button
                onClick={() => onAction('stop', agent.id)}
                className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Stop
              </button>
              <button
                onClick={() => onAction('execute', agent.id)}
                className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Execute Task
              </button>
              <button
                onClick={() => onAction('logs', agent.id)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                View Logs
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}