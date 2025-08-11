"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  MapPin,
  Globe,
  Heart,
  Share2,
  Copy,
  Facebook,
  Twitter,
  Instagram,
  Clock,
  Star,
  DollarSign,
  Users,
  Eye,
} from "lucide-react"
import Link from "next/link"
import { getTripByToken, getTripWithDetails, getCityById, getActivityById, getUserById } from "@/lib/data"

export default function SharedTrip() {
  const params = useParams()
  const token = params.token as string

  const trip = getTripByToken(token)
  const tripData = trip ? getTripWithDetails(trip.id) : null
  const tripOwner = trip ? getUserById(trip.userId) : null

  const [copied, setCopied] = useState(false)

  if (!trip || !tripData || !tripOwner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trip Not Found</h1>
          <p className="text-gray-600 mb-4">This shared trip link is invalid or has been removed.</p>
          <Link href="/dashboard">
            <Button>Explore GlobeTrotter</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyTrip = () => {
    // Simulate copying trip to user's account
    alert("Trip copied to your account! (Feature in development)")
  }

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
  }

  const tripDays = Math.ceil(
    (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24),
  )
  const totalActivitiesCost = tripData.stops.reduce((total, stop) => {
    return total + stop.activities.reduce((stopTotal, activity) => stopTotal + activity.cost, 0)
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-orange-500 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  GlobeTrotter
                </h1>
                <p className="text-xs text-muted-foreground">Shared Trip</p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyLink}>
                {copied ? (
                  "Copied!"
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>
              <Button onClick={handleCopyTrip} className="bg-gradient-to-r from-blue-600 to-orange-500">
                <Heart className="w-4 h-4 mr-2" />
                Copy Trip
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Trip Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.name}</h1>
              <p className="text-lg text-muted-foreground mb-4">{trip.description}</p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDateRange(trip.startDate, trip.endDate)}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {tripData.stops.length} destinations
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  Public Trip
                </div>
              </div>
            </div>
            <div className="text-center">
              <Avatar className="w-16 h-16 mx-auto mb-2">
                <AvatarImage src={tripOwner.profileImage || "/placeholder.svg"} />
                <AvatarFallback>
                  {tripOwner.firstName[0]}
                  {tripOwner.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium">
                  {tripOwner.firstName} {tripOwner.lastName}
                </div>
                <div className="text-muted-foreground">Trip Creator</div>
              </div>
            </div>
          </div>

          {/* Trip Cover Image */}
          <Card className="overflow-hidden mb-6">
            <img
              src={trip.coverImage || "/placeholder.svg?height=400&width=800"}
              alt={trip.name}
              className="w-full h-64 md:h-80 object-cover"
            />
          </Card>

          {/* Trip Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{tripDays}</div>
                <div className="text-sm text-muted-foreground">Days</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{tripData.stops.length}</div>
                <div className="text-sm text-muted-foreground">Destinations</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {tripData.stops.reduce((total, stop) => total + stop.activities.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Activities</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">${totalActivitiesCost}</div>
                <div className="text-sm text-muted-foreground">Est. Cost</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Social Sharing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Share2 className="w-5 h-5 mr-2" />
              Share This Trip
            </CardTitle>
            <CardDescription>Inspire others with this amazing travel plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-4">
              <Button variant="outline" size="sm">
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
              <Button variant="outline" size="sm">
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button variant="outline" size="sm">
                <Instagram className="w-4 h-4 mr-2" />
                Instagram
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyLink}>
                <Copy className="w-4 h-4 mr-2" />
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Trip Details */}
        <Tabs defaultValue="itinerary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
          </TabsList>

          <TabsContent value="itinerary">
            <div className="space-y-6">
              {tripData.stops.length === 0 ? (
                <Card className="p-8 text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations planned</h3>
                  <p className="text-gray-600">This trip doesn't have any destinations yet.</p>
                </Card>
              ) : (
                tripData.stops
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((stop, index) => {
                    const city = getCityById(stop.cityId)
                    if (!city) return null

                    return (
                      <Card key={stop.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                                {index + 1}
                              </div>
                              <div>
                                <CardTitle>
                                  {city.name}, {city.country}
                                </CardTitle>
                                <CardDescription>
                                  {formatDateRange(stop.startDate, stop.endDate)} • Budget: $
                                  {stop.budget.toLocaleString()}
                                </CardDescription>
                              </div>
                            </div>
                            <img
                              src={city.imageUrl || "/placeholder.svg"}
                              alt={city.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          </div>
                        </CardHeader>
                        <CardContent>
                          {stop.notes && <p className="text-sm text-muted-foreground mb-4">{stop.notes}</p>}
                          {stop.activities.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Planned Activities ({stop.activities.length})</h4>
                              <div className="space-y-2">
                                {stop.activities.map((activity) => {
                                  const activityDetails = getActivityById(activity.activityId)
                                  if (!activityDetails) return null

                                  return (
                                    <div
                                      key={activity.id}
                                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                    >
                                      <div className="flex items-center">
                                        <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                                        <div>
                                          <span className="font-medium">{activityDetails.name}</span>
                                          <div className="text-xs text-muted-foreground">
                                            {activity.scheduledDate} at {activity.scheduledTime}
                                          </div>
                                        </div>
                                      </div>
                                      <Badge variant="outline">${activity.cost}</Badge>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })
              )}
            </div>
          </TabsContent>

          <TabsContent value="activities">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tripData.stops.flatMap((stop) =>
                stop.activities.map((activity) => {
                  const activityDetails = getActivityById(activity.activityId)
                  const city = getCityById(stop.cityId)
                  if (!activityDetails || !city) return null

                  return (
                    <Card key={activity.id} className="overflow-hidden">
                      <img
                        src={activityDetails.imageUrl || "/placeholder.svg"}
                        alt={activityDetails.name}
                        className="w-full h-32 object-cover"
                      />
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-1">{activityDetails.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{city.name}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-500 mr-1" />
                            {activityDetails.rating}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {activityDetails.durationHours}h
                          </div>
                          <Badge variant="outline">${activity.cost}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {activity.scheduledDate} at {activity.scheduledTime}
                        </div>
                      </CardContent>
                    </Card>
                  )
                }),
              )}
              {tripData.stops.flatMap((stop) => stop.activities).length === 0 && (
                <div className="col-span-full text-center py-8">
                  <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No activities planned</h3>
                  <p className="text-gray-600">This trip doesn't have any activities yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="budget">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Budget Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Budget</span>
                      <span className="font-semibold">${trip.totalBudget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Activities Cost</span>
                      <span className="font-semibold">${totalActivitiesCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Daily Budget</span>
                      <span className="font-semibold">${Math.round(trip.totalBudget / tripDays).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget by Destination</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tripData.stops.map((stop, index) => {
                      const city = getCityById(stop.cityId)
                      if (!city) return null

                      return (
                        <div key={stop.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                              {index + 1}
                            </div>
                            <span className="font-medium text-sm">{city.name}</span>
                          </div>
                          <span className="font-semibold">${stop.budget.toLocaleString()}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-orange-50 border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Love this trip?</h3>
            <p className="text-muted-foreground mb-6">
              Copy it to your account and customize it for your own adventure
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={handleCopyTrip} size="lg" className="bg-gradient-to-r from-blue-600 to-orange-500">
                <Heart className="w-5 h-5 mr-2" />
                Copy This Trip
              </Button>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  <Users className="w-5 h-5 mr-2" />
                  Join GlobeTrotter
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
