const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    image: String,
    category: String,
    description: String,
    stock: Number,
    sellerType: {
      type: String,
      enum: ["admin", "farmer"],
      default: "admin",
    },
    farmerProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FarmerProduct",
      default: null,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    farmerName: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
