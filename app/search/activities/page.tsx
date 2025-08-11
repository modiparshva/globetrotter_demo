"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Clock, DollarSign, Plus, Filter, Star, MapPin } from "lucide-react"

interface Activity {
  id: number
  name: string
  description: string
  category: string
  cost: number
  durationHours: number
  rating: number
  imageUrl: string
  city: string
  country: string
}

const mockActivities: Activity[] = [
  {
    id: 1,
    name: "Visit Senso-ji Temple",
    description: "Ancient Buddhist temple in Asakusa district with traditional architecture and cultural significance",
    category: "Cultural",
    cost: 0,
    durationHours: 2,
    rating: 4.5,
    imageUrl: "/tokyo-skyline-night.png",
    city: "Tokyo",
    country: "Japan",
  },
  {
    id: 2,
    name: "Tokyo Skytree Observatory",
    description: "Panoramic city views from 634m tower, one of the tallest structures in the world",
    category: "Sightseeing",
    cost: 25,
    durationHours: 2,
    rating: 4.3,
    imageUrl: "/tokyo-skyline-night.png",
    city: "Tokyo",
    country: "Japan",
  },
  {
    id: 3,
    name: "Tsukiji Fish Market Tour",
    description: "Early morning tuna auction and fresh sushi breakfast experience",
    category: "Food",
    cost: 45,
    durationHours: 3,
    rating: 4.7,
    imageUrl: "/tokyo-skyline-night.png",
    city: "Tokyo",
    country: "Japan",
  },
  {
    id: 4,
    name: "Eiffel Tower Visit",
    description: "Iconic iron tower with breathtaking city views and romantic atmosphere",
    category: "Sightseeing",
    cost: 30,
    durationHours: 2,
    rating: 4.4,
    imageUrl: "/paris-eiffel-tower.png",
    city: "Paris",
    country: "France",
  },
  {
    id: 5,
    name: "Louvre Museum",
    description: "World's largest art museum featuring the Mona Lisa and countless masterpieces",
    category: "Cultural",
    cost: 20,
    durationHours: 4,
    rating: 4.6,
    imageUrl: "/paris-eiffel-tower.png",
    city: "Paris",
    country: "France",
  },
  {
    id: 6,
    name: "Seine River Cruise",
    description: "Romantic boat tour along the Seine with views of historic landmarks",
    category: "Leisure",
    cost: 35,
    durationHours: 1,
    rating: 4.2,
    imageUrl: "/paris-eiffel-tower.png",
    city: "Paris",
    country: "France",
  },
]

export default function ActivitySearch() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [costRange, setCostRange] = useState<string>("all")
  const [durationRange, setDurationRange] = useState<string>("all")
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>(mockActivities)

  useEffect(() => {
    const filtered = activities.filter((activity) => {
      const matchesSearch =
        activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "all" || activity.category === selectedCategory
      const matchesCity = selectedCity === "all" || activity.city === selectedCity

      const matchesCost =
        costRange === "all" ||
        (costRange === "free" && activity.cost === 0) ||
        (costRange === "low" && activity.cost > 0 && activity.cost <= 20) ||
        (costRange === "medium" && activity.cost > 20 && activity.cost <= 50) ||
        (costRange === "high" && activity.cost > 50)

      const matchesDuration =
        durationRange === "all" ||
        (durationRange === "short" && activity.durationHours <= 2) ||
        (durationRange === "medium" && activity.durationHours > 2 && activity.durationHours <= 4) ||
        (durationRange === "long" && activity.durationHours > 4)

      return matchesSearch && matchesCategory && matchesCity && matchesCost && matchesDuration
    })

    setFilteredActivities(filtered)
  }, [searchQuery, selectedCategory, selectedCity, costRange, durationRange, activities])

  const categories = Array.from(new Set(activities.map((activity) => activity.category)))
  const cities = Array.from(new Set(activities.map((activity) => activity.city)))

  const getCostBadge = (cost: number) => {
    if (cost === 0) return { label: "Free", color: "bg-green-100 text-green-800" }
    if (cost <= 20) return { label: "Budget", color: "bg-blue-100 text-blue-800" }
    if (cost <= 50) return { label: "Moderate", color: "bg-yellow-100 text-yellow-800" }
    return { label: "Premium", color: "bg-red-100 text-red-800" }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Activities</h1>
          <p className="text-muted-foreground">Find amazing experiences for your destinations</p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search activities, experiences, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={costRange} onValueChange={setCostRange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Cost" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Cost</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="low">$1-20</SelectItem>
                  <SelectItem value="medium">$21-50</SelectItem>
                  <SelectItem value="high">$50+</SelectItem>
                </SelectContent>
              </Select>

              <Select value={durationRange} onValueChange={setDurationRange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Duration</SelectItem>
                  <SelectItem value="short">≤ 2 hours</SelectItem>
                  <SelectItem value="medium">2-4 hours</SelectItem>
                  <SelectItem value="long">4+ hours</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                More
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Results ({filteredActivities.length} activities)</h2>
          </div>

          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-600">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity) => {
                const costBadge = getCostBadge(activity.cost)
                return (
                  <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-1/4">
                        <img
                          src={activity.imageUrl || "/placeholder.svg?height=200&width=300"}
                          alt={activity.name}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-3/4 p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-xl">{activity.name}</CardTitle>
                              <Badge variant="secondary">{activity.category}</Badge>
                              <Badge className={costBadge.color}>{costBadge.label}</Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                              <MapPin className="w-3 h-3 mr-1" />
                              {activity.city}, {activity.country}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center">
                                <Star className="w-3 h-3 text-yellow-500 mr-1" />
                                {activity.rating}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {activity.durationHours}h
                              </div>
                              <div className="flex items-center">
                                <DollarSign className="w-3 h-3 mr-1" />
                                {activity.cost === 0 ? "Free" : `$${activity.cost}`}
                              </div>
                            </div>
                          </div>
                        </div>

                        <CardDescription className="mb-4 line-clamp-2">{activity.description}</CardDescription>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                            onClick={() => {
                              alert(`Added "${activity.name}" to your trip! (Feature in development)`)
                            }}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add to Trip
                          </Button>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
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
