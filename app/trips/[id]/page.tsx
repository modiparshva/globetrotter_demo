"use client"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, ArrowLeft, Edit, Share2, DollarSign, Clock, Star, Plus } from "lucide-react"
import Link from "next/link"
import { getTripWithDetails, getCityById, getActivityById } from "@/lib/data"

export default function TripDetails() {
  const params = useParams()
  const router = useRouter()
  const tripId = Number.parseInt(params.id as string)

  const tripData = getTripWithDetails(tripId)

  if (!tripData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trip Not Found</h1>
          <p className="text-gray-600 mb-4">The trip you're looking for doesn't exist.</p>
          <Link href="/trips">
            <Button>Back to Trips</Button>
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
  }

  const totalActivitiesCost = tripData.stops.reduce((total, stop) => {
    return total + stop.activities.reduce((stopTotal, activity) => stopTotal + activity.cost, 0)
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="mr-4" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{tripData.name}</h1>
              <p className="text-muted-foreground mt-1">{tripData.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/trips/${tripId}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Link href={`/shared/${tripData.shareToken}`}>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </Link>
          </div>
        </div>

        {/* Trip Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <img
                src={tripData.coverImage || "/placeholder.svg?height=300&width=600"}
                alt={tripData.name}
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant={tripData.status === "upcoming" ? "default" : "secondary"} className="text-sm">
                    {tripData.status.charAt(0).toUpperCase() + tripData.status.slice(1)}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDateRange(tripData.startDate, tripData.endDate)}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{tripData.stops.length}</div>
                    <div className="text-sm text-muted-foreground">Destinations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.ceil(
                        (new Date(tripData.endDate).getTime() - new Date(tripData.startDate).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">${tripData.totalBudget.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Budget</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {tripData.stops.reduce((total, stop) => total + stop.activities.length, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Activities</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Budget Overview */}
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
                    <span className="font-semibold">${tripData.totalBudget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Spent</span>
                    <span className="font-semibold">${tripData.spent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Activities Cost</span>
                    <span className="font-semibold">${totalActivitiesCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Remaining</span>
                    <span className="font-semibold text-green-600">
                      ${(tripData.totalBudget - tripData.spent).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-orange-500 h-2 rounded-full"
                      style={{ width: `${Math.min((tripData.spent / tripData.totalBudget) * 100, 100)}%` }}
                    />
                  </div>
                  <Link href={`/trips/${tripId}/budget`}>
                    <Button className="w-full bg-transparent" variant="outline">
                      View Detailed Budget
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/trips/${tripId}/itinerary`}>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    Edit Itinerary
                  </Button>
                </Link>
                <Link href={`/trips/${tripId}/calendar`}>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Calendar
                  </Button>
                </Link>
                <Link href={`/search/activities`}>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Activities
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trip Details Tabs */}
        <Tabs defaultValue="itinerary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="itinerary">
            <div className="space-y-6">
              {tripData.stops.length === 0 ? (
                <Card className="p-8 text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations added yet</h3>
                  <p className="text-gray-600 mb-4">Start building your itinerary by adding destinations</p>
                  <Link href={`/trips/${tripId}/itinerary`}>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Destinations
                    </Button>
                  </Link>
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
                  <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No activities planned yet</h3>
                  <p className="text-gray-600 mb-4">Add some exciting activities to your trip</p>
                  <Link href={`/search/activities`}>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Browse Activities
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Trip Notes</CardTitle>
                <CardDescription>Keep track of important information about your trip</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">General Notes</h4>
                    <p className="text-sm text-muted-foreground">
                      {tripData.description || "No general notes added yet."}
                    </p>
                  </div>
                  {tripData.stops.map((stop, index) => {
                    const city = getCityById(stop.cityId)
                    if (!city || !stop.notes) return null

                    return (
                      <div key={stop.id} className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium mb-2">{city.name} Notes</h4>
                        <p className="text-sm text-muted-foreground">{stop.notes}</p>
                      </div>
                    )
                  })}
                  <Button variant="outline" className="w-full bg-transparent">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
