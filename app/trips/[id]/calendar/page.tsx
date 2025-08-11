"use client"

<<<<<<< HEAD
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useTrip } from "@/hooks/use-trips"
import { databases, DATABASE_ID, ACTIVITIES_COLLECTION_ID, EXPENSES_COLLECTION_ID, ITINERARY_COLLECTION_ID } from "@/lib/appwrite"
import { Query } from "appwrite"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Calendar as CalendarIcon, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  MapPin,
  DollarSign,
  Camera,
  Car,
  Home,
  Utensils,
  ShoppingBag,
  Plane,
  Activity,
  Receipt,
  Plus
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Activity {
  $id: string
  tripId: string
  stopId: string
  name: string
  description: string
  location: string
  scheduledDate: string
  scheduledTime: string
  duration: number
  cost: number
  category: string
  $createdAt: string
  $updatedAt: string
}

interface Expense {
  $id: string
  tripId: string
  title: string
  description: string
  amount: number
  category: string
  date: string
  paymentMethod: string
  currency: string
  isShared: boolean
  tags: string[]
  $createdAt: string
  $updatedAt: string
}

interface ItineraryStop {
  $id: string
  tripId: string
  location: string
  description: string
  date: string
  startTime: string
  endTime: string
  notes: string
  $createdAt: string
  $updatedAt: string
}

interface CalendarEvent {
  id: string
  title: string
  description: string
  date: string
  time?: string // Made optional since expenses don't have time
  type: 'activity' | 'expense' | 'itinerary'
  category: string
  amount?: number
  location?: string
  icon: any
  color: string
}

const categoryIcons = {
  transport: Car,
  accommodation: Home,
  food: Utensils,
  activities: Camera,
  shopping: ShoppingBag,
  entertainment: Activity,
  flights: Plane,
  emergency: Receipt,
  other: Receipt,
  sightseeing: Camera,
  adventure: Activity,
  cultural: Camera,
  relaxation: Home,
  business: Receipt,
}

const categoryColors = {
  transport: 'bg-blue-100 text-blue-800 border-blue-200',
  accommodation: 'bg-purple-100 text-purple-800 border-purple-200',
  food: 'bg-orange-100 text-orange-800 border-orange-200',
  activities: 'bg-green-100 text-green-800 border-green-200',
  shopping: 'bg-pink-100 text-pink-800 border-pink-200',
  entertainment: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  flights: 'bg-sky-100 text-sky-800 border-sky-200',
  emergency: 'bg-red-100 text-red-800 border-red-200',
  other: 'bg-gray-100 text-gray-800 border-gray-200',
  sightseeing: 'bg-green-100 text-green-800 border-green-200',
  adventure: 'bg-orange-100 text-orange-800 border-orange-200',
  cultural: 'bg-purple-100 text-purple-800 border-purple-200',
  relaxation: 'bg-blue-100 text-blue-800 border-blue-200',
  business: 'bg-gray-100 text-gray-800 border-gray-200',
}
=======
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
>>>>>>> origin/dishant

export default function TripCalendar() {
  const params = useParams()
  const router = useRouter()
<<<<<<< HEAD
  const { user } = useAuth()
  const tripId = params.id as string
  const { trip, isLoadingTrip } = useTrip(tripId)

  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [hasLoadedData, setHasLoadedData] = useState(false)

  // Helper function to format date as YYYY-MM-DD (using local timezone)
  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Helper function to get events for a specific date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateStr = formatDate(date)
    return events.filter(event => event.date && event.date === dateStr)
  }

  // Generate calendar days for the current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  // Fetch all trip data
  useEffect(() => {
    if (tripId && user) {
      // Check if all required collection IDs are available
      if (!DATABASE_ID) {
        console.error('DATABASE_ID is missing')
        toast.error("Database configuration is missing")
        setIsLoading(false)
        return
      }
      
      if (!ACTIVITIES_COLLECTION_ID || !EXPENSES_COLLECTION_ID || !ITINERARY_COLLECTION_ID) {
        console.error('Some collection IDs are missing:', {
          ACTIVITIES_COLLECTION_ID,
          EXPENSES_COLLECTION_ID, 
          ITINERARY_COLLECTION_ID
        })
        toast.error("Collection configuration is incomplete")
        setIsLoading(false)
        return
      }
      
      fetchTripData()
    }
  }, [tripId, user])

  const fetchTripData = async () => {
    try {
      setIsLoading(true)
      
      console.log('Fetching trip data for tripId:', tripId)
      console.log('Database ID:', DATABASE_ID)
      console.log('Collections:', {
        ACTIVITIES_COLLECTION_ID,
        EXPENSES_COLLECTION_ID,
        ITINERARY_COLLECTION_ID
      })
      
      // Convert all data to calendar events
      const calendarEvents: CalendarEvent[] = []
      
      // Fetch activities (with error handling)
      try {
        // First try with queries - but activities are linked to stops, not trips directly
        let activitiesResponse
        try {
          // Get all activities first, then filter by trip's stops
          activitiesResponse = await databases.listDocuments(
            DATABASE_ID,
            ACTIVITIES_COLLECTION_ID,
            [
              Query.orderAsc('scheduledDate'),
              Query.orderAsc('scheduledTime')
            ]
          )
        } catch (queryError: any) {
          console.warn("Query failed for activities, trying without filters:", queryError.message)
          // If queries fail, try without filters
          activitiesResponse = await databases.listDocuments(
            DATABASE_ID,
            ACTIVITIES_COLLECTION_ID
          )
        }
        
        let activities = activitiesResponse.documents as unknown as Activity[]
        
        // We need to get itinerary stops for this trip first to filter activities
        let tripStopIds: string[] = []
        try {
          const stopsResponse = await databases.listDocuments(
            DATABASE_ID,
            ITINERARY_COLLECTION_ID,
            [Query.equal('tripId', tripId)]
          )
          tripStopIds = stopsResponse.documents.map(stop => stop.$id)
        } catch (stopsError) {
          console.warn("Could not fetch trip stops for activity filtering")
        }
        
        // Filter activities by trip's stops
        if (tripStopIds.length > 0) {
          activities = activities.filter(activity => tripStopIds.includes(activity.stopId))
        }
        
        console.log('Fetched activities:', activities.length)
        console.log('Sample activity:', activities[0])
        
        // Add activities
        activities.forEach(activity => {
          const IconComponent = categoryIcons[activity.category as keyof typeof categoryIcons] || Camera
          calendarEvents.push({
            id: activity.$id,
            title: activity.name,
            description: activity.description,
            date: activity.scheduledDate,
            time: activity.scheduledTime,
            type: 'activity',
            category: activity.category,
            amount: activity.cost,
            location: activity.location,
            icon: IconComponent,
            color: categoryColors[activity.category as keyof typeof categoryColors] || categoryColors.other
          })
        })
      } catch (activityError: any) {
        console.error("Error fetching activities:", activityError)
        if (activityError.message?.includes('Attribute not found')) {
          console.warn("Activities collection might be missing or have different schema")
        }
        // Continue with other data even if activities fail
      }
      
      // Fetch expenses (with error handling)
      try {
        // First try with queries
        let expensesResponse
        try {
          expensesResponse = await databases.listDocuments(
            DATABASE_ID,
            EXPENSES_COLLECTION_ID,
            [
              Query.equal('tripId', tripId),
              Query.orderAsc('date')
            ]
          )
        } catch (queryError: any) {
          console.warn("Query failed for expenses, trying without filters:", queryError.message)
          // If queries fail, try without filters and filter in JS
          expensesResponse = await databases.listDocuments(
            DATABASE_ID,
            EXPENSES_COLLECTION_ID
          )
        }
        
        let expenses = expensesResponse.documents as unknown as Expense[]
        
        // Filter by tripId in JavaScript if query failed
        if (expenses.length > 0 && expenses[0].tripId !== tripId) {
          expenses = expenses.filter(expense => expense.tripId === tripId)
        }
        
        console.log('Fetched expenses:', expenses.length)
        console.log('Sample expense:', expenses[0])
        
        // Add expenses
        expenses.forEach(expense => {
          const IconComponent = categoryIcons[expense.category as keyof typeof categoryIcons] || DollarSign
          calendarEvents.push({
            id: expense.$id,
            title: expense.title,
            description: expense.description,
            date: expense.date,
            // Note: expenses don't have time, so we omit the time field
            type: 'expense',
            category: expense.category,
            amount: expense.amount,
            icon: IconComponent,
            color: categoryColors[expense.category as keyof typeof categoryColors] || categoryColors.other
          })
        })
      } catch (expenseError: any) {
        console.error("Error fetching expenses:", expenseError)
        if (expenseError.message?.includes('Attribute not found')) {
          console.warn("Expenses collection might be missing or have different schema")
        }
        // Continue with other data even if expenses fail
      }
      
      // Fetch itinerary (with error handling)
      try {
        // First try with queries
        let itineraryResponse
        try {
          itineraryResponse = await databases.listDocuments(
            DATABASE_ID,
            ITINERARY_COLLECTION_ID,
            [
              Query.equal('tripId', tripId),
              Query.orderAsc('date'),
              Query.orderAsc('startTime')
            ]
          )
        } catch (queryError: any) {
          console.warn("Query failed for itinerary, trying without filters:", queryError.message)
          // If queries fail, try without filters and filter in JS
          itineraryResponse = await databases.listDocuments(
            DATABASE_ID,
            ITINERARY_COLLECTION_ID
          )
        }
        
        let itinerary = itineraryResponse.documents as unknown as ItineraryStop[]
        
        // Filter by tripId in JavaScript if query failed
        if (itinerary.length > 0 && itinerary[0].tripId !== tripId) {
          itinerary = itinerary.filter(stop => stop.tripId === tripId)
        }
        
        console.log('Fetched itinerary:', itinerary.length)
        console.log('Sample itinerary stop:', itinerary[0])
        
        // Add itinerary stops
        itinerary.forEach(stop => {
          calendarEvents.push({
            id: stop.$id,
            title: stop.location,
            description: stop.description,
            date: stop.date,
            time: stop.startTime,
            type: 'itinerary',
            category: 'itinerary',
            location: stop.location,
            icon: MapPin,
            color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
          })
        })
      } catch (itineraryError: any) {
        console.error("Error fetching itinerary:", itineraryError)
        if (itineraryError.message?.includes('Attribute not found')) {
          console.warn("Itinerary collection might be missing or have different schema")
        }
        // Continue with other data even if itinerary fails
      }
      
      // Sort events by date and time (with null checks)
      calendarEvents.sort((a, b) => {
        const aDate = a.date || ''
        const bDate = b.date || ''
        const aTime = a.time || 'ZZ:ZZ' // Put events without time at the end
        const bTime = b.time || 'ZZ:ZZ'
        
        const dateCompare = aDate.localeCompare(bDate)
        if (dateCompare === 0) {
          return aTime.localeCompare(bTime)
        }
        return dateCompare
      })
      
      console.log('Total calendar events:', calendarEvents.length)
      setEvents(calendarEvents)
      setHasLoadedData(true)
      
      // Show success message only if we have some data
      if (calendarEvents.length > 0) {
        toast.success("Calendar data loaded successfully")
      }
      
    } catch (error) {
      console.error("Error fetching trip data:", error)
      setHasLoadedData(true)
      toast.error(`Failed to load calendar data: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const days = getDaysInMonth(currentDate)
  const today = new Date()
  const todayStr = formatDate(today)

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert className="max-w-md">
          <AlertDescription>
            Please sign in to view your trip calendar.
          </AlertDescription>
        </Alert>
=======
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
>>>>>>> origin/dishant
      </div>
    )
  }

<<<<<<< HEAD
  if (isLoadingTrip) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertDescription>Trip not found.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/trips/${tripId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Trip
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{trip.name} - Calendar</h1>
            <p className="text-muted-foreground">
              Plan and view your trip activities, expenses, and itinerary
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/trips/${tripId}/activities`}>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </Link>
          <Link href={`/trips/${tripId}/expenses`}>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : hasLoadedData && events.length === 0 ? (
              <div className="text-center py-12">
                <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No events scheduled yet
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start planning your trip by adding activities, expenses, or itinerary stops.
                </p>
                <div className="flex gap-2 justify-center">
                  <Link href={`/trips/${tripId}/activities`}>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Activity
                    </Button>
                  </Link>
                  <Link href={`/trips/${tripId}/expenses`}>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Expense
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-2">
                  {dayNames.map(day => (
                    <div key={day} className="text-center font-medium text-sm text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2">
                  {days.map((day, index) => {
                    if (!day) {
                      return <div key={index} className="h-24" />
                    }
                    
                    const dateStr = formatDate(day)
                    const dayEvents = getEventsForDate(day)
                    const isToday = dateStr === todayStr
                    const isSelected = dateStr === selectedDate
                    
                    return (
                      <div
                        key={index}
                        className={`
                          h-24 p-1 border rounded-lg cursor-pointer transition-colors
                          ${isToday ? 'bg-primary/10 border-primary' : 'border-border hover:bg-muted/50'}
                          ${isSelected ? 'ring-2 ring-primary' : ''}
                        `}
                        onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                      >
                        <div className="text-sm font-medium mb-1">
                          {day.getDate()}
                        </div>
                        <div className="space-y-1 overflow-hidden">
                          {dayEvents.slice(0, 2).map(event => {
                            const IconComponent = event.icon
                            return (
                              <div
                                key={event.id}
                                className={`
                                  text-xs p-1 rounded border truncate
                                  ${event.color}
                                `}
                                title={event.time ? `${event.time} - ${event.title}` : event.title}
                              >
                                <div className="flex items-center gap-1">
                                  <IconComponent className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">{event.title}</span>
                                </div>
                              </div>
                            )
                          })}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Event Details Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate ? (
                `Events for ${new Date(selectedDate).toLocaleDateString()}`
              ) : (
                'Select a date'
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div className="space-y-4">
                {getEventsForDate(new Date(selectedDate)).length === 0 ? (
                  <p className="text-muted-foreground text-sm">No events scheduled for this day.</p>
                ) : (
                  getEventsForDate(new Date(selectedDate)).map(event => {
                    const IconComponent = event.icon
                    return (
                      <div key={event.id} className="space-y-2 p-3 border rounded-lg">
                        <div className="flex items-start gap-2">
                          <IconComponent className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            {event.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {event.description}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {event.time && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {event.time}
                            </div>
                          )}
                          {event.type === 'expense' && event.amount && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              ${event.amount.toFixed(2)}
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}
                        </div>
                        
                        <Badge variant="secondary" className="text-xs">
                          {event.type}
                        </Badge>
                      </div>
                    )
                  })
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Click on a date to view scheduled events, activities, and expenses.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-green-600" />
              <span className="text-sm">Activities</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-orange-600" />
              <span className="text-sm">Expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span className="text-sm">Itinerary</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Transport</span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-purple-600" />
              <span className="text-sm">Accommodation</span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-orange-600" />
              <span className="text-sm">Food & Dining</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
=======
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
>>>>>>> origin/dishant
