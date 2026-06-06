// backend/Models/deliveryBoyModel.js
const mongoose = require("mongoose");

const deliveryBoySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    assignedArea: {
      latitude: Number,
      longitude: Number,
      radius: {
        type: Number,
        comment: "Service radius in km",
      },
    },
    
    isActive: {
      type: Boolean,
      default: true,
    },
    
    currentLocation: {
      latitude: Number,
      longitude: Number,
      lastUpdated: Date,
    },
    
    assignedOrders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    
    completedOrders: {
      type: Number,
      default: 0,
    },
    
    todayEarnings: {
      type: Number,
      default: 0,
    },
    
    totalEarnings: {
      type: Number,
      default: 0,
    },
    
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    
    totalDeliveries: {
      type: Number,
      default: 0,
    },
    
    successfulDeliveries: {
      type: Number,
      default: 0,
    },
    
    failedDeliveries: {
      type: Number,
      default: 0,
    },
    
    phone: {
      type: String,
      required: true,
    },
    
    vehicleType: {
      type: String,
      enum: ["bike", "auto", "van"],
      default: "bike",
    },
    
    vehicleNumber: String,
    
    bankDetails: {
      accountNumber: String,
      bankName: String,
      ifscCode: String,
    },
    
    dailyEarnings: [
      {
        date: Date,
        amount: Number,
        ordersCompleted: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliveryBoy", deliveryBoySchema);
