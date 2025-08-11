// Appwrite Database Setup Script
// Run this script to create the necessary collections and attributes

import { Client, Databases, Permission, Role } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';

async function setupCollections() {
  try {
    console.log('Setting up Appwrite collections...');

    // Create Users Collection
    try {
      await databases.createCollection(
        DATABASE_ID,
        'users',
        'Users',
        [
          Permission.read(Role.user('ID')),
          Permission.update(Role.user('ID')),
          Permission.delete(Role.user('ID')),
        ]
      );
      console.log('✅ Users collection created');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('ℹ️ Users collection already exists');
      } else {
        throw error;
      }
    }

    // Add Users attributes
    const userAttributes = [
      { key: 'email', type: 'string', size: 255, required: true },
      { key: 'firstName', type: 'string', size: 100, required: true },
      { key: 'lastName', type: 'string', size: 100, required: true },
      { key: 'phone', type: 'string', size: 20, required: false },
      { key: 'city', type: 'string', size: 100, required: false },
      { key: 'country', type: 'string', size: 100, required: false },
      { key: 'profileImage', type: 'string', size: 500, required: false },
    ];

    for (const attr of userAttributes) {
      try {
        await databases.createStringAttribute(DATABASE_ID, 'users', attr.key, attr.size, attr.required);
        console.log(`✅ User attribute ${attr.key} created`);
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`ℹ️ User attribute ${attr.key} already exists`);
        } else {
          console.error(`❌ Error creating user attribute ${attr.key}:`, error);
        }
      }
    }

    // Create Trips Collection
    try {
      await databases.createCollection(
        DATABASE_ID,
        'trips',
        'Trips',
        [
          Permission.read(Role.user('ID')),
          Permission.create(Role.user('ID')),
          Permission.update(Role.user('ID')),
          Permission.delete(Role.user('ID')),
        ]
      );
      console.log('✅ Trips collection created');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('ℹ️ Trips collection already exists');
      } else {
        throw error;
      }
    }

    // Add Trips attributes
    const tripAttributes = [
      { key: 'userId', type: 'string', size: 50, required: true },
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'description', type: 'string', size: 1000, required: false },
      { key: 'destination', type: 'string', size: 255, required: true },
      { key: 'startDate', type: 'string', size: 20, required: true },
      { key: 'endDate', type: 'string', size: 20, required: true },
      { key: 'status', type: 'string', size: 20, required: true },
      { key: 'image', type: 'string', size: 500, required: false },
    ];

    for (const attr of tripAttributes) {
      try {
        await databases.createStringAttribute(DATABASE_ID, 'trips', attr.key, attr.size, attr.required);
        console.log(`✅ Trip attribute ${attr.key} created`);
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`ℹ️ Trip attribute ${attr.key} already exists`);
        } else {
          console.error(`❌ Error creating trip attribute ${attr.key}:`, error);
        }
      }
    }

    // Add budget as float attribute
    try {
      await databases.createFloatAttribute(DATABASE_ID, 'trips', 'budget', true, 0);
      console.log('✅ Trip budget attribute created');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('ℹ️ Trip budget attribute already exists');
      } else {
        console.error('❌ Error creating trip budget attribute:', error);
      }
    }

    // Create Activities Collection
    try {
      await databases.createCollection(
        DATABASE_ID,
        'activities',
        'Activities',
        [
          Permission.read(Role.user('ID')),
          Permission.create(Role.user('ID')),
          Permission.update(Role.user('ID')),
          Permission.delete(Role.user('ID')),
        ]
      );
      console.log('✅ Activities collection created');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('ℹ️ Activities collection already exists');
      } else {
        throw error;
      }
    }

    // Add Activities attributes
    const activityAttributes = [
      { key: 'tripId', type: 'string', size: 50, required: true },
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'description', type: 'string', size: 1000, required: false },
      { key: 'location', type: 'string', size: 255, required: true },
      { key: 'date', type: 'string', size: 20, required: true },
      { key: 'time', type: 'string', size: 10, required: true },
      { key: 'category', type: 'string', size: 100, required: true },
    ];

    for (const attr of activityAttributes) {
      try {
        await databases.createStringAttribute(DATABASE_ID, 'activities', attr.key, attr.size, attr.required);
        console.log(`✅ Activity attribute ${attr.key} created`);
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`ℹ️ Activity attribute ${attr.key} already exists`);
        } else {
          console.error(`❌ Error creating activity attribute ${attr.key}:`, error);
        }
      }
    }

    // Add cost as float attribute
    try {
      await databases.createFloatAttribute(DATABASE_ID, 'activities', 'cost', true, 0);
      console.log('✅ Activity cost attribute created');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('ℹ️ Activity cost attribute already exists');
      } else {
        console.error('❌ Error creating activity cost attribute:', error);
      }
    }

    // Create Expenses Collection
    try {
      await databases.createCollection(
        DATABASE_ID,
        'expenses',
        'Expenses',
        [
          Permission.read(Role.user('ID')),
          Permission.create(Role.user('ID')),
          Permission.update(Role.user('ID')),
          Permission.delete(Role.user('ID')),
        ]
      );
      console.log('✅ Expenses collection created');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('ℹ️ Expenses collection already exists');
      } else {
        throw error;
      }
    }

    // Add Expenses attributes
    const expenseAttributes = [
      { key: 'tripId', type: 'string', size: 50, required: true },
      { key: 'activityId', type: 'string', size: 50, required: false },
      { key: 'description', type: 'string', size: 255, required: true },
      { key: 'category', type: 'string', size: 100, required: true },
      { key: 'date', type: 'string', size: 20, required: true },
    ];

    for (const attr of expenseAttributes) {
      try {
        await databases.createStringAttribute(DATABASE_ID, 'expenses', attr.key, attr.size, attr.required);
        console.log(`✅ Expense attribute ${attr.key} created`);
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`ℹ️ Expense attribute ${attr.key} already exists`);
        } else {
          console.error(`❌ Error creating expense attribute ${attr.key}:`, error);
        }
      }
    }

    // Add amount as float attribute
    try {
      await databases.createFloatAttribute(DATABASE_ID, 'expenses', 'amount', true);
      console.log('✅ Expense amount attribute created');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('ℹ️ Expense amount attribute already exists');
      } else {
        console.error('❌ Error creating expense amount attribute:', error);
      }
    }

    // Create Shared Trips Collection
    try {
      await databases.createCollection(
        DATABASE_ID,
        'shared_trips',
        'Shared Trips',
        [
          Permission.read(Role.any()),
          Permission.create(Role.user('ID')),
          Permission.update(Role.user('ID')),
          Permission.delete(Role.user('ID')),
        ]
      );
      console.log('✅ Shared trips collection created');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('ℹ️ Shared trips collection already exists');
      } else {
        throw error;
      }
    }

    // Add Shared Trips attributes
    const sharedTripAttributes = [
      { key: 'tripId', type: 'string', size: 50, required: true },
      { key: 'token', type: 'string', size: 50, required: true },
      { key: 'expiresAt', type: 'string', size: 30, required: false },
    ];

    for (const attr of sharedTripAttributes) {
      try {
        await databases.createStringAttribute(DATABASE_ID, 'shared_trips', attr.key, attr.size, attr.required);
        console.log(`✅ Shared trip attribute ${attr.key} created`);
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`ℹ️ Shared trip attribute ${attr.key} already exists`);
        } else {
          console.error(`❌ Error creating shared trip attribute ${attr.key}:`, error);
        }
      }
    }

    // Add isActive as boolean attribute
    try {
      await databases.createBooleanAttribute(DATABASE_ID, 'shared_trips', 'isActive', true, true);
      console.log('✅ Shared trip isActive attribute created');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('ℹ️ Shared trip isActive attribute already exists');
      } else {
        console.error('❌ Error creating shared trip isActive attribute:', error);
      }
    }

    console.log('🎉 Appwrite setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up Appwrite:', error);
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupCollections();
}

export { setupCollections };
