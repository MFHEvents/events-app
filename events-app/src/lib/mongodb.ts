import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

let isConnected = false; // Track connection status to avoid multiple connections
let bucket: GridFSBucket | null = null;

  
export const connectToDatabase = async (): Promise<typeof mongoose | null> => {

  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return mongoose;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  try {
    const db = await mongoose.connect(mongoUri);
    isConnected = true;

    const nativeMongoDB = mongoose.connection.db;

    if (!nativeMongoDB) {
      throw new Error('Could not setup GridFS')
    }

    // Create the GridFSBucket instance if not already created
    if (!bucket) {
      bucket = new GridFSBucket(nativeMongoDB);
      console.log('GridFSBucket created');
    }
    
    console.log('MongoDB connected');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};

// Export the bucket to be used in other files
export const getBucket = (): GridFSBucket | null => {
  if (!bucket) {
    throw new Error('GridFSBucket is not initialized. Please connect to the database first.');
  }
  return bucket;
};
