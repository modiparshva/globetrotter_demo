"use client"

import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useTrip } from "@/hooks/use-trips"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import { Calendar, MapPin, ArrowLeft, Edit, Share2, DollarSign, Clock, Star, Plus, Loader2, Activity } from "lucide-react"
import Link from "next/link"

export default function TripDetails() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const tripId = params.id as string

  const { trip, activities, expenses, isLoadingTrip, isLoadingActivities, isLoadingExpenses } = useTrip(tripId)

  if (isLoadingTrip) {
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="w-full h-96" />
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

  // Calculate statistics
  const tripDuration = Math.ceil(
    (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
  )
  
  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0
  const totalActivitiesCost = activities?.reduce((sum, activity) => sum + activity.cost, 0) || 0
  const remainingBudget = (trip.budget || 0) - totalExpenses

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="mr-4" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{trip.name}</h1>
              <p className="text-muted-foreground mt-1">{trip.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/trips/${tripId}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Trip Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <img
                src={trip.image || "/placeholder.svg?height=300&width=600"}
                alt={trip.name}
                className="w-full h-64 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant={getBadgeVariant(trip.status)} className="text-sm">
                    {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDateRange(trip.startDate, trip.endDate)}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">1</div>
                    <div className="text-sm text-muted-foreground">Destination</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{tripDuration}</div>
                    <div className="text-sm text-muted-foreground">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">${(trip.budget || 0).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Budget</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{activities?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Activities</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Budget Overview */}
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
                    <span className="font-semibold">${(trip.budget || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Expenses</span>
                    <span className="font-semibold">${totalExpenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Activities Cost</span>
                    <span className="font-semibold">${totalActivitiesCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Remaining</span>
                    <span className={`font-semibold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${remainingBudget.toLocaleString()}
                    </span>
                  </div>
                  {trip.budget && trip.budget > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-orange-500 h-2 rounded-full"
                        style={{ width: `${Math.min((totalExpenses / trip.budget) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                  <Link href={`/trips/${tripId}/budget`}>
                    <Button className="w-full bg-transparent" variant="outline">
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
                <Link href={`/trips/${tripId}/itinerary`}>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    Edit Itinerary
                  </Button>
                </Link>
                <Link href={`/trips/${tripId}/activities`}>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Activity className="w-4 h-4 mr-2" />
                    Manage Activities
                  </Button>
                </Link>
                <Link href={`/trips/${tripId}/expenses`}>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Track Expenses
                  </Button>
                </Link>
                <Link href={`/trips/${tripId}/calendar`}>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Calendar
                  </Button>
                </Link>
                <Link href={`/search/activities`}>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Discover Activities
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trip Details Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
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
                    <p className="text-lg">{tripDuration} days</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <Badge variant={getBadgeVariant(trip.status)}>
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
                    <span className="text-sm text-muted-foreground">Total Activities</span>
                    <span className="text-lg font-semibold">{activities?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Expenses</span>
                    <span className="text-lg font-semibold">{expenses?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Budget Utilized</span>
                    <span className="text-lg font-semibold">
                      {trip.budget && trip.budget > 0 
                        ? `${Math.round((totalExpenses / trip.budget) * 100)}%`
                        : 'N/A'
                      }
                    </span>
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
                    <CardTitle>Activities</CardTitle>
                    <CardDescription>Planned activities for your trip</CardDescription>
                  </div>
                  <Link href={`/search/activities`}>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Activity
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingActivities ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="w-full h-20" />
                    ))}
                  </div>
                ) : activities && activities.length > 0 ? (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div
                        key={activity.$id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg flex items-center justify-center">
                            <Star className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{activity.name}</h4>
                            <p className="text-sm text-muted-foreground">{activity.location}</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(activity.date).toLocaleDateString()}
                              <Clock className="w-3 h-3 ml-2 mr-1" />
                              {activity.time}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">${activity.cost}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">{activity.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No activities planned yet</h3>
                    <p className="text-gray-600 mb-4">Add some exciting activities to your trip</p>
                    <Link href={`/search/activities`}>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Browse Activities
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
                    <CardTitle>Expenses</CardTitle>
                    <CardDescription>Track your trip expenses</CardDescription>
                  </div>
                  <Link href={`/trips/${tripId}/budget`}>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Expense
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingExpenses ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="w-full h-16" />
                    ))}
                  </div>
                ) : expenses && expenses.length > 0 ? (
                  <div className="space-y-4">
                    {expenses.map((expense) => (
                      <div
                        key={expense.$id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h4 className="font-semibold">{expense.description}</h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(expense.date).toLocaleDateString()}
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {expense.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-semibold">${expense.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center font-semibold">
                        <span>Total Expenses</span>
                        <span className="text-lg">${totalExpenses.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses recorded yet</h3>
                    <p className="text-gray-600 mb-4">Start tracking your trip expenses</p>
                    <Link href={`/trips/${tripId}/budget`}>
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

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Trip Notes</CardTitle>
                <CardDescription>Keep track of important information about your trip</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Trip Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {trip.description || "No description added yet."}
                    </p>
                  </div>
                  <Link href={`/trips/${tripId}/edit`}>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Trip Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
