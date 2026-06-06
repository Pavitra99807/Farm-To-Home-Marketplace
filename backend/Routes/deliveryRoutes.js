// backend/Routes/deliveryRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const deliveryController = require("../controllers/deliveryController");

// Create delivery boy (Admin)
router.post("/create", authMiddleware, adminMiddleware, deliveryController.createDeliveryBoy);

// Assign order
router.post("/assign-order", authMiddleware, adminMiddleware, deliveryController.assignOrder);

// Complete delivery
router.put("/complete/:deliveryBoyId", authMiddleware, deliveryController.completeDelivery);

// Get delivery boy dashboard
router.get("/dashboard/:deliveryBoyId", authMiddleware, deliveryController.getDeliveryBoyDashboard);

// Update delivery location
router.put("/location/:deliveryBoyId", authMiddleware, deliveryController.updateDeliveryLocation);

// Get nearby delivery boys
router.get("/nearby", deliveryController.getNearbyDeliveryBoys);

module.exports = router;
