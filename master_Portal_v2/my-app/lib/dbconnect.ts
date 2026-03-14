// /lib/dbconnect.ts
import mongoose from "mongoose";
import  {DB_NAME}  from "../constants";

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Use global cache to prevent multiple connections in development
let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = { bufferCommands: false };
  
    cached.promise = mongoose.connect(MONGODB_URI, {
        ...opts,
        dbName: DB_NAME,   // <--- Here your constant DB is used correctly
      }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
