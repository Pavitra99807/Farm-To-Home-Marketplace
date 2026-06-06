// backend/Routes/priceRoutes.js
const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const priceController = require("../controllers/priceController");

// Get price prediction
router.get("/prediction/:cropName", priceController.getPricePrediction);

// Get price recommendation
router.get("/recommendation/:cropName", priceController.getPriceRecommendation);

// Get historical prices
router.get("/history/:cropName", priceController.getHistoricalPrices);

// Get current market price
router.get("/current/:cropName", priceController.getCurrentMarketPrice);

// Add price data (Admin)
router.post("/add", authMiddleware, adminMiddleware, priceController.addPriceData);

module.exports = router;
