"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
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

// Mock data for demonstration
const upcomingTrips = [
  {
    id: 1,
    destination: "Tokyo, Japan",
    dates: "Dec 15-22, 2024",
    budget: 2800,
    spent: 1200,
    image: "/tokyo-skyline-night.png",
    status: "Planning",
    stops: 3,
  },
  {
    id: 2,
    destination: "Paris, France",
    dates: "Jan 10-17, 2025",
    budget: 3200,
    spent: 800,
    image: "/paris-eiffel-tower.png",
    status: "Booked",
    stops: 2,
  },
]

const popularDestinations = [
  {
    name: "Bali, Indonesia",
    image: "/bali-temple.png",
    avgBudget: "$1,200",
    rating: 4.8,
    travelers: "2.3k",
  },
  {
    name: "Santorini, Greece",
    image: "/santorini-sunset.png",
    avgBudget: "$2,100",
    rating: 4.9,
    travelers: "1.8k",
  },
  {
    name: "Dubai, UAE",
    image: "/dubai-skyline.png",
    avgBudget: "$2,800",
    rating: 4.7,
    travelers: "3.1k",
  },
  {
    name: "Iceland",
    image: "/iceland-northern-lights.png",
    avgBudget: "$2,400",
    rating: 4.9,
    travelers: "1.2k",
  },
]

const recentActivities = [
  {
    user: "Sarah M.",
    action: "shared her Tokyo itinerary",
    time: "2 hours ago",
    avatar: "/woman-profile.png",
  },
  {
    user: "Mike R.",
    action: "completed trip to Barcelona",
    time: "1 day ago",
    avatar: "/man-profile.png",
  },
  {
    user: "Emma L.",
    action: "added 5 activities to Rome trip",
    time: "2 days ago",
    avatar: "/woman-profile-two.png",
  },
]

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  // const router = useRouter()

  // useEffect(() => {
  //   // Redirect to dashboard on home page access
  //   router.push("/dashboard")
  // }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-orange-500 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  GlobeTrotter
                </h1>
                <p className="text-sm text-muted-foreground">Your journey starts here</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Avatar>
                <AvatarImage src="/diverse-user-avatars.png" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John! ✈️</h2>
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
                    <p className="text-2xl font-bold">12</p>
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
                    <p className="text-2xl font-bold">8</p>
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
                    <p className="text-2xl font-bold">$6,000</p>
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
                    <p className="text-2xl font-bold">5</p>
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
                {upcomingTrips.map((trip) => (
                  <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={trip.image || "/placeholder.svg"}
                          alt={trip.destination}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-xl font-semibold mb-1">{trip.destination}</h4>
                            <div className="flex items-center text-muted-foreground mb-2">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span className="text-sm">{trip.dates}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span className="text-sm">{trip.stops} stops planned</span>
                            </div>
                          </div>
                          <Badge variant={trip.status === "Booked" ? "default" : "secondary"}>{trip.status}</Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Budget Progress</span>
                            <span>
                              ${trip.spent} / ${trip.budget}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-orange-500 h-2 rounded-full"
                              style={{ width: `${(trip.spent / trip.budget) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex space-x-2 mt-4">
                          <Link href={`/trips/${trip.id}/itinerary`}>
                            <Button size="sm" variant="outline">
                              <Calendar className="w-4 h-4 mr-1" />
                              Edit Itinerary
                            </Button>
                          </Link>
                          <Button size="sm" variant="outline" onClick={() => alert("Share functionality coming soon!")}>
                            <Users className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Popular Destinations */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold">Popular Destinations</h3>
                <Button variant="outline" size="sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  View Trending
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularDestinations.map((destination, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="relative">
                      <img
                        src={destination.image || "/placeholder.svg"}
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
                      <h4 className="font-semibold mb-2">{destination.name}</h4>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span>{destination.rating}</span>
                        </div>
                        <span>{destination.travelers} travelers</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-medium text-green-600">{destination.avgBudget}</span>
                        <Button size="sm" variant="outline">
                          Explore
                        </Button>
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
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                  onClick={() => alert("Feature coming soon!")}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Browse Travel Photos
                </Button>
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                  onClick={() => alert("Feature coming soon!")}
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
                    <span className="text-sm text-muted-foreground">This Month</span>
                    <span className="font-semibold">$2,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Remaining Budget</span>
                    <span className="font-semibold text-green-600">$4,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg. Trip Cost</span>
                    <span className="font-semibold">$2,500</span>
                  </div>
                  <Button className="w-full mt-4 bg-transparent" variant="outline">
                    View Budget Details
                  </Button>
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
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
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
