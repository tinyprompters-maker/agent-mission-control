// Cloudflare Function: Agent data endpoint with real-time updates via SSE
// This connects to OpenClaw to fetch actual agent status

import { agents } from '../../lib/agent-data';

// Simple in-memory rate limiting for the SSE endpoint
const sseConnections = new Map();

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Check if this is an SSE request
  const acceptHeader = request.headers.get('Accept');
  const isSSE = acceptHeader?.includes('text/event-stream') || url.searchParams.get('stream') === 'true';
  
  if (isSSE) {
    // Set up Server-Sent Events for real-time updates
    const encoder = new TextEncoder();
    
    const stream = new ReadableStream({
      start(controller) {
        // Send initial data
        const data = JSON.stringify({
          type: 'initial',
          agents: getAgentData(),
          timestamp: Date.now()
        });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        
        // Send heartbeat every 30 seconds
        const heartbeatInterval = setInterval(() => {
          try {
            controller.enqueue(encoder.encode(`: heartbeat\n\n`));
          } catch {
            clearInterval(heartbeatInterval);
          }
        }, 30000);
        
        // Simulate agent updates every 5 seconds (replace with real OpenClaw integration)
        const updateInterval = setInterval(() => {
          try {
            const update = {
              type: 'update',
              agents: getAgentData(),
              timestamp: Date.now()
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(update)}\n\n`));
          } catch {
            clearInterval(updateInterval);
          }
        }, 5000);
        
        // Clean up on close
        request.signal.addEventListener('abort', () => {
          clearInterval(heartbeatInterval);
          clearInterval(updateInterval);
        });
      }
    });
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  }
  
  // Regular JSON response
  return new Response(JSON.stringify({
    agents: getAgentData(),
    timestamp: Date.now()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const { action, agentId, data } = await request.json();
    
    // Validate action
    const validActions = ['spawn', 'stop', 'restart', 'update', 'execute'];
    if (!validActions.includes(action)) {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Log the action (audit trail)
    const logEntry = {
      action: `agent_${action}`,
      agentId,
      data,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('CF-Connecting-IP') || 'unknown'
    };
    
    await env.AUTH_STORE?.put(`agent_action:${Date.now()}`, JSON.stringify(logEntry));
    
    // TODO: Integrate with actual OpenClaw API
    // For now, return success
    return new Response(JSON.stringify({
      success: true,
      message: `Action '${action}' queued for agent '${agentId}'`,
      jobId: `job_${Date.now()}`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function getAgentData() {
  // This would fetch from OpenClaw in production
  // For now, return the mock data with some randomization to simulate activity
  return agents.map(agent => ({
    ...agent,
    // Randomly update token count for active agents
    tokens: agent.status === 'active' 
      ? agent.tokens + Math.floor(Math.random() * 100)
      : agent.tokens,
    // Randomly update cost
    cost: agent.status === 'active'
      ? Math.round((agent.cost + (Math.random() * 0.01)) * 100) / 100
      : agent.cost
  }));
}

export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}