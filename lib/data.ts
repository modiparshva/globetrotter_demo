import mockData from "@/data/mockData.json"
<<<<<<< HEAD
import { tripService } from "./trips"
import { authService } from "./auth"

// Legacy interfaces for backward compatibility with existing components
=======

>>>>>>> origin/dishant
export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  phone: string
  city: string
  country: string
  profileImage: string
  bio: string
  totalTrips: number
  countriesVisited: number
  totalBudget: number
  sharedPlans: number
}

export interface Trip {
  id: number
  userId: number
  name: string
  description: string
  startDate: string
  endDate: string
  coverImage: string
  totalBudget: number
  spent: number
  status: "planning" | "upcoming" | "ongoing" | "completed"
  isPublic: boolean
  destinationCount: number
  shareToken: string
}

export interface City {
  id: number
  name: string
  country: string
  region: string
  costIndex: number
  popularityScore: number
  imageUrl: string
  description: string
  rating: number
  travelers: string
  latitude: number
  longitude: number
}

export interface Activity {
  id: number
  cityId: number
  name: string
  description: string
  category: string
  cost: number
  durationHours: number
  rating: number
  imageUrl: string
}

export interface TripStop {
  id: number
  tripId: number
  cityId: number
  startDate: string
  endDate: string
  orderIndex: number
  budget: number
  notes: string
}

export interface TripActivity {
  id: number
  tripStopId: number
  activityId: number
  scheduledDate: string
  scheduledTime: string
  cost: number
  notes: string
}

export interface CommunityActivity {
  id: number
  user: string
  action: string
  time: string
  avatar: string
}

<<<<<<< HEAD
// Data access functions
export const getUsers = (): User[] => mockData.users
export const getTrips = (): Trip[] => mockData.trips as Trip[]
=======
// In-memory storage for new trips (simulating database)
let nextTripId = 4
const tripsStorage: Trip[] = [...mockData.trips]

// Data access functions
export const getUsers = (): User[] => mockData.users
export const getTrips = (): Trip[] => tripsStorage
>>>>>>> origin/dishant
export const getCities = (): City[] => mockData.cities
export const getActivities = (): Activity[] => mockData.activities
export const getTripStops = (): TripStop[] => mockData.tripStops
export const getTripActivities = (): TripActivity[] => mockData.tripActivities
export const getCommunityActivity = (): CommunityActivity[] => mockData.communityActivity

export const getUserById = (id: number): User | undefined => mockData.users.find((user) => user.id === id)

<<<<<<< HEAD
export const getTripById = (id: number): Trip | undefined => mockData.trips.find((trip) => trip.id === id) as Trip | undefined

export const getTripByToken = (token: string): Trip | undefined =>
  mockData.trips.find((trip) => trip.shareToken === token) as Trip | undefined
=======
export const getTripById = (id: number): Trip | undefined => tripsStorage.find((trip) => trip.id === id)

export const getTripByToken = (token: string): Trip | undefined =>
  tripsStorage.find((trip) => trip.shareToken === token)
>>>>>>> origin/dishant

export const getCityById = (id: number): City | undefined => mockData.cities.find((city) => city.id === id)

export const getActivityById = (id: number): Activity | undefined =>
  mockData.activities.find((activity) => activity.id === id)

<<<<<<< HEAD
export const getTripsByUserId = (userId: number): Trip[] => mockData.trips.filter((trip) => trip.userId === userId) as Trip[]
=======
export const getTripsByUserId = (userId: number): Trip[] => tripsStorage.filter((trip) => trip.userId === userId)
>>>>>>> origin/dishant

export const getTripStopsByTripId = (tripId: number): TripStop[] =>
  mockData.tripStops.filter((stop) => stop.tripId === tripId)

export const getActivitiesByCityId = (cityId: number): Activity[] =>
  mockData.activities.filter((activity) => activity.cityId === cityId)

export const getTripActivitiesByStopId = (stopId: number): TripActivity[] =>
  mockData.tripActivities.filter((activity) => activity.tripStopId === stopId)

<<<<<<< HEAD
=======
// Create new trip function
export const createTrip = (tripData: Omit<Trip, "id">): Trip => {
  const newTrip: Trip = {
    ...tripData,
    id: nextTripId++,
  }
  tripsStorage.push(newTrip)
  return newTrip
}

// Update trip function
export const updateTrip = (id: number, updates: Partial<Trip>): Trip | null => {
  const tripIndex = tripsStorage.findIndex((trip) => trip.id === id)
  if (tripIndex === -1) return null

  tripsStorage[tripIndex] = { ...tripsStorage[tripIndex], ...updates }
  return tripsStorage[tripIndex]
}

// Delete trip function
export const deleteTrip = (id: number): boolean => {
  const tripIndex = tripsStorage.findIndex((trip) => trip.id === id)
  if (tripIndex === -1) return false

  tripsStorage.splice(tripIndex, 1)
  return true
}

>>>>>>> origin/dishant
// Enhanced data functions with joins
export const getTripWithDetails = (id: number) => {
  const trip = getTripById(id)
  if (!trip) return null

  const stops = getTripStopsByTripId(id).map((stop) => ({
    ...stop,
    city: getCityById(stop.cityId),
    activities: getTripActivitiesByStopId(stop.id).map((activity) => ({
      ...activity,
      activityDetails: getActivityById(activity.activityId),
    })),
  }))

  return {
    ...trip,
    stops,
  }
}

export const getActivitiesWithCity = () => {
  return mockData.activities.map((activity) => ({
    ...activity,
    city: getCityById(activity.cityId),
  }))
}
<<<<<<< HEAD
=======

// Generate share token
export const generateShareToken = (tripName: string): string => {
  return tripName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now()
}
>>>>>>> origin/dishant
