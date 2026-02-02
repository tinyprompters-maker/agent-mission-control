// Cloudflare Function: Verify JWT token endpoint

const JWT_SECRET = process.env.JWT_SECRET;

async function verifyJWT(token) {
  try {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
    
    if (!encodedHeader || !encodedPayload || !encodedSignature) {
      return null;
    }
    
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(JWT_SECRET);
    
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const signature = Uint8Array.from(atob(encodedSignature.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, signature, encoder.encode(signatureInput));
    
    if (!valid) {
      return null;
    }
    
    const payload = JSON.parse(atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/')));
    
    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
}

function getCookieValue(cookieHeader, name) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(^|;)\\s*${name}=([^;]+)`));
  return match ? match[2] : null;
}

export async function onRequestGet(context) {
  const { request } = context;
  const cookieHeader = request.headers.get('Cookie');
  const token = getCookieValue(cookieHeader, 'auth_token');
  
  if (!token) {
    return new Response(JSON.stringify({ 
      valid: false, 
      error: 'No token provided' 
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const payload = await verifyJWT(token);
  
  if (!payload) {
    return new Response(JSON.stringify({ 
      valid: false, 
      error: 'Invalid or expired token' 
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify({
    valid: true,
    user: {
      sub: payload.sub,
      role: payload.role
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost(context) {
  const { request } = context;
  
  try {
    const { token } = await request.json();
    
    if (!token) {
      return new Response(JSON.stringify({ valid: false, error: 'Token required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const payload = await verifyJWT(token);
    
    if (!payload) {
      return new Response(JSON.stringify({ valid: false, error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ valid: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ valid: false, error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}