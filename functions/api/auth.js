// Cloudflare Function: Login endpoint with rate limiting and bcrypt hashing

const JWT_SECRET = process.env.JWT_SECRET;
const AUTH_PASSWORD_HASH = process.env.AUTH_PASSWORD_HASH; // bcrypt hash of the password
const RATE_LIMIT_PREFIX = 'rate_limit:';
const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 60;

// Simple bcrypt compare implementation for Cloudflare Workers
// In production, use a proper bcrypt wasm implementation or Cloudflare Secrets
async function verifyPassword(password, hash) {
  // For Cloudflare Workers, we'll use the Web Crypto API with PBKDF2
  // The hash format should be: iterations:salt:hash
  const [iterations, salt, storedHash] = hash.split(':');
  
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  const saltData = Uint8Array.from(atob(salt), c => c.charCodeAt(0));
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordData,
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltData,
      iterations: parseInt(iterations),
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  
  const derivedHash = btoa(String.fromCharCode(...new Uint8Array(derivedBits)));
  return derivedHash === storedHash;
}

// Generate JWT token
async function generateJWT(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  
  const jwtPayload = {
    ...payload,
    iat: now,
    exp: now + (24 * 60 * 60) // 24 hours
  };
  
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '');
  const encodedPayload = btoa(JSON.stringify(jwtPayload)).replace(/=/g, '');
  
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(JWT_SECRET);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signatureInput));
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '');
  
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

// Rate limiting check
async function checkRateLimit(env, clientIP) {
  const key = `${RATE_LIMIT_PREFIX}${clientIP}`;
  const now = Math.floor(Date.now() / 1000);
  
  // Get current attempts from KV
  const attempts = await env.AUTH_STORE?.get(key);
  const attemptData = attempts ? JSON.parse(attempts) : { count: 0, windowStart: now };
  
  // Reset if window expired
  if (now - attemptData.windowStart > WINDOW_SECONDS) {
    attemptData.count = 0;
    attemptData.windowStart = now;
  }
  
  // Check limit
  if (attemptData.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0, resetAt: attemptData.windowStart + WINDOW_SECONDS };
  }
  
  return { allowed: true, remaining: MAX_ATTEMPTS - attemptData.count, resetAt: attemptData.windowStart + WINDOW_SECONDS };
}

// Increment rate limit counter
async function incrementRateLimit(env, clientIP) {
  const key = `${RATE_LIMIT_PREFIX}${clientIP}`;
  const now = Math.floor(Date.now() / 1000);
  
  const attempts = await env.AUTH_STORE?.get(key);
  const attemptData = attempts ? JSON.parse(attempts) : { count: 0, windowStart: now };
  
  if (now - attemptData.windowStart > WINDOW_SECONDS) {
    attemptData.count = 1;
    attemptData.windowStart = now;
  } else {
    attemptData.count++;
  }
  
  await env.AUTH_STORE?.put(key, JSON.stringify(attemptData), { expirationTtl: WINDOW_SECONDS });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  
  // Ensure JWT_SECRET is configured
  if (!JWT_SECRET) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Get client IP for rate limiting
  const clientIP = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
  
  // Check rate limit
  const rateLimitStatus = await checkRateLimit(env, clientIP);
  if (!rateLimitStatus.allowed) {
    return new Response(JSON.stringify({ 
      error: 'Too many attempts. Please try again later.',
      retryAfter: rateLimitStatus.resetAt - Math.floor(Date.now() / 1000)
    }), {
      status: 429,
      headers: { 
        'Content-Type': 'application/json',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': rateLimitStatus.resetAt.toString()
      }
    });
  }
  
  try {
    const { password } = await request.json();
    
    if (!password) {
      await incrementRateLimit(env, clientIP);
      return new Response(JSON.stringify({ error: 'Password required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Verify password against hash
    let passwordValid = false;
    
    if (AUTH_PASSWORD_HASH && AUTH_PASSWORD_HASH.includes(':')) {
      // Use PBKDF2 verification
      passwordValid = await verifyPassword(password, AUTH_PASSWORD_HASH);
    } else {
      // Fallback for development - check against env variable directly
      // DO NOT USE IN PRODUCTION
      passwordValid = password === env.AUTH_PASSWORD;
    }
    
    if (!passwordValid) {
      await incrementRateLimit(env, clientIP);
      return new Response(JSON.stringify({ 
        error: 'Invalid credentials',
        remainingAttempts: rateLimitStatus.remaining - 1
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Generate JWT token
    const token = await generateJWT({ 
      sub: 'admin',
      role: 'admin',
      ip: clientIP 
    });
    
    // Set secure HTTP-only cookie
    const isProduction = request.url.startsWith('https://');
    const cookieHeader = `auth_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400${isProduction ? '; __Host-' : ''}`;
    
    // Log successful login (audit trail)
    const logEntry = {
      action: 'login_success',
      ip: clientIP,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('User-Agent') || 'unknown'
    };
    
    // Store in KV for audit (optional)
    await env.AUTH_STORE?.put(`audit:${Date.now()}`, JSON.stringify(logEntry));
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Authentication successful'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookieHeader,
        'X-RateLimit-Remaining': rateLimitStatus.remaining.toString()
      }
    });
    
  } catch (error) {
    console.error('Auth error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle OPTIONS for CORS
export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}