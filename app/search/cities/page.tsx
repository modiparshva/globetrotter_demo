"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, MapPin, Star, DollarSign, Plus, Filter, Globe, TrendingUp, Calendar, Users } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { tripService, type Trip } from "@/lib/trips"

// FIXED: Import from correct path - monumentsData not city_data
import { indianHeritageCities, indianFeaturedCities, debugCityData, type City } from "@/lib/city_data"



// Keep some international cities for variety (optional)
const internationalCities: City[] = [
  {
    id: 1002,
    name: "Tokyo",
    country: "Japan",
    costIndex: 150,
    popularityScore: 95,
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop&crop=center",
    description: "Modern metropolis with rich culture and amazing food",
    rating: 4.8,
    travelers: "2.1M",
    region: "Asia"
  },
  {
    id: 1003,
    name: "Dubai",
    country: "UAE",
    costIndex: 160,
    popularityScore: 85,
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop&crop=center",
    description: "Luxury destination with modern architecture",
    rating: 4.5,
    travelers: "900K",
    region: "Asia"
  },
]

export default function CitySearch() {
  const router = useRouter();
  const { user } = useAuth();
  
  // State management
  const [allCities, setAllCities] = useState<City[]>([])
  const [featuredDestinations, setFeaturedDestinations] = useState<City[]>([])
  const [userTrips, setUserTrips] = useState<Trip[]>([])
  const [isTripsDialogOpen, setIsTripsDialogOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [isLoadingTrips, setIsLoadingTrips] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<string>("All Countries")
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>("")
  const [filteredCities, setFilteredCities] = useState<City[]>([])
  const [totalCitiesCount, setTotalCitiesCount] = useState(0)

  // Initialize cities on component mount
  useEffect(() => {
    // Debug the data loading
    const debugInfo = debugCityData();
    console.log("🔍 Debug Info:", debugInfo);

    if (indianHeritageCities.length === 0) {
      console.error("❌ No Indian heritage cities loaded!");
      return;
    }

    // Combine Indian heritage cities with some international cities
    const combinedCities = [...indianHeritageCities, ...internationalCities];
    console.log("🏙️ Combined cities:", combinedCities.length);

    // Set all cities
    setAllCities(combinedCities);
    setTotalCitiesCount(combinedCities.length);

    // Set featured destinations (top Indian heritage cities + some international)
    const featuredCities = [
      ...indianFeaturedCities.slice(0, 2), // Top 2 Indian heritage cities
      ...internationalCities.slice(0, 1)   // 1 international city
    ];
    setFeaturedDestinations(featuredCities);

    console.log("✨ Featured cities set:", featuredCities.length);
  }, []);

  // Function to add new city (can be called from other parts of the app)
  const addNewCity = (newCity: Omit<City, 'id'>) => {
    const cityWithId = {
      ...newCity,
      id: Date.now(), // Simple ID generation
      isNew: true
    }

    setAllCities(prev => [cityWithId, ...prev]) // Add to beginning to show new cities first
    setTotalCitiesCount(prev => prev + 1)

    // Update featured destinations if it's a high-rating city
    if (newCity.rating >= 4.5) {
      setFeaturedDestinations(prev => [cityWithId, ...prev.slice(0, 2)]) // Keep top 3
    }
  }

  // Function to update city popularity (simulating real-time updates)
  const updateCityPopularity = (cityId: number, newPopularity: number) => {
    setAllCities(prev => 
      prev.map(city => 
        city.id === cityId 
          ? { ...city, popularityScore: newPopularity }
          : city
      )
    )
  }

  // Function to fetch user trips
  const fetchUserTrips = async () => {
    if (!user) return;
    
    setIsLoadingTrips(true);
    try {
      const trips = await tripService.getUserTrips(user.account.$id);
      setUserTrips(trips as unknown as Trip[]);
    } catch (error) {
      console.error('Error fetching user trips:', error);
    } finally {
      setIsLoadingTrips(false);
    }
  }

  // Function to handle Add to Trip button click
  const handleAddToTrip = (city: City) => {
    setSelectedCity(city);
    fetchUserTrips();
    setIsTripsDialogOpen(true);
  }

  // Function to add city to selected trip
  const addCityToTrip = (tripId: string) => {
    if (!selectedCity) return;
    
    console.log('Adding city to trip:', {
      cityId: selectedCity.id,
      cityName: selectedCity.name,
      tripId: tripId
    });
    
    // Navigate to trip itinerary with city ID as query parameter
    router.push(`/trips/${tripId}/itinerary?cityId=${selectedCity.id}`);
    setIsTripsDialogOpen(false);
  }

  // Memoized computed values to prevent recalculation and ensure they're always available
  const countries = useMemo(() => {
    const countryList = Array.from(new Set(allCities.map((city) => city.country))).sort();
    console.log("🌍 Countries available:", countryList);
    return countryList;
  }, [allCities]);

  const regions = useMemo(() => {
    const extractedRegions = Array.from(new Set(
      allCities
        .map((city) => city.region)
        .filter(Boolean) // Remove undefined/null values
    ));

    const regionList = extractedRegions.length > 0 
      ? extractedRegions.sort()
      : ["Asia", "Europe", "North America", "South America", "Africa", "Oceania"];

    console.log("🗺️ Regions available:", regionList);
    return regionList;
  }, [allCities]);

  // Filtering logic with debugging
  useEffect(() => {
    console.log("🔍 Filtering with:", { searchQuery, selectedCountry, selectedRegion, totalCities: allCities.length });

    const filtered = allCities.filter((city) => {
      const matchesSearch =
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCountry = selectedCountry === "All Countries" || city.country === selectedCountry;

      const matchesRegion = selectedRegion === "" || city.region === selectedRegion;

      const matches = matchesSearch && matchesCountry && matchesRegion;

      // Debug logging for first few cities
      if (allCities.indexOf(city) < 3) {
        console.log(`🔍 City ${city.name}:`, { matchesSearch, matchesCountry, matchesRegion, matches });
      }

      return matches;
    });

    // Sort by popularity and show new cities first
    const sorted = filtered.sort((a, b) => {
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      return b.popularityScore - a.popularityScore;
    });

    console.log("📊 Filtered results:", sorted.length);
    setFilteredCities(sorted);
  }, [searchQuery, selectedCountry, selectedRegion, allCities]);

  const getCostLevel = (costIndex: number) => {
    if (costIndex < 90) return { label: "Budget", color: "bg-green-100 text-green-800" };
    if (costIndex < 130) return { label: "Moderate", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Expensive", color: "bg-red-100 text-red-800" };
  }

  // Demo function to simulate adding a new city
  const handleAddDemoCity = () => {
    const demoCities = [
      {
        name: "Jaipur",
        country: "India", 
        costIndex: 85,
        popularityScore: 88,
        imageUrl: "https://images.unsplash.com/photo-1574928817088-a34dd2e0ec8a?w=400&h=300&fit=crop&crop=center",
        description: "Pink City with magnificent palaces and forts",
        rating: 4.6,
        travelers: "1.2M",
        region: "Asia"
      },
      {
        name: "Goa",
        country: "India",
        costIndex: 75,
        popularityScore: 85,
        imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop&crop=center",
        description: "Tropical beaches and Portuguese heritage",
        rating: 4.4,
        travelers: "2.8M",
        region: "Asia"
      }
    ];

    const randomCity = demoCities[Math.floor(Math.random() * demoCities.length)];
    addNewCity(randomCity);
  }

  // Debug button for testing data loading
  const handleDebugData = () => {
    const debugInfo = debugCityData();
    console.table(debugInfo);
    alert(`Loaded ${debugInfo.totalCities} cities. Check console for details.`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Indian Heritage Cities ✈️</h1>
          <p className="text-muted-foreground">Explore India's rich cultural heritage and historic monuments</p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-1" />
              <span>{totalCitiesCount} destinations</span>
            </div>
            
          </div>
        </div>

        

        {/* Featured Cities */}
        {featuredDestinations.length > 0 && (
          <div className="max-w-6xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">✨ Featured Heritage Destinations</h3>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                Most Visited
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredDestinations.map((city) => {
                const costLevel = getCostLevel(city.costIndex);
                return (
                  <Card key={`featured-${city.id}`} className="overflow-hidden hover:shadow-lg transition-shadow border-orange-200">
                    <div className="relative">
                      <img
                        src={city.imageUrl}
                        alt={city.name}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          console.log(`Failed to load image for ${city.name}`);
                          (e.target as HTMLImageElement).src = "/placeholder.jpg";
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-orange-500 text-white">Featured</Badge>
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge className={costLevel.color}>{costLevel.label}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{city.name}</h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3 mr-1" />
                            {city.country}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-sm">
                            <Star className="w-3 h-3 text-yellow-500 mr-1" />
                            {city.rating}
                          </div>
                          <div className="text-xs text-muted-foreground">{city.travelers}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search heritage cities, monuments, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Countries">All Countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Top Regional Selections */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Explore by Region</h3>
            <div className="flex flex-wrap gap-2">
              {regions.length > 0 ? (
                regions.map((region) => (
                  <Button
                    key={region}
                    variant="outline"
                    size="sm"
                    className={selectedRegion === region ? "bg-blue-100 border-blue-300" : ""}
                    onClick={() => setSelectedRegion(selectedRegion === region ? "" : region)}
                  >
                    {region}
                  </Button>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">Loading regions...</div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              All Heritage Destinations ({filteredCities.length} cities)
            </h2>
            {filteredCities.some(city => city.isNew) && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                🆕 {filteredCities.filter(city => city.isNew).length} new
              </Badge>
            )}
          </div>

          {filteredCities.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No heritage cities found</h3>
              <p className="text-gray-600">Try adjusting your search terms or filters</p>
              {allCities.length === 0 && (
                <p className="text-red-600 mt-2">⚠️ No data loaded. Check console for errors.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCities.map((city) => {
                const costLevel = getCostLevel(city.costIndex);
                return (
                  <Card 
                    key={city.id} 
                    className={`overflow-hidden hover:shadow-lg transition-shadow ${
                      city.isNew ? 'border-green-300 shadow-md' : ''
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={city.imageUrl}
                        alt={city.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          console.log(`Failed to load image for ${city.name}`);
                          (e.target as HTMLImageElement).src = "/placeholder.jpg";
                        }}
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Badge className={costLevel.color}>{costLevel.label}</Badge>
                        {city.isNew && (
                          <Badge className="bg-green-500 text-white">New</Badge>
                        )}
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <CardTitle className="text-lg">{city.name}</CardTitle>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3 mr-1" />
                            {city.country}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-sm">
                            <Star className="w-3 h-3 text-yellow-500 mr-1" />
                            {city.rating}
                          </div>
                          <div className="text-xs text-muted-foreground">{city.travelers} travelers</div>
                        </div>
                      </div>

                      <CardDescription className="mb-3 line-clamp-2">{city.description}</CardDescription>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <DollarSign className="w-3 h-3 mr-1" />
                          Cost Index: {city.costIndex}
                        </div>
                        <div className="text-sm text-muted-foreground">Popularity: {city.popularityScore}%</div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                          onClick={() => handleAddToTrip(city)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add to Trip
                        </Button>
                        
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add to Trip Dialog */}
      <Dialog open={isTripsDialogOpen} onOpenChange={setIsTripsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add {selectedCity?.name} to Trip</DialogTitle>
            <DialogDescription>
              Select a trip to add {selectedCity?.name} to your itinerary.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            {isLoadingTrips ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-sm text-gray-500">Loading your trips...</p>
              </div>
            ) : userTrips.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You don't have any trips yet.</p>
                <Button 
                  onClick={() => router.push('/trips/create')}
                  className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                >
                  Create Your First Trip
                </Button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {userTrips.map((trip) => (
                  <Card 
                    key={trip.$id} 
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => addCityToTrip(trip.$id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{trip.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{trip.destination}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              ₹{trip.budget.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <Badge 
                          variant={trip.status === 'ongoing' ? 'default' : trip.status === 'completed' ? 'secondary' : 'outline'}
                          className="ml-2"
                        >
                          {trip.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}