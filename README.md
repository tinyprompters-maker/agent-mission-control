# Agent Mission Control 🔐

A secure, real-time dashboard for managing AI agents with server-side authentication, rate limiting, and live updates via Server-Sent Events.

## 🚀 Features

- **Secure Authentication**: JWT-based auth with HTTP-only cookies
- **Rate Limiting**: 5 attempts per minute per IP
- **Real-time Updates**: Server-Sent Events for live agent status
- **Modern UI**: Beautiful, responsive design with Framer Motion animations
- **Security Headers**: OWASP-compliant security headers via Cloudflare Functions
- **TypeScript**: Full type safety throughout

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Runtime**: Cloudflare Pages + Functions
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Auth**: JWT with Web Crypto API

## 🔐 Security Features

### Implemented

1. **Server-Side Authentication**
   - Password verification via Cloudflare Function
   - JWT tokens with 24-hour expiration
   - HTTP-only, Secure, SameSite cookies
   - No client-side password storage

2. **Rate Limiting**
   - 5 login attempts per IP per minute
   - Automatic lockout with retry-after header
   - IP-based tracking using Cloudflare KV

3. **Security Headers** (via `_middleware.js`)
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`
   - `X-XSS-Protection: 1; mode=block`
   - `Strict-Transport-Security` (HSTS)
   - `Content-Security-Policy`
   - `Referrer-Policy: strict-origin-when-cross-origin`

4. **Audit Logging**
   - All login attempts logged to KV
   - Agent actions tracked with timestamps
   - IP address and User-Agent recorded

## 📦 Setup

### Prerequisites

- Node.js 18+
- Cloudflare account
- Wrangler CLI: `npm install -g wrangler`

### Installation

```bash
# Install dependencies
npm install

# Set up Cloudflare KV namespace
wrangler kv:namespace create "AUTH_STORE"
```

### Environment Variables

Set these in Cloudflare Dashboard → Pages → Settings → Environment Variables:

```bash
# Required - generate with: node scripts/generate-hash.js
JWT_SECRET=your-random-secret-min-32-characters-long
AUTH_PASSWORD_HASH=pbkdf2:100000:salt:hash

# Alternative for development (not recommended for production)
AUTH_PASSWORD=your-password-here
```

#### Generating Password Hash

```bash
node scripts/generate-hash.js your-password
```

This generates a PBKDF2 hash with 100,000 iterations.

### Development

```bash
# Run locally
npm run dev

# Build for Cloudflare
npm run pages:build

# Deploy
npm run pages:deploy
```

## 🔒 Security Checklist

- [ ] JWT_SECRET is at least 32 characters
- [ ] AUTH_PASSWORD_HASH is set (not AUTH_PASSWORD in production)
- [ ] HTTPS is enforced
- [ ] KV namespace is bound to the Pages project
- [ ] Environment variables are in Cloudflare (not in code)
- [ ] `robots: noindex` prevents search indexing

## 🏗️ Architecture

```
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with security headers
│   ├── page.tsx            # Dashboard
│   └── login/page.tsx      # Login page
├── components/             # React components
│   ├── AuthGuard.tsx       # Auth route protection
│   ├── LoginForm.tsx       # Animated login form
│   ├── AgentCard.tsx       # Agent status card
│   └── ...
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts          # Auth state management
│   └── useAgents.ts        # Agent data + SSE
├── functions/              # Cloudflare Functions
│   ├── _middleware.js      # Security headers
│   ├── api/auth.js         # Login endpoint
│   ├── api/verify.js       # Token verification
│   ├── api/logout.js       # Logout endpoint
│   └── api/agents.js       # Agent data + SSE
├── lib/                    # Shared utilities
│   └── agent-data.js       # Agent definitions
└── types/                  # TypeScript types
    └── index.ts
```

## 🔌 API Endpoints

### POST /api/auth
Login endpoint with rate limiting.

```json
// Request
{ "password": "your-password" }

// Success Response (200)
{ "success": true }
// Sets HTTP-only cookie: auth_token=<jwt>

// Error Response (401)
{ "error": "Invalid credentials", "remainingAttempts": 4 }

// Rate Limited (429)
{ "error": "Too many attempts", "retryAfter": 45 }
```

### GET /api/verify
Verify JWT token from cookie.

```json
// Success (200)
{ "valid": true, "user": { "sub": "admin", "role": "admin" } }

// Invalid (401)
{ "valid": false, "error": "Invalid or expired token" }
```

### POST /api/logout
Clear auth cookie.

### GET /api/agents
Get agent data. Supports Server-Sent Events.

```bash
# Regular request
curl /api/agents

# SSE stream
curl -H "Accept: text/event-stream" /api/agents?stream=true
```

## 🎨 UI Features

- **Dark Mode**: Optimized for dark theme
- **Responsive**: Mobile-first design
- **Animations**: Smooth transitions with Framer Motion
- **Accessibility**: ARIA labels, keyboard navigation
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages

## 🔧 Customization

### Adding New Agents

Edit `lib/agent-data.js`:

```javascript
export const agents = [
  {
    id: 'my-agent',
    name: 'My Agent',
    emoji: '🤖',
    type: 'Custom',
    color: 'bg-blue-500',
    status: 'idle',
    task: '-',
    runtime: '-',
    tokens: 0,
    cost: 0
  }
];
```

### Connecting to Real OpenClaw Data

Modify `functions/api/agents.js`:

```javascript
async function getAgentData() {
  // Replace with actual OpenClaw API call
  const response = await fetch('https://openclaw-api.example.com/agents', {
    headers: { 'Authorization': `Bearer ${env.OPENCLAW_API_KEY}` }
  });
  return await response.json();
}
```

## 📄 License

MIT - Big Bang Interactive

## 🆘 Support

For security issues, please email security@bigbanginteractive.com
For general support, open an issue on GitHub.