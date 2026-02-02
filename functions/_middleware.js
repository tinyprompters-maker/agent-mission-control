// Cloudflare Function: Auth middleware - runs on every request
// Adds security headers and handles CORS

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  
  // Security headers to add to all responses
  const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self'; connect-src 'self' https: wss:; media-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
  };

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...securityHeaders,
        'Access-Control-Allow-Origin': url.origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  // Continue to the next handler (either another middleware or the route handler)
  const response = await next();
  
  // Clone the response so we can modify headers
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
  
  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    newResponse.headers.set(key, value);
  });

  // Add CORS headers for API routes
  if (url.pathname.startsWith('/api/')) {
    newResponse.headers.set('Access-Control-Allow-Origin', url.origin);
    newResponse.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return newResponse;
}