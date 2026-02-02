import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// Agent data structure
const AGENTS = [
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
]

const ACTIVITY_FEED = [
  { time: '18:57', agent: '🤖 Main', action: 'Created DNS record for agents.tinyprompters.com', type: 'success' },
  { time: '18:45', agent: '👨‍💻 Engineer', action: 'Built CRM structure documentation', type: 'complete' },
  { time: '18:30', agent: '🤖 Main', action: 'Updated Cloudflare API token', type: 'info' },
  { time: '18:15', agent: '✍️ Scribbles', action: 'Drafted 3 blog posts', type: 'complete' },
  { time: '17:45', agent: '👨‍💻 Engineer', action: 'Created 4 public GitHub repos', type: 'complete' },
  { time: '17:30', agent: '🤖 Main', action: 'Registered on Moltbook', type: 'success' },
]

export default function Dashboard() {
  const router = useRouter()
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [totalCost, setTotalCost] = useState(0.08)
  const [totalTokens, setTotalTokens] = useState(45200)

  useEffect(() => {
    // Check authentication
    const auth = document.cookie.includes('auth=loggedin')
    if (!auth) {
      router.push('/login')
      return
    }

    // Calculate totals
    const cost = AGENTS.reduce((acc, agent) => acc + agent.cost, 0)
    const tokens = AGENTS.reduce((acc, agent) => acc + agent.tokens, 0)
    setTotalCost(cost)
    setTotalTokens(tokens)
  }, [router])

  const handleLogout = () => {
    document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Head>
        <title>Agent Mission Control | Big Bang Interactive</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🦞</span>
            <div>
              <h1 className="text-xl font-bold text-white">Agent Mission Control</h1>
              <p className="text-sm text-gray-400">Big Bang Interactive</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Total Cost Today</p>
              <p className="text-lg font-bold text-green-400">${totalCost.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Tokens Used</p>
              <p className="text-lg font-bold text-blue-400">{totalTokens.toLocaleString()}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Status Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Active Agents</p>
            <p className="text-2xl font-bold text-green-400">1</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Idle Agents</p>
            <p className="text-2xl font-bold text-gray-400">9</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Tasks Completed</p>
            <p className="text-2xl font-bold text-blue-400">23</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Uptime</p>
            <p className="text-2xl font-bold text-purple-400">99.9%</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Agent Grid */}
          <div className="col-span-2">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>🤖</span> Agent Fleet
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {AGENTS.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`bg-gray-800 rounded-lg p-4 border cursor-pointer transition-all hover:border-gray-500 ${
                    agent.status === 'active' ? 'border-green-500' : 'border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{agent.emoji}</span>
                      <div>
                        <p className="font-semibold text-white">{agent.name}</p>
                        <p className="text-xs text-gray-400">{agent.type}</p>
                      </div>
                    </div>
                    <span className={`w-3 h-3 rounded-full ${
                      agent.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-600'
                    }`} />
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-400 truncate">{agent.task}</p>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Runtime: {agent.runtime}</span>
                      <span>${agent.cost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Feed */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>📜</span> Activity Feed
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {ACTIVITY_FEED.map((item, idx) => (
                  <div key={idx} className="text-sm border-l-2 border-gray-600 pl-3">
                    <p className="text-gray-500 text-xs">{item.time}</p>
                    <p className="text-white">{item.agent}</p>
                    <p className="text-gray-400">{item.action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>🎮</span> Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm transition">
                  Spawn New Agent
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm transition">
                  View All Tasks
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded text-sm transition">
                  Generate Report
                </button>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm transition">
                  Emergency Stop
                </button>
              </div>
            </div>

            {/* Crypto Wallet Preview */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span>💎</span> Agent Wallets
                <span className="text-xs bg-yellow-600 text-white px-2 py-0.5 rounded">BETA</span>
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">ETH Balance</span>
                  <span className="text-white">0.00 ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">SOL Balance</span>
                  <span className="text-white">0.00 SOL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Meme Coins</span>
                  <span className="text-white">0 tokens</span>
                </div>
                <button className="w-full mt-2 bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded text-sm transition">
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
