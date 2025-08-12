import { Client, Account, Databases, Storage, Teams, Functions } from 'appwrite';

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const teams = new Teams(client);
export const functions = new Functions(client);

export { client };

// Database IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
export const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID || '';
export const TRIPS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_TRIPS_COLLECTION_ID || '';
export const ITINERARY_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ITINERARY_COLLECTION_ID || '';
export const ACTIVITIES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ACTIVITIES_COLLECTION_ID || '';
export const EXPENSES_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_EXPENSES_COLLECTION_ID || '';
export const SHARED_TRIPS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SHARED_TRIPS_COLLECTION_ID || '';

// Storage buckets
export const PROFILE_IMAGES_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_PROFILE_IMAGES_BUCKET_ID || '';
export const TRIP_IMAGES_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_TRIP_IMAGES_BUCKET_ID || '';
