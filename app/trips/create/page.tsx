"use client"

<<<<<<< HEAD
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useTrips } from "@/hooks/use-trips"
import { storage, TRIP_IMAGES_BUCKET_ID } from "@/lib/appwrite"
import { ID } from "appwrite"
=======
import type React from "react"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
>>>>>>> origin/dishant
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
<<<<<<< HEAD
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Camera, Save, ArrowLeft, DollarSign, Users, Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

// Popular destinations with suggestions
const destinationSuggestions = {
  "Paris, France": [
    "Visit Eiffel Tower",
    "Louvre Museum",
    "Seine River Cruise",
    "Montmartre District",
    "Notre-Dame Cathedral",
    "Champs-Élysées Shopping"
  ],
  "Tokyo, Japan": [
    "Visit Senso-ji Temple",
    "Shibuya Crossing",
    "Tokyo Skytree",
    "Tsukiji Fish Market",
    "Harajuku District",
    "Mount Fuji Day Trip"
  ],
  "New York, USA": [
    "Statue of Liberty",
    "Central Park",
    "Times Square",
    "9/11 Memorial",
    "Brooklyn Bridge",
    "Broadway Show"
  ],
  "London, UK": [
    "Big Ben & Parliament",
    "Tower of London",
    "British Museum",
    "London Eye",
    "Hyde Park",
    "Thames River Cruise"
  ],
  "Dubai, UAE": [
    "Burj Khalifa",
    "Dubai Mall",
    "Desert Safari",
    "Burj Al Arab",
    "Dubai Marina",
    "Gold Souk"
  ],
  "Rome, Italy": [
    "Colosseum",
    "Vatican City",
    "Trevi Fountain",
    "Roman Forum",
    "Pantheon",
    "Spanish Steps"
  ]
}

export default function CreateTrip() {
  const { user } = useAuth()
  const { createTrip, isCreatingTrip } = useTrips()
  const router = useRouter()
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
  const [suggestions, setSuggestions] = useState<string[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Update suggestions when destination changes
    if (name === "destination") {
      const matchedDestination = Object.keys(destinationSuggestions).find(dest => 
        dest.toLowerCase().includes(value.toLowerCase()) && value.length > 2
      )
      setSuggestions(matchedDestination ? destinationSuggestions[matchedDestination as keyof typeof destinationSuggestions] : [])
    }
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
=======
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, MapPin, Camera, Save, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { createTrip, generateShareToken, getCities } from "@/lib/data"

export default function CreateTrip() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    coverImage: "",
    totalBudget: "",
    isPublic: false,
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // INR formatter
  const formatINR = useMemo(() => 
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }), []
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
>>>>>>> origin/dishant
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
<<<<<<< HEAD
    setError("")

    if (!user?.account?.$id) {
      setError("You must be logged in to create a trip")
      return
    }

    if (!formData.name || !formData.destination || !formData.startDate || !formData.endDate) {
      setError("Please fill in all required fields")
=======
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (!formData.name.trim()) {
      setError("Trip name is required")
      setIsLoading(false)
      return
    }

    if (!formData.startDate || !formData.endDate) {
      setError("Please select both start and end dates")
      setIsLoading(false)
>>>>>>> origin/dishant
      return
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError("End date must be after start date")
<<<<<<< HEAD
      return
    }

    if (new Date(formData.startDate) < new Date()) {
      setError("Start date cannot be in the past")
=======
      setIsLoading(false)
      return
    }

    if (formData.totalBudget && isNaN(Number(formData.totalBudget))) {
      setError("Budget must be a valid number")
      setIsLoading(false)
>>>>>>> origin/dishant
      return
    }

    try {
<<<<<<< HEAD
      // Upload image if selected
      let imageUrl = ""
      if (selectedImage) {
        const uploadedUrl = await uploadImage()
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
      }

      // Create trip data
      const tripData = {
        name: formData.name,
        description: formData.description,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget ? parseFloat(formData.budget) : 0,
        status: formData.status,
        image: imageUrl,
      }

      // Create the trip
      createTrip(tripData)

      // The success/error handling is done in the mutation
      router.push("/trips")
    } catch (error: any) {
      console.error("Create trip error:", error)
      setError("Failed to create trip. Please try again.")
      toast.error("Failed to create trip")
    }
  }

=======
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create the trip
      const newTrip = createTrip({
        userId: 1, // Mock user ID
        name: formData.name.trim(),
        description: formData.description.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        coverImage: formData.coverImage || "/diverse-travel-destinations.png",
        totalBudget: formData.totalBudget ? Number(formData.totalBudget) : 0, // Already in INR
        spent: 0,
        status: "planning",
        isPublic: formData.isPublic,
        destinationCount: 0,
        shareToken: generateShareToken(formData.name),
      })

      setSuccess("Trip created successfully!")

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push(`/trips/${newTrip.id}`)
      }, 1500)
    } catch (error) {
      console.error("Create trip error:", error)
      setError("An error occurred while creating your trip. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Get popular Indian destinations for suggestions
  const cities = getCities()
  const popularCities = useMemo(() => {
    const indianCities = cities.filter(city => 
      city.country === "India" || 
      ["Mumbai", "Delhi", "New Delhi", "Bengaluru", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Jaipur", "Goa", "Kochi", "Varanasi", "Udaipur", "Amritsar", "Rishikesh", "Manali", "Shimla", "Agra", "Jodhpur"].some(indianCity => 
        city.name.toLowerCase().includes(indianCity.toLowerCase())
      )
    )
    const finalCities = indianCities.length >= 6 ? indianCities : [...indianCities, ...cities]
    return finalCities.slice(0, 6)
  }, [cities])

>>>>>>> origin/dishant
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
<<<<<<< HEAD
            <h1 className="text-3xl font-bold text-gray-900">Plan a New Trip</h1>
            <p className="text-muted-foreground mt-1">Start your next adventure</p>
=======
            <h1 className="text-3xl font-bold text-gray-900">Plan Your Indian Adventure</h1>
            <p className="text-muted-foreground mt-1">Start exploring incredible India 🇮🇳</p>
>>>>>>> origin/dishant
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Trip Details
              </CardTitle>
<<<<<<< HEAD
              <CardDescription>Provide information about your upcoming trip</CardDescription>
=======
              <CardDescription>Plan your journey across India - from mountains to beaches</CardDescription>
>>>>>>> origin/dishant
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

<<<<<<< HEAD
=======
                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}

>>>>>>> origin/dishant
                {/* Trip Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Trip Name *</Label>
                  <Input
                    id="name"
                    name="name"
<<<<<<< HEAD
                    placeholder="e.g., European Adventure 2024"
=======
                    placeholder="e.g., Golden Triangle Tour, Kerala Backwaters, Rajasthan Heritage"
>>>>>>> origin/dishant
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
<<<<<<< HEAD
                        min={new Date().toISOString().split('T')[0]}
=======
                        min={new Date().toISOString().split("T")[0]}
>>>>>>> origin/dishant
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
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
=======
                        min={formData.startDate || new Date().toISOString().split("T")[0]}
>>>>>>> origin/dishant
                      />
                    </div>
                  </div>
                </div>

<<<<<<< HEAD
                {/* Budget and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (Optional)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="budget"
                        name="budget"
                        type="number"
                        placeholder="0"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="pl-10"
                        min="0"
                        step="0.01"
                      />
                    </div>
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
                {/* Budget in INR */}
                <div className="space-y-2">
                  <Label htmlFor="totalBudget">Total Budget in INR (Optional)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input
                      id="totalBudget"
                      name="totalBudget"
                      type="number"
                      placeholder="25000"
                      value={formData.totalBudget}
                      onChange={handleInputChange}
                      className="pl-8"
                      min="0"
                      step="500"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Typical India trips: Weekend getaway ₹5,000-15,000 | Week-long tour ₹25,000-75,000
                  </p>
>>>>>>> origin/dishant
                </div>

                {/* Trip Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Trip Description</Label>
                  <Textarea
                    id="description"
                    name="description"
<<<<<<< HEAD
                    placeholder="Describe your trip goals, interests, or any special occasions..."
=======
                    placeholder="Describe your trip - adventure, culture, spiritual journey, family vacation, honeymoon, or any special interests..."
>>>>>>> origin/dishant
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>

                {/* Cover Photo */}
                <div className="space-y-2">
                  <Label>Cover Photo (Optional)</Label>
<<<<<<< HEAD
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

                {/* Dynamic Suggestions */}
                {suggestions.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Suggested Activities for {formData.destination}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="bg-white p-3 rounded border border-blue-200 flex items-center justify-between group hover:shadow-sm transition-shadow"
                        >
                          <span className="text-sm text-gray-700">{suggestion}</span>
                          <Badge variant="secondary" className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            Popular
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
=======
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Upload a cover photo for your trip</p>
                    <p className="text-xs text-gray-500 mb-4">We'll use a beautiful Indian destination image if none is provided</p>
                    <Button type="button" variant="outline" size="sm" disabled>
                      Choose File (Coming Soon)
                    </Button>
                  </div>
                </div>

                {/* Privacy Setting */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isPublic" className="text-sm">
                    Make this trip public (help others discover amazing Indian destinations)
                  </Label>
                </div>

                {/* Popular Indian Destinations Suggestions */}
                <div className="bg-gradient-to-r from-orange-50 to-green-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="font-medium text-orange-900 mb-3 flex items-center">
                    🇮🇳 Popular Indian Destinations to Consider
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {popularCities.map((city) => (
                      <div
                        key={city.id}
                        className="bg-white p-3 rounded border border-orange-200 text-center hover:shadow-sm transition-shadow cursor-pointer group"
                        title={`Cost Index: ${city.costIndex}, Rating: ${city.rating}`}
                      >
                        <img
                          src={city.imageUrl || "/placeholder.svg"}
                          alt={city.name}
                          className="w-full h-16 object-cover rounded mb-2 group-hover:scale-105 transition-transform duration-200"
                        />
                        <p className="text-sm font-medium text-gray-900">{city.name}</p>
                        <p className="text-xs text-gray-600">{city.country || "India"}</p>
                        <div className="flex items-center justify-center mt-1 text-xs text-yellow-600">
                          ⭐ {city.rating} • ₹{city.costIndex}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-orange-700 mt-3 flex items-center">
                    💡 You can add specific destinations and create detailed itinerary after creating your trip
                  </p>
                </div>

>>>>>>> origin/dishant
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
<<<<<<< HEAD
                    disabled={isCreatingTrip || isUploadingImage}
                  >
                    {isCreatingTrip || isUploadingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {isUploadingImage ? "Uploading Image..." : "Creating Trip..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Trip & Continue
                      </>
                    )}
=======
                    disabled={isLoading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Creating Your Trip..." : "Create Trip & Start Planning"}
>>>>>>> origin/dishant
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/dashboard">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
