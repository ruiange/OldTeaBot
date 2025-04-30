import { MessageCount } from "../models/messageCount.model.js";

export function registerStatsCommand(bot) {
  bot.command("stats", async ctx => {
    const chatId = ctx.chat.id;
    // 查询该群聊前十名，并按 count 倒序
    const rows = await MessageCount.find({ chat_id: chatId })
      .sort({ count: -1 })
      .limit(10)
      .lean(); // 返回纯 JS 对象以提高性能
      
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