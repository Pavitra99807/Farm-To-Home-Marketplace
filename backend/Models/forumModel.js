// backend/Models/forumModel.js
const mongoose = require("mongoose");

const forumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    
    description: {
      type: String,
      required: true,
    },
    
    category: {
      type: String,
      enum: [
        "crop_advice",
        "market_prices",
        "weather",
        "pest_disease",
        "fertilizer",
        "tools_equipment",
        "general",
      ],
      required: true,
    },
    
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    authorRole: {
      type: String,
      enum: ["farmer", "admin", "agricultural_expert"],
    },
    
    tags: [String],
    
    views: {
      type: Number,
      default: 0,
    },
    
    likes: {
      type: Number,
      default: 0,
    },
    
    likedBy: [mongoose.Schema.Types.ObjectId],
    
    // Replies/Answers
    replies: [
      {
        replyId: mongoose.Schema.Types.ObjectId,
        authorId: mongoose.Schema.Types.ObjectId,
        content: String,
        likes: {
          type: Number,
          default: 0,
        },
        isAccepted: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    
    status: {
      type: String,
      enum: ["open", "closed", "solved"],
      default: "open",
    },
    
    isPinned: {
      type: Boolean,
      default: false,
    },
    
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Forum", forumSchema);
