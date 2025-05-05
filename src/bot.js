// src/bot.js
import { Bot } from "grammy";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { MessageCount } from "./models/messageCount.model.js";
import { registerStatsCommand } from "./commands/stats.command.js";
import * as fs from 'fs';
import * as path from 'path';
dotenv.config();
// 尝试手动加载 .env 文件
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = envContent.split('\n');
    
    for (const line of envVars) {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    }
    console.log('✅ 手动加载 .env 文件成功');
  } else {
    console.log('⚠️ .env 文件不存在，请手动创建');
  }
} catch (error) {
  console.error('❌ 加载 .env 文件失败:', error);
}

// 常规 dotenv 加载作为备份
dotenv.config();

// 请在此处替换为您的实际 Telegram Bot Token
// 如果环境变量中没有设置 BOT_TOKEN，则使用此处的值
const BOT_TOKEN = process.env.BOT_TOKEN || 'your_bot_token_here';

console.log('Bot Token:', BOT_TOKEN ? '已设置' : '未设置');

if (!BOT_TOKEN || BOT_TOKEN === 'your_bot_token_here') {
  console.error('❌ 请在 .env 文件中设置有效的 BOT_TOKEN 或在代码中直接替换 BOT_TOKEN 变量的值');
  process.exit(1);
}

async function main() {
  const bot = new Bot(BOT_TOKEN);

  // 1. 连接数据库
  try {
    await connectDB();
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
    return;
  }

  // 2. 消息中间件：统计发言
  bot.on("message", async ctx => {
    const from = ctx.from;
    if (!from || from.is_bot) return;  // 忽略机器人
    
    try {
      await MessageCount.findOneAndUpdate(
        { user_id: from.id, chat_id: ctx.chat.id },
        {
          $inc: { count: 1 },
          $set: {
            username: from.username || null,
            name: `${from.first_name || ""} ${from.last_name || ""}`.trim()
          }
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error("更新消息计数失败:", err.message);
    }
  });

  // 3. 注册 /stats 命令
  registerStatsCommand(bot);

  // 4. 启动 Bot
  console.log("🤖 Bot 正在启动…");
  await bot.start();
}

main().catch(err => {
  console.error("❌ 启动失败：", err);
  process.exit(1);
}); 