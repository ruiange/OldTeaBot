import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let connection = false;

export async function connectDB() {
  if (!connection) {
    await mongoose.connect(process.env.MONGO_URI);
    connection = true;
    console.log("✅ MongoDB 已通过 Mongoose 连接");
  }
  return mongoose.connection.db;
} 