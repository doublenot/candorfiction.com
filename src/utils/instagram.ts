import type { GalleryImage } from '../config/types';
import { cache } from './cacheApi';

interface InstagramMediaItem {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

interface InstagramResponse {
  data: InstagramMediaItem[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

/**
 * Format Instagram caption for use as alt text
 * Removes hashtags and mentions, truncates to 100 characters
 */
function formatCaptionForAlt(caption?: string): string {
  if (!caption) {
    return 'Instagram image';
  }

  const formatted = caption
    .substring(0, 100)
    .replace(/[#@]\w+/g, '')
    .trim();

  return formatted || 'Instagram image';
}

/**
 * Fetch images from Instagram Basic Display API
 * Note: This requires a valid Instagram access token
 */
export async function fetchInstagramImages(
  accessToken: string,
  maxImages: number = 6
): Promise<GalleryImage[]> {
  if (!accessToken) {
    console.warn('Instagram access token not provided');
    return [];
  }

  try {
    const fields = 'id,media_type,media_url,permalink,caption,timestamp';
    const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=${maxImages}&access_token=${accessToken}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        'Instagram API error:',
        response.status,
        response.statusText
      );
      return [];
    }

    const data: InstagramResponse = await response.json();

    // Filter for images only and transform to our format
    const images: GalleryImage[] = data.data
      .filter((item) => item.media_type === 'IMAGE')
      .map((item) => ({
        id: item.id,
        src: item.media_url,
        alt: formatCaptionForAlt(item.caption),
        caption: item.caption,
      }));

    console.log(`Fetched ${images.length} images from Instagram`);
    return images;
  } catch (error) {
    console.error('Error fetching Instagram images:', error);
    return [];
  }
}

/**
 * Cache for Instagram images using Cloudflare Cache API
 */
export class InstagramImageCache {
  private refreshInterval: number = 3600000; // 1 hour default
  private namespace = 'instagram';

  constructor(refreshInterval?: number) {
    if (refreshInterval) {
      this.refreshInterval = refreshInterval;
    }
  }

  /**
   * Generate a cache key for the request
   */
  private getCacheKey(accessToken: string, maxImages: number): string {
    // Create a unique cache key based on access token hash and image count
    // Use a simple hash to avoid storing the actual token in the cache key
    const tokenHash =
      accessToken.substring(0, 8) +
      accessToken.substring(accessToken.length - 8);
    return `images-${tokenHash}-${maxImages}`;
  }

  async getImages(
    accessToken: string,
    maxImages: number
  ): Promise<GalleryImage[]> {
    try {
      const cacheKey = this.getCacheKey(accessToken, maxImages);

      // Use the cache utility's getOrSet method for clean cache-or-compute pattern
      const images = await cache.getOrSet(
        cacheKey,
        () => fetchInstagramImages(accessToken, maxImages),
        this.refreshInterval,
        this.namespace
      );

      return images;
    } catch (error) {
      console.error('Instagram Cache API error:', error);

      // Try to return stale cache data as fallback
      try {
        const cacheKey = this.getCacheKey(accessToken, maxImages);
        const staleImages = await cache.get<GalleryImage[]>(
          cacheKey,
          this.namespace
        );

        if (staleImages && staleImages.length > 0) {
          console.log(
            'Instagram Cache API: Returning stale cache data as fallback'
          );
          return staleImages;
        }
      } catch (fallbackError) {
        console.error('Failed to retrieve fallback cache data:', fallbackError);
      }

      return [];
    }
  }

  async clearCache(accessToken?: string, maxImages?: number): Promise<void> {
    try {
      if (accessToken && maxImages) {
        // Clear specific cache entry
        const cacheKey = this.getCacheKey(accessToken, maxImages);
        await cache.delete(cacheKey, this.namespace);
      } else {
        // Note: Cache API doesn't have a clear-all method for a namespace
        // Individual cache entries will expire naturally based on TTL
        console.log(
          'Cache API: Individual cache entries will expire naturally'
        );
      }
    } catch (error) {
      console.error('Error clearing Instagram cache:', error);
    }
  }
}

// Global cache instance
export const instagramCache = new InstagramImageCache();
