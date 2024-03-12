import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

// Create an interface for typescript understaning
interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// (global as any).mongoose: It attempts to access the mongoose property of the global object. The global object is a global scope object in Node.js that contains global variables. The (global as any) syntax is used to explicitly cast global to any type, allowing access to properties that might not be defined in the TypeScript types.
let cached: MongooseConnection = (global as any).mongoose;

// If there is no cache variable assigned before, assign the properties of cahced to null and intialise the variable
if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

// Connecting to DB using a workaround for cached variable
export const connectToDatabase = async () => {
  // if connection already exists, then use that
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) throw new Error("Missing MONGODB_URL");

  // If not then create a connection
  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, { dbName: "Escape", bufferCommands: false });

  cached.conn = await cached.promise;

  return cached.conn;
};
