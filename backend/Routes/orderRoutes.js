const express = require("express");

const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

// =========================
// CREATE ORDER
// =========================
router.post("/create", createOrder);

// =========================
// GET ALL ORDERS
// =========================
router.get("/all", getAllOrders);

// =========================
// GET USER ORDERS
// =========================
router.get("/user/:email", getUserOrders);

// =========================
// UPDATE ORDER STATUS
// =========================
router.put("/status/:id", updateOrderStatus);

module.exports = router;