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
  Plane
} from "lucide-react"
import { getAdminStats, getTripsByStatus } from "@/lib/admin-data"
import { getTrips, getCityById } from "@/lib/data"

export default function TripAnalytics() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  const stats = useMemo(() => getAdminStats(), [])
  const allTrips = useMemo(() => getTrips(), [])

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

  const filteredTrips = useMemo(() => {
    let trips = allTrips

    // Search filter
    if (searchQuery) {
      trips = trips.filter(trip =>
        trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.description.toLowerCase().includes(searchQuery.toLowerCase())
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
  }, [allTrips, searchQuery, statusFilter, sortBy])

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

  const tripsByStatus = useMemo(() => {
    return {
      planning: allTrips.filter(t => t.status === "planning").length,
      upcoming: allTrips.filter(t => t.status === "upcoming").length,
      ongoing: allTrips.filter(t => t.status === "ongoing").length,
      completed: allTrips.filter(t => t.status === "completed").length,
    }
  }, [allTrips])

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
            <div className="text-2xl font-bold">{formatNumber.format(tripsByStatus.ongoing + tripsByStatus.upcoming)}</div>
            <p className="text-xs text-muted-foreground">Ongoing & upcoming trips</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatINR.format(stats.totalBudgetAllTrips)}</div>
            <p className="text-xs text-muted-foreground">Across all trips</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Budget</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatINR.format(stats.avgBudgetPerTrip)}</div>
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
                  <div className="text-sm text-muted-foreground">Scheduled ahead</div>
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
              Showing {formatNumber.format(filteredTrips.length)} of {formatNumber.format(allTrips.length)} trips
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
                            {trip.description}
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
                          <span className="text-sm">{formatNumber.format(trip.destinationCount)} stops</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
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
              {allTrips
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
                        {formatNumber.format(trip.destinationCount)} destinations • {trip.status}
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
              {allTrips
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
    </div>
  )
}