// backend/controllers/logisticsController.js
const Farmer = require("../Models/farmerModel");
const Order = require("../Models/orderModel");
const distanceCalculation = require("../utils/distanceCalculation");

/**
 * Calculate pickup charge for farmer
 */
exports.calculatePickupCharge = async (req, res) => {
  try {
    const { farmerLat, farmerLng, deliveryOption } = req.body;

    if (!farmerLat || !farmerLng) {
      return res.status(400).json({
        success: false,
        message: "Farmer coordinates are required",
      });
    }

    const pickupData = distanceCalculation.calculatePickupCharge(farmerLat, farmerLng);
    let charge = 0;

    if (deliveryOption === "company-pickup") {
      charge = pickupData.pickupCharge;
    }

    return res.status(200).json({
      success: true,
      data: {
        distance: pickupData.distance,
        pickupCharge: charge,
        deliveryOption: deliveryOption,
        distanceCategory: pickupData.category,
      },
    });
  } catch (error) {
    console.log("Calculate Pickup Charge Error:", error);
    res.status(500).json({
      success: false,
      message: "Error calculating pickup charge",
    });
  }
};

/**
 * Calculate delivery charge for customer
 */
exports.calculateDeliveryCharge = async (req, res) => {
  try {
    const { customerLat, customerLng } = req.body;

    if (!customerLat || !customerLng) {
      return res.status(400).json({
        success: false,
        message: "Customer coordinates are required",
      });
    }

    const deliveryData = distanceCalculation.calculateDeliveryCharge(customerLat, customerLng);

    return res.status(200).json({
      success: true,
      data: {
        distance: deliveryData.distance,
        deliveryCharge: deliveryData.deliveryCharge,
        distanceCategory: deliveryData.category,
        estimatedDeliveryTime: distanceCalculation.estimateDeliveryTime(deliveryData.distance),
      },
    });
  } catch (error) {
    console.log("Calculate Delivery Charge Error:", error);
    res.status(500).json({
      success: false,
      message: "Error calculating delivery charge",
    });
  }
};

/**
 * Calculate total logistics cost
 */
exports.calculateTotalLogisticsCost = async (req, res) => {
  try {
    const { farmerLat, farmerLng, customerLat, customerLng, deliveryOption = "company-pickup" } = req.body;
const totalCost = distanceCalculation.calculateTotalLogisticsCost(
  farmerLat,
  farmerLng,
  customerLat,
  customerLng,
  deliveryOption
);

    return res.status(200).json({
      success: true,
      data: totalCost,
    });
  } catch (error) {
    console.log("Calculate Total Logistics Cost Error:", error);
    res.status(500).json({
      success: false,
      message: "Error calculating total logistics cost",
    });
  }
};

/**
 * Get warehouse location
 */
exports.getWarehouseLocation = async (req, res) => {
  try {
    const location = distanceCalculation.getWarehouseLocation();

    return res.status(200).json({
      success: true,
      data: {
        location: location,
        name: "RV College of Engineering, Kengeri",
        city: "Bangalore",
        state: "Karnataka",
      },
    });
  } catch (error) {
    console.log("Get Warehouse Location Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching warehouse location",
    });
  }
};

/**
 * Update farmer location and delivery option
 */
exports.updateFarmerLocation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { village, latitude, longitude, deliveryOption } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Coordinates are required",
      });
    }

    const pickupData = distanceCalculation.calculatePickupCharge(latitude, longitude);

    const farmer = await Farmer.findOneAndUpdate(
      { userId: userId },
      {
        village: village,
        latitude: latitude,
        longitude: longitude,
        deliveryOption: deliveryOption || "self-delivery",
        distanceToWarehouse: pickupData.distance,
        pickupCharge: deliveryOption === "company-pickup" ? pickupData.pickupCharge : 0,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Farmer location updated successfully",
      data: farmer,
    });
  } catch (error) {
    console.log("Update Farmer Location Error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating farmer location",
    });
  }
};

/**
 * Get all farmers near warehouse
 */
exports.getFarmersNearWarehouse = async (req, res) => {
  try {
    const radiusKm = req.query.radius || 50;

    const farmers = await Farmer.find({
      distanceToWarehouse: { $lte: radiusKm },
    });

    return res.status(200).json({
      success: true,
      count: farmers.length,
      data: farmers,
    });
  } catch (error) {
    console.log("Get Farmers Near Warehouse Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching farmers",
    });
  }
};
