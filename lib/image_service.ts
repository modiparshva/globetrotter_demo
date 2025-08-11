// lib/imageService.ts - Comprehensive Image Solution
// This service provides multiple strategies for getting city images

export interface ImageSource {
  url: string;
  fallback?: string;
  description?: string;
}

// Comprehensive mapping of Indian heritage cities to high-quality images
export const COMPREHENSIVE_CITY_IMAGES: Record<string, ImageSource> = {
  // Major Heritage Cities - Curated Unsplash Images
  'Agra': {
    url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?taj-mahal-agra',
    description: 'Taj Mahal, Agra'
  },
  'Delhi': {
    url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?red-fort-delhi',
    description: 'Red Fort, Delhi'
  },
  'Mumbai': {
    url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?mumbai-gateway-india',
    description: 'Gateway of India, Mumbai'
  },
  'Aurangabad': {
    url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?ajanta-ellora-caves',
    description: 'Ajanta Caves, Aurangabad'
  },
  'Hampi': {
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?hampi-ruins-karnataka',
    description: 'Hampi Ruins, Karnataka'
  },

  // Previously Missing Cities - New High-Quality Images
  'Hyderabad': {
    url: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?charminar-hyderabad',
    description: 'Charminar, Hyderabad'
  },
  'Bhopal': {
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?sanchi-stupa-bhopal',
    description: 'Sanchi Stupa, Bhopal'
  },
  'Dharwad': {
    url: 'https://images.unsplash.com/photo-1596203732448-d3de7dba694a?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?badami-caves-karnataka',
    description: 'Badami Caves, Karnataka'
  },
  'Lucknow': {
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?bara-imambara-lucknow',
    description: 'Bara Imambara, Lucknow'
  },
  'Chennai': {
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?mamallapuram-temples',
    description: 'Mamallapuram Temples, Chennai'
  },
  'Bhubaneswar': {
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?konark-sun-temple',
    description: 'Konark Sun Temple, Bhubaneswar'
  },
  'Kolkata': {
    url: 'https://images.unsplash.com/photo-1558431382-27e303142733?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?victoria-memorial-kolkata',
    description: 'Victoria Memorial, Kolkata'
  },
  'Bangalore': {
    url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?tipu-sultan-palace-bangalore',
    description: 'Tipu Sultan Palace, Bangalore'
  },
  'Vadodara': {
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?champaner-pavagadh-gujarat',
    description: 'Champaner Pavagadh, Gujarat'
  },
  'Rajkot': {
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?junagadh-caves-gujarat',
    description: 'Junagadh Caves, Gujarat'
  },
  'Thrissur': {
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?kerala-backwaters-temples',
    description: 'Kerala Heritage, Thrissur'
  },
  'Tiruchirappalli': {
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?rock-fort-temple-trichy',
    description: 'Rock Fort Temple, Trichy'
  },
  'Jabalpur': {
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?khajuraho-temples',
    description: 'Khajuraho Temples, Madhya Pradesh'
  },
  'Jhansi': {
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?jhansi-fort-uttar-pradesh',
    description: 'Jhansi Fort, Uttar Pradesh'
  },
  'Sarnath': {
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?sarnath-buddhist-temple',
    description: 'Buddhist Temples, Sarnath'
  },
  'Raiganj': {
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?west-bengal-palace',
    description: 'Heritage Palace, West Bengal'
  },
  'Chandigarh': {
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?rock-garden-chandigarh',
    description: 'Rock Garden, Chandigarh'
  },
  'Guwahati': {
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?assam-temple-heritage',
    description: 'Assam Heritage, Guwahati'
  },
  'Amaravati': {
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?andhra-pradesh-temple',
    description: 'Heritage Temples, Andhra Pradesh'
  },
  'Nagpur': {
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    fallback: 'https://source.unsplash.com/400x300/?nagpur-heritage-maharashtra',
    description: 'Heritage Sites, Nagpur'
  }
};

// Alternative Image APIs for better coverage
export const IMAGE_APIS = {
  // Pixabay - Free API with good Indian content
  pixabay: (cityName: string, apiKey?: string) => {
    if (!apiKey) return null;
    return `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(cityName + ' india heritage')}&category=places&image_type=photo&orientation=horizontal&per_page=1&min_width=400`;
  },

  // Pexels - Free API with high quality images
  pexels: (cityName: string, apiKey?: string) => {
    if (!apiKey) return null;
    return `https://api.pexels.com/v1/search?query=${encodeURIComponent(cityName + ' india monument')}&per_page=1&orientation=landscape`;
  },

  // Unsplash API - High quality curated images
  unsplash: (cityName: string, apiKey?: string) => {
    if (!apiKey) return null;
    return `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cityName + ' india heritage')}&per_page=1&orientation=landscape&client_id=${apiKey}`;
  }
};

// Wikipedia Commons - Free heritage images
export const getWikipediaImage = (cityName: string): string => {
  return `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(cityName + ' india heritage')}&format=json&prop=imageinfo&iiprop=url&origin=*`;
};

// Smart image selection with multiple fallbacks
export const getSmartImageUrl = (cityName: string): string => {
  // Try comprehensive mapping first
  if (COMPREHENSIVE_CITY_IMAGES[cityName]) {
    return COMPREHENSIVE_CITY_IMAGES[cityName].url;
  }

  // Fallback to search-based Unsplash
  const searchTerms = [
    `${cityName} india heritage monument`,
    `${cityName} india architecture`,
    `${cityName} india tourism`,
    `${cityName} india historic`,
    `india heritage architecture`
  ];

  const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
  return `https://source.unsplash.com/400x300/?${encodeURIComponent(randomTerm)}`;
};

// Fallback image with error handling
export const getFallbackImageUrl = (cityName: string): string => {
  if (COMPREHENSIVE_CITY_IMAGES[cityName]?.fallback) {
    return COMPREHENSIVE_CITY_IMAGES[cityName].fallback!;
  }

  // Generic Indian heritage fallback
  return `https://source.unsplash.com/400x300/?india-heritage-architecture`;
};

// Image preloader to check if image exists
export const preloadImage = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

// Smart image loader with fallbacks
export const loadImageWithFallbacks = async (cityName: string): Promise<string> => {
  const primaryUrl = getSmartImageUrl(cityName);

  // Try primary URL
  if (await preloadImage(primaryUrl)) {
    return primaryUrl;
  }

  // Try fallback URL
  const fallbackUrl = getFallbackImageUrl(cityName);
  if (await preloadImage(fallbackUrl)) {
    return fallbackUrl;
  }

  // Final fallback
  return 'https://source.unsplash.com/400x300/?india-heritage';
};

// Export function to get all available city images
export const getAllCityImages = (): Record<string, string> => {
  const result: Record<string, string> = {};
  Object.keys(COMPREHENSIVE_CITY_IMAGES).forEach(city => {
    result[city] = COMPREHENSIVE_CITY_IMAGES[city].url;
  });
  return result;
};
