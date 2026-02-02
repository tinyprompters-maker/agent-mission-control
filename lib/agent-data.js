// Agent data structure - shared between client and server
export const agents = [
  { id: 'main', name: 'Tiny Prompter', emoji: '🤖', type: 'Main', color: 'bg-blue-500', status: 'active', task: 'Building Mission Control', runtime: '2h 15m', tokens: 45200, cost: 0.08 },
  { id: 'fast', name: 'Fast Agent', emoji: '⚡', type: 'Utility', color: 'bg-green-500', status: 'idle', task: '-', runtime: '-', tokens: 0, cost: 0 },
  { id: 'smart', name: 'Smart Router', emoji: '🧠', type: 'Router', color: 'bg-purple-500', status: 'idle', task: '-', runtime: '-', tokens: 0, cost: 0 },
  { id: 'researcher', name: 'Research Agent', emoji: '🔬', type: 'Research', color: 'bg-yellow-500', status: 'idle', task: '-', runtime: '-', tokens: 0, cost: 0 },
  { id: 'engineer', name: 'Software Engineer', emoji: '👨‍💻', type: 'Engineering', color: 'bg-red-500', status: 'idle', task: '-', runtime: '-', tokens: 0, cost: 0 },
  { id: 'writer', name: 'Scribbles', emoji: '✍️', type: 'Content', color: 'bg-pink-500', status: 'idle', task: '-', runtime: '-', tokens: 0, cost: 0 },
  { id: 'tester', name: 'Wile E.', emoji: '🧨', type: 'QA', color: 'bg-orange-500', status: 'idle', task: '-', runtime: '-', tokens: 0, cost: 0 },
  { id: 'security', name: 'Secret', emoji: '🕵️', type: 'Security', color: 'bg-indigo-500', status: 'idle', task: '-', runtime: '-', tokens: 0, cost: 0 },
  { id: 'data', name: 'Dexter', emoji: '🧪', type: 'Analytics', color: 'bg-teal-500', status: 'idle', task: '-', runtime: '-', tokens: 0, cost: 0 },
  { id: 'ops', name: 'Bender', emoji: '🤖', type: 'DevOps', color: 'bg-gray-500', status: 'idle', task: '-', runtime: '-', tokens: 0, cost: 0 },
];

export const activityFeed = [
  { time: '18:57', agent: '🤖 Main', action: 'Created DNS record for agents.tinyprompters.com', type: 'success' },
  { time: '18:45', agent: '👨‍💻 Engineer', action: 'Built CRM structure documentation', type: 'complete' },
  { time: '18:30', agent: '🤖 Main', action: 'Updated Cloudflare API token', type: 'info' },
  { time: '18:15', agent: '✍️ Scribbles', action: 'Drafted 3 blog posts', type: 'complete' },
  { time: '17:45', agent: '👨‍💻 Engineer', action: 'Created 4 public GitHub repos', type: 'complete' },
  { time: '17:30', agent: '🤖 Main', action: 'Registered on Moltbook', type: 'success' },
];