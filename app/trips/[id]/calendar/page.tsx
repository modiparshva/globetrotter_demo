"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, MapPin, Clock, Star, Plus } from "lucide-react"
import Link from "next/link"
import { getTripWithDetails, getCityById, getActivityById } from "@/lib/data"

export default function TripCalendar() {
  const params = useParams()
  const router = useRouter()
  const tripId = Number.parseInt(params.id as string)

  const tripData = getTripWithDetails(tripId)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"calendar" | "timeline">("calendar")

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

  // Generate calendar days
  const startDate = new Date(tripData.startDate)
  const endDate = new Date(tripData.endDate)
  const tripDays = []

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    tripDays.push(new Date(d))
  }

  // Get activities for a specific date
  const getActivitiesForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    const activities = []

    for (const stop of tripData.stops) {
      const city = getCityById(stop.cityId)
      if (!city) continue

      for (const activity of stop.activities) {
        if (activity.scheduledDate === dateString) {
          const activityDetails = getActivityById(activity.activityId)
          if (activityDetails) {
            activities.push({
              ...activity,
              details: activityDetails,
              city: city,
            })
          }
        }
      }
    }

    return activities.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
  }

  // Get current stop for a date
  const getStopForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]

    for (const stop of tripData.stops) {
      if (dateString >= stop.startDate && dateString <= stop.endDate) {
        return {
          ...stop,
          city: getCityById(stop.cityId),
        }
      }
    }
    return null
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href={`/trips/${tripId}`}>
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Trip
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Trip Calendar</h1>
              <p className="text-muted-foreground mt-1">{tripData.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Select value={viewMode} onValueChange={(value: "calendar" | "timeline") => setViewMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="calendar">Calendar</SelectItem>
                <SelectItem value="timeline">Timeline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Trip Overview */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{tripDays.length}</div>
                <div className="text-sm text-muted-foreground">Total Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{tripData.stops.length}</div>
                <div className="text-sm text-muted-foreground">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {tripData.stops.reduce((total, stop) => total + stop.activities.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Activities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  $
                  {tripData.stops
                    .reduce(
                      (total, stop) => total + stop.activities.reduce((actTotal, act) => actTotal + act.cost, 0),
                      0,
                    )
                    .toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Activities Cost</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={viewMode} onValueChange={setViewMode} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <div className="space-y-6">
              {tripDays.length === 0 ? (
                <Card className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No dates planned</h3>
                  <p className="text-gray-600 mb-4">Set your trip dates to see the calendar view</p>
                  <Link href={`/trips/${tripId}/edit`}>
                    <Button>Edit Trip Dates</Button>
                  </Link>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {tripDays.map((day, index) => {
                    const currentStop = getStopForDate(day)
                    const dayActivities = getActivitiesForDate(day)
                    const isToday = day.toDateString() === new Date().toDateString()

                    return (
                      <Card key={index} className={`overflow-hidden ${isToday ? "ring-2 ring-blue-500" : ""}`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                Day {index + 1}
                                {isToday && <Badge className="ml-2 text-xs">Today</Badge>}
                              </CardTitle>
                              <CardDescription>
                                {day.toLocaleDateString("en-US", {
                                  weekday: "long",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </CardDescription>
                            </div>
                            {currentStop?.city && (
                              <div className="text-right">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {currentStop.city.name}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {dayActivities.length === 0 ? (
                            <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                              <Plus className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">No activities planned</p>
                              <Link href={`/search/activities`}>
                                <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                                  Add Activity
                                </Button>
                              </Link>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {dayActivities.map((activity, actIndex) => (
                                <div key={actIndex} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                  <div className="flex-shrink-0">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-medium text-sm truncate">{activity.details.name}</h4>
                                      <Badge variant="outline" className="text-xs">
                                        ${activity.cost}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {formatTime(activity.scheduledTime)}
                                      <span className="mx-2">•</span>
                                      <Star className="w-3 h-3 mr-1" />
                                      {activity.details.rating}
                                    </div>
                                    {activity.notes && (
                                      <p className="text-xs text-muted-foreground mt-1 truncate">{activity.notes}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                              <div className="text-center pt-2">
                                <div className="text-xs text-muted-foreground">
                                  Total: ${dayActivities.reduce((sum, act) => sum + act.cost, 0)}
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            <div className="space-y-6">
              {tripDays.length === 0 ? (
                <Card className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No timeline available</h3>
                  <p className="text-gray-600 mb-4">Set your trip dates to see the timeline view</p>
                  <Link href={`/trips/${tripId}/edit`}>
                    <Button>Edit Trip Dates</Button>
                  </Link>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Trip Timeline</CardTitle>
                    <CardDescription>Complete day-by-day breakdown of your {tripDays.length}-day trip</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-orange-500"></div>

                      <div className="space-y-8">
                        {tripDays.map((day, index) => {
                          const currentStop = getStopForDate(day)
                          const dayActivities = getActivitiesForDate(day)
                          const isToday = day.toDateString() === new Date().toDateString()

                          return (
                            <div key={index} className="relative flex items-start">
                              {/* Timeline dot */}
                              <div
                                className={`absolute left-6 w-4 h-4 rounded-full border-2 border-white ${
                                  isToday ? "bg-blue-500" : "bg-gray-300"
                                } shadow-sm z-10`}
                              ></div>

                              {/* Content */}
                              <div className="ml-16 flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <h3 className="font-semibold text-lg">
                                      Day {index + 1} -{" "}
                                      {day.toLocaleDateString("en-US", {
                                        weekday: "long",
                                        month: "long",
                                        day: "numeric",
                                      })}
                                      {isToday && <Badge className="ml-2">Today</Badge>}
                                    </h3>
                                    {currentStop?.city && (
                                      <div className="flex items-center text-muted-foreground">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {currentStop.city.name}, {currentStop.city.country}
                                      </div>
                                    )}
                                  </div>
                                  {dayActivities.length > 0 && (
                                    <Badge variant="outline">{dayActivities.length} activities</Badge>
                                  )}
                                </div>

                                {dayActivities.length === 0 ? (
                                  <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center">
                                    <p className="text-sm text-gray-600 mb-2">No activities planned for this day</p>
                                    <Link href={`/search/activities`}>
                                      <Button variant="outline" size="sm">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Activity
                                      </Button>
                                    </Link>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    {dayActivities.map((activity, actIndex) => (
                                      <div
                                        key={actIndex}
                                        className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm"
                                      >
                                        <div className="flex items-center space-x-4">
                                          <div className="text-center">
                                            <div className="text-sm font-medium">
                                              {formatTime(activity.scheduledTime)}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                              {activity.details.durationHours}h
                                            </div>
                                          </div>
                                          <div className="flex-1">
                                            <h4 className="font-medium">{activity.details.name}</h4>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                              <Badge variant="secondary" className="mr-2 text-xs">
                                                {activity.details.category}
                                              </Badge>
                                              <Star className="w-3 h-3 mr-1" />
                                              {activity.details.rating}
                                            </div>
                                            {activity.notes && (
                                              <p className="text-sm text-muted-foreground mt-1">{activity.notes}</p>
                                            )}
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div className="font-medium">${activity.cost}</div>
                                          <div className="text-xs text-muted-foreground">{activity.city.name}</div>
                                        </div>
                                      </div>
                                    ))}
                                    <div className="text-right text-sm text-muted-foreground">
                                      Daily total: ${dayActivities.reduce((sum, act) => sum + act.cost, 0)}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
