"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useTrips } from "@/hooks/use-trips"
import { storage, PROFILE_IMAGES_BUCKET_ID } from "@/lib/appwrite"
import { ID } from "appwrite"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Phone, MapPin, Camera, Save, Globe, Calendar, Settings, Heart, Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function UserProfile() {
  const { user, updateProfile, isUpdatingProfile } = useAuth()
  const { trips } = useTrips()
  const [isEditing, setIsEditing] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    profileImage: "",
  })

  // Update local state when user data changes
  useEffect(() => {
    if (user?.profile) {
      setProfileData({
        firstName: user.profile.firstName || "",
        lastName: user.profile.lastName || "",
        email: user.account?.email || "",
        phone: user.profile.phone || "",
        city: user.profile.city || "",
        country: user.profile.country || "",
        profileImage: user.profile.profileImage || "",
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.account?.$id) return

    setIsUploadingImage(true)
    try {
      // Upload file to Appwrite storage
      const fileUpload = await storage.createFile(
        PROFILE_IMAGES_BUCKET_ID,
        ID.unique(),
        file
      )

      // Get file URL
      const fileUrl = storage.getFileView(PROFILE_IMAGES_BUCKET_ID, fileUpload.$id)

      // Update profile with new image URL
      updateProfile({
        userId: user.account.$id,
        data: {
          profileImage: fileUrl.toString(),
        }
      })

      setProfileData(prev => ({
        ...prev,
        profileImage: fileUrl.toString(),
      }))

      toast.success("Profile image updated successfully!")
    } catch (error: any) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image")
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleSave = () => {
    if (!user?.account?.$id) return

    updateProfile({
      userId: user.account.$id,
      data: {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        city: profileData.city,
        country: profileData.country,
      }
    })

    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset to original data
    if (user?.profile) {
      setProfileData({
        firstName: user.profile.firstName || "",
        lastName: user.profile.lastName || "",
        email: user.account?.email || "",
        phone: user.profile.phone || "",
        city: user.profile.city || "",
        country: user.profile.country || "",
        profileImage: user.profile.profileImage || "",
      })
    }
    setIsEditing(false)
  }

  // Filter trips by status
  const plannedTrips = trips?.filter(trip => trip.status === 'planning' || trip.status === 'upcoming') || []
  const completedTrips = trips?.filter(trip => trip.status === 'completed') || []
  const ongoingTrips = trips?.filter(trip => trip.status === 'ongoing') || []

  // Calculate stats
  const totalTrips = trips?.length || 0
  const countriesVisited = new Set(trips?.map(trip => trip.destination?.split(',')[0]?.trim()) || []).size
  const totalBudget = trips?.reduce((sum, trip) => sum + (trip.budget || 0), 0) || 0

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and travel preferences</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="trips">My Trips</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Manage your personal information and preferences</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      {isEditing ? (
                        <>
                          <Button variant="outline" onClick={handleCancel}>
                            Cancel
                          </Button>
                          <Button onClick={handleSave} disabled={isUpdatingProfile}>
                            {isUpdatingProfile ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-2" />
                                Save
                              </>
                            )}
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => setIsEditing(true)}>
                          <Settings className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Photo */}
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={profileData.profileImage || "/placeholder.svg"} />
                      <AvatarFallback className="text-2xl">
                        {profileData.firstName?.[0] || 'U'}
                        {profileData.lastName?.[0] || 'N'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingImage}
                      >
                        {isUploadingImage ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Camera className="w-4 h-4 mr-2" />
                            Change Photo
                          </>
                        )}
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="firstName"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="lastName"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          disabled={true}
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="city"
                          name="city"
                          value={profileData.city}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="country"
                          name="country"
                          value={profileData.country}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trips Tab */}
            <TabsContent value="trips">
              <div className="space-y-6">
                {/* Ongoing Trips */}
                {ongoingTrips.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Ongoing Trips
                      </CardTitle>
                      <CardDescription>Your current adventures</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ongoingTrips.map((trip) => (
                          <Card key={trip.$id} className="overflow-hidden">
                            <img
                              src={trip.image || "/placeholder.svg"}
                              alt={trip.name}
                              className="w-full h-32 object-cover"
                            />
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-sm mb-1">{trip.name}</h3>
                              <p className="text-xs text-muted-foreground mb-2">{trip.destination}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                              </p>
                              <Badge variant="secondary" className="mt-2 text-xs">
                                {trip.status}
                              </Badge>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Planned Trips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Planned Trips
                    </CardTitle>
                    <CardDescription>Your upcoming adventures</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {plannedTrips.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {plannedTrips.map((trip) => (
                          <Card key={trip.$id} className="overflow-hidden">
                            <img
                              src={trip.image || "/placeholder.svg"}
                              alt={trip.name}
                              className="w-full h-32 object-cover"
                            />
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-sm mb-1">{trip.name}</h3>
                              <p className="text-xs text-muted-foreground mb-2">{trip.destination}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                              </p>
                              <div className="flex justify-between items-center mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {trip.status}
                                </Badge>
                                <Link href={`/trips/${trip.$id}`}>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">No planned trips yet</p>
                        <Link href="/trips/create">
                          <Button>
                            <Calendar className="w-4 h-4 mr-2" />
                            Plan Your First Trip
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Completed Trips */}
                {completedTrips.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        Completed Trips
                      </CardTitle>
                      <CardDescription>Your travel memories</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {completedTrips.map((trip) => (
                          <Card key={trip.$id} className="overflow-hidden">
                            <img
                              src={trip.image || "/placeholder.svg"}
                              alt={trip.name}
                              className="w-full h-32 object-cover"
                            />
                            <CardContent className="p-4">
                              <h3 className="font-semibold text-sm mb-1">{trip.name}</h3>
                              <p className="text-xs text-muted-foreground mb-2">{trip.destination}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                              </p>
                              <div className="flex justify-between items-center mt-2">
                                <Badge variant="secondary" className="text-xs">
                                  {trip.status}
                                </Badge>
                                <Link href={`/trips/${trip.$id}`}>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="stats">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">{totalTrips}</p>
                        <p className="text-muted-foreground">Total Trips</p>
                      </div>
                      <Globe className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">{countriesVisited}</p>
                        <p className="text-muted-foreground">Countries Visited</p>
                      </div>
                      <MapPin className="w-8 h-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
                        <p className="text-muted-foreground">Total Budget</p>
                      </div>
                      <Calendar className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}