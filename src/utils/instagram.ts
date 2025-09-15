import type { GalleryImage } from '../config/types';

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
        alt: item.caption
          ? item.caption
              .substring(0, 100)
              .replace(/[#@]\w+/g, '')
              .trim() || 'Instagram image'
          : 'Instagram image',
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
 * Cache for Instagram images to avoid frequent API calls
 */
class InstagramImageCache {
  private cache: GalleryImage[] = [];
  private lastFetch: number = 0;
  private refreshInterval: number = 3600000; // 1 hour default

  constructor(refreshInterval?: number) {
    if (refreshInterval) {
      this.refreshInterval = refreshInterval;
    }
  }

  isExpired(): boolean {
    return Date.now() - this.lastFetch > this.refreshInterval;
  }

  async getImages(
    accessToken: string,
    maxImages: number
  ): Promise<GalleryImage[]> {
    if (this.cache.length === 0 || this.isExpired()) {
      console.log('Refreshing Instagram image cache');
      const freshImages = await fetchInstagramImages(accessToken, maxImages);

      if (freshImages.length > 0) {
        this.cache = freshImages;
        this.lastFetch = Date.now();
      }
    }

    return this.cache;
  }

  clearCache(): void {
    this.cache = [];
    this.lastFetch = 0;
  }
}

// Global cache instance
export const instagramCache = new InstagramImageCache();
