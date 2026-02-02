'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useAgents } from '@/hooks/useAgents';
import { AuthGuard } from '@/components/AuthGuard';
import { Header } from '@/components/Header';
import { StatsCard } from '@/components/StatsCard';
import { AgentCard } from '@/components/AgentCard';
import { AgentDetail } from '@/components/AgentDetail';
import { ActivityFeed } from '@/components/ActivityFeed';
import { QuickActions } from '@/components/QuickActions';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { Agent } from '@/types';
import { MOCK_ACTIVITIES } from '@/lib/mockData';

export default function DashboardPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const { agents, stats, isLoading, isRealtime, executeAction } = useAgents({ enableRealtime: true });

  const handleAgentAction = async (action: string, agentId: string) => {
    try {
      await executeAction(action, agentId);
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  if (isLoading && agents.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
        <Header totalCost={stats.totalCost} totalTokens={stats.totalTokens} />

        <main className="p-4 sm:p-6 max-w-7xl mx-auto">
          {/* Real-time indicator */}
          <div className="flex justify-end mb-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-xs text-gray-400"
            >
              <motion.span
                animate={isRealtime ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-2 h-2 rounded-full ${isRealtime ? 'bg-green-500' : 'bg-yellow-500'}`}
              />
              {isRealtime ? 'Real-time updates active' : 'Polling for updates'}
            </motion.div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <StatsCard
              title="Active Agents"
              value={stats.activeAgents}
              icon="⚡"
              color="green"
              delay={0}
            />
            <StatsCard
              title="Idle Agents"
              value={stats.idleAgents}
              icon="💤"
              color="gray"
              delay={0.1}
            />
            <StatsCard
              title="Tasks Completed"
              value={23}
              icon="✅"
              color="blue"
              delay={0.2}
            />
            <StatsCard
              title="Uptime"
              value="99.9%"
              icon="📈"
              color="purple"
              delay={0.3}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Agent Grid */}
            <div className="lg:col-span-2">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-semibold mb-4 flex items-center gap-2 text-white"
              >
                <span>🤖</span>
                Agent Fleet
                <span className="ml-auto text-sm text-gray-500">{agents.length} agents</span>
              </motion.h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {agents.map((agent, idx) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    isSelected={selectedAgent?.id === agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    index={idx}
                  />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <ActivityFeed activities={MOCK_ACTIVITIES} />
              <QuickActions />
            </div>
          </div>
        </main>

        <AgentDetail
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
          onAction={handleAgentAction}
        />
      </div>
    </AuthGuard>
  );
}
