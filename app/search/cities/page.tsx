"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Star, DollarSign, Plus, Filter, Globe } from "lucide-react"

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
}

const mockCities: City[] = [
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
  },
]

export default function CitySearch() {
  const [cities, setCities] = useState<City[]>(mockCities)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<string>("All Countries")
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [filteredCities, setFilteredCities] = useState<City[]>(mockCities)

  useEffect(() => {
    const filtered = cities.filter((city) => {
      const matchesSearch =
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCountry = !selectedCountry || city.country === selectedCountry

      return matchesSearch && matchesCountry
    })

    setFilteredCities(filtered)
  }, [searchQuery, selectedCountry, cities])

  const getCostLevel = (costIndex: number) => {
    if (costIndex < 90) return { label: "Budget", color: "bg-green-100 text-green-800" }
    if (costIndex < 130) return { label: "Moderate", color: "bg-yellow-100 text-yellow-800" }
    return { label: "Expensive", color: "bg-red-100 text-red-800" }
  }

  const countries = Array.from(new Set(cities.map((city) => city.country)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Cities</h1>
          <p className="text-muted-foreground">Find your next destination and add it to your trip</p>
        </div>

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

          {/* Top Regional Selections */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Top Regional Selections</h3>
            <div className="flex flex-wrap gap-2">
              {["Europe", "Asia", "North America", "South America", "Africa", "Oceania"].map((region) => (
                <Button
                  key={region}
                  variant="outline"
                  size="sm"
                  className={selectedRegion === region ? "bg-blue-100 border-blue-300" : ""}
                  onClick={() => setSelectedRegion(selectedRegion === region ? "" : region)}
                >
                  {region}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Results ({filteredCities.length} cities)</h2>
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
                  <Card key={city.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={city.imageUrl || "/placeholder.svg?height=200&width=400"}
                        alt={city.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={costLevel.color}>{costLevel.label}</Badge>
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
