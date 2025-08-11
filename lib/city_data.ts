// lib/monumentsData.ts - Fixed Data Processing
import city_data from '../data/citiesData.json';
import { getSmartImageUrl, getFallbackImageUrl, WORKING_CITY_IMAGES } from './image_service';

const RAW_DATA = city_data;

export interface City {
  id: number;
  name: string;
  country: string;
  costIndex: number;
  popularityScore: number;
  imageUrl: string;
  description: string;
  rating: number;
  travelers: string;
  region?: string;
  isNew?: boolean;
}

// Enhanced image URL function - SYNCHRONOUS
function getEnhancedImageUrl(cityName: string): string {
  try {
    return getSmartImageUrl(cityName);
  } catch {
    return getFallbackImageUrl(cityName);
  }
}

// Fixed transform function with proper data handling
function transform(): City[] {
  const map = new Map<string, { monuments: string[]; domestic19: number }>();

  console.log('🔍 Processing data rows:', RAW_DATA.data?.length || 0);

  RAW_DATA.data.forEach((row: string[], idx: number) => {
    try {
      // Debug: Log first few rows to understand structure
      if (idx < 5) {
        console.log(`Row ${idx}:`, row);
      }

      // Ensure row has enough columns
      if (!row || row.length < 3) {
        console.warn(`⚠️ Row ${idx} has insufficient columns:`, row);
        return;
      }

      const circle = row[0]?.trim();
      const monument = row[1]?.trim();
      const domestic19Str = row[2]?.trim();

      // Skip if any required field is empty
      if (!circle || !monument || !domestic19Str) {
        console.warn(`⚠️ Row ${idx} has empty required fields:`, { circle, monument, domestic19Str });
        return;
      }

      // Skip total rows
      if (circle === "Total" || circle.toLowerCase() === "total") {
        return;
      }

      // Parse domestic visitors number
      const domestic19 = Number(domestic19Str);
      if (isNaN(domestic19) || domestic19 < 0) {
        console.warn(`⚠️ Row ${idx} has invalid domestic19:`, domestic19Str);
        return;
      }

      // Add to map
      if (!map.has(circle)) {
        map.set(circle, { monuments: [], domestic19: 0 });
      }
      const entry = map.get(circle)!;
      entry.monuments.push(monument);
      entry.domestic19 += domestic19;

      // Debug: Log successful processing for first few rows
      if (idx < 5) {
        console.log(`✅ Row ${idx} processed successfully:`, { circle, monument, domestic19 });
      }

    } catch (err) {
      console.error(`❌ Error processing row [${idx}]:`, err, row);
    }
  });

  console.log(`📊 Cities found after processing: ${map.size}`);
  console.log('🏙️ City names:', Array.from(map.keys()).slice(0, 10));

  let uid = 1;
  const cities: City[] = [];

  map.forEach(({ monuments, domestic19 }, circle) => {
    // Calculate metrics
    const popularity = Math.min(Math.round((domestic19 / 4_500_000) * 100), 100);
    const costIndex = 80 + Math.round((domestic19 / 4_500_000) * 40);
    const rating = 3.5 + (popularity / 100) * 1.5;

    // Create city object
    const city: City = {
      id: uid++,
      name: circle,
      country: "India",
      costIndex,
      popularityScore: popularity,
      imageUrl: getEnhancedImageUrl(circle),
      description: monuments.slice(0, 3).join(", ") + (monuments.length > 3 ? "…" : ""),
      rating: Number(rating.toFixed(1)),
      travelers: `${(domestic19 / 1_000_000).toFixed(1)}M`,
      region: "Asia",
    };

    cities.push(city);

    // Debug: Log first few cities
    if (cities.length <= 5) {
      console.log(`🏛️ City created:`, {
        name: city.name,
        visitors: city.travelers,
        popularity: city.popularityScore,
        imageUrl: city.imageUrl
      });
    }
  });

  cities.sort((a, b) => b.popularityScore - a.popularityScore);
  console.log(`✅ Final cities count: ${cities.length}`);
  
  return cities;
}

// Export synchronous data
export const indianHeritageCities: City[] = transform();

export const indianFeaturedCities: City[] = indianHeritageCities
  .slice(0, 3)
  .map(city => ({ ...city, isNew: true }));

// Debug function
export function debugCityData() {
  console.log('🏛️ Indian Heritage Cities loaded:', indianHeritageCities.length);
  
  if (indianHeritageCities.length > 0) {
    console.log('📊 Sample cities:', indianHeritageCities.slice(0, 3));

    console.log('🖼️ Image coverage:');
    indianHeritageCities.forEach(city => {
      const hasWorkingImage = WORKING_CITY_IMAGES[city.name];
      const isLocalImage = city.imageUrl.startsWith('/images/cities/');
      const imageType = hasWorkingImage ? '🌐 External URL' : 
                       isLocalImage ? '📁 Local image' : '🔍 Fallback';
      console.log(`${city.name}: ${imageType} - ${city.imageUrl}`);
    });
  } else {
    console.error('❌ No cities loaded! Check data processing logic.');
  }

  return {
    totalCities: indianHeritageCities.length,
    sampleCities: indianHeritageCities.slice(0, 3),
    featuredCount: indianFeaturedCities.length,
    citiesWithWorkingImages: indianHeritageCities.filter(city => WORKING_CITY_IMAGES[city.name]).length,
    citiesWithLocalImages: indianHeritageCities.filter(city => city.imageUrl.startsWith('/images/cities/')).length
  };
}

export const refreshCityImages = () => {
  indianHeritageCities.forEach(city => {
    city.imageUrl = getEnhancedImageUrl(city.name);
  });
};
