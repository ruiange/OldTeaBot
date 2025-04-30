# 本地设置说明

## 技术栈
- Node.js
- Grammy (Telegram Bot 框架)
- Mongoose (MongoDB 对象模型工具)

## 环境设置

有两种方式设置环境变量：

### 1. 使用交互式设置向导（推荐）

运行以下命令启动交互式设置向导，它将引导您完成配置过程：

```bash
npm run setup
```

### 2. 手动创建环境配置文件

在项目根目录创建 `.env` 文件，添加以下内容：

```
BOT_TOKEN=your_bot_token_here
MONGO_URI=mongodb://username:password@host:port/database_name
```

请替换为您的实际 Telegram Bot Token 和 MongoDB 连接地址。

## 运行项目

安装依赖：
```bash
npm install
```

启动开发服务器：
```bash
npm run dev
```

## 数据库说明

本项目使用 Mongoose 作为 MongoDB 的对象文档映射库，主要模型如下：

- `MessageCount`: 存储用户在群组中的发言数统计
  - `user_id`: 用户ID
  - `chat_id`: 群组ID
  - `username`: 用户名
  - `name`: 用户全名
  - `count`: 发言计数

## 使用方法

1. 将 Bot 邀请到群组中
2. 发送消息后使用 `/stats` 命令查看群组排行榜

## 故障排除

如果遇到 "Empty token!" 错误，请确保:
1. `.env` 文件存在于项目根目录
2. `BOT_TOKEN` 变量设置正确且不为空
3. 环境变量能被正确加载

可以通过运行 `npm run setup` 重新配置环境变量。 