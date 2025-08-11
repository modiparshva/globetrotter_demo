// components/EnhancedImage.tsx - Smart Image Component with Fallbacks
"use client"

import React, { useState, useCallback } from 'react';
import { getFallbackImageUrl } from '@/lib/image_service';

interface EnhancedImageProps {
  src: string;
  alt: string;
  cityName?: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
}

export const EnhancedImage: React.FC<EnhancedImageProps> = ({
  src,
  alt,
  cityName,
  className = "",
  fallbackSrc,
  onError
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasErrored, setHasErrored] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = useCallback(() => {
    if (!hasErrored) {
      setHasErrored(true);

      // Try city-specific fallback first
      if (cityName && !fallbackSrc) {
        const fallback = getFallbackImageUrl(cityName);
        setCurrentSrc(fallback);
        onError?.();
        return;
      }

      // Try provided fallback
      if (fallbackSrc && currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        onError?.();
        return;
      }

      // Final fallback - generic heritage image
      setCurrentSrc('https://source.unsplash.com/400x300/?india-heritage-architecture');
      onError?.();
    }
  }, [hasErrored, cityName, fallbackSrc, currentSrc, onError]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
      {hasErrored && (
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          📷 Fallback Image
        </div>
      )}
    </div>
  );
};

export default EnhancedImage;
