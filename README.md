# Telegram 统计机器人

## 一、项目目录结构

```
telegram-stats-bot/
├─ .env
├─ package.json
├─ src/
│  ├─ config/
│  │  └─ db.js               // MongoDB 连接
│  ├─ models/
│  │  └─ messageCount.model.js  // 发言数文档模型
│  ├─ commands/
│  │  └─ stats.command.js    // /stats 命令处理
│  └─ bot.js                 // Bot 启动入口
└─ README.md
```

## 二、环境准备

### 安装依赖

```bash
npm init -y
npm install grammy mongodb dotenv
```

### 创建环境配置文件

在项目根目录创建 `.env` 文件：

```
BOT_TOKEN=你的_bot_token_here
MONGO_URI=mongodb://用户名:密码@主机:端口/数据库名
```

## 三、编写 MongoDB 连接

文件路径：`src/config/db.js`

```javascript
// src/config/db.js
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
```

## 四、定义发言数模型

文件路径：`src/models/messageCount.model.js`

```javascript
// src/models/messageCount.model.js
/**
 * 这个文件只是集中存放 collection 名称，方便后续复用
 */
export const COLLECTION_NAME = "message_counts";
```

## 五、实现 /stats 命令

文件路径：`src/commands/stats.command.js`

```javascript
// src/commands/stats.command.js
import { COLLECTION_NAME } from "../models/messageCount.model.js";

export function registerStatsCommand(bot, db) {
  const coll = db.collection(COLLECTION_NAME);

  bot.command("stats", async ctx => {
    const chatId = ctx.chat.id;
    // 查询该群聊前十名，并按 count 倒序
    const rows = await coll.find({ chat_id: chatId })
      .sort({ count: -1 })
      .limit(10)
      .toArray();
    if (rows.length === 0) {
      return ctx.reply("目前还没有发言数据。");
    }
    const lines = rows.map((r, i) => {
      const name = r.name?.trim() || r.username || "匿名";
      return `${i + 1}. ${name} — ${r.count} 条`;
    });
    await ctx.reply("📊 群聊发言排行榜：\n" + lines.join("\n"));
  });
}
```

## 六、Bot 启动入口

文件路径：`src/bot.js`

```javascript
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
```

## 七、运行

```bash
# 开发时可用 nodemon 自动重启
npm install -D nodemon

# package.json 加入
# "scripts": {
#   "dev": "nodemon --exec node src/bot.js"
# }

npm run dev
```

1. 将 Bot 邀请进目标群组
2. 发送几条消息测试统计
3. 在群里发送 `/stats` 即可看到排行榜

## 八、可选优化

- **错误日志**：给每个 await 包裹 try/catch，防止某条更新失败导致整个 Bot 崩溃
- **周期清理**：定时删除半年或一年之前的统计数据
- **按时间统计**：在文档中额外存 date 字段，按需分组聚合（天/周/月）