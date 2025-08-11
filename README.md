# GlobeTrotter Dashboard - Appwrite Migration

This project has been migrated from NextAuth + PostgreSQL to Appwrite for both authentication and database operations.

## 🚀 Changes Made

### Authentication Migration
- **From**: NextAuth with credentials provider
- **To**: Appwrite Authentication with email/password
- Custom React hooks (`useAuth`) for authentication state management
- Client-side authentication with React Query for state management

### Database Migration
- **From**: PostgreSQL with Vercel Postgres
- **To**: Appwrite Database (MongoDB-like document database)
- Document-based data structure instead of relational tables
- Real-time capabilities available through Appwrite subscriptions

### Key Features
- ✅ User registration and authentication
- ✅ Trip management (CRUD operations)
- ✅ Activity and expense tracking
- ✅ Trip sharing functionality
- ✅ Real-time data updates with React Query
- ✅ File storage for profile and trip images

## 📋 Prerequisites

1. **Node.js** (v18 or later)
2. **pnpm** package manager
3. **Appwrite account** (https://cloud.appwrite.io)

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Appwrite Setup
Follow the detailed setup guide in [APPWRITE_SETUP.md](./APPWRITE_SETUP.md) to:
- Create an Appwrite project
- Set up database collections
- Configure authentication
- Set up storage buckets

### 3. Environment Configuration
1. Copy `.env.example` to `.env.local`
2. Fill in your Appwrite project details:

```bash
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here

# Database Configuration
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here

# Collection IDs (use these exact values)
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=users
NEXT_PUBLIC_APPWRITE_TRIPS_COLLECTION_ID=trips
NEXT_PUBLIC_APPWRITE_ACTIVITIES_COLLECTION_ID=activities
NEXT_PUBLIC_APPWRITE_EXPENSES_COLLECTION_ID=expenses
NEXT_PUBLIC_APPWRITE_SHARED_TRIPS_COLLECTION_ID=shared_trips

# Storage Bucket IDs (use these exact values)
NEXT_PUBLIC_APPWRITE_PROFILE_IMAGES_BUCKET_ID=profile_images
NEXT_PUBLIC_APPWRITE_TRIP_IMAGES_BUCKET_ID=trip_images
```

### 4. Run the Application
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📚 Architecture Overview

### Authentication Flow
1. Users register/sign in through Appwrite Auth
2. Authentication state is managed by React Query
3. Custom `useAuth` hook provides authentication methods
4. Protected routes redirect unauthenticated users

### Data Management
1. **Services Layer**: `lib/trips.ts`, `lib/auth.ts` contain business logic
2. **Hooks Layer**: `hooks/use-auth.ts`, `hooks/use-trips.ts` provide React integration
3. **Component Layer**: Components use hooks for data and state management

### Key Files
- `lib/appwrite.ts` - Appwrite client configuration
- `lib/auth.ts` - Authentication service
- `lib/trips.ts` - Trip management service
- `hooks/use-auth.ts` - Authentication React hook
- `hooks/use-trips.ts` - Trip management React hook
- `app/providers.tsx` - React Query provider setup

## 🔧 Development

### Adding New Features
1. Create service functions in appropriate service files
2. Create custom hooks for React integration
3. Use hooks in components for data and state management

### Database Operations
All database operations go through Appwrite's document-based API:
- Create: `databases.createDocument()`
- Read: `databases.getDocument()` / `databases.listDocuments()`
- Update: `databases.updateDocument()`
- Delete: `databases.deleteDocument()`

### Real-time Updates
Appwrite supports real-time subscriptions. You can add real-time features by:
```javascript
import { client } from '@/lib/appwrite'

client.subscribe('databases.[DATABASE_ID].collections.[COLLECTION_ID].documents', response => {
  // Handle real-time updates
})
```

## 🚨 Migration Notes

### Breaking Changes
- All authentication now goes through Appwrite
- Database queries use document-based structure instead of SQL
- Session management is client-side with React Query
- API routes updated to work with Appwrite

### Data Structure Changes
- User IDs are now Appwrite document IDs (strings, not integers)
- Timestamps are ISO strings instead of database timestamps
- Relationships are managed through document references

## 🆘 Troubleshooting

### Common Issues
1. **Environment Variables**: Ensure all Appwrite environment variables are set correctly
2. **Permissions**: Make sure database collections have proper read/write permissions
3. **CORS**: Appwrite automatically handles CORS for your domain
4. **Authentication**: Check that email/password authentication is enabled in Appwrite console

### Support
For issues specific to this migration, check the Appwrite documentation:
- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite React Guide](https://appwrite.io/docs/quick-starts/react)

## 📈 Next Steps

Potential enhancements:
1. Add real-time trip collaboration
2. Implement push notifications
3. Add social features (trip comments, likes)
4. Integrate with mapping services
5. Add offline support with service workers

The foundation is now in place for a modern, scalable travel planning application!
