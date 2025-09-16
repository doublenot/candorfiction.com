/**
 * Cloudflare Cache API utilities
 * Provides a simplified interface for working with Cloudflare's Cache API
 */

export interface CacheOptions {
  /**
   * Cache duration in milliseconds
   */
  ttl: number;
  /**
   * Cache namespace/prefix for organizing cache keys
   */
  namespace?: string;
}

/**
 * Cache API wrapper for Cloudflare Workers
 */
export class CloudflareCacheAPI {
  private getCache() {
    // Handle both Cloudflare Workers and other environments
    return (globalThis as any).caches?.default || caches;
  }

  /**
   * Generate a cache request object
   */
  private getCacheRequest(key: string, namespace?: string): Request {
    const cacheKey = namespace ? `${namespace}:${key}` : key;
    return new Request(`https://cache.api/${cacheKey}`, {
      method: 'GET',
    });
  }

  /**
   * Store data in cache
   */
  async set<T>(key: string, data: T, options: CacheOptions): Promise<void> {
    try {
      const cache = this.getCache();
      const cacheRequest = this.getCacheRequest(key, options.namespace);

      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl: options.ttl,
      };

      const response = new Response(JSON.stringify(cacheData), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `public, max-age=${Math.floor(options.ttl / 1000)}`,
        },
      });

      await cache.put(cacheRequest, response);
      console.log(`Cache API: Stored data for key "${key}"`);
    } catch (error) {
      console.error(`Cache API: Failed to store data for key "${key}":`, error);
    }
  }

  /**
   * Retrieve data from cache
   */
  async get<T>(key: string, namespace?: string): Promise<T | null> {
    try {
      const cache = this.getCache();
      const cacheRequest = this.getCacheRequest(key, namespace);

      const cachedResponse = await cache.match(cacheRequest);

      if (!cachedResponse) {
        return null;
      }

      const cachedData = await cachedResponse.json();
      const cacheAge = Date.now() - cachedData.timestamp;

      // Check if cache has expired
      if (cacheAge > cachedData.ttl) {
        console.log(`Cache API: Cache expired for key "${key}"`);
        await this.delete(key, namespace);
        return null;
      }

      console.log(`Cache API: Cache hit for key "${key}"`);
      return cachedData.data;
    } catch (error) {
      console.error(
        `Cache API: Failed to retrieve data for key "${key}":`,
        error
      );
      return null;
    }
  }

  /**
   * Delete data from cache
   */
  async delete(key: string, namespace?: string): Promise<void> {
    try {
      const cache = this.getCache();
      const cacheRequest = this.getCacheRequest(key, namespace);

      await cache.delete(cacheRequest);
      console.log(`Cache API: Deleted cache for key "${key}"`);
    } catch (error) {
      console.error(
        `Cache API: Failed to delete cache for key "${key}":`,
        error
      );
    }
  }

  /**
   * Check if a cache entry exists and is fresh
   */
  async has(key: string, namespace?: string): Promise<boolean> {
    const data = await this.get(key, namespace);
    return data !== null;
  }

  /**
   * Get or set pattern - retrieve from cache, or compute and store if not found
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    options: CacheOptions
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key, options.namespace);

    if (cached !== null) {
      return cached;
    }

    // Cache miss - compute value
    console.log(`Cache API: Cache miss for key "${key}", computing value`);
    const value = await factory();

    // Store in cache
    await this.set(key, value, options);

    return value;
  }
}

// Export a singleton instance
export const cacheAPI = new CloudflareCacheAPI();

/**
 * Quick helper functions for common operations
 */
export const cache = {
  /**
   * Store data with TTL
   */
  set: <T>(key: string, data: T, ttlMs: number, namespace?: string) =>
    cacheAPI.set(key, data, { ttl: ttlMs, namespace }),

  /**
   * Get data from cache
   */
  get: <T>(key: string, namespace?: string) => cacheAPI.get<T>(key, namespace),

  /**
   * Delete from cache
   */
  delete: (key: string, namespace?: string) => cacheAPI.delete(key, namespace),

  /**
   * Get or compute and store
   */
  getOrSet: <T>(
    key: string,
    factory: () => Promise<T>,
    ttlMs: number,
    namespace?: string
  ) => cacheAPI.getOrSet(key, factory, { ttl: ttlMs, namespace }),
};
