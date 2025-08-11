"use client"

import { useState } from "react"
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
} from "lucide-react"
import Link from "next/link"
import { getUsers, getTrips, getCities, getCommunityActivity, getTripsByUserId } from "@/lib/data"

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  // Get data from JSON
  const users = getUsers()
  const currentUser = users[0] // Simulate logged in user
  const allTrips = getTrips()
  const userTrips = getTripsByUserId(currentUser.id)
  const upcomingTrips = userTrips.filter((trip) => trip.status === "upcoming" || trip.status === "planning")
  const cities = getCities()
  const popularDestinations = cities.slice(0, 4) // Get first 4 cities
  const recentActivities = getCommunityActivity()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {currentUser.firstName}! ✈️</h2>
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Trips</p>
                    <p className="text-2xl font-bold">{currentUser.totalTrips}</p>
                  </div>
                  <Plane className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Countries Visited</p>
                    <p className="text-2xl font-bold">{currentUser.countriesVisited}</p>
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
                    <p className="text-2xl font-bold">${currentUser.totalBudget.toLocaleString()}</p>
                  </div>
                  <Wallet className="w-8 h-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Shared Plans</p>
                    <p className="text-2xl font-bold">{currentUser.sharedPlans}</p>
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
                    <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <img
                            src={trip.coverImage || "/placeholder.svg"}
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
                                <span className="text-sm">{trip.destinationCount} destinations</span>
                              </div>
                            </div>
                            <Badge variant={trip.status === "upcoming" ? "default" : "secondary"}>
                              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Budget Progress</span>
                              <span>
                                ${trip.spent.toLocaleString()} / ${trip.totalBudget.toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-orange-500 h-2 rounded-full"
                                style={{ width: `${Math.min((trip.spent / trip.totalBudget) * 100, 100)}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex space-x-2 mt-4">
                            <Link href={`/trips/${trip.id}`}>
                              <Button size="sm" variant="outline">
                                <Calendar className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                            </Link>
                            <Link href={`/trips/${trip.id}/itinerary`}>
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
                        {destination.name}, {destination.country}
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
                    <span className="font-semibold">${currentUser.totalBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Trips</span>
                    <span className="font-semibold text-blue-600">{upcomingTrips.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg. Trip Cost</span>
                    <span className="font-semibold">
                      ${Math.round(currentUser.totalBudget / Math.max(currentUser.totalTrips, 1)).toLocaleString()}
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
