"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Globe, 
  MapPin, 
  Star, 
  TrendingUp, 
  Activity as ActivityIcon, 
  Search, 
  DollarSign,
  Eye,
  Edit,
  Plus,
  Calendar,
  Users
} from "lucide-react"
import { getPopularDestinations, getTopActivitiesByCategory, getRegionalAnalytics, getAdminStats } from "@/lib/admin-data"
import { getCities, getActivities } from "@/lib/data"

export default function CitiesAnalytics() {
  const [searchQuery, setSearchQuery] = useState("")
  const [regionFilter, setRegionFilter] = useState("all")
  const [sortBy, setSortBy] = useState("popularity")

  const stats = useMemo(() => getAdminStats(), [])
  const popularDestinations = useMemo(() => getPopularDestinations(), [])
  const activities = useMemo(() => getActivities(), [])
  const cities = useMemo(() => getCities(), [])
  const activityCategories = useMemo(() => getTopActivitiesByCategory(), [])
  const regionalAnalytics = useMemo(() => getRegionalAnalytics(), [])

  // INR formatter
  const formatINR = useMemo(() => 
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }), []
  )

  const formatNumber = useMemo(() => 
    new Intl.NumberFormat("en-IN"), []
  )

  const filteredCities = useMemo(() => {
    let filtered = popularDestinations

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(city =>
        city.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Region filter (would need region data in popularDestinations)
    if (regionFilter !== "all") {
      // For demo, we'll use the city names to infer regions
      const regionCities = cities.filter(city => city.region === regionFilter).map(city => city.name)
      filtered = filtered.filter(dest => regionCities.includes(dest.cityName))
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.popularity - a.popularity
        case "trips":
          return b.totalTrips - a.totalTrips
        case "budget":
          return b.totalBudget - a.totalBudget
        case "rating":
          return b.avgRating - a.avgRating
        case "name":
          return a.cityName.localeCompare(b.cityName)
        default:
          return 0
      }
    })

    return filtered
  }, [popularDestinations, cities, searchQuery, regionFilter, sortBy])

  const regions = useMemo(() => [...new Set(cities.map(city => city.region))], [cities])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cities & Activities Analytics</h1>
            <p className="mt-2 text-sm text-gray-600">
              Monitor destination performance and activity engagement across India
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add New City
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cities</CardTitle>
            <Globe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber.format(stats.totalCities)}</div>
            <p className="text-xs text-muted-foreground">Available destinations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <ActivityIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber.format(stats.totalActivities)}</div>
            <p className="text-xs text-muted-foreground">Available experiences</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Activity Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatINR.format(Math.round(activities.reduce((sum, act) => sum + act.cost, 0) / activities.length))}
            </div>
            <p className="text-xs text-muted-foreground">Per activity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. City Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(cities.reduce((sum, city) => sum + city.rating, 0) / cities.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Overall satisfaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Regional Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Regional Performance
          </CardTitle>
          <CardDescription>Trip distribution and performance across Indian regions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {regionalAnalytics.map((region) => (
                <div key={region.name} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{region.name}</h4>
                    <Badge variant="outline">{formatNumber.format(region.totalTrips)} trips</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Cities</div>
                      <div className="font-medium">{formatNumber.format(region.cities)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Avg. Cost</div>
                      <div className="font-medium">₹{formatNumber.format(region.avgCostIndex)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Avg. Rating</div>
                      <div className="font-medium flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        {region.avgRating}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress 
                      value={(region.totalTrips / Math.max(...regionalAnalytics.map(r => r.totalTrips))) * 100}
                      className="h-2" 
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Activity Categories Distribution</h4>
              {activityCategories.slice(0, 6).map((category, index) => (
                <div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{category.category}</div>
                      <div className="text-xs text-muted-foreground">
                        Avg: {formatINR.format(category.avgCost)} • ⭐ {category.avgRating}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">{formatNumber.format(category.count)} activities</Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* City Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Destination Performance</CardTitle>
          <CardDescription>Detailed analytics for all Indian destinations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="trips">Trip Count</SelectItem>
                <SelectItem value="budget">Total Budget</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {formatNumber.format(filteredCities.length)} destinations
            </p>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Destination</TableHead>
                  <TableHead>Trips</TableHead>
                  <TableHead>Total Budget</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Popularity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <Globe className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-muted-foreground">No cities found matching your criteria</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCities.map((destination, index) => (
                    <TableRow key={destination.cityId}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{destination.cityName}</div>
                            <div className="text-sm text-muted-foreground">{destination.country}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-muted-foreground mr-1" />
                          <span className="font-medium">{formatNumber.format(destination.totalTrips)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-muted-foreground mr-1" />
                          <span className="font-medium">{formatINR.format(destination.totalBudget)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{destination.avgRating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="flex-1 mr-2">
                            <Progress value={destination.popularity} className="h-2" />
                          </div>
                          <span className="text-sm text-muted-foreground">{destination.popularity}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Top Activities by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Activity Categories</CardTitle>
            <CardDescription>Most popular types of experiences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activityCategories.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{category.category}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatNumber.format(category.count)} activities • Avg: {formatINR.format(category.avgCost)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{category.avgRating}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity Trends</CardTitle>
            <CardDescription>Latest activity additions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.slice(0, 8).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{activity.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {activity.category} • {activity.durationHours}h • 
                      <Star className="w-3 h-3 text-yellow-500 inline mx-1" />
                      {activity.rating}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatINR.format(activity.cost)}</div>
                    <Badge variant="outline" className="text-xs">{activity.category}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}