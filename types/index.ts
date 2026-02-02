export interface Agent {
  id: string;
  name: string;
  emoji: string;
  type: string;
  color: string;
  status: 'active' | 'idle' | 'error' | 'stopped';
  task: string;
  runtime: string;
  tokens: number;
  cost: number;
}

export interface ActivityItem {
  time: string;
  agent: string;
  action: string;
  type: 'success' | 'complete' | 'info' | 'error' | 'warning';
}

export interface User {
  sub: string;
  role: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface AgentStats {
  activeAgents: number;
  idleAgents: number;
  tasksCompleted: number;
  uptime: string;
}

export interface CostMetrics {
  totalCost: number;
  totalTokens: number;
  dailyAverage: number;
  projectedMonthly: number;
}