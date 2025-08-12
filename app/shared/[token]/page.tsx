"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import {
  Calendar,
  MapPin,
  Globe,
  Share2,
  Copy,
  Star,
  DollarSign,
  Users,
  Eye,
  AlertTriangle,
  Check,
} from "lucide-react"
import Link from "next/link"
import { tripService, type Trip } from "@/lib/trips"
import { toast } from "sonner"

export default function SharedTrip() {
  const params = useParams()
  const token = params.token as string

  const [trip, setTrip] = useState<Trip | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchSharedTrip = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const { sharedTrip, trip: tripData } = await tripService.getSharedTrip(token)
        setTrip(tripData as unknown as Trip)
      } catch (error: any) {
        console.error('Error fetching shared trip:', error)
        setError(error.message || 'Failed to load shared trip')
      } finally {
        setIsLoading(false)
      }
    }

    if (token) {
      fetchSharedTrip()
    }
  }, [token])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error === 'Shared trip not found or expired' ? 'Trip Not Found' : 'Access Error'}
          </h1>
          <p className="text-gray-600 mb-4">
            {error || 'This shared trip link is invalid or has been removed.'}
          </p>
          <Link href="/dashboard">
            <Button>Explore GlobeTrotter</Button>
          </Link>
        </div>
      </div>
    )
  }

  const tripDays = Math.ceil(
    (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-orange-500 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  GlobeTrotter
                </h1>
                <p className="text-xs text-muted-foreground">Shared Trip</p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-orange-500">
                  <Star className="w-4 h-4 mr-2" />
                  Explore GlobeTrotter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Trip Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">{trip.description}</p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDateRange(trip.startDate, trip.endDate)}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {trip.destination}
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    Public Trip
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-r from-blue-100 to-orange-100 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-sm">
                  <div className="font-medium">Shared Trip</div>
                  <div className="text-muted-foreground">Public View</div>
                </div>
              </div>
            </div>

            {/* Trip Cover Image */}
            <Card className="overflow-hidden mb-6">
              <img
                src={trip.image || "/placeholder.svg?height=400&width=800"}
                alt={trip.name}
                className="w-full h-64 md:h-80 object-cover"
              />
            </Card>

            {/* Trip Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{tripDays}</div>
                  <div className="text-sm text-muted-foreground">Days</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">${trip.budget}</div>
                  <div className="text-sm text-muted-foreground">Budget</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Status</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">⭐</div>
                  <div className="text-sm text-muted-foreground">Shared</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Trip Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <p className="text-sm mt-1">{trip.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Destination</Label>
                  <p className="text-sm mt-1">{trip.destination}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Start Date</Label>
                    <p className="text-sm mt-1">{new Date(trip.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">End Date</Label>
                    <p className="text-sm mt-1">{new Date(trip.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Budget</Label>
                    <p className="text-sm mt-1">${trip.budget}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <p className="text-sm mt-1 capitalize">{trip.status}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Sharing */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Share2 className="w-5 h-5 mr-2" />
                Share This Trip
              </CardTitle>
              <CardDescription>Help others discover this amazing journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Button variant="outline" onClick={copyToClipboard}>
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Trip Link
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="text-center">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-2">Inspired by this trip?</h3>
              <p className="text-muted-foreground mb-4">
                Create your own amazing travel experiences with GlobeTrotter
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-orange-500">
                  Start Planning Your Trip
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}