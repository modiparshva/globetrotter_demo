"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  BarChart3, 
  DollarSign, 
  Users, 
  MapPin, 
  Calendar,
  Star,
  Activity as ActivityIcon,
  Globe,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { getTripTrends, getGrowthMetrics, getAdminStats, getRegionalAnalytics, getTopActivitiesByCategory } from "@/lib/admin-data"

export default function AdvancedAnalytics() {
  const stats = useMemo(() => getAdminStats(), [])
  const tripTrends = useMemo(() => getTripTrends(), [])
  const growthMetrics = useMemo(() => getGrowthMetrics(), [])
  const regionalAnalytics = useMemo(() => getRegionalAnalytics(), [])
  const activityCategories = useMemo(() => getTopActivitiesByCategory(), [])

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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
            <p className="mt-2 text-sm text-gray-600">
              Deep insights into platform performance and user behavior trends
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>User Growth</span>
              <Users className="h-5 w-5 text-blue-600" />
            </CardTitle>
            <CardDescription>Monthly user registration trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="text-2xl font-bold">{formatNumber.format(growthMetrics.userGrowth.thisMonth)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Month</span>
                <span className="text-lg text-muted-foreground">{formatNumber.format(growthMetrics.userGrowth.lastMonth)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Growth Rate</span>
                <div className="flex items-center">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">+{growthMetrics.userGrowth.percentageChange}%</span>
                </div>
              </div>
              <Progress value={growthMetrics.userGrowth.percentageChange} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Trip Growth</span>
              <MapPin className="h-5 w-5 text-green-600" />
            </CardTitle>
            <CardDescription>Trip creation and booking trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="text-2xl font-bold">{formatNumber.format(growthMetrics.tripGrowth.thisMonth)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Month</span>
                <span className="text-lg text-muted-foreground">{formatNumber.format(growthMetrics.tripGrowth.lastMonth)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Growth Rate</span>
                <div className="flex items-center">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">+{growthMetrics.tripGrowth.percentageChange}%</span>
                </div>
              </div>
              <Progress value={growthMetrics.tripGrowth.percentageChange} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Budget Growth</span>
              <DollarSign className="h-5 w-5 text-orange-600" />
            </CardTitle>
            <CardDescription>Revenue and budget trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="text-2xl font-bold">{formatINR.format(growthMetrics.budgetGrowth.thisMonth)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Month</span>
                <span className="text-lg text-muted-foreground">{formatINR.format(growthMetrics.budgetGrowth.lastMonth)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Growth Rate</span>
                <div className="flex items-center">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">+{growthMetrics.budgetGrowth.percentageChange}%</span>
                </div>
              </div>
              <Progress value={growthMetrics.budgetGrowth.percentageChange} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trip Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Monthly Trip Creation Trends
          </CardTitle>
          <CardDescription>Trip creation patterns over the past 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-6 lg:grid-cols-12 gap-2">
              {tripTrends.map((trend, index) => {
                const maxTrips = Math.max(...tripTrends.map(t => t.tripsCreated))
                const height = Math.max((trend.tripsCreated / maxTrips) * 100, 10)
                
                return (
                  <div key={trend.month} className="flex flex-col items-center">
                    <div 
                      className="bg-gradient-to-t from-blue-600 to-orange-500 rounded-t-sm mb-2 min-h-[20px] w-8 flex items-end justify-center"
                      style={{ height: `${height}px` }}
                      title={`${trend.month}: ${trend.tripsCreated} trips, ${formatINR.format(trend.totalBudget)} budget`}
                    >
                      <span className="text-xs text-white font-medium pb-1">{trend.tripsCreated}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{trend.month}</span>
                  </div>
                )
              })}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatNumber.format(tripTrends.reduce((sum, t) => sum + t.tripsCreated, 0))}
                </div>
                <div className="text-sm text-muted-foreground">Total Trips (12 months)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatINR.format(tripTrends.reduce((sum, t) => sum + t.totalBudget, 0))}
                </div>
                <div className="text-sm text-muted-foreground">Total Budget (12 months)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {formatINR.format(Math.round(tripTrends.reduce((sum, t) => sum + t.avgBudget, 0) / tripTrends.length))}
                </div>
                <div className="text-sm text-muted-foreground">Avg. Budget per Trip</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Distribution & Activity Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Regional Distribution Analysis
            </CardTitle>
            <CardDescription>Trip distribution across Indian regions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regionalAnalytics.map((region, index) => {
                const maxTrips = Math.max(...regionalAnalytics.map(r => r.totalTrips))
                const percentage = (region.totalTrips / maxTrips) * 100
                
                return (
                  <div key={region.name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                          {index + 1}
                        </div>
                        <span className="font-medium">{region.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatNumber.format(region.totalTrips)} trips</div>
                        <div className="text-xs text-muted-foreground">{region.cities} cities</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Progress value={percentage} className="flex-1 h-2" />
                      <span className="text-sm text-muted-foreground">{Math.round(percentage)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Avg. Cost: ₹{formatNumber.format(region.avgCostIndex)}</span>
                      <span className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        {region.avgRating} rating
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ActivityIcon className="w-5 h-5 mr-2" />
              Activity Category Performance
            </CardTitle>
            <CardDescription>Most popular activity types and engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityCategories.map((category, index) => {
                const maxCount = Math.max(...activityCategories.map(c => c.count))
                const percentage = (category.count / maxCount) * 100
                
                return (
                  <div key={category.category}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-600 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                          {index + 1}
                        </div>
                        <span className="font-medium">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatNumber.format(category.count)} activities</div>
                        <div className="text-xs text-muted-foreground">Avg: {formatINR.format(category.avgCost)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Progress value={percentage} className="flex-1 h-2" />
                      <span className="text-sm text-muted-foreground">{Math.round(percentage)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Top activities available</span>
                      <span className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        {category.avgRating} avg rating
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Platform Performance KPIs
          </CardTitle>
          <CardDescription>Critical metrics for platform health and user engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-700 mb-2">
                {growthMetrics.engagementMetrics.avgTripsPerUser}
              </div>
              <div className="text-sm font-medium text-blue-900 mb-1">Trips per User</div>
              <div className="text-xs text-blue-600">User engagement metric</div>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-700 mb-2">
                {formatINR.format(growthMetrics.engagementMetrics.avgBudgetPerUser)}
              </div>
              <div className="text-sm font-medium text-green-900 mb-1">Avg. Budget/User</div>
              <div className="text-xs text-green-600">Revenue per user</div>
            </div>

            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-700 mb-2">
                {growthMetrics.engagementMetrics.completionRate}%
              </div>
              <div className="text-sm font-medium text-orange-900 mb-1">Completion Rate</div>
              <div className="text-xs text-orange-600">Platform effectiveness</div>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-700 mb-2">
                {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
              </div>
              <div className="text-sm font-medium text-purple-900 mb-1">User Activity Rate</div>
              <div className="text-xs text-purple-600">Active vs total users</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights and Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Platform Insights & Recommendations
          </CardTitle>
          <CardDescription>AI-powered insights based on current platform data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-green-900">🚀 Growth Opportunities</h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="font-medium text-sm">North India Expansion</div>
                  <div className="text-xs text-muted-foreground">North India shows highest trip growth (+40.6%). Consider adding more destinations.</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="font-medium text-sm">Activity Diversification</div>
                  <div className="text-xs text-muted-foreground">Heritage activities are most popular. Expand cultural and wellness categories.</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <div className="font-medium text-sm">Budget Optimization</div>
                  <div className="text-xs text-muted-foreground">Average budget per trip is {formatINR.format(stats.avgBudgetPerTrip)}. Consider mid-range packages.</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-amber-900">⚠️ Areas for Improvement</h4>
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                  <div className="font-medium text-sm">User Retention</div>
                  <div className="text-xs text-muted-foreground">{100 - Math.round((stats.activeUsers / stats.totalUsers) * 100)}% users are inactive. Implement engagement campaigns.</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <div className="font-medium text-sm">Regional Balance</div>
                  <div className="text-xs text-muted-foreground">Some regions have low activity. Focus marketing on underperforming areas.</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <div className="font-medium text-sm">Activity Engagement</div>
                  <div className="text-xs text-muted-foreground">Average {Math.round(stats.totalActivities / stats.totalCities)} activities per city. Add more local experiences.</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}