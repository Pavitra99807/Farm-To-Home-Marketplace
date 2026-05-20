const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
    },

    email: {
  type: String,
},

    address: {
      type: String,
    },

    city: {
      type: String,
    },

    pincode: {
      type: String,
    },

    phone: {
      type: String,
    },

    items: {
      type: Array,
      default: [],
    },

    totalAmount: {
      type: Number,
    },

    paymentStatus: {
      type: String,
      default: "Paid",
    },

    orderStatus: {
      type: String,
      default: "Processing",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Order",
  orderSchema
);