// backend/Models/notificationModel.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    recipientRole: {
      type: String,
      enum: ["farmer", "customer", "admin", "delivery_boy"],
      required: true,
    },
    
    type: {
      type: String,
      enum: [
        "product_approved",
        "product_rejected",
        "order_received",
        "pickup_scheduled",
        "pickup_completed",
        "payment_released",
        "product_sold",
        "delivery_assigned",
        "delivery_completed",
        "low_stock_alert",
        "weather_alert",
        "price_update",
        "demand_alert",
        "forum_reply",
      ],
      required: true,
    },
    
    title: {
      type: String,
      required: true,
    },
    
    message: {
      type: String,
      required: true,
    },
    
    relatedData: {
      orderId: mongoose.Schema.Types.ObjectId,
      productId: mongoose.Schema.Types.ObjectId,
      farmerId: mongoose.Schema.Types.ObjectId,
    },
    
    isRead: {
      type: Boolean,
      default: false,
    },
    
    readAt: Date,
    
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    
    sentVia: [
      {
        type: String,
        enum: ["in_app", "email", "sms", "push"],
      },
    ],
    
    actionUrl: String,
    
    expiresAt: Date,
  },
  { timestamps: true }
);

// Auto cleanup old notifications
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Notification", notificationSchema);
