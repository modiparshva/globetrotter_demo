// lib/monumentsData.ts - Updated with Comprehensive Image Support
import city_data from '../data/citiesData.json';
import { getSmartImageUrl, getFallbackImageUrl, COMPREHENSIVE_CITY_IMAGES } from './image_service';

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

// Enhanced image URL function with comprehensive coverage
function getEnhancedImageUrl(cityName: string): string {
  // Use the smart image service for comprehensive coverage
  return getSmartImageUrl(cityName);
}

function transform(): City[] {
  const map = new Map<string, { monuments: string[]; domestic19: number }>();

  RAW_DATA.data.forEach((row: string[], idx: number) => {
    try {
      const circle = row[0];
      const monument = row[1];
      const domestic19 = Number(row[2]);

      if (!circle || !monument || isNaN(domestic19)) {
        console.warn(`⚠️ Skipping invalid row [${idx}]`, row);
        return;
      }
      if (circle === "Total") return;

      if (!map.has(circle)) {
        map.set(circle, { monuments: [], domestic19: 0 });
      }
      const entry = map.get(circle)!;
      entry.monuments.push(monument);
      entry.domestic19 += domestic19;
    } catch (err) {
      console.error(`❌ Error processing row [${idx}]:`, err, row);
    }
  });

  let uid = 1;
  const cities: City[] = [];

  map.forEach(({ monuments, domestic19 }, circle) => {
    const popularity = Math.min(Math.round((domestic19 / 4_500_000) * 100), 100);
    const costIndex = 80 + Math.round((domestic19 / 4_500_000) * 40);
    const rating = 3.5 + (popularity / 100) * 1.5;

    cities.push({
      id: uid++,
      name: circle,
      country: "India",
      costIndex,
      popularityScore: popularity,
      imageUrl: getEnhancedImageUrl(circle), // Using enhanced image service
      description: monuments.slice(0, 3).join(", ") + (monuments.length > 3 ? "…" : ""),
      rating: Number(rating.toFixed(1)),
      travelers: `${(domestic19 / 1_000_000).toFixed(1)}M`,
      region: "Asia",
    });
  });

  cities.sort((a, b) => b.popularityScore - a.popularityScore);
  return cities;
}

export const indianHeritageCities: City[] = transform();

export const indianFeaturedCities: City[] = indianHeritageCities
  .slice(0, 3)
  .map(city => ({ ...city, isNew: true }));

// Debug function to check data and images
export function debugCityData() {
  console.log('🏛️ Indian Heritage Cities loaded:', indianHeritageCities.length);
  console.log('📊 Sample cities:', indianHeritageCities.slice(0, 3));

  // Log cities with their image sources
  console.log('🖼️ Image coverage:');
  indianHeritageCities.forEach(city => {
    const hasCustomImage = COMPREHENSIVE_CITY_IMAGES[city.name];
    console.log(`${city.name}: ${hasCustomImage ? '✅ Custom image' : '🔍 Search-based'} - ${city.imageUrl}`);
  });

  return {
    totalCities: indianHeritageCities.length,
    sampleCities: indianHeritageCities.slice(0, 3),
    featuredCount: indianFeaturedCities.length,
    citiesWithCustomImages: indianHeritageCities.filter(city => COMPREHENSIVE_CITY_IMAGES[city.name]).length
  };
}

// Function to refresh images if needed
export const refreshCityImages = () => {
  indianHeritageCities.forEach(city => {
    city.imageUrl = getEnhancedImageUrl(city.name);
  });
};
