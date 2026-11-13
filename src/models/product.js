const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  star: { type: Number, max: 6 },
  price: { type: String, required: true },
  img: { type: String, required: true },
  hotOffer: { type: Boolean, default: false },
  isSuggest: { type: Boolean, default: false },
  category: { type: String, required: true },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 1,
  },
  details: {
    type: String,
    default: "این محصول جزئیات ندارد",
    maxlength: [500, "جزئیات نمی‌تواند بیشتر از 500 کلمه باشد"],
  },
  keywords: {
    type: [String],
    default: [],
  },
  show: { type: Boolean, default: true },
});

ProductSchema.pre("validate", function () {
  if (this.keywords.length === 0) {
    this.keywords.push(this.name);
  }

});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
