// backend/Routes/trackingRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const trackingController = require("../controllers/trackingController");

// Update tracking status
router.put("/status/:orderId", authMiddleware, trackingController.updateTrackingStatus);

// Update warehouse status
router.put("/warehouse-status/:orderId", authMiddleware, adminMiddleware, trackingController.updateWarehouseStatus);

// Get farmer order tracking
router.get("/farmer/:farmerId", authMiddleware, trackingController.getFarmerOrderTracking);

// Get customer order tracking
router.get("/customer/:customerId", authMiddleware, trackingController.getCustomerOrderTracking);

// Get all orders tracking (Admin)
router.get("/", authMiddleware, adminMiddleware, trackingController.getAllOrdersTracking);

// Get order tracking
router.get("/:orderId", trackingController.getOrderTracking);

module.exports = router;
