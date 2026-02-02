// Cloudflare Function: Logout endpoint - clears the auth cookie

export async function onRequestPost(context) {
  const { request } = context;
  
  // Clear the auth cookie
  const isProduction = request.url.startsWith('https://');
  const cookieHeader = `auth_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0${isProduction ? '; __Host-' : ''}`;
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': cookieHeader
    }
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}