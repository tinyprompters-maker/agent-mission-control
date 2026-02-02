'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Agent, ActivityItem } from '@/types';
import { MOCK_AGENTS, MOCK_ACTIVITIES } from '@/lib/mockData';

interface UseAgentsOptions {
  enableRealtime?: boolean;
}

export function useAgents(options: UseAgentsOptions = {}) {
  const { enableRealtime = true } = options;
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealtime, setIsRealtime] = useState(false);

  // Simulate fetching data
  const fetchAgents = useCallback(async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Add some randomness to make it feel alive
      const randomizedAgents = MOCK_AGENTS.map(agent => ({
        ...agent,
        tokens: agent.tokens + Math.floor(Math.random() * 1000),
        cost: agent.cost + Math.random() * 0.1,
        status: Math.random() > 0.8 
          ? (agent.status === 'active' ? 'idle' : 'active')
          : agent.status
      }));
      
      setAgents(randomizedAgents);
      setActivities(MOCK_ACTIVITIES);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchAgents();
    
    if (enableRealtime) {
      setIsRealtime(true);
      // Simulate real-time updates
      const interval = setInterval(() => {
        setAgents(prev => prev.map(agent => ({
          ...agent,
          tokens: agent.tokens + Math.floor(Math.random() * 100),
          cost: agent.cost + Math.random() * 0.01
        })));
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [enableRealtime, fetchAgents]);

  // Calculate stats
  const stats = {
    activeAgents: agents.filter(a => a.status === 'active').length,
    idleAgents: agents.filter(a => a.status === 'idle').length,
    totalTokens: agents.reduce((acc, a) => acc + a.tokens, 0),
    totalCost: agents.reduce((acc, a) => acc + a.cost, 0)
  };

  const executeAction = useCallback(async (action: string, agentId: string, data?: any) => {
    // Simulate action execution
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Action executed:', action, agentId, data);
    return { success: true };
  }, []);

  return {
    agents,
    activities,
    stats,
    isLoading,
    error,
    isRealtime,
    executeAction,
    refresh: fetchAgents
  };
}
