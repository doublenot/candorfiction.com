import type { GalleryImage } from '../config/types';

interface ImagesApiResponse {
  success: boolean;
  images: GalleryImage[];
  count?: number;
  message?: string;
  error?: string;
}

/**
 * Fetch images from the /api/images endpoint
 */
export async function fetchImagesFromApi(
  maxImages: number = 6
): Promise<GalleryImage[]> {
  try {
    const url = new URL('/api/images', window.location.origin);
    url.searchParams.set('limit', maxImages.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Images API error:', response.status, response.statusText);
      return [];
    }

    const data: ImagesApiResponse = await response.json();

    if (!data.success) {
      console.warn('Images API returned error:', data.error || data.message);
      return [];
    }

    console.log(`Fetched ${data.images.length} images from API`);
    return data.images;
  } catch (error) {
    console.error('Error fetching images from API:', error);
    return [];
  }
}

/**
 * Cache for API images to avoid frequent requests
 */
class ApiImageCache {
  private cache: GalleryImage[] = [];
  private lastFetch: number = 0;
  private refreshInterval: number = 1800000; // 30 minutes default

  constructor(refreshInterval?: number) {
    if (refreshInterval) {
      this.refreshInterval = refreshInterval;
    }
  }

  isExpired(): boolean {
    return Date.now() - this.lastFetch > this.refreshInterval;
  }

  async getImages(maxImages: number): Promise<GalleryImage[]> {
    if (this.cache.length === 0 || this.isExpired()) {
      console.log('Refreshing API image cache');
      const freshImages = await fetchImagesFromApi(maxImages);

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
export const apiImageCache = new ApiImageCache();
