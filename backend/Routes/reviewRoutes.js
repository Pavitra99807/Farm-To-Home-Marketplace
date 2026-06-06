// backend/Routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const reviewController = require("../controllers/reviewController");

// Add review
router.post("/add", authMiddleware, reviewController.addReview);

// Approve review (Admin)
router.put("/approve/:reviewId", authMiddleware, adminMiddleware, reviewController.approveReview);

// Get reviews by farmer
router.get("/farmer/:farmerId", reviewController.getReviewsByFarmer);

// Get reviews by product
router.get("/product/:productId", reviewController.getReviewsByProduct);

// Report review
router.post("/report/:reviewId", authMiddleware, reviewController.reportReview);

// Mark helpful
router.post("/helpful/:reviewId", authMiddleware, reviewController.markHelpful);

module.exports = router;
