// backend/Routes/demandRoutes.js
const express = require("express");
const router = express.Router();
const demandController = require("../controllers/demandController");

// Get demand by category
router.get("/by-category", demandController.getDemandByCategory);

// Get categorized demand
router.get("/categorized", demandController.getCategorizedDemand);

// Get recommended crops
router.get("/recommended", demandController.getRecommendedCrops);

// Get demand forecast
router.get("/forecast", demandController.getDemandForecast);

module.exports = router;
