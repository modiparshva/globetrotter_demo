"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useTrip } from "@/hooks/use-trips"
import { tripService } from "@/lib/trips"
import { databases, DATABASE_ID, ACTIVITIES_COLLECTION_ID, EXPENSES_COLLECTION_ID, ITINERARY_COLLECTION_ID, SHARED_TRIPS_COLLECTION_ID } from "@/lib/appwrite"
import { Query } from "appwrite"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  Calendar,
  MapPin,
  ArrowLeft,
  Edit,
  Share2,
  DollarSign,
  Clock,
  Star,
  Plus,
  Loader2,
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  Navigation,
  CreditCard,
  PieChart,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Camera,
  Utensils,
  Car,
  Home,
  ShoppingBag,
  Plane,
  Copy,
  Check
} from "lucide-react"
import Link from "next/link"

// Enhanced interfaces to match actual database schema
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

interface ExpenseItem {
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

interface ItineraryItem {
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

const categoryIcons = {
  sightseeing: Camera,
  food: Utensils,
  entertainment: Star,
  shopping: ShoppingBag,
  outdoor: Activity,
  culture: Camera,
  transport: Car,
  accommodation: Home,
  flights: Plane,
  other: Activity,
}

const expenseCategoryIcons = {
  transport: Car,
  accommodation: Home,
  food: Utensils,
  activities: Camera,
  shopping: ShoppingBag,
  entertainment: Star,
  flights: Plane,
  emergency: AlertTriangle,
  other: CreditCard,
}

export default function TripDetails() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const tripId = params.id as string

  const { trip, isLoadingTrip } = useTrip(tripId)

  // Enhanced state for comprehensive data
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [expenses, setExpenses] = useState<ExpenseItem[]>([])
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Share functionality state
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [isShared, setIsShared] = useState(false)
  const [sharedTripToken, setSharedTripToken] = useState<string | null>(null)

  // Fetch all trip data
  useEffect(() => {
    if (tripId && user) {
      fetchTripData()
      checkIfTripIsShared()
    }
  }, [tripId, user])

  const checkIfTripIsShared = async () => {
    try {
      const sharedTrips = await databases.listDocuments(
        DATABASE_ID,
        SHARED_TRIPS_COLLECTION_ID,
        [Query.equal('tripId', tripId), Query.equal('isActive', true)]
      )
      
      if (sharedTrips.documents.length > 0) {
        const sharedTrip = sharedTrips.documents[0]
        setIsShared(true)
        setSharedTripToken(sharedTrip.token)
        setShareUrl(`${window.location.origin}/shared/${sharedTrip.token}`)
      }
    } catch (error) {
      console.warn('Could not check share status:', error)
    }
  }

  const fetchTripData = async () => {
    try {
      setIsLoadingData(true)
      setError(null)

      // Fetch activities
      let activitiesData: ActivityItem[] = []
      try {
        // Get all activities and filter by trip's stops
        const activitiesResponse = await databases.listDocuments(
          DATABASE_ID,
          ACTIVITIES_COLLECTION_ID
        )

        // Get itinerary stops for this trip to filter activities
        const stopsResponse = await databases.listDocuments(
          DATABASE_ID,
          ITINERARY_COLLECTION_ID,
          [Query.equal('tripId', tripId)]
        )

        const tripStopIds = stopsResponse.documents.map(stop => stop.$id)
        activitiesData = activitiesResponse.documents
          .filter((activity: any) => tripStopIds.includes(activity.stopId))
          .map((activity: any) => activity as ActivityItem)
      } catch (err) {
        console.warn("Could not fetch activities:", err)
      }

      // Fetch expenses
      let expensesData: ExpenseItem[] = []
      try {
        const expensesResponse = await databases.listDocuments(
          DATABASE_ID,
          EXPENSES_COLLECTION_ID,
          [Query.equal('tripId', tripId)]
        )
        expensesData = expensesResponse.documents.map((expense: any) => expense as ExpenseItem)
      } catch (err) {
        console.warn("Could not fetch expenses:", err)
      }

      // Fetch itinerary
      let itineraryData: ItineraryItem[] = []
      try {
        const itineraryResponse = await databases.listDocuments(
          DATABASE_ID,
          ITINERARY_COLLECTION_ID,
          [
            Query.equal('tripId', tripId),
            Query.orderAsc('orderIndex')
          ]
        )
        itineraryData = itineraryResponse.documents.map((stop: any) => stop as ItineraryItem)
      } catch (err) {
        console.warn("Could not fetch itinerary:", err)
      }

      setActivities(activitiesData)
      setExpenses(expensesData)
      setItinerary(itineraryData)

    } catch (error) {
      console.error("Error fetching trip data:", error)
      setError("Failed to load trip data")
    } finally {
      setIsLoadingData(false)
    }
  }

  // Enhanced calculations and analytics
  const calculateTripStats = () => {
    // Basic trip info
    const tripDuration = trip ? Math.ceil(
      (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1 : 0

    // Financial calculations
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const totalActivitiesCost = activities.reduce((sum, activity) => sum + activity.cost, 0)
    const totalPlannedCost = totalExpenses + totalActivitiesCost
    const remainingBudget = (trip?.budget || 0) - totalExpenses - totalActivitiesCost
    const budgetUtilization = trip?.budget ? (totalExpenses / trip.budget) * 100 : 0

    // Activity calculations
    const totalActivities = activities.length
    const totalActivityDuration = activities.reduce((sum, activity) => sum + activity.duration, 0)
    const avgActivityCost = totalActivities > 0 ? totalActivitiesCost / totalActivities : 0

    // Expense analytics
    const expensesByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)

    const dailyExpenseAvg = tripDuration > 0 ? totalExpenses / tripDuration : 0

    // Time analytics
    const daysUntilTrip = trip ? Math.ceil(
      (new Date(trip.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    ) : 0

    const isUpcoming = daysUntilTrip > 0
    const isOngoing = trip ? (
      new Date() >= new Date(trip.startDate) && new Date() <= new Date(trip.endDate)
    ) : false

    // Activity categories
    const activitiesByCategory = activities.reduce((acc, activity) => {
      acc[activity.category] = (acc[activity.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      tripDuration,
      totalExpenses,
      totalActivitiesCost,
      totalPlannedCost,
      remainingBudget,
      budgetUtilization,
      totalActivities,
      totalActivityDuration,
      avgActivityCost,
      expensesByCategory,
      dailyExpenseAvg,
      daysUntilTrip,
      isUpcoming,
      isOngoing,
      activitiesByCategory,
      expenseCount: expenses.length,
      itineraryStops: itinerary.length
    }
  }

  const stats = calculateTripStats()

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`
    }
    return `${mins}m`
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'secondary'
      case 'ongoing':
        return 'default'
      case 'upcoming':
      case 'planning':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'ongoing':
        return 'text-blue-600'
      case 'upcoming':
        return 'text-orange-600'
      case 'planning':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  // Share functionality
  const handleShareTrip = async () => {
    if (isShared) {
      // If already shared, just open the dialog to show the existing link
      setIsShareDialogOpen(true)
      return
    }

    setIsSharing(true)
    try {
      const sharedTrip = await tripService.shareTrip(tripId)
      const shareUrl = `${window.location.origin}/shared/${sharedTrip.token}`
      setShareUrl(shareUrl)
      setIsShared(true)
      setSharedTripToken(sharedTrip.token)
      setIsShareDialogOpen(true)
      toast.success('Trip shared successfully! Anyone with the link can view your trip.')
    } catch (error) {
      console.error('Error sharing trip:', error)
      toast.error('Failed to share trip. Please try again.')
    } finally {
      setIsSharing(false)
    }
  }

  const handleUnshareTrip = async () => {
    if (!sharedTripToken) return

    setIsSharing(true)
    try {
      await tripService.deactivateSharedTrip(sharedTripToken)
      setIsShared(false)
      setSharedTripToken(null)
      setShareUrl(null)
      setIsShareDialogOpen(false)
      toast.success('Trip unshared successfully! The link is no longer accessible.')
    } catch (error) {
      console.error('Error unsharing trip:', error)
      toast.error('Failed to unshare trip. Please try again.')
    } finally {
      setIsSharing(false)
    }
  }

  const copyToClipboard = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl)
        setIsCopied(true)
        toast.success('Link copied to clipboard!')
        setTimeout(() => setIsCopied(false), 2000)
      } catch (error) {
        console.error('Failed to copy to clipboard:', error)
        toast.error('Failed to copy link. Please copy it manually.')
      }
    }
  }

  if (isLoadingTrip || isLoadingData) {
    if (isLoadingTrip || isLoadingData) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-8">
              <Skeleton className="w-24 h-10 mr-4" />
              <div>
                <Skeleton className="w-64 h-8 mb-2" />
                <Skeleton className="w-96 h-4" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <Skeleton className="w-full h-96 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Skeleton className="w-full h-32" />
                  <Skeleton className="w-full h-32" />
                  <Skeleton className="w-full h-32" />
                </div>
              </div>
              <div className="space-y-6">
                <Skeleton className="w-full h-48" />
                <Skeleton className="w-full h-32" />
              </div>
            </div>
          </div>
        </div>
      )
    }
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
          <p className="text-gray-600 mb-4">You don't have permission to view this trip.</p>
          <Link href="/trips">
            <Button>Back to Trips</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <Alert className="max-w-md mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="mr-4" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{trip.name}</h1>
                <Badge variant={getBadgeVariant(trip.status)} className="text-sm">
                  {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                </Badge>
              </div>
              <p className="text-muted-foreground">{trip.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDateRange(trip.startDate, trip.endDate)}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {trip.destination}
                </div>
                {stats.isUpcoming && (
                  <div className="flex items-center text-orange-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {stats.daysUntilTrip} days to go
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/trips/${tripId}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button 
              variant={isShared ? "default" : "outline"} 
              size="sm"
              onClick={handleShareTrip}
              disabled={isSharing}
              className={isShared ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {isSharing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : isShared ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <Share2 className="w-4 h-4 mr-2" />
              )}
              {isSharing ? 'Processing...' : isShared ? 'Shared' : 'Share'}
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{stats.tripDuration}</p>
                  <p className="text-sm text-muted-foreground">Days</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalExpenses)}</p>
                  <p className="text-sm text-muted-foreground">Spent</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Budget: {formatCurrency(trip.budget || 0)}</span>
                  <span>{stats.budgetUtilization.toFixed(1)}%</span>
                </div>
                <Progress value={Math.min(stats.budgetUtilization, 100)} className="mt-1" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalActivities}</p>
                  <p className="text-sm text-muted-foreground">Activities</p>
                </div>
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {formatDuration(stats.totalActivityDuration)} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-600">{stats.itineraryStops}</p>
                  <p className="text-sm text-muted-foreground">Destinations</p>
                </div>
                <Navigation className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {formatCurrency(stats.dailyExpenseAvg)}/day avg
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Trip Image and Overview */}
            <Card className="overflow-hidden">
              <img
                src={trip.image || "/placeholder.svg?height=300&width=600"}
                alt={trip.name}
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{stats.remainingBudget >= 0 ? '+' : ''}{formatCurrency(stats.remainingBudget)}</div>
                    <div className="text-sm text-muted-foreground">Budget Remaining</div>
                    {stats.remainingBudget < 0 && (
                      <div className="flex items-center justify-center mt-1">
                        <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                        <span className="text-xs text-red-500">Over budget</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">{stats.expenseCount}</div>
                    <div className="text-sm text-muted-foreground">Expenses</div>
                    <div className="text-xs text-muted-foreground mt-1">{formatCurrency(stats.dailyExpenseAvg)}/day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">{formatCurrency(stats.avgActivityCost)}</div>
                    <div className="text-sm text-muted-foreground">Avg Activity</div>
                    <div className="text-xs text-muted-foreground mt-1">{formatCurrency(stats.totalActivitiesCost)} total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-1">{stats.budgetUtilization.toFixed(0)}%</div>
                    <div className="text-sm text-muted-foreground">Budget Used</div>
                    <div className="text-xs text-muted-foreground mt-1">{stats.budgetUtilization > 100 ? 'Over' : 'Within'} budget</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activities">Activities ({stats.totalActivities})</TabsTrigger>
                <TabsTrigger value="expenses">Expenses ({stats.expenseCount})</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary ({stats.itineraryStops})</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Trip Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Destination</Label>
                        <p className="text-lg">{trip.destination}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Duration</Label>
                        <p className="text-lg">{stats.tripDuration} days</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                        <div className="mt-1">
                          <Badge variant={getBadgeVariant(trip.status)} className={getStatusColor(trip.status)}>
                            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                        <p className="text-lg">{new Date(trip.$createdAt).toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Planned Cost</span>
                        <span className="text-lg font-semibold">{formatCurrency(stats.totalPlannedCost)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Activity Duration</span>
                        <span className="text-lg font-semibold">{formatDuration(stats.totalActivityDuration)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Budget Utilization</span>
                        <span className={`text-lg font-semibold ${stats.budgetUtilization > 100 ? 'text-red-600' : 'text-green-600'}`}>
                          {stats.budgetUtilization.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Daily Expense Avg</span>
                        <span className="text-lg font-semibold">{formatCurrency(stats.dailyExpenseAvg)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="activities">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Activities ({stats.totalActivities})</CardTitle>
                        <CardDescription>Planned activities for your trip</CardDescription>
                      </div>
                      <Link href={`/trips/${tripId}/activities`}>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Activity
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {activities.length > 0 ? (
                      <div className="space-y-4">
                        {activities.map((activity) => {
                          const IconComponent = categoryIcons[activity.category as keyof typeof categoryIcons] || Star
                          return (
                            <div
                              key={activity.$id}
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg flex items-center justify-center">
                                  <IconComponent className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-semibold">{activity.name}</h4>
                                  <p className="text-sm text-muted-foreground">{activity.location}</p>
                                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(activity.scheduledDate).toLocaleDateString()}
                                    <Clock className="w-3 h-3 ml-2 mr-1" />
                                    {activity.scheduledTime}
                                    <span className="ml-2">({formatDuration(activity.duration)})</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant="outline">{formatCurrency(activity.cost)}</Badge>
                                <p className="text-xs text-muted-foreground mt-1 capitalize">{activity.category}</p>
                              </div>
                            </div>
                          )
                        })}
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center font-semibold">
                            <span>Total Activity Cost</span>
                            <span className="text-lg">{formatCurrency(stats.totalActivitiesCost)}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                            <span>Total Duration</span>
                            <span>{formatDuration(stats.totalActivityDuration)}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No activities planned yet</h3>
                        <p className="text-gray-600 mb-4">Add some exciting activities to your trip</p>
                        <Link href={`/trips/${tripId}/activities`}>
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Activity
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="expenses">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Expenses ({stats.expenseCount})</CardTitle>
                        <CardDescription>Track your trip expenses</CardDescription>
                      </div>
                      <Link href={`/trips/${tripId}/expenses`}>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Expense
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {expenses.length > 0 ? (
                      <div className="space-y-4">
                        {expenses.map((expense) => {
                          const IconComponent = expenseCategoryIcons[expense.category as keyof typeof expenseCategoryIcons] || CreditCard
                          return (
                            <div
                              key={expense.$id}
                              className="flex items-center justify-between p-4 border rounded-lg"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                  <IconComponent className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold">{expense.title}</h4>
                                  <p className="text-sm text-muted-foreground">{expense.description}</p>
                                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(expense.date).toLocaleDateString()}
                                    <Badge variant="secondary" className="ml-2 text-xs capitalize">
                                      {expense.category}
                                    </Badge>
                                    {expense.paymentMethod && (
                                      <span className="ml-2 text-xs">via {expense.paymentMethod}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-semibold">{formatCurrency(expense.amount)}</span>
                                {expense.isShared && (
                                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    <Users className="w-3 h-3 mr-1" />
                                    Shared
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center font-semibold">
                            <span>Total Expenses</span>
                            <span className="text-lg">{formatCurrency(stats.totalExpenses)}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                            <span>Daily Average</span>
                            <span>{formatCurrency(stats.dailyExpenseAvg)}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses recorded yet</h3>
                        <p className="text-gray-600 mb-4">Start tracking your trip expenses</p>
                        <Link href={`/trips/${tripId}/expenses`}>
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Expense
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="itinerary">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Itinerary ({stats.itineraryStops})</CardTitle>
                        <CardDescription>Your trip destinations and schedule</CardDescription>
                      </div>
                      <Link href={`/trips/${tripId}/itinerary`}>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Destination
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {itinerary.length > 0 ? (
                      <div className="space-y-4">
                        {itinerary.map((stop, index) => (
                          <div
                            key={stop.$id}
                            className="flex items-center space-x-4 p-4 border rounded-lg"
                          >
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="font-semibold text-blue-600">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{stop.destination}</h4>
                              <p className="text-sm text-muted-foreground">{stop.notes}</p>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(stop.startDate).toLocaleDateString()} - {new Date(stop.endDate).toLocaleDateString()}
                                <span className="ml-4">Budget: {formatCurrency(stop.budget)}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline">{formatCurrency(stop.budget)}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No itinerary planned yet</h3>
                        <p className="text-gray-600 mb-4">Create your trip itinerary</p>
                        <Link href={`/trips/${tripId}/itinerary`}>
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Plan Itinerary
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <PieChart className="w-5 h-5 mr-2" />
                        Expense Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {Object.keys(stats.expensesByCategory).length > 0 ? (
                        <div className="space-y-3">
                          {Object.entries(stats.expensesByCategory).map(([category, amount]) => (
                            <div key={category} className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                <span className="text-sm capitalize">{category}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-semibold">{formatCurrency(amount)}</span>
                                <div className="text-xs text-muted-foreground">
                                  {((amount / stats.totalExpenses) * 100).toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">No expense data available</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Activity Categories
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {Object.keys(stats.activitiesByCategory).length > 0 ? (
                        <div className="space-y-3">
                          {Object.entries(stats.activitiesByCategory).map(([category, count]) => (
                            <div key={category} className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                <span className="text-sm capitalize">{category}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-semibold">{count}</span>
                                <div className="text-xs text-muted-foreground">
                                  {((count / stats.totalActivities) * 100).toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">No activity data available</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Budget Overview */}
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
                    <span className="font-semibold">{formatCurrency(trip.budget || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Expenses</span>
                    <span className="font-semibold">{formatCurrency(stats.totalExpenses)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Planned Activities</span>
                    <span className="font-semibold">{formatCurrency(stats.totalActivitiesCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Remaining</span>
                    <span className={`font-semibold ${stats.remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(stats.remainingBudget)}
                    </span>
                  </div>
                  {trip.budget && trip.budget > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${stats.budgetUtilization > 100
                          ? 'bg-gradient-to-r from-red-500 to-red-600'
                          : 'bg-gradient-to-r from-blue-500 to-orange-500'
                          }`}
                        style={{ width: `${Math.min(stats.budgetUtilization, 100)}%` }}
                      />
                    </div>
                  )}
                  <Link href={`/trips/${tripId}/expenses`}>
                    <Button className="w-full" variant="outline">
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
                <Link href={`/trips/${tripId}/calendar`}>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Calendar
                  </Button>
                </Link>
                <Link href={`/trips/${tripId}/itinerary`}>
                  <Button className="w-full justify-start" variant="outline">
                    <Navigation className="w-4 h-4 mr-2" />
                    Edit Itinerary
                  </Button>
                </Link>
                <Link href={`/trips/${tripId}/activities`}>
                  <Button className="w-full justify-start" variant="outline">
                    <Activity className="w-4 h-4 mr-2" />
                    Manage Activities
                  </Button>
                </Link>
                <Link href={`/trips/${tripId}/expenses`}>
                  <Button className="w-full justify-start" variant="outline">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Track Expenses
                  </Button>
                </Link>
                <Link href={`/search/activities`}>
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Discover Activities
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Trip Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Status</span>
                  <Badge variant={getBadgeVariant(trip.status)} className={getStatusColor(trip.status)}>
                    {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                  </Badge>
                </div>
                {stats.isUpcoming && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Starts in</span>
                    <span className="font-semibold text-orange-600">{stats.daysUntilTrip} days</span>
                  </div>
                )}
                {stats.isOngoing && (
                  <div className="flex items-center justify-center p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-blue-600 font-medium">Trip is ongoing!</span>
                  </div>
                )}
                <div className="pt-2">
                  <Link href={`/trips/${tripId}/edit`}>
                    <Button variant="outline" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Trip Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isShared ? 'Trip Shared' : 'Share Trip'}</DialogTitle>
            <DialogDescription>
              {isShared 
                ? 'Your trip is currently shared. Anyone with this link can view your trip details.'
                : 'Anyone with this link can view your trip details. The link doesn\'t expire.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                value={shareUrl || ''}
                readOnly
                className="font-mono text-sm"
              />
            </div>
            <Button size="sm" className="px-3" onClick={copyToClipboard}>
              <span className="sr-only">Copy</span>
              {isCopied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
            <p>✅ Trip details and itinerary</p>
            <p>✅ Activities and expenses</p>
            <p>✅ Photos and notes</p>
            <p className="text-orange-600">⚠️ Anyone with this link can view your trip</p>
          </div>
          {isShared && (
            <div className="pt-4 border-t">
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleUnshareTrip}
                disabled={isSharing}
                className="w-full"
              >
                {isSharing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <AlertTriangle className="w-4 h-4 mr-2" />
                )}
                {isSharing ? 'Unsharing...' : 'Unshare Trip'}
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                This will make the link inaccessible to others
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
