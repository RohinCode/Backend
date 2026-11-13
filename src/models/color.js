const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["blue", "green", "pink", "yellow", "orange", "purple", "gray"],
  },
});

module.exports = mongoose.model("Theme", themeSchema);
