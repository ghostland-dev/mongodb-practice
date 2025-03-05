import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const DB_URL: string = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo-db:27017/${process.env.MONGO_INITDB_DATABASE}?authSource=${process.env.MONGO_INITDB_ROOT_USERNAME}`;

const connectDB = async () => {
  try {
    await mongoose.connect( DB_URL );
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
};

export default connectDB;
