const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getMarketPriceList,
  submitFarmerProduct,
  getMyFarmerProducts,
  getAdminFarmerProducts,
  updateFarmerProductStatus,
} = require("../controllers/farmerProductController");

const farmerOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "farmer") {
    return res.status(403).json({
      success: false,
      message: "Farmer access only",
    });
  }

  next();
};

router.get("/market-prices", getMarketPriceList);
router.post("/submit", authMiddleware, farmerOnly, submitFarmerProduct);
router.get("/my-products", authMiddleware, farmerOnly, getMyFarmerProducts);
router.get("/admin/all", authMiddleware, adminMiddleware, getAdminFarmerProducts);
router.patch(
  "/admin/:id/status",
  authMiddleware,
  adminMiddleware,
  updateFarmerProductStatus
);

module.exports = router;
