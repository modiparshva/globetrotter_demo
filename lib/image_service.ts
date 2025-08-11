// lib/image_service.ts - Fixed and Simplified
export interface ImageSource {
  url: string;
  fallback?: string;
  description?: string;
}

const LOCAL_IMAGE_CITIES = [
  'Bhubaneswar', 'Dharwad', 'Bhopal', 'Bangalore',
  'Jodhpur', 'Raigarh', 'Thrissur', 'Vadodara', 'Patna', 'Sarnath',
  'Goa', 'Tiruchirappalli', 'Jhansi', 'Jabalpur', 'Guwahati',
  'Jaipur', 'Amaravati', 'Lucknow', 'Shimla', 'Kolkata', 'Chandigarh',
  'Rajkot', 'Nagpur', 'Leh', 'Srinagar', 'Raipur'
];

export const WORKING_CITY_IMAGES: Record<string, ImageSource> = {
  'Agra': {
    url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop&crop=center',
    fallback: '/images/cities/agra.jpg',
    description: 'Taj Mahal, Agra'
  },
  'Delhi': {
    url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop&crop=center',
    fallback: '/images/cities/delhi.jpg',
    description: 'Red Fort, Delhi'
  },
  'Mumbai': {
    url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop&crop=center',
    fallback: '/images/cities/mumbai.jpg',
    description: 'Gateway of India, Mumbai'
  },
  'Aurangabad': {
    url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop&crop=center',
    fallback: '/images/cities/aurangabad.jpg',
    description: 'Ajanta Caves, Aurangabad'
  },
  'Hampi': {
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&crop=center',
    fallback: '/images/cities/hampi.jpg',
    description: 'Hampi Ruins, Karnataka'
  },
  'Hyderabad': {
    url: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=400&h=300&fit=crop&crop=center',
    fallback: '/images/cities/hyderabad.jpg',
    description: 'Charminar, Hyderabad'
  },
  'Lucknow': {
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    fallback: '/images/cities/lucknow.jpg',
    description: 'Bara Imambara, Lucknow'
  },
  'Chennai': {
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&crop=center',
    fallback: '/images/cities/chennai.jpg',
    description: 'Mamallapuram Temples, Chennai'
  }
};

// Helper functions
const getLocalImagePath = (cityName: string, extension: string = 'jpg'): string => {
  const normalizedName = cityName.toLowerCase().replace(/\s+/g, '-');
  return `/images/cities/${normalizedName}.${extension}`;
};

const shouldUseLocalImage = (cityName: string): boolean => {
  return LOCAL_IMAGE_CITIES.includes(cityName);
};

// Main function - SYNCHRONOUS for compatibility
export const getSmartImageUrl = (cityName: string): string => {
  // If city should use local image, return local path
  if (shouldUseLocalImage(cityName)) {
    return getLocalImagePath(cityName);
  }

  // If city has working external URL, use it
  if (WORKING_CITY_IMAGES[cityName]) {
    return WORKING_CITY_IMAGES[cityName].url;
  }

  // Default fallback
  return '/images/cities/default-heritage.jpg';
};

// Fallback function - PROPERLY EXPORTED
export const getFallbackImageUrl = (cityName: string): string => {
  // Try local image first
  if (shouldUseLocalImage(cityName)) {
    return getLocalImagePath(cityName);
  }

  // Try working image fallback
  if (WORKING_CITY_IMAGES[cityName]?.fallback) {
    return WORKING_CITY_IMAGES[cityName].fallback!;
  }

  // Final fallback
  return '/images/cities/default-heritage.jpg';
};
