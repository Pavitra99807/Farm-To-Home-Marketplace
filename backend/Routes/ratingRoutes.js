// backend/Routes/ratingRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const ratingController = require("../controllers/ratingController");

// Calculate farmer rating
router.post("/calculate/:farmerId", authMiddleware, adminMiddleware, ratingController.calculateFarmerRating);

// Get farmers by level
router.get("/level/:level", ratingController.getFarmersByLevel);

// Get top rated farmers
router.get("/top/farmers", ratingController.getTopRatedFarmers);

// Get farmer rating
router.get("/:farmerId", ratingController.getFarmerRating);

module.exports = router;
