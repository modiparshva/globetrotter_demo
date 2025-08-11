import { account, databases, DATABASE_ID, USERS_COLLECTION_ID } from './appwrite';
import { ID, Query } from 'appwrite';

export interface User {
  $id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  city?: string;
  country?: string;
  profileImage?: string;
  $createdAt: string;
  $updatedAt: string;
}

export class AuthService {
  // Create a new user account
  async createAccount(email: string, password: string, firstName: string, lastName: string, phone?: string, city?: string, country?: string) {
    try {
      const userAccount = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);
      
      // Create user document in database
      const userDoc = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userAccount.$id,
        {
          email,
          firstName,
          lastName,
          phone: phone || '',
          city: city || '',
          country: country || '',
          profileImage: '',
        }
      );

      return { account: userAccount, profile: userDoc };
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  // Sign in user
  async signIn(email: string, password: string) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      return session;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  // Sign out user
  async signOut() {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const user = await account.get();
      if (user) {
        // Get user profile from database
        const profile = await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, user.$id);
        return { account: user, profile };
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Update user profile
  async updateProfile(userId: string, data: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    city?: string;
    country?: string;
    profileImage?: string;
  }) {
    try {
      const updatedProfile = await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        data
      );
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      await account.get();
      return true;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();
