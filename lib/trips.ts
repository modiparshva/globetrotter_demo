import { databases, DATABASE_ID, TRIPS_COLLECTION_ID, ACTIVITIES_COLLECTION_ID, EXPENSES_COLLECTION_ID, SHARED_TRIPS_COLLECTION_ID } from './appwrite';
import { ID, Query } from 'appwrite';

export interface Trip {
  $id: string;
  userId: string;
  name: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'planning' | 'ongoing' | 'completed';
  image?: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface Activity {
  $id: string;
  tripId: string;
  name: string;
  description: string;
  location: string;
  date: string;
  time: string;
  cost: number;
  category: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface Expense {
  $id: string;
  tripId: string;
  activityId?: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface SharedTrip {
  $id: string;
  tripId: string;
  token: string;
  isActive: boolean;
  expiresAt?: string;
  $createdAt: string;
  $updatedAt: string;
}

export class TripService {
  // Trip CRUD operations
  async createTrip(userId: string, tripData: Omit<Trip, '$id' | 'userId' | '$createdAt' | '$updatedAt'>) {
    try {
      const trip = await databases.createDocument(
        DATABASE_ID,
        TRIPS_COLLECTION_ID,
        ID.unique(),
        {
          userId,
          ...tripData,
        }
      );
      return trip;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  }

  async getUserTrips(userId: string) {
    try {
      const trips = await databases.listDocuments(
        DATABASE_ID,
        TRIPS_COLLECTION_ID,
        [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
      );
      return trips.documents;
    } catch (error) {
      console.error('Error fetching user trips:', error);
      throw error;
    }
  }

  async getTrip(tripId: string) {
    try {
      const trip = await databases.getDocument(DATABASE_ID, TRIPS_COLLECTION_ID, tripId);
      return trip;
    } catch (error) {
      console.error('Error fetching trip:', error);
      throw error;
    }
  }

  async updateTrip(tripId: string, tripData: Partial<Omit<Trip, '$id' | 'userId' | '$createdAt' | '$updatedAt'>>) {
    try {
      const trip = await databases.updateDocument(
        DATABASE_ID,
        TRIPS_COLLECTION_ID,
        tripId,
        tripData
      );
      return trip;
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  }

  async deleteTrip(tripId: string) {
    try {
      await databases.deleteDocument(DATABASE_ID, TRIPS_COLLECTION_ID, tripId);
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  }

  // Activity CRUD operations
  async createActivity(tripId: string, activityData: Omit<Activity, '$id' | 'tripId' | '$createdAt' | '$updatedAt'>) {
    try {
      const activity = await databases.createDocument(
        DATABASE_ID,
        ACTIVITIES_COLLECTION_ID,
        ID.unique(),
        {
          tripId,
          ...activityData,
        }
      );
      return activity;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }

  async getTripActivities(tripId: string) {
    try {
      const activities = await databases.listDocuments(
        DATABASE_ID,
        ACTIVITIES_COLLECTION_ID,
        [Query.equal('tripId', tripId), Query.orderAsc('date')]
      );
      return activities.documents;
    } catch (error) {
      console.error('Error fetching trip activities:', error);
      throw error;
    }
  }

  async updateActivity(activityId: string, activityData: Partial<Omit<Activity, '$id' | 'tripId' | '$createdAt' | '$updatedAt'>>) {
    try {
      const activity = await databases.updateDocument(
        DATABASE_ID,
        ACTIVITIES_COLLECTION_ID,
        activityId,
        activityData
      );
      return activity;
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  }

  async deleteActivity(activityId: string) {
    try {
      await databases.deleteDocument(DATABASE_ID, ACTIVITIES_COLLECTION_ID, activityId);
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  }

  // Expense CRUD operations
  async createExpense(tripId: string, expenseData: Omit<Expense, '$id' | 'tripId' | '$createdAt' | '$updatedAt'>) {
    try {
      const expense = await databases.createDocument(
        DATABASE_ID,
        EXPENSES_COLLECTION_ID,
        ID.unique(),
        {
          tripId,
          ...expenseData,
        }
      );
      return expense;
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  }

  async getTripExpenses(tripId: string) {
    try {
      const expenses = await databases.listDocuments(
        DATABASE_ID,
        EXPENSES_COLLECTION_ID,
        [Query.equal('tripId', tripId), Query.orderDesc('date')]
      );
      return expenses.documents;
    } catch (error) {
      console.error('Error fetching trip expenses:', error);
      throw error;
    }
  }

  async updateExpense(expenseId: string, expenseData: Partial<Omit<Expense, '$id' | 'tripId' | '$createdAt' | '$updatedAt'>>) {
    try {
      const expense = await databases.updateDocument(
        DATABASE_ID,
        EXPENSES_COLLECTION_ID,
        expenseId,
        expenseData
      );
      return expense;
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  }

  async deleteExpense(expenseId: string) {
    try {
      await databases.deleteDocument(DATABASE_ID, EXPENSES_COLLECTION_ID, expenseId);
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }

  // Shared trip operations
  async shareTrip(tripId: string, expiresAt?: string) {
    try {
      const token = ID.unique();
      const sharedTrip = await databases.createDocument(
        DATABASE_ID,
        SHARED_TRIPS_COLLECTION_ID,
        ID.unique(),
        {
          tripId,
          token,
          isActive: true,
          expiresAt: expiresAt || '',
        }
      );
      return sharedTrip;
    } catch (error) {
      console.error('Error sharing trip:', error);
      throw error;
    }
  }

  async getSharedTrip(token: string) {
    try {
      const sharedTrips = await databases.listDocuments(
        DATABASE_ID,
        SHARED_TRIPS_COLLECTION_ID,
        [Query.equal('token', token), Query.equal('isActive', true)]
      );
      
      if (sharedTrips.documents.length === 0) {
        throw new Error('Shared trip not found or expired');
      }

      const sharedTrip = sharedTrips.documents[0];
      
      // Check if expired
      if (sharedTrip.expiresAt && new Date(sharedTrip.expiresAt) < new Date()) {
        throw new Error('Shared trip has expired');
      }

      const trip = await this.getTrip(sharedTrip.tripId);
      return { sharedTrip, trip };
    } catch (error) {
      console.error('Error fetching shared trip:', error);
      throw error;
    }
  }

  async deactivateSharedTrip(token: string) {
    try {
      const sharedTrips = await databases.listDocuments(
        DATABASE_ID,
        SHARED_TRIPS_COLLECTION_ID,
        [Query.equal('token', token)]
      );
      
      if (sharedTrips.documents.length > 0) {
        await databases.updateDocument(
          DATABASE_ID,
          SHARED_TRIPS_COLLECTION_ID,
          sharedTrips.documents[0].$id,
          { isActive: false }
        );
      }
    } catch (error) {
      console.error('Error deactivating shared trip:', error);
      throw error;
    }
  }
}

export const tripService = new TripService();
