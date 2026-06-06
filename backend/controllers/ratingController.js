// backend/controllers/ratingController.js
const Farmer = require("../Models/farmerModel");
const Order = require("../Models/orderModel");

/**
 * Update farmer rating based on orders
 */
exports.calculateFarmerRating = async (req, res) => {
  try {
    const { farmerId } = req.params;

    const farmer = await Farmer.findById(farmerId);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    // Get completed orders
    const completedOrders = await Order.find({
      farmerId: farmerId,
      status: "delivered",
    });

    // Calculate stats
    const ordersCompleted = completedOrders.length;
    const totalRating = completedOrders.reduce((sum, order) => {
      return sum + (order.farmerRating?.score || 0);
    }, 0);

    const averageRating = ordersCompleted > 0 ? totalRating / ordersCompleted : 0;

    // Calculate delivery success rate
    const successfulDeliveries = completedOrders.filter((order) => order.trackingStatus === "delivered").length;
    const deliverySuccess = ordersCompleted > 0 ? (successfulDeliveries / ordersCompleted) * 100 : 0;

    // Determine level
    let level = "Bronze";
    if (averageRating >= 4.5 && ordersCompleted >= 100) {
      level = "Premium";
    } else if (averageRating >= 4.2 && ordersCompleted >= 50) {
      level = "Gold";
    } else if (averageRating >= 3.8 && ordersCompleted >= 25) {
      level = "Silver";
    }

    // Update farmer
    const updatedFarmer = await Farmer.findByIdAndUpdate(
      farmerId,
      {
        "farmerRating.averageRating": parseFloat(averageRating.toFixed(2)),
        "farmerRating.totalRatings": completedOrders.filter((o) => o.farmerRating).length,
        "farmerRating.level": level,
        "farmerRating.ordersCompleted": ordersCompleted,
        "farmerRating.deliverySuccess": parseFloat(deliverySuccess.toFixed(2)),
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Farmer rating calculated",
      data: {
        farmerRating: updatedFarmer.farmerRating,
      },
    });
  } catch (error) {
    console.log("Calculate Farmer Rating Error:", error);
    res.status(500).json({
      success: false,
      message: "Error calculating farmer rating",
    });
  }
};

/**
 * Get farmer rating details
 */
exports.getFarmerRating = async (req, res) => {
  try {
    const { farmerId } = req.params;

    const farmer = await Farmer.findById(farmerId).select("farmerRating");

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: farmer.farmerRating,
    });
  } catch (error) {
    console.log("Get Farmer Rating Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching farmer rating",
    });
  }
};

/**
 * Get all farmers by rating level
 */
exports.getFarmersByLevel = async (req, res) => {
  try {
    const { level } = req.params;

    const validLevels = ["Bronze", "Silver", "Gold", "Premium"];

    if (!validLevels.includes(level)) {
      return res.status(400).json({
        success: false,
        message: "Invalid farmer level",
      });
    }

    const farmers = await Farmer.find({
      "farmerRating.level": level,
    }).select("farmerRating village activeProducts");

    return res.status(200).json({
      success: true,
      count: farmers.length,
      data: farmers,
    });
  } catch (error) {
    console.log("Get Farmers By Level Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching farmers",
    });
  }
};

/**
 * Get top rated farmers
 */
exports.getTopRatedFarmers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const farmers = await Farmer.find()
      .sort({ "farmerRating.averageRating": -1 })
      .limit(parseInt(limit))
      .select("farmerRating village activeProducts totalEarnings");

    return res.status(200).json({
      success: true,
      data: farmers,
    });
  } catch (error) {
    console.log("Get Top Rated Farmers Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching top rated farmers",
    });
  }
};
