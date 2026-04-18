import mongoose from "mongoose";

let isConnected = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("=> Using existing database connection");
    return;
  }

  const MONGODB_URL = process.env.MONGODB_URL;
  if (!MONGODB_URL) {
    throw new Error("FATAL: MONGODB_URL environment variable is missing!");
  }

  try {
    const db = await mongoose.connect(MONGODB_URL, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = db.connections[0]?.readyState === 1;
    console.log("=> Connected to MongoDB");

  } catch (error) {
    console.error("=> Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB connection lost");
  isConnected = false;
});
