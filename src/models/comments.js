const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true,
  },
  text: {
    type: String,
    required: true,
    maxlength: [500, "کامنت نمی‌تواند بیشتر از 500 کلمه باشد"],
  },
  date: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
