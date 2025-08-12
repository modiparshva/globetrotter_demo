import mockData from "@/data/mockData.json"
import { tripService } from "./trips"
import { authService } from "./auth"

// Legacy interfaces for backward compatibility with existing components
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

// Data access functions
export const getUsers = (): User[] => mockData.users
export const getTrips = (): Trip[] => mockData.trips as Trip[]
export const getCities = (): City[] => mockData.cities
export const getActivities = (): Activity[] => mockData.activities
export const getTripStops = (): TripStop[] => mockData.tripStops
export const getTripActivities = (): TripActivity[] => mockData.tripActivities
export const getCommunityActivity = (): CommunityActivity[] => mockData.communityActivity

export const getUserById = (id: number): User | undefined => mockData.users.find((user) => user.id === id)

export const getTripById = (id: number): Trip | undefined => mockData.trips.find((trip) => trip.id === id) as Trip | undefined

export const getTripByToken = (token: string): Trip | undefined =>
  mockData.trips.find((trip) => trip.shareToken === token) as Trip | undefined

export const getCityById = (id: number): City | undefined => mockData.cities.find((city) => city.id === id)

export const getActivityById = (id: number): Activity | undefined =>
  mockData.activities.find((activity) => activity.id === id)

export const getTripsByUserId = (userId: number): Trip[] => mockData.trips.filter((trip) => trip.userId === userId) as Trip[]

export const getTripStopsByTripId = (tripId: number): TripStop[] =>
  mockData.tripStops.filter((stop) => stop.tripId === tripId)

export const getActivitiesByCityId = (cityId: number): Activity[] =>
  mockData.activities.filter((activity) => activity.cityId === cityId)

export const getTripActivitiesByStopId = (stopId: number): TripActivity[] =>
  mockData.tripActivities.filter((activity) => activity.tripStopId === stopId)

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
