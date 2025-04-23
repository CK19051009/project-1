const mongoose = require("mongoose");
const cahtSchema = new mongoose.Schema(
  {
    userId: String,
    content: String,
    room_id: String,
    avatar: String,
    image: Array,
    deletedAt: Date,
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", cahtSchema, "chats");

module.exports = Chat;
