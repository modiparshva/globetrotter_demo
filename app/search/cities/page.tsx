"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Star, DollarSign, Plus, Filter, Globe, TrendingUp } from "lucide-react"

interface City {
  id: number
  name: string
  country: string
  costIndex: number
  popularityScore: number
  imageUrl: string
  description: string
  rating: number
  travelers: string
  isNew?: boolean // Flag to identify newly added cities
  region?: string
}

// Initial mock cities data
const initialMockCities: City[] = [
  {
    id: 1,
    name: "Tokyo",
    country: "Japan",
    costIndex: 150,
    popularityScore: 95,
    imageUrl: "/tokyo-skyline-night.png",
    description: "Modern metropolis with rich culture and amazing food",
    rating: 4.8,
    travelers: "2.1M",
    region: "Asia"
  },
  {
    id: 2,
    name: "Paris",
    country: "France",
    costIndex: 140,
    popularityScore: 92,
    imageUrl: "/paris-eiffel-tower.png",
    description: "City of lights, art, and romance",
    rating: 4.6,
    travelers: "1.8M",
    region: "Europe"
  },
  {
    id: 3,
    name: "Bali",
    country: "Indonesia",
    costIndex: 80,
    popularityScore: 88,
    imageUrl: "/bali-temple.png",
    description: "Tropical paradise with stunning temples and beaches",
    rating: 4.7,
    travelers: "1.2M",
    region: "Asia"
  },
  {
    id: 4,
    name: "Dubai",
    country: "UAE",
    costIndex: 160,
    popularityScore: 85,
    imageUrl: "/dubai-skyline.png",
    description: "Luxury destination with modern architecture",
    rating: 4.5,
    travelers: "900K",
    region: "Asia"
  },
]

// Featured/Popular cities that get highlighted
const featuredCities = [
  {
    id: 101,
    name: "Santorini",
    country: "Greece",
    costIndex: 145,
    popularityScore: 90,
    imageUrl: "/santorini-sunset.png",
    description: "Breathtaking sunsets and white-washed buildings",
    rating: 4.9,
    travelers: "850K",
    region: "Europe",
    isNew: true
  },
  {
    id: 102,
    name: "Iceland",
    country: "Iceland",
    costIndex: 170,
    popularityScore: 87,
    imageUrl: "/iceland-northern-lights.png",
    description: "Northern lights and stunning natural wonders",
    rating: 4.8,
    travelers: "650K",
    region: "Europe",
    isNew: true
  }
]

export default function CitySearch() {
  // State management like in the trips page
  const [allCities, setAllCities] = useState<City[]>([])
  const [featuredDestinations, setFeaturedDestinations] = useState<City[]>(featuredCities)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<string>("All Countries")
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>("")
  const [filteredCities, setFilteredCities] = useState<City[]>([])
  const [totalCitiesCount, setTotalCitiesCount] = useState(0)

  // Initialize cities on component mount
  useEffect(() => {
    // Combine initial mock cities with featured cities
    const combinedCities = [...initialMockCities, ...featuredCities]
    setAllCities(combinedCities)
    setTotalCitiesCount(combinedCities.length)
  }, [])

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

  // Memoized computed values to prevent recalculation and ensure they're always available
  const countries = useMemo(() => {
    return Array.from(new Set(allCities.map((city) => city.country)))
  }, [allCities])

  const regions = useMemo(() => {
    const extractedRegions = Array.from(new Set(
      allCities
        .map((city) => city.region)
        .filter(Boolean) // Remove undefined/null values
    ))
    
    // Return extracted regions or fallback to predefined ones
    return extractedRegions.length > 0 
      ? extractedRegions 
      : ["Asia", "Europe", "North America", "South America", "Africa", "Oceania"]
  }, [allCities])

  // Filtering logic
  useEffect(() => {
    const filtered = allCities.filter((city) => {
      const matchesSearch =
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCountry = selectedCountry === "All Countries" || city.country === selectedCountry
      
      const matchesRegion = selectedRegion === "" || city.region === selectedRegion

      return matchesSearch && matchesCountry && matchesRegion
    })

    // Sort by popularity and show new cities first
    const sorted = filtered.sort((a, b) => {
      if (a.isNew && !b.isNew) return -1
      if (!a.isNew && b.isNew) return 1
      return b.popularityScore - a.popularityScore
    })

    setFilteredCities(sorted)
  }, [searchQuery, selectedCountry, selectedRegion, allCities])

  const getCostLevel = (costIndex: number) => {
    if (costIndex < 90) return { label: "Budget", color: "bg-green-100 text-green-800" }
    if (costIndex < 130) return { label: "Moderate", color: "bg-yellow-100 text-yellow-800" }
    return { label: "Expensive", color: "bg-red-100 text-red-800" }
  }

  // Demo function to simulate adding a new city
  const handleAddDemoCity = () => {
    const demoCities = [
      {
        name: "Barcelona",
        country: "Spain",
        costIndex: 120,
        popularityScore: 89,
        imageUrl: "/barcelona-sagrada.png",
        description: "Gothic architecture and Mediterranean vibes",
        rating: 4.7,
        travelers: "1.5M",
        region: "Europe"
      },
      {
        name: "Seoul",
        country: "South Korea",
        costIndex: 110,
        popularityScore: 86,
        imageUrl: "/seoul-skyline.png",
        description: "K-culture and modern technology hub",
        rating: 4.6,
        travelers: "1.3M",
        region: "Asia"
      }
    ]
    
    const randomCity = demoCities[Math.floor(Math.random() * demoCities.length)]
    addNewCity(randomCity)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Cities ✈️</h1>
          <p className="text-muted-foreground">Find your next destination and add it to your trip</p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-1" />
              <span>{totalCitiesCount} destinations</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>{allCities.filter(city => city.isNew).length} newly added</span>
            </div>
          </div>
        </div>

        {/* Demo Add Button (for testing) */}
        <div className="max-w-4xl mx-auto mb-4 text-center">
          <Button 
            onClick={handleAddDemoCity} 
            variant="outline" 
            size="sm"
            className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Demo City (Test Dynamic Update)
          </Button>
        </div>

        {/* Featured Cities */}
        {featuredDestinations.length > 0 && (
          <div className="max-w-6xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">✨ Featured Destinations</h3>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                Trending
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredDestinations.slice(0, 2).map((city) => {
                const costLevel = getCostLevel(city.costIndex)
                return (
                  <Card key={`featured-${city.id}`} className="overflow-hidden hover:shadow-lg transition-shadow border-orange-200">
                    <div className="relative">
                      <img
                        src={city.imageUrl || "/placeholder.svg?height=150&width=400"}
                        alt={city.name}
                        className="w-full h-32 object-cover"
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
                )
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
                placeholder="Search cities, countries, or descriptions..."
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

          {/* Top Regional Selections - Fixed with safe rendering */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Top Regional Selections</h3>
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
              All Destinations ({filteredCities.length} cities)
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cities found</h3>
              <p className="text-gray-600">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCities.map((city) => {
                const costLevel = getCostLevel(city.costIndex)
                return (
                  <Card 
                    key={city.id} 
                    className={`overflow-hidden hover:shadow-lg transition-shadow ${
                      city.isNew ? 'border-green-300 shadow-md' : ''
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={city.imageUrl || "/placeholder.svg?height=200&width=400"}
                        alt={city.name}
                        className="w-full h-48 object-cover"
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
                          onClick={() => {
                            // Simulate adding to trip and increasing popularity
                            updateCityPopularity(city.id, Math.min(city.popularityScore + 1, 100))
                            alert(`Added ${city.name} to your trip! (Feature in development)`)
                          }}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add to Trip
                        </Button>
                        <Button size="sm" variant="outline">
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
