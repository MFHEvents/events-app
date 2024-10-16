import mongoose from 'mongoose';

let isConnected = false; // Track connection status to avoid multiple connections

  
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
    console.log('MongoDB connected');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};
