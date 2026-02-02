import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if already authenticated
    const auth = document.cookie.includes('auth=loggedin')
    if (auth) {
      router.push('/')
    }
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simple client-side check for static export
    // In production, this should be server-side
    if (password === 'BigBang2026!') {
      document.cookie = 'auth=loggedin; path=/; max-age=86400' // 24 hours
      router.push('/')
    } else {
      setError('Invalid password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 max-w-md w-full">
        <div className="text-center mb-6">
          <span className="text-4xl">🦞</span>
          <h1 className="text-2xl font-bold text-white mt-2">Agent Mission Control</h1>
          <p className="text-gray-400 text-sm">Big Bang Interactive</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter password..."
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-gray-500 text-xs text-center mt-4">
          Secure Access Only
        </p>
      </div>
    </div>
  )
}
