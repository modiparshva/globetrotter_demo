"use client"

<<<<<<< HEAD
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useTrip } from "@/hooks/use-trips"
import { databases, DATABASE_ID, ITINERARY_COLLECTION_ID, ACTIVITIES_COLLECTION_ID } from "@/lib/appwrite"
import { ID, Query } from "appwrite"
=======
import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
>>>>>>> origin/dishant
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
<<<<<<< HEAD
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
=======
>>>>>>> origin/dishant
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
<<<<<<< HEAD
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
  Calendar, 
  MapPin, 
  ArrowLeft, 
  Plus, 
  GripVertical, 
  Edit, 
  Trash2, 
  Clock, 
  DollarSign, 
  Save,
  Loader2,
  X
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface ItineraryStop {
  $id: string
  tripId: string
  destination: string
  startDate: string
  endDate: string
  budget: number
  notes: string
  orderIndex: number
  $createdAt: string
  $updatedAt: string
}

interface Activity {
  $id: string
  stopId: string
  name: string
  description: string
  scheduledDate: string
  scheduledTime: string
  duration: number
  cost: number
  location: string
  category: string
  $createdAt: string
  $updatedAt: string
}
=======
import { Calendar, MapPin, ArrowLeft, Plus, GripVertical, Edit, Trash2, Clock, DollarSign, Save } from "lucide-react"
import Link from "next/link"
import { getTripWithDetails, getCities, getActivitiesByCityId } from "@/lib/data"
>>>>>>> origin/dishant

export default function TripItinerary() {
  const params = useParams()
  const router = useRouter()
<<<<<<< HEAD
  const { user } = useAuth()
  const tripId = params.id as string
  const { trip, isLoadingTrip } = useTrip(tripId)

  const [itineraryStops, setItineraryStops] = useState<ItineraryStop[]>([])
  const [activities, setActivities] = useState<{ [stopId: string]: Activity[] }>({})
  const [isLoadingItinerary, setIsLoadingItinerary] = useState(true)
  const [isAddingStop, setIsAddingStop] = useState(false)
  const [editingStop, setEditingStop] = useState<ItineraryStop | null>(null)
  const [deletingStopId, setDeletingStopId] = useState<string | null>(null)
  const [isAddingActivity, setIsAddingActivity] = useState<string | null>(null)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [deletingActivityId, setDeletingActivityId] = useState<string | null>(null)

  const [newStop, setNewStop] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    notes: "",
  })

  const [newActivity, setNewActivity] = useState({
    name: "",
    description: "",
    scheduledDate: "",
    scheduledTime: "",
    duration: "",
    cost: "",
    location: "",
    category: "sightseeing",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Fetch itinerary stops and activities
  useEffect(() => {
    if (tripId) {
      fetchItinerary()
    }
  }, [tripId])

  const fetchItinerary = async () => {
    try {
      setIsLoadingItinerary(true)
      
      // Fetch itinerary stops
      const stopsResponse = await databases.listDocuments(
        DATABASE_ID,
        ITINERARY_COLLECTION_ID,
        [
          Query.equal('tripId', tripId),
          Query.orderAsc('orderIndex')
        ]
      )
      
      const stops = stopsResponse.documents as ItineraryStop[]
      setItineraryStops(stops)

      // Fetch activities for each stop
      const activitiesData: { [stopId: string]: Activity[] } = {}
      
      for (const stop of stops) {
        try {
          const activitiesResponse = await databases.listDocuments(
            DATABASE_ID,
            ACTIVITIES_COLLECTION_ID,
            [
              Query.equal('stopId', stop.$id),
              Query.orderAsc('scheduledDate'),
              Query.orderAsc('scheduledTime')
            ]
          )
          activitiesData[stop.$id] = activitiesResponse.documents as Activity[]
        } catch (error) {
          console.error(`Error fetching activities for stop ${stop.$id}:`, error)
          activitiesData[stop.$id] = []
        }
      }
      
      setActivities(activitiesData)
    } catch (error) {
      console.error("Error fetching itinerary:", error)
      toast.error("Failed to load itinerary")
    } finally {
      setIsLoadingItinerary(false)
    }
  }

  const handleAddStop = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!newStop.destination || !newStop.startDate || !newStop.endDate) {
      setError("Please fill in all required fields")
      return
    }

    if (new Date(newStop.startDate) >= new Date(newStop.endDate)) {
      setError("End date must be after start date")
      return
    }

    setIsSubmitting(true)
    try {
      const stopData = {
        tripId,
        destination: newStop.destination,
        startDate: newStop.startDate,
        endDate: newStop.endDate,
        budget: newStop.budget ? parseFloat(newStop.budget) : 0,
        notes: newStop.notes,
        orderIndex: itineraryStops.length,
      }

      const response = await databases.createDocument(
        DATABASE_ID,
        ITINERARY_COLLECTION_ID,
        ID.unique(),
        stopData
      )

      const newStopData = response as ItineraryStop
      setItineraryStops(prev => [...prev, newStopData])
      setActivities(prev => ({ ...prev, [newStopData.$id]: [] }))
      
      setIsAddingStop(false)
      setNewStop({
        destination: "",
        startDate: "",
        endDate: "",
        budget: "",
        notes: "",
      })
      
      toast.success("Stop added successfully!")
    } catch (error: any) {
      console.error("Error adding stop:", error)
      setError("Failed to add stop. Please try again.")
      toast.error("Failed to add stop")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateStop = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingStop) return
    
    setError("")
    setIsSubmitting(true)
    
    try {
      const updateData = {
        destination: editingStop.destination,
        startDate: editingStop.startDate,
        endDate: editingStop.endDate,
        budget: editingStop.budget,
        notes: editingStop.notes,
      }

      await databases.updateDocument(
        DATABASE_ID,
        ITINERARY_COLLECTION_ID,
        editingStop.$id,
        updateData
      )

      setItineraryStops(prev => 
        prev.map(stop => 
          stop.$id === editingStop.$id 
            ? { ...stop, ...updateData }
            : stop
        )
      )
      
      setEditingStop(null)
      toast.success("Stop updated successfully!")
    } catch (error: any) {
      console.error("Error updating stop:", error)
      toast.error("Failed to update stop")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteStop = async (stopId: string) => {
    try {
      // Delete all activities for this stop first
      const stopActivities = activities[stopId] || []
      for (const activity of stopActivities) {
        await databases.deleteDocument(
          DATABASE_ID,
          ACTIVITIES_COLLECTION_ID,
          activity.$id
        )
      }

      // Delete the stop
      await databases.deleteDocument(
        DATABASE_ID,
        ITINERARY_COLLECTION_ID,
        stopId
      )

      setItineraryStops(prev => prev.filter(stop => stop.$id !== stopId))
      setActivities(prev => {
        const newActivities = { ...prev }
        delete newActivities[stopId]
        return newActivities
      })
      
      setDeletingStopId(null)
      toast.success("Stop deleted successfully!")
    } catch (error: any) {
      console.error("Error deleting stop:", error)
      toast.error("Failed to delete stop")
    }
  }

  const handleAddActivity = async (e: React.FormEvent, stopId: string) => {
    e.preventDefault()
    setError("")
    
    if (!newActivity.name || !newActivity.scheduledDate || !newActivity.scheduledTime) {
      setError("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const activityData = {
        stopId,
        name: newActivity.name,
        description: newActivity.description,
        scheduledDate: newActivity.scheduledDate,
        scheduledTime: newActivity.scheduledTime,
        duration: newActivity.duration ? parseInt(newActivity.duration) : 60,
        cost: newActivity.cost ? parseFloat(newActivity.cost) : 0,
        location: newActivity.location,
        category: newActivity.category,
      }

      const response = await databases.createDocument(
        DATABASE_ID,
        ACTIVITIES_COLLECTION_ID,
        ID.unique(),
        activityData
      )

      const newActivityData = response as Activity
      setActivities(prev => ({
        ...prev,
        [stopId]: [...(prev[stopId] || []), newActivityData]
      }))
      
      setIsAddingActivity(null)
      setNewActivity({
        name: "",
        description: "",
        scheduledDate: "",
        scheduledTime: "",
        duration: "",
        cost: "",
        location: "",
        category: "sightseeing",
      })
      
      toast.success("Activity added successfully!")
    } catch (error: any) {
      console.error("Error adding activity:", error)
      setError("Failed to add activity. Please try again.")
      toast.error("Failed to add activity")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingActivity) return
    
    setError("")
    setIsSubmitting(true)
    
    try {
      const updateData = {
        name: editingActivity.name,
        description: editingActivity.description,
        scheduledDate: editingActivity.scheduledDate,
        scheduledTime: editingActivity.scheduledTime,
        duration: editingActivity.duration,
        cost: editingActivity.cost,
        location: editingActivity.location,
        category: editingActivity.category,
      }

      await databases.updateDocument(
        DATABASE_ID,
        ACTIVITIES_COLLECTION_ID,
        editingActivity.$id,
        updateData
      )

      setActivities(prev => ({
        ...prev,
        [editingActivity.stopId]: prev[editingActivity.stopId].map(activity =>
          activity.$id === editingActivity.$id
            ? { ...activity, ...updateData }
            : activity
        )
      }))
      
      setEditingActivity(null)
      toast.success("Activity updated successfully!")
    } catch (error: any) {
      console.error("Error updating activity:", error)
      toast.error("Failed to update activity")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteActivity = async (activityId: string, stopId: string) => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        ACTIVITIES_COLLECTION_ID,
        activityId
      )

      setActivities(prev => ({
        ...prev,
        [stopId]: prev[stopId].filter(activity => activity.$id !== activityId)
      }))
      
      setDeletingActivityId(null)
      toast.success("Activity deleted successfully!")
    } catch (error: any) {
      console.error("Error deleting activity:", error)
      toast.error("Failed to delete activity")
    }
  }

  const calculateTotalBudget = () => {
    return itineraryStops.reduce((total, stop) => total + stop.budget, 0)
  }

  const calculateTotalActivities = () => {
    return Object.values(activities).reduce((total, stopActivities) => total + stopActivities.length, 0)
  }

  const calculateTotalDays = () => {
    if (!trip) return 0
    return Math.ceil(
      (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
    )
  }

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
  }

  if (isLoadingTrip || isLoadingItinerary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Skeleton className="w-24 h-10 mr-4" />
            <Skeleton className="w-64 h-8" />
          </div>
          <div className="space-y-6">
            <Skeleton className="w-full h-32" />
            <Skeleton className="w-full h-96" />
          </div>
        </div>
      </div>
    )
  }

  if (!trip) {
=======
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
>>>>>>> origin/dishant
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

<<<<<<< HEAD
  // Check if user owns this trip
  if (trip.userId !== user?.account?.$id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to view this itinerary.</p>
          <Link href="/trips">
            <Button>Back to Trips</Button>
          </Link>
        </div>
      </div>
    )
=======
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
>>>>>>> origin/dishant
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
<<<<<<< HEAD
              <h1 className="text-3xl font-bold text-gray-900">Build Itinerary</h1>
              <p className="text-muted-foreground mt-1">{trip.name}</p>
=======
              <h1 className="text-3xl font-bold text-gray-900">Build Your Indian Journey</h1>
              <p className="text-muted-foreground mt-1">{tripData.name}</p>
>>>>>>> origin/dishant
            </div>
          </div>
          <Dialog open={isAddingStop} onOpenChange={setIsAddingStop}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Stop
              </Button>
            </DialogTrigger>
<<<<<<< HEAD
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Stop</DialogTitle>
                <DialogDescription>Add a new destination to your trip itinerary</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddStop} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination *</Label>
                  <Input
                    id="destination"
                    placeholder="e.g., Paris, France"
                    value={newStop.destination}
                    onChange={(e) => setNewStop((prev) => ({ ...prev, destination: e.target.value }))}
                    required
                  />
=======
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
>>>>>>> origin/dishant
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newStop.startDate}
                      onChange={(e) => setNewStop((prev) => ({ ...prev, startDate: e.target.value }))}
<<<<<<< HEAD
                      required
=======
>>>>>>> origin/dishant
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newStop.endDate}
                      onChange={(e) => setNewStop((prev) => ({ ...prev, endDate: e.target.value }))}
<<<<<<< HEAD
                      min={newStop.startDate}
                      required
=======
>>>>>>> origin/dishant
                    />
                  </div>
                </div>
                <div className="space-y-2">
<<<<<<< HEAD
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="0"
                    value={newStop.budget}
                    onChange={(e) => setNewStop((prev) => ({ ...prev, budget: e.target.value }))}
                    min="0"
                    step="0.01"
                  />
=======
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
>>>>>>> origin/dishant
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
<<<<<<< HEAD
                    placeholder="Any special notes for this destination..."
=======
                    placeholder="Any special notes for this Indian destination..."
>>>>>>> origin/dishant
                    value={newStop.notes}
                    onChange={(e) => setNewStop((prev) => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
<<<<<<< HEAD
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Add Stop
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddingStop(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
=======
                  <Button onClick={handleAddStop} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Add Stop
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingStop(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
>>>>>>> origin/dishant
            </DialogContent>
          </Dialog>
        </div>

        {/* Trip Overview */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
<<<<<<< HEAD
                <div className="text-2xl font-bold text-blue-600">{itineraryStops.length}</div>
                <div className="text-sm text-muted-foreground">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{calculateTotalDays()}</div>
=======
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
>>>>>>> origin/dishant
                <div className="text-sm text-muted-foreground">Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
<<<<<<< HEAD
                  ${calculateTotalBudget().toLocaleString()}
=======
                  {formatINR.format(tripData.stops.reduce((total, stop) => total + stop.budget, 0))}
>>>>>>> origin/dishant
                </div>
                <div className="text-sm text-muted-foreground">Total Budget</div>
              </div>
              <div className="text-center">
<<<<<<< HEAD
                <div className="text-2xl font-bold text-purple-600">{calculateTotalActivities()}</div>
=======
                <div className="text-2xl font-bold text-purple-600">
                  {formatNumber.format(tripData.stops.reduce((total, stop) => total + stop.activities.length, 0))}
                </div>
>>>>>>> origin/dishant
                <div className="text-sm text-muted-foreground">Activities</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Itinerary Sections */}
        <div className="space-y-6">
<<<<<<< HEAD
          {itineraryStops.length === 0 ? (
            <Card className="p-12 text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Start Building Your Itinerary</h3>
              <p className="text-gray-600 mb-6">
                Add destinations to create your perfect travel plan. You can reorder them later.
              </p>
              <Button onClick={() => setIsAddingStop(true)} size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Stop
              </Button>
            </Card>
          ) : (
            itineraryStops.map((stop, index) => (
              <Card key={stop.$id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-orange-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center mr-4">
                        <GripVertical className="w-5 h-5 text-gray-400 mr-2 cursor-move" />
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-xl">{stop.destination}</CardTitle>
                        <CardDescription className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDateRange(stop.startDate, stop.endDate)}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center">
                        <DollarSign className="w-3 h-3 mr-1" />
                        ${stop.budget.toLocaleString()}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingStop(stop)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setDeletingStopId(stop.$id)}
                      >
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
                            {Math.ceil(
                              (new Date(stop.endDate).getTime() - new Date(stop.startDate).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            days
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span>Budget: ${stop.budget.toLocaleString()}</span>
                        </div>
                        {stop.notes && (
                          <div className="text-sm text-muted-foreground">
                            <strong>Notes:</strong> {stop.notes}
                          </div>
                        )}
                      </div>
                      <div className="mt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsAddingActivity(stop.$id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Activity
                        </Button>
                      </div>
                    </div>

                    {/* Activities */}
                    <div>
                      <h4 className="font-medium mb-3">
                        Planned Activities ({activities[stop.$id]?.length || 0})
                      </h4>
                      {!activities[stop.$id] || activities[stop.$id].length === 0 ? (
                        <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                          <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">No activities planned yet</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => setIsAddingActivity(stop.$id)}
                          >
                            Add First Activity
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {activities[stop.$id].map((activity) => (
                            <div
                              key={activity.$id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center flex-1">
                                <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{activity.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {new Date(activity.scheduledDate).toLocaleDateString()} at {activity.scheduledTime}
                                    {activity.location && ` • ${activity.location}`}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  ${activity.cost}
                                </Badge>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setEditingActivity(activity)}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setDeletingActivityId(activity.$id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
=======
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
>>>>>>> origin/dishant
          )}
        </div>

        {/* Add Another Section Button */}
<<<<<<< HEAD
        {itineraryStops.length > 0 && (
=======
        {tripData.stops.length > 0 && (
>>>>>>> origin/dishant
          <div className="text-center pt-6">
            <Button
              onClick={() => setIsAddingStop(true)}
              variant="outline"
              size="lg"
              className="border-dashed border-2"
            >
              <Plus className="w-5 h-5 mr-2" />
<<<<<<< HEAD
              Add Another Stop
=======
              Add Another Indian Stop
>>>>>>> origin/dishant
            </Button>
          </div>
        )}
      </div>
<<<<<<< HEAD

      {/* Edit Stop Dialog */}
      <Dialog open={editingStop !== null} onOpenChange={() => setEditingStop(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Stop</DialogTitle>
            <DialogDescription>Update the details for this destination</DialogDescription>
          </DialogHeader>
          {editingStop && (
            <form onSubmit={handleUpdateStop} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-destination">Destination *</Label>
                <Input
                  id="edit-destination"
                  value={editingStop.destination}
                  onChange={(e) => setEditingStop({...editingStop, destination: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Start Date *</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={editingStop.startDate}
                    onChange={(e) => setEditingStop({...editingStop, startDate: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">End Date *</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={editingStop.endDate}
                    onChange={(e) => setEditingStop({...editingStop, endDate: e.target.value})}
                    min={editingStop.startDate}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-budget">Budget ($)</Label>
                <Input
                  id="edit-budget"
                  type="number"
                  value={editingStop.budget}
                  onChange={(e) => setEditingStop({...editingStop, budget: parseFloat(e.target.value) || 0})}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editingStop.notes}
                  onChange={(e) => setEditingStop({...editingStop, notes: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Stop
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditingStop(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Activity Dialog */}
      <Dialog open={isAddingActivity !== null} onOpenChange={() => setIsAddingActivity(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Activity</DialogTitle>
            <DialogDescription>Plan an activity for this destination</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => isAddingActivity && handleAddActivity(e, isAddingActivity)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="activity-name">Activity Name *</Label>
              <Input
                id="activity-name"
                placeholder="e.g., Visit Eiffel Tower"
                value={newActivity.name}
                onChange={(e) => setNewActivity((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity-description">Description</Label>
              <Textarea
                id="activity-description"
                placeholder="Brief description of the activity..."
                value={newActivity.description}
                onChange={(e) => setNewActivity((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activity-date">Date *</Label>
                <Input
                  id="activity-date"
                  type="date"
                  value={newActivity.scheduledDate}
                  onChange={(e) => setNewActivity((prev) => ({ ...prev, scheduledDate: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="activity-time">Time *</Label>
                <Input
                  id="activity-time"
                  type="time"
                  value={newActivity.scheduledTime}
                  onChange={(e) => setNewActivity((prev) => ({ ...prev, scheduledTime: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activity-duration">Duration (minutes)</Label>
                <Input
                  id="activity-duration"
                  type="number"
                  placeholder="60"
                  value={newActivity.duration}
                  onChange={(e) => setNewActivity((prev) => ({ ...prev, duration: e.target.value }))}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="activity-cost">Cost ($)</Label>
                <Input
                  id="activity-cost"
                  type="number"
                  placeholder="0"
                  value={newActivity.cost}
                  onChange={(e) => setNewActivity((prev) => ({ ...prev, cost: e.target.value }))}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity-location">Location</Label>
              <Input
                id="activity-location"
                placeholder="e.g., Champ de Mars, Paris"
                value={newActivity.location}
                onChange={(e) => setNewActivity((prev) => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activity-category">Category</Label>
              <Select
                value={newActivity.category}
                onValueChange={(value) => setNewActivity((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sightseeing">Sightseeing</SelectItem>
                  <SelectItem value="food">Food & Dining</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="outdoor">Outdoor Activities</SelectItem>
                  <SelectItem value="culture">Culture & Arts</SelectItem>
                  <SelectItem value="transport">Transportation</SelectItem>
                  <SelectItem value="accommodation">Accommodation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Add Activity
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAddingActivity(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Activity Dialog */}
      <Dialog open={editingActivity !== null} onOpenChange={() => setEditingActivity(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
            <DialogDescription>Update the details for this activity</DialogDescription>
          </DialogHeader>
          {editingActivity && (
            <form onSubmit={handleUpdateActivity} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-activity-name">Activity Name *</Label>
                <Input
                  id="edit-activity-name"
                  value={editingActivity.name}
                  onChange={(e) => setEditingActivity({...editingActivity, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-activity-description">Description</Label>
                <Textarea
                  id="edit-activity-description"
                  value={editingActivity.description}
                  onChange={(e) => setEditingActivity({...editingActivity, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-activity-date">Date *</Label>
                  <Input
                    id="edit-activity-date"
                    type="date"
                    value={editingActivity.scheduledDate}
                    onChange={(e) => setEditingActivity({...editingActivity, scheduledDate: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-activity-time">Time *</Label>
                  <Input
                    id="edit-activity-time"
                    type="time"
                    value={editingActivity.scheduledTime}
                    onChange={(e) => setEditingActivity({...editingActivity, scheduledTime: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-activity-duration">Duration (minutes)</Label>
                  <Input
                    id="edit-activity-duration"
                    type="number"
                    value={editingActivity.duration}
                    onChange={(e) => setEditingActivity({...editingActivity, duration: parseInt(e.target.value) || 60})}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-activity-cost">Cost ($)</Label>
                  <Input
                    id="edit-activity-cost"
                    type="number"
                    value={editingActivity.cost}
                    onChange={(e) => setEditingActivity({...editingActivity, cost: parseFloat(e.target.value) || 0})}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-activity-location">Location</Label>
                <Input
                  id="edit-activity-location"
                  value={editingActivity.location}
                  onChange={(e) => setEditingActivity({...editingActivity, location: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-activity-category">Category</Label>
                <Select
                  value={editingActivity.category}
                  onValueChange={(value) => setEditingActivity({...editingActivity, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sightseeing">Sightseeing</SelectItem>
                    <SelectItem value="food">Food & Dining</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="outdoor">Outdoor Activities</SelectItem>
                    <SelectItem value="culture">Culture & Arts</SelectItem>
                    <SelectItem value="transport">Transportation</SelectItem>
                    <SelectItem value="accommodation">Accommodation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Activity
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditingActivity(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Stop Confirmation */}
      <AlertDialog open={deletingStopId !== null} onOpenChange={() => setDeletingStopId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Stop</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this stop? This will also delete all associated activities. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingStopId && handleDeleteStop(deletingStopId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Stop
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Activity Confirmation */}
      <AlertDialog open={deletingActivityId !== null} onOpenChange={() => setDeletingActivityId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Activity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this activity? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingActivityId && editingActivity) {
                  handleDeleteActivity(deletingActivityId, editingActivity.stopId)
                } else if (deletingActivityId) {
                  // Find the activity to get its stopId
                  for (const [stopId, stopActivities] of Object.entries(activities)) {
                    const activity = stopActivities.find(a => a.$id === deletingActivityId)
                    if (activity) {
                      handleDeleteActivity(deletingActivityId, stopId)
                      break
                    }
                  }
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Activity
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
=======
>>>>>>> origin/dishant
    </div>
  )
}
