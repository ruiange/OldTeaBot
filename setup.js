// setup.js
import { promises as fs } from 'fs';
import { createInterface } from 'readline';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setup() {
  console.log("👋 欢迎使用 Telegram 统计机器人设置向导!");
  console.log("🔧 此脚本将帮助您创建必要的配置文件");
  console.log("📝 请根据提示输入以下信息:\n");

  let botToken = await question("1️⃣ 请输入您的 Telegram Bot Token (从 @BotFather 获取): ");
  while (!botToken || botToken.trim() === '' || botToken === 'your_bot_token_here') {
    console.log("❗ Bot Token 不能为空!");
    botToken = await question("请重新输入您的 Telegram Bot Token: ");
  }

  let mongoUri = await question("2️⃣ 请输入 MongoDB 连接 URI (例如: mongodb://username:password@host:port/database): ");
  if (!mongoUri || mongoUri.trim() === '') {
    mongoUri = 'mongodb://localhost:27017/telegramBot';
    console.log(`ℹ️ 使用默认 MongoDB URI: ${mongoUri}`);
  }

  const envContent = `BOT_TOKEN=${botToken.trim()}\nMONGO_URI=${mongoUri.trim()}\n`;
  
  try {
    await fs.writeFile(resolve(__dirname, '.env'), envContent);
    console.log("\n✅ .env 文件已成功创建!");
  } catch (error) {
    console.error("❌ 创建 .env 文件失败:", error);
    process.exit(1);
  }

  console.log("\n🚀 设置完成! 您现在可以运行以下命令启动机器人:");
  console.log("   npm run dev");
  
  rl.close();
}

setup().catch(error => {
  console.error("❌ 设置过程中出错:", error);
  rl.close();
  process.exit(1);
}); 