import React from 'react';
import { useFetchImages } from '../utils/useFetchImages';

const HeroImage: React.FC = () => {
  const {
    images: galleryImages,
    isLoading,
    isUsingFallback,
  } = useFetchImages();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const nextImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
      );
      setIsTransitioning(false);
    }, 150);
  };

  const prevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
      );
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <div className="relative">
      <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Loading state when fetching images */}
        {isLoading ? (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-8 h-8 border-2 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-600">Loading images...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Main image display */}
            <div className="relative w-full h-full">
              <img
                src={galleryImages[currentIndex].src}
                alt={galleryImages[currentIndex].alt}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isTransitioning ? 'opacity-50' : 'opacity-100'
                }`}
              />

              {/* Loading overlay during transition */}
              {isTransitioning && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Navigation controls - only show when images are loaded */}
        {!isLoading && (
          <>
            <button
              onClick={prevImage}
              disabled={isTransitioning}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
              aria-label="Previous image"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={nextImage}
              disabled={isTransitioning}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
              aria-label="Next image"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      <div className="absolute -bottom-6 -left-6 bg-white text-[var(--text-dark)] p-6 rounded-xl shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[var(--accent-color)] rounded-lg flex items-center justify-center">
            <div className="text-xl text-white icon-camera"></div>
          </div>
          <div>
            <h3 className="font-semibold">Professional</h3>
            <p className="text-sm text-gray-600">
              {isUsingFallback ? 'Quality Guaranteed' : 'Latest Portfolio'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroImage;
