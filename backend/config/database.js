import mongoose from "mongoose";

let connectionPromise;

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is required. Configure it in backend/.env.");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(mongoUri)
      .then(() => {
        console.log("Connected to MongoDB.");
      })
      .finally(() => {
        connectionPromise = undefined;
      });
  }

  await connectionPromise;
}
