// components/EnhancedImage.tsx - Fixed Version
"use client";

import React, { useState, useCallback } from "react";
import { getFallbackImageUrl } from "@/lib/image_service";

interface EnhancedImageProps {
  src: string;
  alt: string;
  cityName?: string;
  className?: string;
  onError?: () => void;
}

export const EnhancedImage: React.FC<EnhancedImageProps> = ({
  src,
  alt,
  cityName,
  className = "",
  onError
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasErrored, setHasErrored] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = useCallback(() => {
    if (!hasErrored) {
      setHasErrored(true);

      // Try city-specific fallback first
      if (cityName) {
        const fallback = getFallbackImageUrl(cityName);
        if (fallback !== currentSrc) {
          setCurrentSrc(fallback);
          onError?.();
          return;
        }
      }

      // Final fallback - default heritage image
      setCurrentSrc('/images/cities/default-heritage.jpg');
      onError?.();
    }
  }, [hasErrored, cityName, currentSrc, onError]);

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
        className={`${className} transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  );
};

export default EnhancedImage;
