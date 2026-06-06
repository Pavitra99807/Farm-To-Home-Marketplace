// backend/Models/walletModel.js
const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
      unique: true,
    },
    
    totalBalance: {
      type: Number,
      default: 0,
    },
    
    pendingBalance: {
      type: Number,
      default: 0,
    },
    
    withdrawnBalance: {
      type: Number,
      default: 0,
    },
    
    transactions: [
      {
        transactionId: String,
        type: {
          type: String,
          enum: ["credit", "debit", "withdrawal", "penalty"],
        },
        amount: Number,
        description: String,
        orderId: mongoose.Schema.Types.ObjectId,
        status: {
          type: String,
          enum: ["pending", "completed", "failed"],
          default: "pending",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    
    withdrawalRequests: [
      {
        requestId: String,
        amount: Number,
        bankDetails: {
          accountNumber: String,
          bankName: String,
          ifscCode: String,
        },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected", "completed"],
          default: "pending",
        },
        requestedAt: Date,
        completedAt: Date,
        remarks: String,
      },
    ],
    
    lastWithdrawalDate: Date,
    
    monthlyEarnings: [
      {
        month: String,
        year: Number,
        amount: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);
