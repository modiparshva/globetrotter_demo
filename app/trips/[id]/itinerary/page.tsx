"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, MapPin, ArrowLeft, Plus, GripVertical, Edit, Trash2, Clock, DollarSign, Save } from "lucide-react"
import Link from "next/link"
import { getTripWithDetails, getCities, getActivitiesByCityId } from "@/lib/data"

export default function TripItinerary() {
  const params = useParams()
  const router = useRouter()
  const tripId = Number.parseInt(params.id as string)

  const tripData = getTripWithDetails(tripId)
  const allCities = getCities()

  const [isAddingStop, setIsAddingStop] = useState(false)
  const [newStop, setNewStop] = useState({
    cityId: "",
    startDate: "",
    endDate: "",
    budget: 0,
    notes: "",
  })

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

  const handleAddStop = () => {
    if (!newStop.cityId || !newStop.startDate || !newStop.endDate) {
      alert("Please fill in all required fields")
      return
    }

    // Simulate adding stop
    console.log("Adding stop:", newStop)
    setIsAddingStop(false)
    setNewStop({
      cityId: "",
      startDate: "",
      endDate: "",
      budget: 0,
      notes: "",
    })
  }

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return `${startDate.toLocaleDateString("en-IN")} - ${endDate.toLocaleDateString("en-IN")}`
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
              <h1 className="text-3xl font-bold text-gray-900">Build Your Indian Journey</h1>
              <p className="text-muted-foreground mt-1">{tripData.name}</p>
            </div>
          </div>
          <Dialog open={isAddingStop} onOpenChange={setIsAddingStop}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Stop
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Stop</DialogTitle>
                <DialogDescription>Add a new Indian destination to your trip itinerary</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Select City *</Label>
                  <Select
                    value={newStop.cityId}
                    onValueChange={(value) => setNewStop((prev) => ({ ...prev, cityId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an Indian city" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCities.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                          {city.name}, {city.country || "India"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newStop.startDate}
                      onChange={(e) => setNewStop((prev) => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newStop.endDate}
                      onChange={(e) => setNewStop((prev) => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (INR)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="15000"
                      value={newStop.budget}
                      onChange={(e) =>
                        setNewStop((prev) => ({ ...prev, budget: Number.parseFloat(e.target.value) || 0 }))
                      }
                      className="pl-8"
                      step="500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special notes for this Indian destination..."
                    value={newStop.notes}
                    onChange={(e) => setNewStop((prev) => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddStop} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Add Stop
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingStop(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Trip Overview */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{formatNumber.format(tripData.stops.length)}</div>
                <div className="text-sm text-muted-foreground">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatNumber.format(Math.ceil(
                    (new Date(tripData.endDate).getTime() - new Date(tripData.startDate).getTime()) /
                      (1000 * 60 * 60 * 24),
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {formatINR.format(tripData.stops.reduce((total, stop) => total + stop.budget, 0))}
                </div>
                <div className="text-sm text-muted-foreground">Total Budget</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatNumber.format(tripData.stops.reduce((total, stop) => total + stop.activities.length, 0))}
                </div>
                <div className="text-sm text-muted-foreground">Activities</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Itinerary Sections */}
        <div className="space-y-6">
          {tripData.stops.length === 0 ? (
            <Card className="p-12 text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Start Building Your Indian Itinerary</h3>
              <p className="text-gray-600 mb-6">
                Add Indian destinations to create your perfect travel plan across incredible India. You can reorder them later.
              </p>
              <Button onClick={() => setIsAddingStop(true)} size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Indian Stop
              </Button>
            </Card>
          ) : (
            tripData.stops
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((stop, index) => {
                const city = allCities.find((c) => c.id === stop.cityId)
                if (!city) return null

                return (
                  <Card key={stop.id} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-orange-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex items-center mr-4">
                            <GripVertical className="w-5 h-5 text-gray-400 mr-2 cursor-move" />
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <img
                              src={city.imageUrl || "/placeholder.svg"}
                              alt={city.name}
                              className="w-12 h-12 rounded-lg object-cover mr-4"
                            />
                            <div>
                              <CardTitle className="text-xl">{city.name}</CardTitle>
                              <CardDescription className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {city.country || "India"} • {formatDateRange(stop.startDate, stop.endDate)}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />{formatINR.format(stop.budget)}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Stop Details */}
                        <div>
                          <h4 className="font-medium mb-3">Stop Information</h4>
                          <div className="space-y-3">
                            <div className="flex items-center text-sm">
                              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                              <span>
                                {formatNumber.format(Math.ceil(
                                  (new Date(stop.endDate).getTime() - new Date(stop.startDate).getTime()) /
                                    (1000 * 60 * 60 * 24),
                                ))}{" "}
                                days
                              </span>
                            </div>
                            <div className="flex items-center text-sm">
                              <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                              <span>Budget: {formatINR.format(stop.budget)}</span>
                            </div>
                            {stop.notes && (
                              <div className="text-sm text-muted-foreground">
                                <strong>Notes:</strong> {stop.notes}
                              </div>
                            )}
                          </div>
                          <div className="mt-4">
                            <Link href={`/search/activities?city=${city.id}`}>
                              <Button variant="outline" size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Activities
                              </Button>
                            </Link>
                          </div>
                        </div>

                        {/* Activities */}
                        <div>
                          <h4 className="font-medium mb-3">Planned Activities ({formatNumber.format(stop.activities.length)})</h4>
                          {stop.activities.length === 0 ? (
                            <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                              <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">No activities planned yet</p>
                              <Link href={`/search/activities?city=${city.id}`}>
                                <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                                  Browse Indian Experiences
                                </Button>
                              </Link>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {stop.activities.map((activity) => {
                                const activityDetails = allCities
                                  .flatMap((c) => getActivitiesByCityId(c.id))
                                  .find((a) => a.id === activity.activityId)

                                if (!activityDetails) return null

                                return (
                                  <div
                                    key={activity.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                  >
                                    <div className="flex items-center">
                                      <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                                      <div>
                                        <div className="font-medium text-sm">{activityDetails.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {new Date(activity.scheduledDate).toLocaleDateString("en-IN")} at {activity.scheduledTime}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        {formatINR.format(activity.cost)}
                                      </Badge>
                                      <Button variant="ghost" size="sm">
                                        <Edit className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
          )}
        </div>

        {/* Add Another Section Button */}
        {tripData.stops.length > 0 && (
          <div className="text-center pt-6">
            <Button
              onClick={() => setIsAddingStop(true)}
              variant="outline"
              size="lg"
              className="border-dashed border-2"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Another Indian Stop
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
