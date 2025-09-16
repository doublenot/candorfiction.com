import { useState, useEffect } from 'react';
import type { GalleryImage } from '../config/types';
import siteConfig from '../config/siteConfig.json';
import type { SiteConfig } from '../config/types';

const config: SiteConfig = siteConfig as SiteConfig;

interface ImagesApiResponse {
  success: boolean;
  images: GalleryImage[];
  count?: number;
  message?: string;
  error?: string;
}

/**
 * Custom hook to fetch images with fallback logic
 */
export function useFetchImages(): {
  images: GalleryImage[];
  isLoading: boolean;
  isUsingFallback: boolean;
} {
  const [images, setImages] = useState<GalleryImage[]>(
    config.gallery.fallbackImages
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      // If Instagram is not enabled, use fallback immediately
      if (!config.gallery.instagram.enabled) {
        console.log('Instagram integration disabled, using fallback images');
        setIsUsingFallback(true);
        return;
      }

      setIsLoading(true);
      try {
        const url = new URL('/api/images', window.location.origin);
        url.searchParams.set(
          'limit',
          config.gallery.instagram.maxImages.toString()
        );

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error(
            'Images API error:',
            response.status,
            response.statusText
          );
          setIsUsingFallback(true);
          return;
        }

        const data: ImagesApiResponse = await response.json();

        if (!data.success || data.images.length === 0) {
          console.warn(
            'Images API returned error or no images:',
            data.error || data.message
          );
          setIsUsingFallback(true);
          return;
        }

        console.log(`Fetched ${data.images.length} images from Instagram API`);
        setImages(data.images);
        setIsUsingFallback(false);
      } catch (error) {
        console.error('Error fetching images from API:', error);
        setIsUsingFallback(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  return {
    images,
    isLoading,
    isUsingFallback,
  };
}
