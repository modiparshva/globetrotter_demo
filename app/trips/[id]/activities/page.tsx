"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useTrip } from "@/hooks/use-trips"
import { databases, DATABASE_ID, ITINERARY_COLLECTION_ID, ACTIVITIES_COLLECTION_ID } from "@/lib/appwrite"
import { ID, Query } from "appwrite"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  Edit, 
  Trash2, 
  Clock, 
  DollarSign, 
  Save,
  Loader2,
  Filter,
  Search,
  CalendarDays,
  Activity,
  Utensils,
  ShoppingBag,
  Camera,
  Music,
  Car,
  Home
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

interface ActivityItem {
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

const categoryIcons = {
  sightseeing: Camera,
  food: Utensils,
  entertainment: Music,
  shopping: ShoppingBag,
  outdoor: Activity,
  culture: Camera,
  transport: Car,
  accommodation: Home,
  other: Activity,
}

const categoryColors = {
  sightseeing: "bg-blue-100 text-blue-800",
  food: "bg-orange-100 text-orange-800",
  entertainment: "bg-purple-100 text-purple-800",
  shopping: "bg-green-100 text-green-800",
  outdoor: "bg-emerald-100 text-emerald-800",
  culture: "bg-indigo-100 text-indigo-800",
  transport: "bg-gray-100 text-gray-800",
  accommodation: "bg-yellow-100 text-yellow-800",
  other: "bg-slate-100 text-slate-800",
}

export default function TripActivities() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const tripId = params.id as string
  const { trip, isLoadingTrip } = useTrip(tripId)

  const [itineraryStops, setItineraryStops] = useState<ItineraryStop[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [filteredActivities, setFilteredActivities] = useState<ActivityItem[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isAddingActivity, setIsAddingActivity] = useState(false)
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null)
  const [deletingActivityId, setDeletingActivityId] = useState<string | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStop, setSelectedStop] = useState("all")
  const [selectedDate, setSelectedDate] = useState("")

  const [newActivity, setNewActivity] = useState({
    stopId: "",
    name: "",
    description: "",
    scheduledDate: "",
    scheduledTime: "",
    duration: "60",
    cost: "",
    location: "",
    category: "sightseeing",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Fetch data
  useEffect(() => {
    if (tripId) {
      fetchData()
    }
  }, [tripId])

  // Apply filters
  useEffect(() => {
    let filtered = activities

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        activity =>
          activity.name.toLowerCase().includes(query) ||
          activity.description.toLowerCase().includes(query) ||
          activity.location.toLowerCase().includes(query)
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(activity => activity.category === selectedCategory)
    }

    if (selectedStop !== "all") {
      filtered = filtered.filter(activity => activity.stopId === selectedStop)
    }

    if (selectedDate) {
      filtered = filtered.filter(activity => activity.scheduledDate === selectedDate)
    }

    setFilteredActivities(filtered)
  }, [activities, searchQuery, selectedCategory, selectedStop, selectedDate])

  const fetchData = async () => {
    try {
      setIsLoadingData(true)
      
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

      // Fetch all activities for the trip
      const allActivities: ActivityItem[] = []
      
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
          allActivities.push(...(activitiesResponse.documents as ActivityItem[]))
        } catch (error) {
          console.error(`Error fetching activities for stop ${stop.$id}:`, error)
        }
      }
      
      setActivities(allActivities)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load activities")
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!newActivity.stopId || !newActivity.name || !newActivity.scheduledDate || !newActivity.scheduledTime) {
      setError("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const activityData = {
        stopId: newActivity.stopId,
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

      const newActivityData = response as ActivityItem
      setActivities(prev => [...prev, newActivityData])
      
      setIsAddingActivity(false)
      setNewActivity({
        stopId: "",
        name: "",
        description: "",
        scheduledDate: "",
        scheduledTime: "",
        duration: "60",
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

      setActivities(prev =>
        prev.map(activity =>
          activity.$id === editingActivity.$id
            ? { ...activity, ...updateData }
            : activity
        )
      )
      
      setEditingActivity(null)
      toast.success("Activity updated successfully!")
    } catch (error: any) {
      console.error("Error updating activity:", error)
      toast.error("Failed to update activity")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteActivity = async (activityId: string) => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        ACTIVITIES_COLLECTION_ID,
        activityId
      )

      setActivities(prev => prev.filter(activity => activity.$id !== activityId))
      setDeletingActivityId(null)
      toast.success("Activity deleted successfully!")
    } catch (error: any) {
      console.error("Error deleting activity:", error)
      toast.error("Failed to delete activity")
    }
  }

  const getStopNameById = (stopId: string) => {
    const stop = itineraryStops.find(s => s.$id === stopId)
    return stop ? stop.destination : "Unknown Stop"
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`
    }
    return `${mins}m`
  }

  const groupActivitiesByDate = (activities: ActivityItem[]) => {
    return activities.reduce((groups, activity) => {
      const date = activity.scheduledDate
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(activity)
      return groups
    }, {} as { [date: string]: ActivityItem[] })
  }

  const calculateStats = () => {
    const totalCost = activities.reduce((sum, activity) => sum + activity.cost, 0)
    const totalDuration = activities.reduce((sum, activity) => sum + activity.duration, 0)
    const categories = [...new Set(activities.map(a => a.category))].length
    return { totalCost, totalDuration, categories, count: activities.length }
  }

  if (isLoadingTrip || isLoadingData) {
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

  // Check if user owns this trip
  if (trip.userId !== user?.account?.$id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to view these activities.</p>
          <Link href="/trips">
            <Button>Back to Trips</Button>
          </Link>
        </div>
      </div>
    )
  }

  const stats = calculateStats()
  const groupedActivities = groupActivitiesByDate(filteredActivities)

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
              <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
              <p className="text-muted-foreground mt-1">{trip.name}</p>
            </div>
          </div>
          <Dialog open={isAddingActivity} onOpenChange={setIsAddingActivity}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Activity</DialogTitle>
                <DialogDescription>Plan a new activity for your trip</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddActivity} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="stop">Destination *</Label>
                  <Select
                    value={newActivity.stopId}
                    onValueChange={(value) => setNewActivity(prev => ({ ...prev, stopId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {itineraryStops.map((stop) => (
                        <SelectItem key={stop.$id} value={stop.$id}>
                          {stop.destination}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity-name">Activity Name *</Label>
                  <Input
                    id="activity-name"
                    placeholder="e.g., Visit Eiffel Tower"
                    value={newActivity.name}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity-description">Description</Label>
                  <Textarea
                    id="activity-description"
                    placeholder="Brief description of the activity..."
                    value={newActivity.description}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="activity-date">Date *</Label>
                    <Input
                      id="activity-date"
                      type="date"
                      value={newActivity.scheduledDate}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, scheduledDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activity-time">Time *</Label>
                    <Input
                      id="activity-time"
                      type="time"
                      value={newActivity.scheduledTime}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, scheduledTime: e.target.value }))}
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
                      onChange={(e) => setNewActivity(prev => ({ ...prev, duration: e.target.value }))}
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
                      onChange={(e) => setNewActivity(prev => ({ ...prev, cost: e.target.value }))}
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
                    onChange={(e) => setNewActivity(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity-category">Category</Label>
                  <Select
                    value={newActivity.category}
                    onValueChange={(value) => setNewActivity(prev => ({ ...prev, category: value }))}
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
                  <Button type="button" variant="outline" onClick={() => setIsAddingActivity(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.count}</div>
                <div className="text-sm text-muted-foreground">Total Activities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">${stats.totalCost.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Total Cost</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{formatDuration(stats.totalDuration)}</div>
                <div className="text-sm text-muted-foreground">Total Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.categories}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Activities</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search by name, description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-filter">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
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
              <div className="space-y-2">
                <Label htmlFor="stop-filter">Destination</Label>
                <Select value={selectedStop} onValueChange={setSelectedStop}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Destinations</SelectItem>
                    {itineraryStops.map((stop) => (
                      <SelectItem key={stop.$id} value={stop.$id}>
                        {stop.destination}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-filter">Date</Label>
                <Input
                  id="date-filter"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activities Content */}
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-6">
            {Object.keys(groupedActivities).length === 0 ? (
              <Card className="p-12 text-center">
                <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Activities Found</h3>
                <p className="text-gray-600 mb-6">
                  {activities.length === 0
                    ? "Start planning your trip by adding some activities."
                    : "No activities match your current filters."}
                </p>
                <Button onClick={() => setIsAddingActivity(true)} size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Activity
                </Button>
              </Card>
            ) : (
              Object.entries(groupedActivities)
                .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                .map(([date, dayActivities]) => (
                  <Card key={date}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        {new Date(date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </CardTitle>
                      <CardDescription>
                        {dayActivities.length} activities • 
                        {formatDuration(dayActivities.reduce((sum, a) => sum + a.duration, 0))} total • 
                        ${dayActivities.reduce((sum, a) => sum + a.cost, 0).toFixed(2)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {dayActivities
                          .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
                          .map((activity) => {
                            const IconComponent = categoryIcons[activity.category as keyof typeof categoryIcons]
                            return (
                              <div
                                key={activity.$id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-center flex-1">
                                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white mr-4">
                                    <IconComponent className="w-5 h-5 text-gray-600" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-medium">{activity.name}</h4>
                                      <Badge className={categoryColors[activity.category as keyof typeof categoryColors]}>
                                        {activity.category}
                                      </Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                      <div className="flex items-center gap-4">
                                        <span className="flex items-center">
                                          <Clock className="w-3 h-3 mr-1" />
                                          {formatTime(activity.scheduledTime)} ({formatDuration(activity.duration)})
                                        </span>
                                        <span className="flex items-center">
                                          <MapPin className="w-3 h-3 mr-1" />
                                          {getStopNameById(activity.stopId)}
                                        </span>
                                        {activity.cost > 0 && (
                                          <span className="flex items-center">
                                            <DollarSign className="w-3 h-3 mr-1" />
                                            ${activity.cost.toFixed(2)}
                                          </span>
                                        )}
                                      </div>
                                      {activity.location && (
                                        <p className="text-xs">{activity.location}</p>
                                      )}
                                      {activity.description && (
                                        <p className="text-xs">{activity.description}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingActivity(activity)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeletingActivityId(activity.$id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            {filteredActivities.length === 0 ? (
              <Card className="p-12 text-center">
                <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Activities Found</h3>
                <p className="text-gray-600 mb-6">
                  {activities.length === 0
                    ? "Start planning your trip by adding some activities."
                    : "No activities match your current filters."}
                </p>
                <Button onClick={() => setIsAddingActivity(true)} size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Activity
                </Button>
              </Card>
            ) : (
              filteredActivities.map((activity) => {
                const IconComponent = categoryIcons[activity.category as keyof typeof categoryIcons]
                return (
                  <Card key={activity.$id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-orange-100 mr-4">
                            <IconComponent className="w-6 h-6 text-gray-700" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-medium">{activity.name}</h3>
                              <Badge className={categoryColors[activity.category as keyof typeof categoryColors]}>
                                {activity.category}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(activity.scheduledDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatTime(activity.scheduledTime)} ({formatDuration(activity.duration)})
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {getStopNameById(activity.stopId)}
                              </div>
                            </div>
                            {activity.location && (
                              <p className="text-sm text-muted-foreground mt-1">📍 {activity.location}</p>
                            )}
                            {activity.description && (
                              <p className="text-sm text-gray-600 mt-2">{activity.description}</p>
                            )}
                            {activity.cost > 0 && (
                              <div className="flex items-center mt-2">
                                <Badge variant="outline" className="text-green-700 border-green-200">
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  ${activity.cost.toFixed(2)}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingActivity(activity)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingActivityId(activity.$id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </TabsContent>
        </Tabs>
      </div>

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
              onClick={() => deletingActivityId && handleDeleteActivity(deletingActivityId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Activity
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
