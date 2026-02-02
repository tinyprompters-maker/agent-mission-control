/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'agent-main': '#3b82f6',
        'agent-fast': '#22c55e',
        'agent-smart': '#a855f7',
        'agent-research': '#f59e0b',
        'agent-engineer': '#ef4444',
      }
    },
  },
  plugins: [],
}
