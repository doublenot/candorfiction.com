import { handleContactForm } from './handleContactForm';
import { isValidOrigin } from './security';
import type { Env } from './types';

/**
 * Handle API routes with security validation
 */
export async function handleApiRoutes(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const origin = request.headers.get('Origin');

  // Handle CORS preflight with origin validation
  if (request.method === 'OPTIONS') {
    // Validate origin for CORS preflight
    if (origin && isValidOrigin(request, env)) {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
          Vary: 'Origin',
        },
      });
    } else {
      // Reject CORS preflight from invalid origins
      return new Response('CORS request not allowed', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
  }

  if (pathname === '/api/contact' && request.method === 'POST') {
    return handleContactForm(request, env);
  }

  return new Response(
    JSON.stringify({
      success: false,
      error: 'API endpoint not found',
    }),
    {
      status: 404,
      headers: {
        'Access-Control-Allow-Origin':
          origin && isValidOrigin(request, env) ? origin : '',
        'Content-Type': 'application/json',
        Vary: 'Origin',
      },
    }
  );
}
