const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: {
    type: String,
    default: null,
    maxlength: [100, "آدرس نمی‌تواند بیشت از 100 کاراکتر باشد"],
  },
  phoneNamber: {
    type: String,
    default: null,
    maxlength: [11, "شماره نمی‌تواند بیشتر از 11 رقم باشد"],
  },
  isadmin: { type: Boolean, default: false },
  isOwner: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
