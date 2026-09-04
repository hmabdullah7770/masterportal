import mongoose from "mongoose";
import { MONGO_DB_NAME } from "./constant";

// const MONGO_URI = process.env.MONGO_URI as string;

const MONGO_URI= "mongodb+srv://hmabdullah7770:hmabdullah7770@cluster0.ppftw.mongodb.net"

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URI, {
      dbName: MONGO_DB_NAME,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log(`MongoDB connected successfully to db: ${MONGO_DB_NAME}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default mongoose;