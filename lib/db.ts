import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn?: typeof mongoose;
  promise?: Promise<typeof mongoose>;
}

declare global {
  var mongooseCache: MongooseCache;
}

let cached = global.mongooseCache as MongooseCache;

if (!cached) {
  cached = global.mongooseCache = {};
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = undefined;
    throw e;
  }

  return cached.conn;
}
