"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="trips">My Trips</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
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
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Photo */}
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={profileData.profileImage || "/placeholder.svg"} />
                      <AvatarFallback className="text-2xl">
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
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
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
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trips Tab */}
            <TabsContent value="trips">
              <div className="space-y-6">
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
                    </div>
                  </CardContent>
                </Card>

                <Card>
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
