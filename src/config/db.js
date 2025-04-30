import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

export async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db();  // 默认使用 URI 里指定的数据库
    console.log("✅ MongoDB 已连接");
  }
  return db;
} 