import { getUsers, getTrips, getCities, getActivities, getCommunityActivity, type User, type Trip, type City, type Activity } from "./data"

// Admin Analytics Functions
export interface AdminStats {
  totalUsers: number
  totalTrips: number
  totalCities: number
  totalActivities: number
  avgBudgetPerTrip: number
  totalBudgetAllTrips: number
  activeUsers: number
  completedTrips: number
  upcomingTrips: number
  ongoingTrips: number
  planningTrips: number
}

export interface UserActivity {
  userId: number
  userName: string
  email: string
  totalTrips: number
  totalBudget: number
  lastActivity: string
  status: "active" | "inactive"
}

export interface PopularDestination {
  cityId: number
  cityName: string
  country: string
  totalTrips: number
  totalBudget: number
  avgRating: number
  popularity: number
}

export interface TripTrends {
  month: string
  tripsCreated: number
  totalBudget: number
  avgBudget: number
}

// Get overall platform statistics
export const getAdminStats = (): AdminStats => {
  const users = getUsers()
  const trips = getTrips()
  const cities = getCities()
  const activities = getActivities()

  const totalBudgetAllTrips = trips.reduce((sum, trip) => sum + trip.totalBudget, 0)
  const avgBudgetPerTrip = trips.length > 0 ? Math.round(totalBudgetAllTrips / trips.length) : 0

  const completedTrips = trips.filter(t => t.status === "completed").length
  const upcomingTrips = trips.filter(t => t.status === "upcoming").length
  const ongoingTrips = trips.filter(t => t.status === "ongoing").length
  const planningTrips = trips.filter(t => t.status === "planning").length

  // Simulate active users (users with trips in last 30 days)
  const activeUsers = users.filter(u => u.totalTrips > 0).length

  return {
    totalUsers: users.length,
    totalTrips: trips.length,
    totalCities: cities.length,
    totalActivities: activities.length,
    avgBudgetPerTrip,
    totalBudgetAllTrips,
    activeUsers,
    completedTrips,
    upcomingTrips,
    ongoingTrips,
    planningTrips
  }
}

// Get user activity data
export const getUserActivity = (): UserActivity[] => {
  const users = getUsers()
  const trips = getTrips()

  return users.map(user => {
    const userTrips = trips.filter(t => t.userId === user.id)
    const totalBudget = userTrips.reduce((sum, trip) => sum + trip.totalBudget, 0)
    
    return {
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      totalTrips: userTrips.length,
      totalBudget,
      lastActivity: userTrips.length > 0 ? "Recently active" : "No recent activity",
      status: userTrips.length > 0 ? "active" : "inactive"
    }
  })
}

// Get popular destinations
export const getPopularDestinations = (): PopularDestination[] => {
  const cities = getCities()
  const trips = getTrips()

  return cities.map(city => {
    // For this demo, we'll use the city's popularity score and rating
    // In real implementation, you'd calculate from actual trip data
    return {
      cityId: city.id,
      cityName: city.name,
      country: city.country,
      totalTrips: Math.floor(city.popularityScore / 10), // Simulate trip count
      totalBudget: Math.floor(city.popularityScore * city.costIndex * 1000), // Simulate budget
      avgRating: city.rating,
      popularity: city.popularityScore
    }
  }).sort((a, b) => b.popularity - a.popularity)
}

// Get trip creation trends (monthly data)
export const getTripTrends = (): TripTrends[] => {
  const trips = getTrips()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  // For demo, create sample trend data
  // In real implementation, group actual trips by creation month
  return months.map((month, index) => ({
    month,
    tripsCreated: Math.floor(Math.random() * 20) + 5, // Simulate 5-25 trips per month
    totalBudget: Math.floor(Math.random() * 500000) + 100000, // Simulate budget
    avgBudget: Math.floor(Math.random() * 50000) + 25000 // Simulate avg budget
  }))
}

// Get top activities by category
export const getTopActivitiesByCategory = () => {
  const activities = getActivities()
  
  const categories = activities.reduce((acc, activity) => {
    if (!acc[activity.category]) {
      acc[activity.category] = []
    }
    acc[activity.category].push(activity)
    return acc
  }, {} as Record<string, Activity[]>)

  return Object.entries(categories).map(([category, acts]) => ({
    category,
    count: acts.length,
    avgCost: Math.round(acts.reduce((sum, act) => sum + act.cost, 0) / acts.length),
    avgRating: Math.round((acts.reduce((sum, act) => sum + act.rating, 0) / acts.length) * 10) / 10,
    activities: acts.sort((a, b) => b.rating - a.rating).slice(0, 3) // Top 3 activities
  })).sort((a, b) => b.count - a.count)
}

// Get recent user registrations
export const getRecentUsers = (limit: number = 10): User[] => {
  const users = getUsers()
  // In real implementation, sort by registration date
  // For demo, return all users (limited)
  return users.slice(0, limit)
}

// Get platform growth metrics
export const getGrowthMetrics = () => {
  const stats = getAdminStats()
  
  // Simulate growth data
  return {
    userGrowth: {
      thisMonth: 23,
      lastMonth: 18,
      percentageChange: 27.8
    },
    tripGrowth: {
      thisMonth: 45,
      lastMonth: 32,
      percentageChange: 40.6
    },
    budgetGrowth: {
      thisMonth: 2850000, // ₹28,50,000
      lastMonth: 2100000, // ₹21,00,000
      percentageChange: 35.7
    },
    engagementMetrics: {
      avgTripsPerUser: Math.round((stats.totalTrips / stats.totalUsers) * 10) / 10,
      avgBudgetPerUser: Math.round(stats.totalBudgetAllTrips / stats.totalUsers),
      completionRate: Math.round((stats.completedTrips / stats.totalTrips) * 100)
    }
  }
}

// Admin user management functions
export const getUsersByStatus = (status: "active" | "inactive" | "all" = "all") => {
  const userActivity = getUserActivity()
  
  if (status === "all") return userActivity
  return userActivity.filter(user => user.status === status)
}

export const getTripsByStatus = (status?: string) => {
  const trips = getTrips()
  
  if (!status || status === "all") return trips
  return trips.filter(trip => trip.status === status)
}

// Regional analytics for Indian cities
export const getRegionalAnalytics = () => {
  const cities = getCities()
  const popularDestinations = getPopularDestinations()
  
  const regions = cities.reduce((acc, city) => {
    const region = city.region || "Other"
    if (!acc[region]) {
      acc[region] = {
        name: region,
        cities: 0,
        totalTrips: 0,
        avgCostIndex: 0,
        avgRating: 0
      }
    }
    
    const destination = popularDestinations.find(d => d.cityId === city.id)
    acc[region].cities += 1
    acc[region].totalTrips += destination?.totalTrips || 0
    acc[region].avgCostIndex += city.costIndex
    acc[region].avgRating += city.rating
    
    return acc
  }, {} as Record<string, any>)

  return Object.values(regions).map((region: any) => ({
    ...region,
    avgCostIndex: Math.round(region.avgCostIndex / region.cities),
    avgRating: Math.round((region.avgRating / region.cities) * 10) / 10
  })).sort((a: any, b: any) => b.totalTrips - a.totalTrips)
}