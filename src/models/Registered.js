const mongoose = require("mongoose");

const registeredSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],

  totalPrice: {
    type: Number,
    required: true,
  },

  isDelivered: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Registered", registeredSchema);
