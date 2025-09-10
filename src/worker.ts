/**
 * Cloudflare Worker for Candor Fiction website
 * Handles static asset serving and client-side routing for React SPA
 */

import { handleApiRoutes } from './utils';
import type { Env } from './utils';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      // Handle static assets (CSS, JS, images, etc.)
      if (
        pathname.startsWith('/assets/') ||
        pathname.endsWith('.css') ||
        pathname.endsWith('.js') ||
        pathname.endsWith('.json') ||
        pathname.endsWith('.png') ||
        pathname.endsWith('.jpg') ||
        pathname.endsWith('.jpeg') ||
        pathname.endsWith('.gif') ||
        pathname.endsWith('.svg') ||
        pathname.endsWith('.ico') ||
        pathname.endsWith('.webp') ||
        pathname.endsWith('.woff') ||
        pathname.endsWith('.woff2') ||
        pathname.endsWith('.ttf') ||
        pathname.endsWith('.eot')
      ) {
        // Try to serve the static asset
        const asset = await env.ASSETS.fetch(request);
        if (asset.status !== 404) {
          return asset;
        }
      }

      // Handle API routes
      if (pathname.startsWith('/api/')) {
        return handleApiRoutes(request, env);
      }

      // For all other routes (SPA routing), serve index.html
      // This allows React Router to handle client-side routing
      const indexRequest = new Request(
        new URL('/index.html', request.url).toString(),
        {
          method: request.method,
          headers: request.headers,
          body: request.body,
        }
      );

      const indexResponse = await env.ASSETS.fetch(indexRequest);

      if (indexResponse.status === 404) {
        return new Response('Website not found', { status: 404 });
      }

      // Add security headers
      const response = new Response(indexResponse.body, {
        status: indexResponse.status,
        statusText: indexResponse.statusText,
        headers: {
          ...Object.fromEntries(indexResponse.headers),
          // Security headers
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Content-Security-Policy':
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: https:; " +
            "font-src 'self' data:; " +
            "connect-src 'self' https:;",
          // Cache headers for HTML
          'Cache-Control': 'public, max-age=300, s-maxage=300',
        },
      });

      return response;
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};
