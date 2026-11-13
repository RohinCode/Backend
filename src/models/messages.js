const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  isRead: { type: Boolean, default: false },
  date: { type: Date, default: Date.now, expires: 60 * 60 * 48 },
});

const Message = mongoose.model("Message", MessagesSchema);
module.exports = Message;
