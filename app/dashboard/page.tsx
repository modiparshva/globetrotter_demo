"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  MapPin,
  Plus,
  Search,
  TrendingUp,
  Users,
  Wallet,
  Plane,
  Clock,
  Star,
  Globe,
  Camera,
  Heart,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useTrips } from "@/hooks/use-trips"
import { getCities, getCommunityActivity } from "@/lib/data"
import DestinationCarousel from "@/components/destination-carousel"

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const { user, isLoading: isAuthLoading } = useAuth()
  const { trips, isLoadingTrips } = useTrips()

  // Static data that remains the same
  const cities = getCities()
  const popularDestinations = cities.slice(0, 4)
  const recentActivities = getCommunityActivity()

  // Calculate user statistics from real trip data
  const userStats = useMemo(() => {
    if (!trips) return { totalTrips: 0, countriesVisited: 0, totalBudget: 0, sharedPlans: 0 }

    const totalTrips = trips.length
    const totalBudget = trips.reduce((sum, trip) => sum + trip.budget, 0)
    const uniqueDestinations = new Set(trips.map(trip => trip.destination))
    const countriesVisited = uniqueDestinations.size
    const sharedPlans = trips.filter(trip => trip.status === 'planning').length

    return {
      totalTrips,
      countriesVisited,
      totalBudget,
      sharedPlans,
    }
  }, [trips])

  // Filter upcoming trips
  const upcomingTrips = useMemo(() => {
    if (!trips) return []
    return trips.filter((trip) => trip.status === "planning" || trip.status === "ongoing")
  }, [trips])

  // Show loading state
  if (isAuthLoading || isLoadingTrips) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-muted-foreground">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Please sign in</h3>
            <p className="text-gray-600 mb-4">You need to be signed in to view your dashboard.</p>
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.profile?.firstName || 'Traveler'}! ✈️</h2>
              <p className="text-lg text-muted-foreground">
                Ready to plan your next adventure? Let's make it unforgettable.
              </p>
            </div>
            <Link href="/trips/create">
              <Button
                size="lg"
                className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
              >
                <Plus className="w-5 h-5 mr-2" />
                Plan New Trip
              </Button>
            </Link>
          </div>

          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold">Featured Destinations</h3>
              <Link href="/search/cities">
                <Button variant="outline" size="sm">
                  <Globe className="w-4 h-4 mr-1" />
                  Explore All
                </Button>
              </Link>
            </div>
            <DestinationCarousel />
          </section>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Trips</p>
                    <p className="text-2xl font-bold">{userStats.totalTrips}</p>
                  </div>
                  <Plane className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Destinations</p>
                    <p className="text-2xl font-bold">{userStats.countriesVisited}</p>
                  </div>
                  <Globe className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Total Budget</p>
                    <p className="text-2xl font-bold">${userStats.totalBudget.toLocaleString()}</p>
                  </div>
                  <Wallet className="w-8 h-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Planning Trips</p>
                    <p className="text-2xl font-bold">{userStats.sharedPlans}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upcoming Trips */}
          <div className="lg:col-span-2 space-y-6">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold">Upcoming Trips</h3>
                <Link href="/trips">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {upcomingTrips.length === 0 ? (
                  <Card className="p-8 text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No upcoming trips</h4>
                    <p className="text-gray-600 mb-4">Start planning your next adventure!</p>
                    <Link href="/trips/create">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Plan New Trip
                      </Button>
                    </Link>
                  </Card>
                ) : (
                  upcomingTrips.map((trip) => (
                    <Card key={trip.$id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <img
                            src={trip.image || "/placeholder.svg"}
                            alt={trip.name}
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </div>
                        <div className="md:w-2/3 p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-xl font-semibold mb-1">{trip.name}</h4>
                              <div className="flex items-center text-muted-foreground mb-2">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span className="text-sm">
                                  {new Date(trip.startDate).toLocaleDateString()} -{" "}
                                  {new Date(trip.endDate).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center text-muted-foreground">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span className="text-sm">{trip.destination}</span>
                              </div>
                            </div>
                            <Badge variant={trip.status === "ongoing" ? "default" : "secondary"}>
                              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Budget Allocated</span>
                              <span>${trip.budget.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-orange-500 h-2 rounded-full"
                                style={{ width: `${trip.status === 'planning' ? 10 : 50}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex space-x-2 mt-4">
                            <Link href={`/trips/${trip.$id}`}>
                              <Button size="sm" variant="outline">
                                <Calendar className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                            </Link>
                            <Link href={`/trips/${trip.$id}/itinerary`}>
                              <Button size="sm" variant="outline">
                                <MapPin className="w-4 h-4 mr-1" />
                                Edit Itinerary
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </section>

            {/* Popular Destinations */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold">Popular Destinations</h3>
                <Link href="/search/cities">
                  <Button variant="outline" size="sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    View All
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularDestinations.map((destination) => (
                  <Card
                    key={destination.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    <div className="relative">
                      <img
                        src={destination.imageUrl || "/placeholder.svg"}
                        alt={destination.name}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">
                        {destination.name}, {destination.country || "India"}
                      </h4>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span>{destination.rating}</span>
                        </div>
                        <span>{destination.travelers} travelers</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-muted-foreground">Cost Index: {destination.costIndex}</span>
                        <Link href={`/search/cities`}>
                          <Button size="sm" variant="outline">
                            Explore
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Activity Feed & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/trips/create">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Plan Weekend Getaway
                  </Button>
                </Link>
                <Link href="/search/activities">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Search className="w-4 h-4 mr-2" />
                    Discover Activities
                  </Button>
                </Link>
                <Link href="/search/cities">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Camera className="w-4 h-4 mr-2" />
                    Browse Destinations
                  </Button>
                </Link>
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                  onClick={() => alert("Community feature coming soon!")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join Travel Groups
                </Button>
              </CardContent>
            </Card>

            {/* Budget Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="w-5 h-5 mr-2" />
                  Budget Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Budget</span>
                    <span className="font-semibold">${userStats.totalBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Trips</span>
                    <span className="font-semibold text-blue-600">{upcomingTrips.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg. Trip Cost</span>
                    <span className="font-semibold">
                      ${Math.round(userStats.totalBudget / Math.max(userStats.totalTrips, 1)).toLocaleString()}
                    </span>
                  </div>
                  <Link href="/trips">
                    <Button className="w-full mt-4 bg-transparent" variant="outline">
                      View All Trips
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Community Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Community Activity
                </CardTitle>
                <CardDescription>See what fellow travelers are up to</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {activity.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-transparent" variant="outline" size="sm">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
