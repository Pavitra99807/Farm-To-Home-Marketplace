// backend/Models/orderModel.js - ENHANCED VERSION
// Add these fields to existing orderModel.js

/**
NEW FIELDS TO ADD TO EXISTING orderModel.js:

// Logistics & Delivery
pickupCharge: {
  type: Number,
  default: 0,
  comment: "Charge for farmer to warehouse"
},

deliveryCharge: {
  type: Number,
  default: 0,
  comment: "Charge for warehouse to customer"
},

totalAmount: {
  type: Number,
  required: true,
  comment: "Product price + delivery charge + pickup charge"
},

// Order Tracking
trackingStatus: {
  type: String,
  enum: [
    "order_confirmed",
    "packed",
    "out_for_delivery",
    "delivered",
    "cancelled"
  ],
  default: "order_confirmed",
},

warehouseStatus: {
  type: String,
  enum: [
    "pending_approval",
    "approved",
    "waiting_pickup",
    "picked_up",
    "stored_in_warehouse",
    "quality_check",
    "ready_for_delivery"
  ],
  default: "pending_approval",
},

// Delivery Info
deliveryBoyId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "DeliveryBoy",
},

deliveryStartTime: Date,
deliveryCompletedTime: Date,

// Customer Location
customerDeliveryLocation: {
  latitude: Number,
  longitude: Number,
  address: String,
},

warehousePickupLocation: {
  latitude: 12.9237,
  longitude: 77.4987,
},

// Farmer Location
farmerPickupLocation: {
  latitude: Number,
  longitude: Number,
  address: String,
},

// Timeline
timeline: [
  {
    status: String,
    timestamp: Date,
    location: {
      latitude: Number,
      longitude: Number,
    },
    notes: String,
  },
],

// Quality Check
qualityCheck: {
  status: {
    type: String,
    enum: ["pending", "passed", "rejected", "changes_requested"],
  },
  checkedBy: mongoose.Schema.Types.ObjectId,
  checkDate: Date,
  remarks: String,
  score: Number,
},

// Ratings
farmerRating: {
  score: Number,
  review: String,
  ratedAt: Date,
},

deliveryBoyRating: {
  score: Number,
  review: String,
  ratedAt: Date,
},

// Cancellation
cancellationReason: String,
cancelledAt: Date,
cancelledBy: {
  type: String,
  enum: ["customer", "farmer", "admin"],
},

// Refund
refundStatus: String,
refundAmount: Number,
refundedAt: Date,
*/
