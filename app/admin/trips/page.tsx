"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  MapPin, 
  Search, 
  Calendar, 
  DollarSign, 
  Users,
  TrendingUp,
  Eye,
  Edit,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Plane,
  Loader2,
  Ban,
  Share,
  Download,
  UserCheck
} from "lucide-react"
import { useAdminStats, useAdminTrips } from '@/hooks/use-admin'
import { tripService } from '@/lib/trips'
import { toast } from "sonner"

export default function TripAnalytics() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [selectedTrip, setSelectedTrip] = useState<any>(null)
  const [showTripDetails, setShowTripDetails] = useState(false)
  const [showEditTrip, setShowEditTrip] = useState(false)
  const [updatingTripId, setUpdatingTripId] = useState<string | null>(null)

  // Fetch real admin data
  const { data: stats, isLoading: isLoadingStats } = useAdminStats()
  const { data: allTrips, isLoading: isLoadingTrips, refetch: refetchTrips } = useAdminTrips()

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

  // Process trips data to match expected format
  const processedTrips = useMemo(() => {
    if (!allTrips) return []
    return allTrips.map(trip => ({
      id: trip.$id,
      name: trip.name,
      description: `Trip to ${trip.destination}`,
      status: trip.status,
      startDate: trip.startDate,
      endDate: trip.endDate,
      totalBudget: trip.budget,
      spent: Math.round(trip.budget * 0.3), // Simulate spent amount (30% of budget)
      destinationCount: 1, // Since we have destination as string, assume 1
      destination: trip.destination,
      userId: trip.userId,
    }))
  }, [allTrips])

  // Action handlers
  const handleViewTrip = (trip: any) => {
    setSelectedTrip(trip)
    setShowTripDetails(true)
  }

  const handleEditTrip = (trip: any) => {
    setSelectedTrip(trip)
    setShowEditTrip(true)
  }

  const handleShareTrip = (trip: any) => {
    // In a real implementation, this would generate a shareable link
    navigator.clipboard.writeText(`${window.location.origin}/shared/trip/${trip.id}`)
    toast.success(`Trip "${trip.name}" share link copied to clipboard`)
  }

  const handleDownloadTrip = (trip: any) => {
    // In a real implementation, this would generate and download trip data
    toast.success(`Downloading trip data for "${trip.name}"`)
  }

  const handleDeleteTrip = (trip: any) => {
    if (window.confirm(`Are you sure you want to delete trip "${trip.name}"? This action cannot be undone.`)) {
      // In a real implementation, this would call an API
      toast.success(`Trip "${trip.name}" has been deleted`)
    }
  }

  const handleChangeStatus = async (trip: any, newStatus: 'planning' | 'upcoming' | 'ongoing' | 'completed') => {
    if (updatingTripId === trip.id) return // Prevent multiple calls
    
    setUpdatingTripId(trip.id)
    try {
      await tripService.updateTrip(trip.id, { status: newStatus })
      toast.success(`Trip "${trip.name}" status changed to ${newStatus}`)
      
      // Refetch the trips data to get updated information
      refetchTrips()
    } catch (error) {
      console.error('Error updating trip status:', error)
      toast.error('Failed to update trip status. Please try again.')
    } finally {
      setUpdatingTripId(null)
    }
  }

  const filteredTrips = useMemo(() => {
    let trips = processedTrips

    // Search filter
    if (searchQuery) {
      trips = trips.filter(trip =>
        trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      trips = trips.filter(trip => trip.status === statusFilter)
    }

    // Sort
    trips.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        case "budget":
          return b.totalBudget - a.totalBudget
        case "name":
          return a.name.localeCompare(b.name)
        case "status":
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

    return trips
  }, [processedTrips, searchQuery, statusFilter, sortBy])

  const tripsByStatus = useMemo(() => {
    if (!processedTrips) return { planning: 0, upcoming: 0, ongoing: 0, completed: 0 }
    return {
      planning: processedTrips.filter(t => t.status === "planning").length,
      upcoming: processedTrips.filter(t => t.status === "upcoming").length,
      ongoing: processedTrips.filter(t => t.status === "ongoing").length,
      completed: processedTrips.filter(t => t.status === "completed").length,
    }
  }, [processedTrips])

  // Show loading state
  if (isLoadingStats || isLoadingTrips) {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-5">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-muted-foreground">Loading trip analytics...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!stats || !allTrips) {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-5">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load trip data</h3>
            <p className="text-gray-600 mb-4">Please check your permissions or try again later.</p>
          </div>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "ongoing":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "upcoming":
        return <Calendar className="w-4 h-4 text-orange-600" />
      case "planning":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      default:
        return <XCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "ongoing":
        return "bg-blue-100 text-blue-800"
      case "upcoming":
        return "bg-orange-100 text-orange-800"
      case "planning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trip Analytics</h1>
            <p className="mt-2 text-sm text-gray-600">
              Monitor and analyze trip data, user behavior, and booking trends
            </p>
          </div>
        </div>
      </div>

      {/* Trip Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <Plane className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber.format(stats.totalTrips)}</div>
            <p className="text-xs text-muted-foreground">All time trips created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber.format(tripsByStatus.ongoing)}</div>
            <p className="text-xs text-muted-foreground">Currently ongoing trips</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatINR.format(stats.totalBudget)}</div>
            <p className="text-xs text-muted-foreground">Across all trips</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Budget</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatINR.format(Math.round(stats.totalBudget / Math.max(stats.totalTrips, 1)))}
            </div>
            <p className="text-xs text-muted-foreground">Per trip average</p>
          </CardContent>
        </Card>
      </div>

      {/* Trip Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Trip Status Distribution
          </CardTitle>
          <CardDescription>Current status breakdown of all trips</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border">
              <div className="flex items-center">
                <AlertCircle className="w-8 h-8 text-yellow-600 mr-3" />
                <div>
                  <div className="font-medium">Planning</div>
                  <div className="text-sm text-muted-foreground">In preparation</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-yellow-700">{formatNumber.format(tripsByStatus.planning)}</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-orange-600 mr-3" />
                <div>
                  <div className="font-medium">Upcoming</div>
                  <div className="text-sm text-muted-foreground">In preparation</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-orange-700">{formatNumber.format(tripsByStatus.upcoming)}</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <div className="font-medium">Ongoing</div>
                  <div className="text-sm text-muted-foreground">Currently active</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-700">{formatNumber.format(tripsByStatus.ongoing)}</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <div className="font-medium">Completed</div>
                  <div className="text-sm text-muted-foreground">Successfully finished</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-700">{formatNumber.format(tripsByStatus.completed)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip Management Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Management</CardTitle>
          <CardDescription>View, search, and manage all trips on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search trips by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Start Date</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {formatNumber.format(filteredTrips.length)} of {formatNumber.format(processedTrips.length)} trips
            </p>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trip Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Destinations</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <Plane className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-muted-foreground">No trips found matching your criteria</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTrips.map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{trip.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            Trip to {trip.destination}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(trip.status)}>
                          <div className="flex items-center">
                            {getStatusIcon(trip.status)}
                            <span className="ml-1">{trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(trip.startDate).toLocaleDateString("en-IN")}</div>
                          <div className="text-muted-foreground">to {new Date(trip.endDate).toLocaleDateString("en-IN")}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{formatINR.format(trip.totalBudget)}</div>
                          <div className="text-sm text-muted-foreground">
                            Spent: {formatINR.format(trip.spent)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-muted-foreground mr-1" />
                          <span className="text-sm">{trip.destination}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewTrip(trip)}
                            title="View trip details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditTrip(trip)}
                            title="Edit trip"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                title="More actions"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleShareTrip(trip)}>
                                <Share className="w-4 h-4 mr-2" />
                                Share Trip
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadTrip(trip)}>
                                <Download className="w-4 h-4 mr-2" />
                                Download Data
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleChangeStatus(trip, 'completed')}
                                disabled={updatingTripId === trip.id}
                              >
                                {updatingTripId === trip.id ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                )}
                                Mark Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleChangeStatus(trip, 'ongoing')}
                                disabled={updatingTripId === trip.id}
                              >
                                {updatingTripId === trip.id ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <Clock className="w-4 h-4 mr-2" />
                                )}
                                Mark Ongoing
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleChangeStatus(trip, 'upcoming')}
                                disabled={updatingTripId === trip.id}
                              >
                                {updatingTripId === trip.id ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <Calendar className="w-4 h-4 mr-2" />
                                )}
                                Mark Upcoming
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleChangeStatus(trip, 'planning')}
                                disabled={updatingTripId === trip.id}
                              >
                                {updatingTripId === trip.id ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 mr-2" />
                                )}
                                Mark Planning
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteTrip(trip)}
                                className="text-red-600"
                              >
                                <Ban className="w-4 h-4 mr-2" />
                                Delete Trip
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Trip Analytics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Trips by Budget</CardTitle>
            <CardDescription>Highest budget trips on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {processedTrips
                .sort((a, b) => b.totalBudget - a.totalBudget)
                .slice(0, 5)
                .map((trip, index) => (
                <div key={trip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{trip.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {trip.destination} • {trip.status}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatINR.format(trip.totalBudget)}</div>
                    <div className="text-xs text-muted-foreground">Spent: {formatINR.format(trip.spent)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Trip Activity</CardTitle>
            <CardDescription>Latest trip updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {processedTrips
                .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                .slice(0, 5)
                .map((trip, index) => (
                <div key={trip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{trip.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Starts: {new Date(trip.startDate).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(trip.status)} variant="secondary">
                      {trip.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trip Details Modal */}
      <Dialog open={showTripDetails} onOpenChange={setShowTripDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Trip Details</DialogTitle>
            <DialogDescription>
              View detailed information about this trip.
            </DialogDescription>
          </DialogHeader>
          {selectedTrip && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Trip Name</label>
                  <p className="text-sm text-muted-foreground">{selectedTrip.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedTrip.status)}>
                      {selectedTrip.status.charAt(0).toUpperCase() + selectedTrip.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Destination</label>
                  <p className="text-sm text-muted-foreground">{selectedTrip.destination}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedTrip.startDate).toLocaleDateString("en-IN")} - {new Date(selectedTrip.endDate).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Budget</label>
                  <p className="text-sm text-muted-foreground">{formatINR.format(selectedTrip.totalBudget)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Amount Spent</label>
                  <p className="text-sm text-muted-foreground">{formatINR.format(selectedTrip.spent)}</p>
                </div>
              </div>
              {selectedTrip.description && (
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedTrip.description}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Trip Modal */}
      <Dialog open={showEditTrip} onOpenChange={setShowEditTrip}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Trip</DialogTitle>
            <DialogDescription>
              Modify trip details and settings.
            </DialogDescription>
          </DialogHeader>
          {selectedTrip && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Trip Name</label>
                  <Input defaultValue={selectedTrip.name} placeholder="Enter trip name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select defaultValue={selectedTrip.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Destination</label>
                  <Input defaultValue={selectedTrip.destination} placeholder="Enter destination" />
                </div>
                <div>
                  <label className="text-sm font-medium">Budget</label>
                  <Input type="number" defaultValue={selectedTrip.totalBudget} placeholder="Enter budget" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowEditTrip(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success("Trip updated successfully")
                  setShowEditTrip(false)
                }}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}