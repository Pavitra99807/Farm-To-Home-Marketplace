// backend/Routes/walletRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const walletController = require("../controllers/walletController");

// Add earnings
router.post("/add-earnings", authMiddleware, walletController.addEarnings);

// Deduct pickup charge
router.post("/deduct-charge", authMiddleware, walletController.deductPickupCharge);

// Request withdrawal
router.post("/request-withdrawal", authMiddleware, walletController.requestWithdrawal);

// Process withdrawal (Admin)
router.put("/process-withdrawal", authMiddleware, adminMiddleware, walletController.processWithdrawal);

// Get wallet history
router.get("/history/:farmerId", authMiddleware, walletController.getWalletHistory);

// Get wallet
router.get("/:farmerId", authMiddleware, walletController.getWallet);

module.exports = router;
