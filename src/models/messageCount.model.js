import mongoose from "mongoose";

const messageCountSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true
  },
  chat_id: {
    type: Number,
    required: true
  },
  username: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: ""
  },
  count: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  collection: "message_counts"
});

// 创建复合索引，使查询更高效
messageCountSchema.index({ chat_id: 1, user_id: 1 }, { unique: true });

export const MessageCount = mongoose.model("MessageCount", messageCountSchema);
export const COLLECTION_NAME = "message_counts"; 