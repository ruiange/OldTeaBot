# 本地设置说明

## 创建环境配置文件

在项目根目录创建 `.env` 文件，添加以下内容：

```
BOT_TOKEN=your_bot_token_here
MONGO_URI=mongodb://username:password@host:port/database_name
```

请替换为您的实际 Telegram Bot Token 和 MongoDB 连接地址。

## 运行项目

安装开发依赖：
```bash
npm install
```

启动开发服务器：
```bash
npm run dev
```

## 使用方法

1. 将 Bot 邀请到群组中
2. 发送消息后使用 `/stats` 命令查看群组排行榜 