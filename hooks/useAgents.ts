'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Agent, ActivityItem } from '@/types';

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
  const eventSourceRef = useRef<EventSource | null>(null);

  // Fetch initial data
  const fetchAgents = useCallback(async () => {
    try {
      const response = await fetch('/api/agents', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }

      const data = await response.json();
      setAgents(data.agents);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false);
    }
  }, []);

  // Set up SSE for real-time updates
  useEffect(() => {
    if (!enableRealtime) {
      fetchAgents();
      return;
    }

    // Try SSE first
    try {
      const eventSource = new EventSource('/api/agents?stream=true', {
        withCredentials: true
      });

      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsRealtime(true);
        setIsLoading(false);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'initial' || data.type === 'update') {
            setAgents(data.agents);
          }
        } catch (err) {
          console.error('Failed to parse SSE data:', err);
        }
      };

      eventSource.onerror = () => {
        setIsRealtime(false);
        // Fall back to polling if SSE fails
        fetchAgents();
      };

      return () => {
        eventSource.close();
      };
    } catch {
      // SSE not supported, use polling
      fetchAgents();
      const interval = setInterval(fetchAgents, 5000);
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
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, agentId, data })
      });

      if (!response.ok) {
        throw new Error('Action failed');
      }

      return await response.json();
    } catch (err) {
      throw err;
    }
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