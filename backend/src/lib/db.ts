// Cached Mongoose connection (Next.js hot-reload / serverless safe).
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
// Database name within the cluster. Passed as Mongoose `dbName` so it works even
// when the connection string has no database in its path (Atlas SRV strings
// often don't — otherwise Mongoose silently falls back to the `test` database).
const MONGODB_DB = process.env.MONGODB_DB || 'lumi';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Reuse the connection across lambda invocations / hot reloads.
const globalForMongoose = global as unknown as { _mongoose?: MongooseCache };
const cached: MongooseCache = globalForMongoose._mongoose ?? { conn: null, promise: null };
globalForMongoose._mongoose = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Add it to .env.local');
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      dbName: MONGODB_DB,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
