"use client"

<<<<<<< HEAD
import { useState } from "react"
=======
import { useState, useEffect, useMemo } from "react"
>>>>>>> origin/dishant
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
<<<<<<< HEAD
import { Search, Plus, Calendar, MapPin, MoreHorizontal, Edit, Eye, Trash2, Filter, SortAsc, Loader2 } from "lucide-react"
import { useTrips } from "@/hooks/use-trips"
import { useAuth } from "@/hooks/use-auth"
import { Trip } from "@/lib/trips"

export default function MyTrips() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const { trips, isLoadingTrips, deleteTrip } = useTrips()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Show loading state
  if (isAuthLoading || isLoadingTrips) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-muted-foreground">Loading your trips...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Please sign in</h3>
            <p className="text-gray-600 mb-4">You need to be signed in to view your trips.</p>
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const filteredTrips = (trips || []).filter((trip) => {
    const matchesSearch =
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
=======
import { Search, Plus, Calendar, MapPin, MoreHorizontal, Edit, Eye, Trash2, Filter, SortAsc } from "lucide-react"
import { getTrips, deleteTrip, type Trip } from "@/lib/data"

export default function MyTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

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

  // Load trips on component mount
  useEffect(() => {
    setTrips(getTrips())
  }, [])

  const handleDeleteTrip = (tripId: number) => {
    if (window.confirm("Are you sure you want to delete this trip? This action cannot be undone.")) {
      const success = deleteTrip(tripId)
      if (success) {
        setTrips(getTrips()) // Refresh the trips list
      }
    }
  }

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.description.toLowerCase().includes(searchQuery.toLowerCase())
>>>>>>> origin/dishant

    if (activeTab === "all") return matchesSearch
    return matchesSearch && trip.status === activeTab
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-green-100 text-green-800"
<<<<<<< HEAD
      case "planning":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
=======
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "planning":
        return "bg-yellow-100 text-yellow-800"
>>>>>>> origin/dishant
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDateRange = (startDate: string, endDate: string) => {
<<<<<<< HEAD
    const start = new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const end = new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    return `${start} - ${end}`
  }

  const handleDeleteTrip = async (tripId: string) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      await deleteTrip(tripId)
    }
  }

=======
    const start = new Date(startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
    const end = new Date(endDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
    return `${start} - ${end}`
  }

>>>>>>> origin/dishant
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
<<<<<<< HEAD
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Trips</h1>
            <p className="text-muted-foreground">Manage and organize your travel adventures</p>
=======
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Indian Adventures</h1>
            <p className="text-muted-foreground">Manage and organize your incredible India journeys</p>
>>>>>>> origin/dishant
          </div>
          <Button
            asChild
            className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
          >
            <Link href="/trips/create">
              <Plus className="w-4 h-4 mr-2" />
              Plan New Trip
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
<<<<<<< HEAD
              placeholder="Search trips..."
=======
              placeholder="Search your Indian trips..."
>>>>>>> origin/dishant
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <SortAsc className="w-4 h-4 mr-2" />
              Sort by
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Trips</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
<<<<<<< HEAD
=======
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
>>>>>>> origin/dishant
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredTrips.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
                <p className="text-gray-600 mb-4">
<<<<<<< HEAD
                  {searchQuery ? "Try adjusting your search terms" : "Start planning your first adventure!"}
=======
                  {searchQuery ? "Try adjusting your search terms" : "Start exploring incredible India!"}
>>>>>>> origin/dishant
                </p>
                <Button asChild>
                  <Link href="/trips/create">
                    <Plus className="w-4 h-4 mr-2" />
<<<<<<< HEAD
                    Create Your First Trip
=======
                    Create Your First Indian Adventure
>>>>>>> origin/dishant
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrips.map((trip) => (
<<<<<<< HEAD
                  <Card key={trip.$id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={trip.image || "/placeholder.svg?height=200&width=400"}
=======
                  <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={trip.coverImage || "/placeholder.svg?height=200&width=400"}
>>>>>>> origin/dishant
                        alt={trip.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="secondary" className="opacity-90">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
<<<<<<< HEAD
                              <Link href={`/trips/${trip.$id}`}>
=======
                              <Link href={`/trips/${trip.id}`}>
>>>>>>> origin/dishant
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
<<<<<<< HEAD
                              <Link href={`/trips/${trip.$id}/edit`}>
=======
                              <Link href={`/trips/${trip.id}/edit`}>
>>>>>>> origin/dishant
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
<<<<<<< HEAD
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteTrip(trip.$id)}
                            >
=======
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTrip(trip.id)}>
>>>>>>> origin/dishant
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge className={getStatusColor(trip.status)}>
                          {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <CardTitle className="mb-2 line-clamp-1">{trip.name}</CardTitle>
                      <CardDescription className="mb-3 line-clamp-2">{trip.description}</CardDescription>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDateRange(trip.startDate, trip.endDate)}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
<<<<<<< HEAD
                          {trip.destination}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Budget: ${trip.budget.toLocaleString()}</span>
=======
                          {formatNumber.format(trip.destinationCount)} destinations
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Budget: {formatINR.format(trip.totalBudget)}</span>
>>>>>>> origin/dishant
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
<<<<<<< HEAD
                          <Link href={`/trips/${trip.$id}`}>
=======
                          <Link href={`/trips/${trip.id}`}>
>>>>>>> origin/dishant
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
<<<<<<< HEAD
                          <Link href={`/trips/${trip.$id}/edit`}>
=======
                          <Link href={`/trips/${trip.id}/edit`}>
>>>>>>> origin/dishant
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
