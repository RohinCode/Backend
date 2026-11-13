const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  quantity: { type: Number, default: 1 },
  category: { type: String, required: true },
});

const Reports = mongoose.model("Report", ReportSchema);
module.exports = Reports;
