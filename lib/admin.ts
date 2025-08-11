import { databases, DATABASE_ID, USERS_COLLECTION_ID, TRIPS_COLLECTION_ID, ACTIVITIES_COLLECTION_ID, EXPENSES_COLLECTION_ID } from './appwrite';
import { Query } from 'appwrite';

export interface AdminStats {
  totalUsers: number
  totalTrips: number
  totalBudget: number
  activeUsers: number
  completedTrips: number
  ongoingTrips: number
  planningTrips: number
}

export interface AdminUser {
  $id: string
  email: string
  firstName: string
  lastName: string
  totalTrips: number
  totalBudget: number
  status: 'active' | 'inactive'
  $createdAt: string
}

export interface AdminTrip {
  $id: string
  userId: string
  name: string
  destination: string
  startDate: string
  endDate: string
  budget: number
  status: 'planning' | 'ongoing' | 'completed'
  $createdAt: string
}

export interface AdminDestination {
  destination: string
  totalTrips: number
  totalBudget: number
  avgBudget: number
}

export class AdminService {
  // Get platform statistics
  async getAdminStats(): Promise<AdminStats> {
    try {
      // Fetch all users
      const usersResponse = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.limit(1000)] // Adjust limit as needed
      );

      // Fetch all trips
      const tripsResponse = await databases.listDocuments(
        DATABASE_ID,
        TRIPS_COLLECTION_ID,
        [Query.limit(1000)] // Adjust limit as needed
      );

      const users = usersResponse.documents;
      const trips = tripsResponse.documents;

      // Calculate statistics
      const totalUsers = users.length;
      const totalTrips = trips.length;
      const totalBudget = trips.reduce((sum, trip: any) => sum + (trip.budget || 0), 0);

      // Count trip statuses
      const completedTrips = trips.filter((trip: any) => trip.status === 'completed').length;
      const ongoingTrips = trips.filter((trip: any) => trip.status === 'ongoing').length;
      const planningTrips = trips.filter((trip: any) => trip.status === 'planning').length;

      // Calculate active users (users with at least one trip)
      const usersWithTrips = new Set(trips.map((trip: any) => trip.userId));
      const activeUsers = usersWithTrips.size;

      return {
        totalUsers,
        totalTrips,
        totalBudget,
        activeUsers,
        completedTrips,
        ongoingTrips,
        planningTrips,
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }

  // Get all users with their trip statistics
  async getAllUsers(): Promise<AdminUser[]> {
    try {
      const usersResponse = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.limit(1000), Query.orderDesc('$createdAt')]
      );

      const tripsResponse = await databases.listDocuments(
        DATABASE_ID,
        TRIPS_COLLECTION_ID,
        [Query.limit(1000)]
      );

      const users = usersResponse.documents;
      const trips = tripsResponse.documents;

      // Calculate user statistics
      return users.map((user: any) => {
        const userTrips = trips.filter((trip: any) => trip.userId === user.$id);
        const totalTrips = userTrips.length;
        const totalBudget = userTrips.reduce((sum, trip: any) => sum + (trip.budget || 0), 0);

        return {
          $id: user.$id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          totalTrips,
          totalBudget,
          status: totalTrips > 0 ? 'active' : 'inactive',
          $createdAt: user.$createdAt,
        };
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Get all trips with user information
  async getAllTrips(): Promise<AdminTrip[]> {
    try {
      const tripsResponse = await databases.listDocuments(
        DATABASE_ID,
        TRIPS_COLLECTION_ID,
        [Query.limit(1000), Query.orderDesc('$createdAt')]
      );

      return tripsResponse.documents.map((trip: any) => ({
        $id: trip.$id,
        userId: trip.userId,
        name: trip.name,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        budget: trip.budget || 0,
        status: trip.status,
        $createdAt: trip.$createdAt,
      }));
    } catch (error) {
      console.error('Error fetching trips:', error);
      throw error;
    }
  }

  // Get popular destinations
  async getPopularDestinations(): Promise<AdminDestination[]> {
    try {
      const tripsResponse = await databases.listDocuments(
        DATABASE_ID,
        TRIPS_COLLECTION_ID,
        [Query.limit(1000)]
      );

      const trips = tripsResponse.documents;

      // Group trips by destination
      const destinationMap = new Map<string, { trips: any[], totalBudget: number }>();

      trips.forEach((trip: any) => {
        const destination = trip.destination || 'Unknown';
        if (!destinationMap.has(destination)) {
          destinationMap.set(destination, { trips: [], totalBudget: 0 });
        }
        const destData = destinationMap.get(destination)!;
        destData.trips.push(trip);
        destData.totalBudget += trip.budget || 0;
      });

      // Convert to array and calculate statistics
      const destinations: AdminDestination[] = Array.from(destinationMap.entries()).map(([destination, data]) => ({
        destination,
        totalTrips: data.trips.length,
        totalBudget: data.totalBudget,
        avgBudget: data.trips.length > 0 ? Math.round(data.totalBudget / data.trips.length) : 0,
      }));

      // Sort by total trips descending
      return destinations.sort((a, b) => b.totalTrips - a.totalTrips);
    } catch (error) {
      console.error('Error fetching popular destinations:', error);
      throw error;
    }
  }

  // Get growth metrics (simplified version)
  getGrowthMetrics() {
    // For now, return mock growth data since we don't have historical data
    return {
      userGrowth: { percentageChange: 12 },
      tripGrowth: { percentageChange: 15 },
      budgetGrowth: { percentageChange: 8 },
      engagementMetrics: {
        avgTripsPerUser: 2.5,
        avgBudgetPerUser: 25000,
        completionRate: 75,
      },
    };
  }
}

export const adminService = new AdminService();
