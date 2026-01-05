// lib/db.ts
import { MongoClient, Db, ServerApiVersion } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectDB(): Promise<Db> {
  if (cachedDb) return cachedDb;

  const uri = process.env.MONGO_URI;
  const dbName = process.env.DB_NAME;

  if (!uri || !dbName) {
    throw new Error("MONGO_URI or DB_NAME not set in environment");
  }

  // MongoClient instance
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await client.connect();

  cachedClient = client;
  cachedDb = client.db(dbName);

  console.log(`🚀 Connected to MongoDB (${process.env.NODE_ENV || "dev"})`);

  return cachedDb;
}

export async function closeDB(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log("MongoDB connection closed.");
  }
}
