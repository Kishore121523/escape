import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// (global as any).mongoose: It attempts to access the mongoose property of the global object. The global object is a global scope object in Node.js that contains global variables. The (global as any) syntax is used to explicitly cast global to any type, allowing access to properties that might not be defined in the TypeScript types.
let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) throw new Error("Missing MONGODB_URL");

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, { dbName: "escape", bufferCommands: false });

  cached.conn = await cached.promise;

  return cached.conn;
};
