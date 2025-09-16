import { InstagramImageCache } from './instagram';
import { isValidOrigin } from './security';
import type { Env } from './types';

// Create a cache instance with 6-hour duration for server-side API
const serverInstagramCache = new InstagramImageCache(21600000); // 6 hours in milliseconds

/**
 * Handle /api/images endpoint - fetch Instagram images server-side
 */
export async function handleImagesApi(
  request: Request,
  env: Env
): Promise<Response> {
  const origin = request.headers.get('Origin');

  // Validate origin
  if (!isValidOrigin(request, env)) {
    console.warn('Images API request rejected: invalid origin', {
      origin,
      timestamp: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Request not authorized',
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // Only allow GET requests
  if (request.method !== 'GET') {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Method not allowed',
      }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin || '',
        },
      }
    );
  }

  try {
    // Check if Instagram is configured
    if (!env.INSTAGRAM_ACCESS_TOKEN) {
      console.warn(
        'Instagram access token not configured, returning empty array'
      );
      return new Response(
        JSON.stringify({
          success: true,
          images: [],
          message: 'Instagram not configured',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': origin || '',
            'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
          },
        }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const maxImages = parseInt(url.searchParams.get('limit') || '6', 10);

    // Use server-side Instagram cache with 6-hour duration
    const images = await serverInstagramCache.getImages(
      env.INSTAGRAM_ACCESS_TOKEN,
      maxImages
    );

    console.log(`Images API: Returning ${images.length} Instagram images`);

    return new Response(
      JSON.stringify({
        success: true,
        images,
        count: images.length,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin || '',
          'Cache-Control': 'public, max-age=21600', // Cache for 6 hours
        },
      }
    );
  } catch (error) {
    console.error('Images API error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to fetch images',
        images: [],
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin || '',
        },
      }
    );
  }
}
