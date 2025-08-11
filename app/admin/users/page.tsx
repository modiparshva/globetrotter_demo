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
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Ban,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  DollarSign,
  Loader2
} from "lucide-react"
import { useAdminStats, useAdminUsers } from "@/hooks/use-admin"

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  // Fetch real admin data
  const { data: stats, isLoading: isLoadingStats } = useAdminStats()
  const { data: allUsers, isLoading: isLoadingUsers } = useAdminUsers()

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

  // Process user data to match the expected format
  const processedUsers = useMemo(() => {
    if (!allUsers) return []
    return allUsers.map(user => ({
      userId: user.$id,
      userName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      totalTrips: user.totalTrips,
      totalBudget: user.totalBudget,
      status: user.status,
      lastActivity: user.totalTrips > 0 ? "Recently active" : "No recent activity",
    }))
  }, [allUsers])

  const filteredUsers = useMemo(() => {
    let users = processedUsers

    // Search filter
    if (searchQuery) {
      users = users.filter(user =>
        user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      users = users.filter(user => user.status === statusFilter)
    }

    // Sort
    users.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.userName.localeCompare(b.userName)
        case "trips":
          return b.totalTrips - a.totalTrips
        case "budget":
          return b.totalBudget - a.totalBudget
        case "email":
          return a.email.localeCompare(b.email)
        default:
          return 0
      }
    })

    return users
  }, [processedUsers, searchQuery, statusFilter, sortBy])

  const activeUsers = processedUsers.filter(user => user.status === "active").length
  const inactiveUsers = processedUsers.filter(user => user.status === "inactive").length

  // Show loading state
  if (isLoadingStats || isLoadingUsers) {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-5">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-muted-foreground">Loading user management...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!stats || !allUsers) {
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-5">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load user data</h3>
            <p className="text-gray-600 mb-4">Please check your permissions or try again later.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage user accounts and monitor user activity on the platform
            </p>
          </div>
        </div>
      </div>

      {/* User Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber.format(stats.totalUsers)}</div>
            <p className="text-xs text-muted-foreground">Registered on platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber.format(activeUsers)}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((activeUsers / stats.totalUsers) * 100)}% of total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
            <XCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber.format(inactiveUsers)}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((inactiveUsers / stats.totalUsers) * 100)}% of total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Budget per User</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatINR.format(Math.round(stats.totalBudget / Math.max(stats.totalUsers, 1)))}
            </div>
            <p className="text-xs text-muted-foreground">Average spending</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
          <CardDescription>Search, filter, and manage user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
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
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="trips">Trip Count</SelectItem>
                <SelectItem value="budget">Total Budget</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {formatNumber.format(filteredUsers.length)} of {formatNumber.format(processedUsers.length)} users
            </p>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Trips</TableHead>
                  <TableHead>Total Budget</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <Users className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-muted-foreground">No users found matching your criteria</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-blue-600">
                              {user.userName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{user.userName}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.status === "active" ? "default" : "secondary"}
                          className={user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                        >
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-muted-foreground mr-1" />
                          <span className="font-medium">{formatNumber.format(user.totalTrips)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-muted-foreground mr-1" />
                          <span className="font-medium">{formatINR.format(user.totalBudget)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-1" />
                          {user.lastActivity}
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

      {/* User Activity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Users by Trip Count</CardTitle>
            <CardDescription>Users with the most trips created</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {processedUsers
                .sort((a, b) => b.totalTrips - a.totalTrips)
                .slice(0, 5)
                .map((user, index) => (
                <div key={user.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{user.userName}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatNumber.format(user.totalTrips)} trips</div>
                    <div className="text-xs text-muted-foreground">{formatINR.format(user.totalBudget)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Users by Budget</CardTitle>
            <CardDescription>Users with the highest total trip budgets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {processedUsers
                .sort((a, b) => b.totalBudget - a.totalBudget)
                .slice(0, 5)
                .map((user, index) => (
                <div key={user.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{user.userName}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatINR.format(user.totalBudget)}</div>
                    <div className="text-xs text-muted-foreground">{formatNumber.format(user.totalTrips)} trips</div>
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