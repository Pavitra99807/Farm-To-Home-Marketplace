// backend/Models/reviewModel.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },
    
    // Product Review
    productRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    
    productReview: String,
    
    // Farmer Review
    farmerRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    
    farmerReview: String,
    
    // Delivery Review (if applicable)
    deliveryRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    
    deliveryReview: String,
    
    // Product Quality
    qualityScore: {
      type: Number,
      min: 1,
      max: 5,
    },
    
    // Freshness
    freshnessScore: {
      type: Number,
      min: 1,
      max: 5,
    },
    
    // Packaging
    packagingScore: {
      type: Number,
      min: 1,
      max: 5,
    },
    
    // Images
    images: [String],
    
    // Moderation
    isApproved: {
      type: Boolean,
      default: false,
    },
    
    modApprovedAt: Date,
    
    modApprovedBy: mongoose.Schema.Types.ObjectId,
    
    isReported: {
      type: Boolean,
      default: false,
    },
    
    reportReason: String,
    
    // Helpfulness
    helpfulCount: {
      type: Number,
      default: 0,
    },
    
    unhelpfulCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
