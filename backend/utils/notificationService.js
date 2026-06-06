// backend/utils/notificationService.js
const nodemailer = require("nodemailer");
const Notification = require("../Models/notificationModel");

// Email transporter configuration
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Create and send notification
 */
const sendNotification = async (recipientId, recipientRole, notificationData) => {
  try {
    // Save to database
    const notification = new Notification({
      recipientId,
      recipientRole,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      priority: notificationData.priority || "medium",
      relatedData: notificationData.relatedData,
      sentVia: notificationData.sentVia || ["in_app"],
    });

    await notification.save();

    // Send via email if specified
    if (notificationData.sentVia?.includes("email") && notificationData.email) {
      await sendEmailNotification(notificationData.email, notificationData.title, notificationData.message);
    }

    // Send via SMS if specified (integrate Twilio)
    if (notificationData.sentVia?.includes("sms") && notificationData.phone) {
      // SMS logic here
    }

    return notification;
  } catch (error) {
    console.error("Notification Error:", error);
    throw error;
  }
};

/**
 * Send email notification
 */
const sendEmailNotification = async (email, subject, message) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>${subject}</h2>
        <p>${message}</p>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ccc;">
          <small>This is an automated message. Please do not reply.</small>
        </div>
      </div>
    `;

    await emailTransporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully to:", email);
  } catch (error) {
    console.error("Email sending error:", error);
  }
};

/**
 * Get user notifications
 */
const getNotifications = async (userId, limit = 10, skip = 0) => {
  try {
    const notifications = await Notification.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const totalCount = await Notification.countDocuments({ recipientId: userId });

    return {
      notifications,
      total: totalCount,
      unreadCount: await Notification.countDocuments({ recipientId: userId, isRead: false }),
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

/**
 * Mark notification as read
 */
const markNotificationAsRead = async (notificationId) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      {
        isRead: true,
        readAt: new Date(),
      },
      { new: true }
    );

    return notification;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

/**
 * Notification templates
 */
const notificationTemplates = {
  productApproved: (productName) => ({
    type: "product_approved",
    title: "Product Approved",
    message: `Your product "${productName}" has been approved and is live on the marketplace.`,
    priority: "high",
  }),

  productRejected: (productName, reason) => ({
    type: "product_rejected",
    title: "Product Rejected",
    message: `Your product "${productName}" was rejected. Reason: ${reason}`,
    priority: "high",
  }),

  orderReceived: (orderId, customerName) => ({
    type: "order_received",
    title: "New Order Received",
    message: `You have received a new order #${orderId} from ${customerName}.`,
    priority: "high",
  }),

  pickupScheduled: (pickupDate, pickupTime) => ({
    type: "pickup_scheduled",
    title: "Pickup Scheduled",
    message: `Your product pickup is scheduled for ${pickupDate} at ${pickupTime}. Please keep your product ready.`,
    priority: "medium",
  }),

  paymentReleased: (amount) => ({
    type: "payment_released",
    title: "Payment Released",
    message: `₹${amount} has been credited to your wallet.`,
    priority: "high",
  }),

  productSold: (productName, quantity, amount) => ({
    type: "product_sold",
    title: "Product Sold",
    message: `${quantity}x ${productName} sold for ₹${amount}.`,
    priority: "medium",
  }),

  deliveryAssigned: (deliveryBoyName, pickupTime) => ({
    type: "delivery_assigned",
    title: "Delivery Assigned",
    message: `Delivery boy ${deliveryBoyName} has been assigned. Pickup at ${pickupTime}.`,
    priority: "medium",
  }),

  deliveryCompleted: (orderId) => ({
    type: "delivery_completed",
    title: "Delivery Completed",
    message: `Your order #${orderId} has been delivered successfully.`,
    priority: "high",
  }),

  lowStockAlert: (productName, quantity) => ({
    type: "low_stock_alert",
    title: "Low Stock Alert",
    message: `${productName} stock is running low. Only ${quantity} units remaining.`,
    priority: "medium",
  }),

  weatherAlert: (alertType, message) => ({
    type: "weather_alert",
    title: `Weather Alert: ${alertType}`,
    message: message,
    priority: "high",
  }),
};

module.exports = {
  sendNotification,
  sendEmailNotification,
  getNotifications,
  markNotificationAsRead,
  notificationTemplates,
};
