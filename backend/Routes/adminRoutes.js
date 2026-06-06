const express = require("express");
const router = express.Router();

const {
  dashboardStats,
  getAllUsers,
  getAllFarmers,
  freezeUser,
  deleteUser,
  getFarmerDetails,
  freezeFarmer,
deleteFarmer,
} = require("../controllers/adminController");

router.get(
  "/dashboard-stats",
  dashboardStats
);
router.get("/users", getAllUsers);

router.get("/farmers", getAllFarmers);
router.put(
  "/freeze-user/:id",
  freezeUser
);
router.get(
  "/farmer/:id",
  getFarmerDetails
);

router.delete(
  "/delete-user/:id",
  deleteUser
);
router.put(
  "/farmer/freeze/:id",
  freezeFarmer
);

router.delete(
  "/farmer/:id",
  deleteFarmer
);

module.exports = router;