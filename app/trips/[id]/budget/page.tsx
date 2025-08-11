"use client"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  PieChart,
  BarChart3,
  Calendar,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import { getTripWithDetails, getCityById, getActivityById } from "@/lib/data"

export default function TripBudget() {
  const params = useParams()
  const router = useRouter()
  const tripId = Number.parseInt(params.id as string)

  const tripData = getTripWithDetails(tripId)

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
      </div>
    )
  }

  // Calculate budget breakdown
  const totalBudget = tripData.totalBudget
  const spent = tripData.spent
  const remaining = totalBudget - spent

  // Calculate costs by category
  const accommodationCost = Math.round(totalBudget * 0.4) // 40% of budget
  const transportCost = Math.round(totalBudget * 0.25) // 25% of budget
  const foodCost = Math.round(totalBudget * 0.2) // 20% of budget
  const activitiesCost = tripData.stops.reduce((total, stop) => {
    return total + stop.activities.reduce((stopTotal, activity) => stopTotal + activity.cost, 0)
  }, 0)
  const miscCost = totalBudget - accommodationCost - transportCost - foodCost - activitiesCost

  const categories = [
    {
      name: "Accommodation",
      amount: accommodationCost,
      color: "bg-blue-500",
      spent: Math.round(accommodationCost * 0.6),
    },
    { name: "Transport", amount: transportCost, color: "bg-green-500", spent: Math.round(transportCost * 0.8) },
    { name: "Food & Dining", amount: foodCost, color: "bg-orange-500", spent: Math.round(foodCost * 0.7) },
    { name: "Activities", amount: activitiesCost, color: "bg-purple-500", spent: activitiesCost },
    { name: "Miscellaneous", amount: miscCost, color: "bg-gray-500", spent: Math.round(miscCost * 0.3) },
  ]

  const totalSpentByCategory = categories.reduce((total, cat) => total + cat.spent, 0)

  // Daily budget breakdown
  const tripDays = Math.ceil(
    (new Date(tripData.endDate).getTime() - new Date(tripData.startDate).getTime()) / (1000 * 60 * 60 * 24),
  )
  const dailyBudget = totalBudget / tripDays
  const dailySpent = spent / tripDays

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
              <h1 className="text-3xl font-bold text-gray-900">Budget & Cost Breakdown</h1>
              <p className="text-muted-foreground mt-1">{tripData.name}</p>
            </div>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Spent</p>
                  <p className="text-2xl font-bold text-red-600">${spent.toLocaleString()}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="text-2xl font-bold text-green-600">${remaining.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Daily Budget</p>
                  <p className="text-2xl font-bold">${Math.round(dailyBudget).toLocaleString()}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
            <CardDescription>Track your spending against your total budget</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round((spent / totalBudget) * 100)}% used</span>
              </div>
              <Progress value={(spent / totalBudget) * 100} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$0</span>
                <span>${totalBudget.toLocaleString()}</span>
              </div>
              {spent > totalBudget && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  You're over budget by ${(spent - totalBudget).toLocaleString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="breakdown" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="breakdown">Category Breakdown</TabsTrigger>
            <TabsTrigger value="daily">Daily Breakdown</TabsTrigger>
            <TabsTrigger value="destinations">By Destination</TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Spending by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{category.name}</span>
                          <span>${category.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`${category.color} h-2 rounded-full`}
                              style={{ width: `${(category.amount / totalBudget) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {Math.round((category.amount / totalBudget) * 100)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Spent: ${category.spent.toLocaleString()}</span>
                          <span>Remaining: ${(category.amount - category.spent).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Budget Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Budget Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map((category, index) => {
                      const percentSpent = (category.spent / category.amount) * 100
                      let alertType = "normal"
                      let alertMessage = ""

                      if (percentSpent > 100) {
                        alertType = "over"
                        alertMessage = `Over budget by $${(category.spent - category.amount).toLocaleString()}`
                      } else if (percentSpent > 80) {
                        alertType = "warning"
                        alertMessage = `${Math.round(100 - percentSpent)}% budget remaining`
                      } else {
                        alertMessage = `${Math.round(100 - percentSpent)}% budget remaining`
                      }

                      return (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-3 ${category.color}`} />
                            <span className="font-medium text-sm">{category.name}</span>
                          </div>
                          <Badge
                            variant={
                              alertType === "over" ? "destructive" : alertType === "warning" ? "secondary" : "outline"
                            }
                            className="text-xs"
                          >
                            {alertMessage}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="daily">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Daily Budget Analysis
                </CardTitle>
                <CardDescription>Your trip is {tripDays} days long</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">${Math.round(dailyBudget)}</div>
                    <div className="text-sm text-muted-foreground">Daily Budget</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">${Math.round(dailySpent)}</div>
                    <div className="text-sm text-muted-foreground">Daily Spent (Avg)</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">${Math.round(dailyBudget - dailySpent)}</div>
                    <div className="text-sm text-muted-foreground">Daily Remaining</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Daily Breakdown by Category</h4>
                  {categories.map((category, index) => {
                    const dailyCategoryBudget = category.amount / tripDays
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${category.color}`} />
                          <span className="font-medium text-sm">{category.name}</span>
                        </div>
                        <span className="text-sm font-medium">${Math.round(dailyCategoryBudget)}/day</span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="destinations">
            <div className="space-y-6">
              {tripData.stops.length === 0 ? (
                <Card className="p-8 text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations added yet</h3>
                  <p className="text-gray-600 mb-4">Add destinations to see budget breakdown by location</p>
                  <Link href={`/trips/${tripId}/itinerary`}>
                    <Button>Add Destinations</Button>
                  </Link>
                </Card>
              ) : (
                tripData.stops
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((stop, index) => {
                    const city = getCityById(stop.cityId)
                    if (!city) return null

                    const stopActivitiesCost = stop.activities.reduce((total, activity) => total + activity.cost, 0)
                    const stopDays = Math.ceil(
                      (new Date(stop.endDate).getTime() - new Date(stop.startDate).getTime()) / (1000 * 60 * 60 * 24),
                    )

                    return (
                      <Card key={stop.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                                {index + 1}
                              </div>
                              <div>
                                <CardTitle>
                                  {city.name}, {city.country}
                                </CardTitle>
                                <CardDescription>
                                  {stopDays} days • {stop.activities.length} activities
                                </CardDescription>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold">${stop.budget.toLocaleString()}</div>
                              <div className="text-sm text-muted-foreground">Budget</div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-lg font-bold text-blue-600">
                                ${Math.round(stop.budget / stopDays)}
                              </div>
                              <div className="text-xs text-muted-foreground">Daily Budget</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <div className="text-lg font-bold text-purple-600">${stopActivitiesCost}</div>
                              <div className="text-xs text-muted-foreground">Activities Cost</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-lg font-bold text-green-600">
                                ${(stop.budget - stopActivitiesCost).toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">Remaining</div>
                            </div>
                          </div>

                          {stop.activities.length > 0 && (
                            <div className="mt-4">
                              <h5 className="font-medium mb-2">Activity Costs</h5>
                              <div className="space-y-2">
                                {stop.activities.map((activity) => {
                                  const activityDetails = getActivityById(activity.activityId)
                                  if (!activityDetails) return null

                                  return (
                                    <div key={activity.id} className="flex items-center justify-between text-sm">
                                      <span>{activityDetails.name}</span>
                                      <Badge variant="outline">${activity.cost}</Badge>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
