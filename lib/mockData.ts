import type { Agent, ActivityItem } from '@/types';

export const MOCK_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Main Coordinator',
    emoji: '🤖',
    type: 'Coordinator',
    color: 'bg-blue-500',
    status: 'active',
    task: 'Managing agent fleet and task distribution',
    runtime: '2h 34m',
    tokens: 45200,
    cost: 1.234
  },
  {
    id: '2',
    name: 'Code Engineer',
    emoji: '👨‍💻',
    type: 'Engineer',
    color: 'bg-green-500',
    status: 'active',
    task: 'Building CRM structure documentation',
    runtime: '1h 12m',
    tokens: 28400,
    cost: 0.876
  },
  {
    id: '3',
    name: 'Scribbles Writer',
    emoji: '✍️',
    type: 'Writer',
    color: 'bg-purple-500',
    status: 'idle',
    task: 'Drafting blog posts for marketing',
    runtime: '45m',
    tokens: 32100,
    cost: 0.654
  },
  {
    id: '4',
    name: 'Research Analyst',
    emoji: '🔬',
    type: 'Researcher',
    color: 'bg-yellow-500',
    status: 'active',
    task: 'Analyzing market trends and competitors',
    runtime: '3h 21m',
    tokens: 56700,
    cost: 1.432
  },
  {
    id: '5',
    name: 'Data Processor',
    emoji: '📊',
    type: 'Processor',
    color: 'bg-pink-500',
    status: 'active',
    task: 'Processing customer data imports',
    runtime: '45m',
    tokens: 18900,
    cost: 0.432
  },
  {
    id: '6',
    name: 'Security Guard',
    emoji: '🛡️',
    type: 'Security',
    color: 'bg-red-500',
    status: 'idle',
    task: 'Monitoring system security logs',
    runtime: '8h 15m',
    tokens: 12300,
    cost: 0.321
  },
  {
    id: '7',
    name: 'Design Assistant',
    emoji: '🎨',
    type: 'Designer',
    color: 'bg-indigo-500',
    status: 'active',
    task: 'Creating UI mockups for dashboard',
    runtime: '2h 05m',
    tokens: 23400,
    cost: 0.567
  },
  {
    id: '8',
    name: 'Test Runner',
    emoji: '🧪',
    type: 'Tester',
    color: 'bg-orange-500',
    status: 'active',
    task: 'Running integration test suite',
    runtime: '1h 48m',
    tokens: 15600,
    cost: 0.398
  },
  {
    id: '9',
    name: 'DevOps Bot',
    emoji: '⚙️',
    type: 'DevOps',
    color: 'bg-cyan-500',
    status: 'idle',
    task: 'Deploying to production environment',
    runtime: '32m',
    tokens: 8900,
    cost: 0.245
  },
  {
    id: '10',
    name: 'Support Agent',
    emoji: '💬',
    type: 'Support',
    color: 'bg-teal-500',
    status: 'active',
    task: 'Responding to customer tickets',
    runtime: '4h 22m',
    tokens: 41200,
    cost: 1.123
  }
];

export const MOCK_ACTIVITIES: ActivityItem[] = [
  { time: '20:05', agent: '🤖 Main', action: 'Created DNS record for agents.tinyprompters.com', type: 'success' },
  { time: '19:58', agent: '👨‍💻 Engineer', action: 'Built CRM structure documentation', type: 'complete' },
  { time: '19:45', agent: '🤖 Main', action: 'Updated Cloudflare API token', type: 'info' },
  { time: '19:30', agent: '✍️ Scribbles', action: 'Drafted 3 blog posts', type: 'complete' },
  { time: '19:15', agent: '👨‍💻 Engineer', action: 'Created 4 public GitHub repos', type: 'complete' },
  { time: '19:00', agent: '🤖 Main', action: 'Registered on Moltbook', type: 'success' },
  { time: '18:45', agent: '🔬 Research', action: 'Completed competitor analysis report', type: 'complete' },
  { time: '18:30', agent: '🛡️ Security', action: 'Scanned for vulnerabilities', type: 'success' },
  { time: '18:15', agent: '📊 Data', action: 'Processed 10,000 customer records', type: 'complete' },
  { time: '18:00', agent: '⚙️ DevOps', action: 'Deployed dashboard v2.0.0', type: 'success' },
];
