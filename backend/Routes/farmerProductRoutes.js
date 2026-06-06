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
  moveProductToStore,
  getApprovedFarmerProducts
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
const getAllFarmers = async (req, res) => {
  try {
    const farmers = await User.find({
      role: "farmer",
    });

    res.json({
      success: true,
      data: farmers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

router.get("/market-prices", getMarketPriceList);
router.post("/submit", authMiddleware, farmerOnly, submitFarmerProduct);
router.get("/my-products", authMiddleware, farmerOnly, getMyFarmerProducts);
router.get("/admin/all", authMiddleware, adminMiddleware, getAdminFarmerProducts);
router.get(
  "/admin/inventory",
  authMiddleware,
  adminMiddleware,
  getApprovedFarmerProducts
);

router.post(
  "/admin/:id/move-store",
  authMiddleware,
  adminMiddleware,
  moveProductToStore
);

router.patch(
  "/admin/:id/status",
  authMiddleware,
  adminMiddleware,
  updateFarmerProductStatus
);
router.get("/all-farmers", getAllFarmers);

module.exports = router;
