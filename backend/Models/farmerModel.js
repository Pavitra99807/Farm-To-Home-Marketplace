// backend/Models/farmerModel.js
const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Location Details
    village: {
      type: String,
      required: true,
      trim: true,
    },
    
    latitude: {
      type: Number,
      required: true,
    },
    
    longitude: {
      type: Number,
      required: true,
    },
    
    // Distance & Logistics
    distanceToWarehouse: {
      type: Number,
      default: 0,
      comment: "Distance in kilometers"
    },
    
    pickupCharge: {
      type: Number,
      default: 0,
      comment: "Auto-calculated based on distance"
    },
    
    deliveryOption: {
      type: String,
      enum: ["self-delivery", "company-pickup"],
      default: "self-delivery",
    },
    
    // Wallet & Earnings
    walletBalance: {
      type: Number,
      default: 0,
    },
    
    totalEarnings: {
      type: Number,
      default: 0,
    },
    
    pendingEarnings: {
      type: Number,
      default: 0,
    },
    
    totalPickupCharges: {
      type: Number,
      default: 0,
    },
    
    withdrawableBalance: {
      type: Number,
      default: 0,
    },
    
    // Rating System
    farmerRating: {
      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      
      totalRatings: {
        type: Number,
        default: 0,
      },
      
      level: {
        type: String,
        enum: ["Bronze", "Silver", "Gold", "Premium"],
        default: "Bronze",
      },
      
      ordersCompleted: {
        type: Number,
        default: 0,
      },
      
      deliverySuccess: {
        type: Number,
        default: 0,
      },
    },
    
    // Products & Inventory
    productsListed: {
      type: Number,
      default: 0,
    },
    
    activeProducts: {
      type: Number,
      default: 0,
    },
    
    // Bank Details
    bankDetails: {
      accountNumber: String,
      accountHolderName: String,
      bankName: String,
      ifscCode: String,
      verified: {
        type: Boolean,
        default: false,
      },
    },
    
    // Status
    isApproved: {
      type: Boolean,
      default: false,
    },
    
    isActive: {
      type: Boolean,
      default: true,
    },
    
    // Preferences
    preferredDeliveryOption: String,
    sellingHours: {
      startTime: String,
      endTime: String,
    },
    
    // Stats
    totalOrdersFulfilled: {
      type: Number,
      default: 0,
    },
    
    cancellationRate: {
      type: Number,
      default: 0,
    },
    
    responseTime: {
      type: Number,
      default: 0,
      comment: "Average response time in minutes"
    },
  },
  { timestamps: true }
);

// Index for geospatial queries
farmerSchema.index({ latitude: 1, longitude: 1 });

module.exports = mongoose.model("Farmer", farmerSchema);
