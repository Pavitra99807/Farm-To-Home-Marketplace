// backend/Models/warehouseStockModel.js
const mongoose = require("mongoose");

const warehouseStockSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    
    productName: String,
    
    category: String,
    
    availableQuantity: {
      type: Number,
      default: 0,
    },
    
    soldQuantity: {
      type: Number,
      default: 0,
    },
    
    remainingQuantity: {
      type: Number,
      default: 0,
    },
    
    minStockLevel: {
      type: Number,
      default: 10,
    },
    
    isLowStock: {
      type: Boolean,
      default: false,
    },
    
    lastRestockDate: Date,
    
    restockHistory: [
      {
        date: Date,
        quantityAdded: Number,
        fromFarmerId: mongoose.Schema.Types.ObjectId,
      },
    ],
    
    expiryDate: Date,
    
    storageLocation: String,
    
    qualityCondition: {
      type: String,
      enum: ["excellent", "good", "fair", "poor"],
      default: "good",
    },
    
    lastQualityCheck: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("WarehouseStock", warehouseStockSchema);
