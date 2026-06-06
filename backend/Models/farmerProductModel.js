const mongoose = require("mongoose");

const farmerProductSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    farmerName: {
      type: String,
      required: true,
      trim: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    marketPrice: {
      type: Number,
      required: true,
      min: 0,
    },
   
    farmerPrice: {
      type: Number,
      required: true,
      min: 0,
    },
     adminSellingPrice:{
  type:Number,
  default:0
},
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminRemark: {
      type: String,
      default: "",
    },
    approvedProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FarmerProduct", farmerProductSchema);
