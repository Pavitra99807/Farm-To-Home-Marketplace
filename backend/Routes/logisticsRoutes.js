// backend/Routes/logisticsRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const logisticsController = require("../controllers/logisticsController");

// Calculate pickup charge
router.post("/calculate-pickup", logisticsController.calculatePickupCharge);

// Calculate delivery charge
router.post("/calculate-delivery", logisticsController.calculateDeliveryCharge);

// Calculate total logistics cost
router.post("/calculate-total", logisticsController.calculateTotalLogisticsCost);

// Get warehouse location
router.get("/warehouse-location", logisticsController.getWarehouseLocation);

// Update farmer location
router.put("/farmer-location/:userId", authMiddleware, logisticsController.updateFarmerLocation);

// Get farmers near warehouse
router.get("/farmers-near", logisticsController.getFarmersNearWarehouse);

module.exports = router;
