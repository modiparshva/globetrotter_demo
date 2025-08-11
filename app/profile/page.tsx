"use client"

<<<<<<< HEAD
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useTrips } from "@/hooks/use-trips"
import { storage, PROFILE_IMAGES_BUCKET_ID } from "@/lib/appwrite"
import { ID } from "appwrite"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
=======
import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
>>>>>>> origin/dishant
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
<<<<<<< HEAD
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
=======
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Phone, MapPin, Camera, Save, Trash2, Globe, Calendar, Settings, Heart, Eye } from "lucide-react"

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    city: "New York",
    country: "United States",
    bio: "Passionate traveler exploring the world one destination at a time. Love discovering hidden gems and sharing travel experiences with fellow adventurers.",
    profileImage: "/diverse-user-avatars.png",
  })

  const [preferences, setPreferences] = useState({
    language: "English",
    currency: "USD",
    notifications: true,
    publicProfile: true,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
>>>>>>> origin/dishant
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

<<<<<<< HEAD
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
=======
  const handleSave = () => {
    // Save logic here
    setIsEditing(false)
  }

  const plannedTrips = [
    {
      id: 1,
      name: "European Adventure",
      destination: "Paris, Rome, Barcelona",
      dates: "Jun 15-30, 2024",
      image: "/paris-eiffel-tower.png",
    },
    {
      id: 2,
      name: "Tokyo Discovery",
      destination: "Tokyo, Kyoto, Osaka",
      dates: "Mar 10-20, 2024",
      image: "/tokyo-skyline-night.png",
    },
  ]

  const previousTrips = [
    {
      id: 1,
      name: "Bali Retreat",
      destination: "Ubud, Seminyak",
      dates: "Jan 5-15, 2024",
      image: "/bali-temple.png",
    },
    {
      id: 2,
      name: "Iceland Adventure",
      destination: "Reykjavik, Blue Lagoon",
      dates: "Nov 12-18, 2023",
      image: "/iceland-northern-lights.png",
    },
  ]

  const savedDestinations = [
    { name: "Santorini, Greece", image: "/santorini-sunset.png" },
    { name: "Dubai, UAE", image: "/dubai-skyline.png" },
    { name: "Bali, Indonesia", image: "/bali-temple.png" },
  ]
>>>>>>> origin/dishant

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
<<<<<<< HEAD
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="trips">My Trips</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
=======
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="trips">My Trips</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
>>>>>>> origin/dishant
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
<<<<<<< HEAD
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
=======
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Profile Information
                      </CardTitle>
                      <CardDescription>Update your personal information and profile details</CardDescription>
                    </div>
                    <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "outline" : "default"}>
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
>>>>>>> origin/dishant
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Photo */}
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={profileData.profileImage || "/placeholder.svg"} />
                      <AvatarFallback className="text-2xl">
<<<<<<< HEAD
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
=======
                        {profileData.firstName[0]}
                        {profileData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        <Camera className="w-4 h-4 mr-2" />
                        Change Photo
                      </Button>
                    )}
>>>>>>> origin/dishant
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
<<<<<<< HEAD
                          disabled={true}
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
=======
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
>>>>>>> origin/dishant
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
<<<<<<< HEAD
=======

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Tell us about yourself and your travel interests..."
                    />
                  </div>

                  {isEditing && (
                    <div className="flex gap-4">
                      <Button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
>>>>>>> origin/dishant
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trips Tab */}
            <TabsContent value="trips">
              <div className="space-y-6">
<<<<<<< HEAD
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
=======
                {/* Planned Trips */}
                <Card>
                  <CardHeader>
                    <CardTitle>Planned Trips</CardTitle>
                    <CardDescription>Your upcoming adventures</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {plannedTrips.map((trip) => (
                        <Card key={trip.id} className="overflow-hidden">
                          <img
                            src={trip.image || "/placeholder.svg"}
                            alt={trip.name}
                            className="w-full h-32 object-cover"
                          />
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-1">{trip.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{trip.destination}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3 mr-1" />
                              {trip.dates}
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Previous Trips */}
                <Card>
                  <CardHeader>
                    <CardTitle>Previous Trips</CardTitle>
                    <CardDescription>Your completed adventures</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {previousTrips.map((trip) => (
                        <Card key={trip.id} className="overflow-hidden">
                          <img
                            src={trip.image || "/placeholder.svg"}
                            alt={trip.name}
                            className="w-full h-32 object-cover"
                          />
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-1">{trip.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{trip.destination}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3 mr-1" />
                              {trip.dates}
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Saved Tab */}
            <TabsContent value="saved">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Saved Destinations
                  </CardTitle>
                  <CardDescription>Places you want to visit</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedDestinations.map((destination, index) => (
                      <Card key={index} className="overflow-hidden">
                        <img
                          src={destination.image || "/placeholder.svg"}
                          alt={destination.name}
                          className="w-full h-32 object-cover"
                        />
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2">{destination.name}</h4>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                              View Details
                            </Button>
                            <Button size="sm" variant="outline">
                              <Heart className="w-3 h-3 text-red-500" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Account Settings
                    </CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Language</Label>
                        <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                      </div>
                      <Badge variant="outline">{preferences.language}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Currency</Label>
                        <p className="text-sm text-muted-foreground">Default currency for pricing</p>
                      </div>
                      <Badge variant="outline">{preferences.currency}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive trip updates and recommendations</p>
                      </div>
                      <Badge variant={preferences.notifications ? "default" : "secondary"}>
                        {preferences.notifications ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Public Profile</Label>
                        <p className="text-sm text-muted-foreground">Allow others to see your trips</p>
                      </div>
                      <Badge variant={preferences.publicProfile ? "default" : "secondary"}>
                        {preferences.publicProfile ? "Public" : "Private"}
                      </Badge>
>>>>>>> origin/dishant
                    </div>
                  </CardContent>
                </Card>

                <Card>
<<<<<<< HEAD
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
=======
                  <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Alert>
                      <AlertDescription>
                        Deleting your account will permanently remove all your trips, preferences, and data. This action
                        cannot be undone.
                      </AlertDescription>
                    </Alert>
                    <Button variant="destructive" className="mt-4">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
>>>>>>> origin/dishant
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/dishant
