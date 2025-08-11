"use client"

<<<<<<< HEAD
import { useState, useRef, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useTrip, useTrips } from "@/hooks/use-trips"
import { storage, TRIP_IMAGES_BUCKET_ID } from "@/lib/appwrite"
import { ID } from "appwrite"
=======
import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
>>>>>>> origin/dishant
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
<<<<<<< HEAD
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, MapPin, Camera, Save, ArrowLeft, Trash2, Upload, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
=======
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Calendar, MapPin, Camera, Save, ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { getTripById } from "@/lib/data"
>>>>>>> origin/dishant

export default function EditTrip() {
  const params = useParams()
  const router = useRouter()
<<<<<<< HEAD
  const { user } = useAuth()
  const tripId = params.id as string
  const { trip, isLoadingTrip } = useTrip(tripId)
  const { updateTrip, deleteTrip, isUpdatingTrip, isDeletingTrip } = useTrips()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    status: "planning" as const,
    image: "",
  })

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [error, setError] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Update form data when trip loads
  useEffect(() => {
    if (trip) {
      setFormData({
        name: trip.name || "",
        description: trip.description || "",
        destination: trip.destination || "",
        startDate: trip.startDate || "",
        endDate: trip.endDate || "",
        budget: trip.budget?.toString() || "",
        status: trip.status || "planning",
        image: trip.image || "",
      })
      setImagePreview(trip.image || "")
    }
  }, [trip])

  if (isLoadingTrip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Skeleton className="w-24 h-10 mr-4" />
            <Skeleton className="w-64 h-8" />
          </div>
          <div className="max-w-2xl mx-auto">
            <Skeleton className="w-full h-96" />
          </div>
        </div>
      </div>
    )
  }
=======
  const tripId = Number.parseInt(params.id as string)

  const trip = getTripById(tripId)

  const [formData, setFormData] = useState({
    name: trip?.name || "",
    description: trip?.description || "",
    startDate: trip?.startDate || "",
    endDate: trip?.endDate || "",
    totalBudget: trip?.totalBudget || 0,
    isPublic: trip?.isPublic || false,
    coverImage: trip?.coverImage || "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
>>>>>>> origin/dishant

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trip Not Found</h1>
<<<<<<< HEAD
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
          <p className="text-gray-600 mb-4">You don't have permission to edit this trip.</p>
=======
          <p className="text-gray-600 mb-4">The trip you're trying to edit doesn't exist.</p>
>>>>>>> origin/dishant
          <Link href="/trips">
            <Button>Back to Trips</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
<<<<<<< HEAD
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview("")
    setFormData(prev => ({ ...prev, image: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return null

    setIsUploadingImage(true)
    try {
      const fileUpload = await storage.createFile(
        TRIP_IMAGES_BUCKET_ID,
        ID.unique(),
        selectedImage
      )

      const fileUrl = storage.getFileView(TRIP_IMAGES_BUCKET_ID, fileUpload.$id)
      return fileUrl.toString()
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image")
      return null
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.name || !formData.destination || !formData.startDate || !formData.endDate) {
      setError("Please fill in all required fields")
=======
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isPublic: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!formData.name || !formData.startDate || !formData.endDate) {
      setError("Please fill in all required fields")
      setIsLoading(false)
>>>>>>> origin/dishant
      return
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError("End date must be after start date")
<<<<<<< HEAD
=======
      setIsLoading(false)
>>>>>>> origin/dishant
      return
    }

    try {
<<<<<<< HEAD
      // Upload image if selected
      let imageUrl = formData.image
      if (selectedImage) {
        const uploadedUrl = await uploadImage()
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
      }

      // Update trip data
      const updateData = {
        name: formData.name,
        description: formData.description,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget ? parseFloat(formData.budget) : 0,
        status: formData.status,
        image: imageUrl,
      }

      updateTrip({ tripId, data: updateData })

      toast.success("Trip updated successfully!")
      router.push(`/trips/${tripId}`)
    } catch (error: any) {
      console.error("Update trip error:", error)
      setError("Failed to update trip. Please try again.")
      toast.error("Failed to update trip")
    }
  }

  const handleDelete = () => {
    if (showDeleteConfirm) {
      deleteTrip(tripId)
      router.push("/trips")
    } else {
      setShowDeleteConfirm(true)
=======
      // Simulate API call
      console.log("Updating trip:", formData)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect back to trip details
      router.push(`/trips/${tripId}`)
    } catch (error) {
      console.error("Update trip error:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this trip? This action cannot be undone.")) {
      try {
        setIsLoading(true)
        // Simulate API call
        console.log("Deleting trip:", tripId)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        router.push("/trips")
      } catch (error) {
        console.error("Delete trip error:", error)
        setError("Failed to delete trip. Please try again.")
      } finally {
        setIsLoading(false)
      }
>>>>>>> origin/dishant
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href={`/trips/${tripId}`}>
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Trip
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Trip</h1>
            <p className="text-muted-foreground mt-1">Update your trip details</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
<<<<<<< HEAD
                Trip Details
              </CardTitle>
              <CardDescription>Update your trip information</CardDescription>
=======
                Trip Information
              </CardTitle>
              <CardDescription>Update your trip details and preferences</CardDescription>
>>>>>>> origin/dishant
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Trip Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Trip Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., European Adventure 2024"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

<<<<<<< HEAD
                {/* Destination */}
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="destination"
                      name="destination"
                      placeholder="e.g., Paris, France"
                      value={formData.destination}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

=======
>>>>>>> origin/dishant
                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
<<<<<<< HEAD
                        min={formData.startDate}
=======
>>>>>>> origin/dishant
                      />
                    </div>
                  </div>
                </div>

<<<<<<< HEAD
                {/* Budget and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget</Label>
                    <Input
                      id="budget"
                      name="budget"
                      type="number"
                      placeholder="0"
                      value={formData.budget}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Trip Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
=======
                {/* Budget */}
                <div className="space-y-2">
                  <Label htmlFor="totalBudget">Total Budget ($)</Label>
                  <Input
                    id="totalBudget"
                    name="totalBudget"
                    type="number"
                    placeholder="0"
                    value={formData.totalBudget}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
>>>>>>> origin/dishant
                </div>

                {/* Trip Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Trip Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your trip goals, interests, or any special occasions..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>

<<<<<<< HEAD
                {/* Cover Photo */}
                <div className="space-y-2">
                  <Label>Cover Photo</Label>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Trip cover preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                        className="absolute top-2 right-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-2">Upload a cover photo for your trip</p>
                      <Button type="button" variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeletingTrip}
                  >
                    {isDeletingTrip ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : showDeleteConfirm ? (
                      "Confirm Delete"
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Trip
                      </>
                    )}
                  </Button>
                  
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" asChild>
                      <Link href={`/trips/${tripId}`}>Cancel</Link>
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                      disabled={isUpdatingTrip || isUploadingImage}
                    >
                      {isUpdatingTrip || isUploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {isUploadingImage ? "Uploading..." : "Updating..."}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Update Trip
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {showDeleteConfirm && (
                  <Alert>
                    <AlertDescription>
                      Are you sure you want to delete this trip? This action cannot be undone.
                      Click "Confirm Delete" again to proceed.
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>
=======
                {/* Privacy Setting */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="isPublic">Make Trip Public</Label>
                    <p className="text-sm text-muted-foreground">Allow others to view and get inspired by your trip</p>
                  </div>
                  <Switch id="isPublic" checked={formData.isPublic} onCheckedChange={handleSwitchChange} />
                </div>

                {/* Cover Photo */}
                <div className="space-y-2">
                  <Label>Cover Photo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    {formData.coverImage ? (
                      <div className="space-y-4">
                        <img
                          src={formData.coverImage || "/placeholder.svg"}
                          alt="Trip cover"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button type="button" variant="outline" size="sm">
                          <Camera className="w-4 h-4 mr-2" />
                          Change Photo
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-2">Upload a cover photo for your trip</p>
                        <Button type="button" variant="outline" size="sm">
                          Choose File
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                    disabled={isLoading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Saving Changes..." : "Save Changes"}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href={`/trips/${tripId}`}>Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="mt-8 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for this trip</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-900">Delete Trip</h4>
                  <p className="text-sm text-red-600">
                    Permanently delete this trip and all associated data. This action cannot be undone.
                  </p>
                </div>
                <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Trip
                </Button>
              </div>
            </CardContent>
          </Card>
>>>>>>> origin/dishant
        </div>
      </div>
    </div>
  )
}
