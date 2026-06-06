// backend/Models/priceHistoryModel.js
const mongoose = require("mongoose");

const priceHistorySchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: true,
    },
    
    cropCategory: String,
    
    date: {
      type: Date,
      required: true,
    },
    
    currentPrice: {
      type: Number,
      required: true,
    },
    
    minPrice: Number,
    
    maxPrice: Number,
    
    avgPrice: Number,
    
    supplyQuantity: Number,
    
    demandLevel: {
      type: String,
      enum: ["high", "medium", "low"],
    },
    
    // Price Movement
    priceChange: Number,
    priceChangePercentage: Number,
    
    // Prediction
    predictedTomorrow: Number,
    predicted3Days: Number,
    predicted7Days: Number,
    
    // Market Info
    marketName: String,
    region: String,
    
    // Source
    source: {
      type: String,
      enum: ["mandi", "ecommerce", "farmer_feedback"],
      default: "mandi",
    },
    
    dataQuality: {
      type: String,
      enum: ["verified", "estimated", "historical"],
    },
  },
  { timestamps: true }
);

// Create index for efficient queries
priceHistorySchema.index({ cropName: 1, date: -1 });
priceHistorySchema.index({ date: -1 });

module.exports = mongoose.model("PriceHistory", priceHistorySchema);
