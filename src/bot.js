// src/bot.js
import { Bot } from "grammy";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { COLLECTION_NAME } from "./models/messageCount.model.js";
import { registerStatsCommand } from "./commands/stats.command.js";

dotenv.config();

async function main() {
  const bot = new Bot(process.env.BOT_TOKEN);

  // 1. 连接数据库
  const db = await connectDB();
  const coll = db.collection(COLLECTION_NAME);

  // 2. 消息中间件：统计发言
  bot.on("message", async ctx => {
    const from = ctx.from;
    if (!from || from.is_bot) return;  // 忽略机器人
    await coll.updateOne(
      { user_id: from.id, chat_id: ctx.chat.id },
      {
        $inc: { count: 1 },
        $set: {
          username: from.username || null,
          name: `${from.first_name || ""} ${from.last_name || ""}`.trim()
        }
      },
      { upsert: true }
    );
  });

  // 3. 注册 /stats 命令
  registerStatsCommand(bot, db);

  // 4. 启动 Bot
  console.log("🤖 Bot 正在启动…");
  bot.start();
}

main().catch(err => {
  console.error("❌ 启动失败：", err);
  process.exit(1);
}); 