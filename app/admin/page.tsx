"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Globe, 
  Calendar,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Plane,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { useAdminStats, useAdminUsers, usePopularDestinations } from "@/hooks/use-admin"
import { adminService } from "@/lib/admin"
import { getCommunityActivity } from "@/lib/data"

export default function AdminDashboard() {
  // All hooks must be called at the top, before any conditional returns
  const { data: stats, isLoading: isLoadingStats } = useAdminStats()
  const { data: allUsers, isLoading: isLoadingUsers } = useAdminUsers()
  const { data: popularDestinations, isLoading: isLoadingDestinations } = usePopularDestinations()
  
  // INR formatter
  const formatINR = useMemo(() => 
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }), []
  )

  const formatNumber = useMemo(() => 
    new Intl.NumberFormat("en-IN"), []
  )

  // Static data that remains the same
  const growthMetrics = useMemo(() => adminService.getGrowthMetrics(), [])
  const recentActivities = useMemo(() => getCommunityActivity().slice(0, 5), [])

  // Process user activity data
  const userActivity = useMemo(() => {
    if (!allUsers) return []
    return allUsers.slice(0, 5).map(user => ({
      userId: user.$id,
      userName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      totalTrips: user.totalTrips,
      totalBudget: user.totalBudget,
      status: user.isActive ? "active" : "inactive",
    }))
  }, [allUsers])

  // Mock regional data since we don't have this structure yet
  const regionalData = useMemo(() => [
    { name: "North India", cities: 15, avgRating: 4.2, totalTrips: 245, avgCostIndex: 15000 },
    { name: "South India", cities: 12, avgRating: 4.5, totalTrips: 198, avgCostIndex: 18000 },
    { name: "West India", cities: 10, avgRating: 4.1, totalTrips: 156, avgCostIndex: 22000 },
    { name: "East India", cities: 8, avgRating: 4.3, totalTrips: 89, avgCostIndex: 12000 },
  ], [])

  // Show loading state
  if (isLoadingStats || isLoadingUsers || isLoadingDestinations) {
    return (
      <div className="space-y-8">
        <div className="border-b border-gray-200 pb-5">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-muted-foreground">Loading admin dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="space-y-8">
        <div className="border-b border-gray-200 pb-5">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load admin data</h3>
            <p className="text-gray-600 mb-4">Please check your permissions or try again later.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Monitor your Indian travel platform's performance and user engagement
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Last updated: {new Date().toLocaleString("en-IN")}
            </Badge>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber.format(stats.totalUsers)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600">+{growthMetrics.userGrowth.percentageChange}%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <Plane className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber.format(stats.totalTrips)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600">+{growthMetrics.tripGrowth.percentageChange}%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatINR.format(stats.totalBudget)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600">+{growthMetrics.budgetGrowth.percentageChange}%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber.format(stats.activeUsers)}</div>
            <div className="text-xs text-muted-foreground">
              {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total users
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trip Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Trip Status Distribution
            </CardTitle>
            <CardDescription>Current status of all trips on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">Completed</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">{stats.completedTrips}</span>
                  <Badge variant="secondary">{Math.round((stats.completedTrips / stats.totalTrips) * 100)}%</Badge>
                </div>
              </div>
              <Progress 
                value={(stats.completedTrips / stats.totalTrips) * 100} 
                className="h-2"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm">Planning</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">{stats.planningTrips}</span>
                  <Badge variant="secondary">{Math.round((stats.planningTrips / stats.totalTrips) * 100)}%</Badge>
                </div>
              </div>
              <Progress 
                value={(stats.planningTrips / stats.totalTrips) * 100} 
                className="h-2"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  <span className="text-sm">Ongoing</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">{stats.ongoingTrips}</span>
                  <Badge variant="secondary">{Math.round((stats.ongoingTrips / stats.totalTrips) * 100)}%</Badge>
                </div>
              </div>
              <Progress 
                value={(stats.ongoingTrips / stats.totalTrips) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Key Performance Indicators
            </CardTitle>
            <CardDescription>Platform engagement and usage metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-blue-900">Avg. Trips per User</div>
                  <div className="text-xs text-blue-600">User engagement metric</div>
                </div>
                <div className="text-2xl font-bold text-blue-700">{growthMetrics.engagementMetrics.avgTripsPerUser}</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-green-900">Avg. Budget per User</div>
                  <div className="text-xs text-green-600">Spending behavior</div>
                </div>
                <div className="text-xl font-bold text-green-700">{formatINR.format(growthMetrics.engagementMetrics.avgBudgetPerUser)}</div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-orange-900">Trip Completion Rate</div>
                  <div className="text-xs text-orange-600">Platform effectiveness</div>
                </div>
                <div className="text-2xl font-bold text-orange-700">{growthMetrics.engagementMetrics.completionRate}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Destinations & Regional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Top Indian Destinations
              </CardTitle>
              <CardDescription>Most popular cities by trip count and budget</CardDescription>
            </div>
            <Link href="/admin/cities">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(popularDestinations || []).slice(0, 5).map((destination, index) => (
                <div key={destination.destination} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{destination.destination}</div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        4.5 • {destination.totalTrips} trips
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatINR.format(destination.totalBudget)}</div>
                    <div className="text-xs text-muted-foreground">Total Budget</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Regional Distribution
              </CardTitle>
              <CardDescription>Trip distribution across Indian regions</CardDescription>
            </div>
            <Link href="/admin/analytics">
              <Button variant="outline" size="sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                Detailed Analytics
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {regionalData.map((region, index) => (
                <div key={region.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{region.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {region.cities} cities • Avg rating: {region.avgRating}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{region.totalTrips} trips</Badge>
                    <div className="text-sm text-muted-foreground">${region.avgCostIndex}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent User Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Recent User Activity
            </CardTitle>
            <CardDescription>Latest user registrations and trip creations</CardDescription>
          </div>
          <Link href="/admin/users">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userActivity.map((user) => (
              <div key={user.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-blue-600">
                      {user.userName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{user.userName}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">{user.totalTrips} trips</div>
                    <div className="text-xs text-muted-foreground">{formatINR.format(user.totalBudget)}</div>
                  </div>
                  <Badge variant={user.status === "active" ? "default" : "secondary"}>
                    {user.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/users">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center p-4">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <div className="font-medium">Manage Users</div>
                <div className="text-xs text-muted-foreground">View and manage user accounts</div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/trips">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center p-4">
              <MapPin className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <div className="font-medium">Trip Analytics</div>
                <div className="text-xs text-muted-foreground">Analyze trip data and trends</div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/cities">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center p-4">
              <Globe className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <div className="font-medium">Cities & Activities</div>
                <div className="text-xs text-muted-foreground">Manage destinations and activities</div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/analytics">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex items-center p-4">
              <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <div className="font-medium">Advanced Analytics</div>
                <div className="text-xs text-muted-foreground">Detailed charts and insights</div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}