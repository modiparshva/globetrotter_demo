# Appwrite Setup Instructions

This application uses Appwrite as the backend service for authentication and database operations.

## Prerequisites

1. Create an Appwrite account at https://cloud.appwrite.io
2. Create a new project in your Appwrite console

## Environment Setup

1. Copy `.env.example` to `.env.local`
2. Fill in your Appwrite project details:

```bash
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here

# Database Configuration
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here

# Collection IDs
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
NEXT_PUBLIC_APPWRITE_TRIPS_COLLECTION_ID=trips
NEXT_PUBLIC_APPWRITE_ACTIVITIES_COLLECTION_ID=activities
NEXT_PUBLIC_APPWRITE_EXPENSES_COLLECTION_ID=expenses
NEXT_PUBLIC_APPWRITE_SHARED_TRIPS_COLLECTION_ID=shared_trips

# Storage Bucket IDs
NEXT_PUBLIC_APPWRITE_PROFILE_IMAGES_BUCKET_ID=profile_images
NEXT_PUBLIC_APPWRITE_TRIP_IMAGES_BUCKET_ID=trip_images
```

## Database Setup

### 1. Create Database
1. Go to your Appwrite console
2. Navigate to "Databases"
3. Create a new database named "globetrotter"
4. Copy the database ID to your `.env.local` file

### 2. Create Collections

#### Users Collection
- Collection ID: `users`
- Permissions: 
  - Read: Users
  - Create: Users
  - Update: Users
  - Delete: Users

Attributes:
- `email` (String, 255, Required)
- `firstName` (String, 100, Required)
- `lastName` (String, 100, Required)
- `phone` (String, 20, Optional)
- `city` (String, 100, Optional)
- `country` (String, 100, Optional)
- `profileImage` (String, 500, Optional)

#### Trips Collection
- Collection ID: `trips`
- Permissions: 
  - Read: Users
  - Create: Users
  - Update: Users
  - Delete: Users

Attributes:
- `userId` (String, 50, Required)
- `name` (String, 255, Required)
- `description` (String, 1000, Optional)
- `destination` (String, 255, Required)
- `startDate` (String, 20, Required)
- `endDate` (String, 20, Required)
- `budget` (Float, Required, Default: 0)
- `status` (String, 20, Required, Default: "planning")
- `image` (String, 500, Optional)

#### Activities Collection
- Collection ID: `activities`
- Permissions: 
  - Read: Users
  - Create: Users
  - Update: Users
  - Delete: Users

Attributes:
- `tripId` (String, 50, Required)
- `name` (String, 255, Required)
- `description` (String, 1000, Optional)
- `location` (String, 255, Required)
- `date` (String, 20, Required)
- `time` (String, 10, Required)
- `cost` (Float, Required, Default: 0)
- `category` (String, 100, Required)

#### Expenses Collection
- Collection ID: `expenses`
- Permissions: 
  - Read: Users
  - Create: Users
  - Update: Users
  - Delete: Users

Attributes:
- `tripId` (String, 50, Required)
- `activityId` (String, 50, Optional)
- `description` (String, 255, Required)
- `amount` (Float, Required)
- `category` (String, 100, Required)
- `date` (String, 20, Required)

#### Shared Trips Collection
- Collection ID: `shared_trips`
- Permissions: 
  - Read: Any
  - Create: Users
  - Update: Users
  - Delete: Users

Attributes:
- `tripId` (String, 50, Required)
- `token` (String, 50, Required)
- `isActive` (Boolean, Required, Default: true)
- `expiresAt` (String, 30, Optional)

### 3. Create Storage Buckets

#### Profile Images Bucket
- Bucket ID: `profile_images`
- Permissions:
  - Read: Users
  - Create: Users
  - Update: Users
  - Delete: Users
- File Size Limit: 5MB
- Allowed File Extensions: jpg, jpeg, png, gif, webp

#### Trip Images Bucket
- Bucket ID: `trip_images`
- Permissions:
  - Read: Any
  - Create: Users
  - Update: Users
  - Delete: Users
- File Size Limit: 10MB
- Allowed File Extensions: jpg, jpeg, png, gif, webp

## Authentication Setup

1. Go to your Appwrite console
2. Navigate to "Auth"
3. Enable "Email/Password" authentication method
4. Configure any additional settings as needed

## Running the Application

After completing the setup:

1. Install dependencies: `pnpm install`
2. Start the development server: `pnpm dev`
3. The application will be available at `http://localhost:3000`

## Migration Notes

This application has been migrated from:
- **NextAuth** → **Appwrite Auth**
- **PostgreSQL** → **Appwrite Database (MongoDB-like)**

Key changes:
- Authentication is now handled client-side with Appwrite SDK
- Database operations use Appwrite's document-based structure
- Real-time capabilities are available through Appwrite subscriptions
- File storage is handled through Appwrite Storage
