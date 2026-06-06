// backend/controllers/deliveryController.js
const DeliveryBoy = require("../Models/deliveryBoyModel");
const Order = require("../Models/orderModel");
const distanceCalculation = require("../utils/distanceCalculation");

/**
 * Create delivery boy
 */
exports.createDeliveryBoy = async (req, res) => {
  try {
    const { userId, phone, assignedArea, vehicleType, vehicleNumber } = req.body;

    const deliveryBoy = new DeliveryBoy({
      userId,
      phone,
      assignedArea,
      vehicleType: vehicleType || "bike",
      vehicleNumber,
      isActive: true,
    });

    await deliveryBoy.save();

    return res.status(201).json({
      success: true,
      message: "Delivery boy created successfully",
      data: deliveryBoy,
    });
  } catch (error) {
    console.log("Create Delivery Boy Error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating delivery boy",
    });
  }
};

/**
 * Assign order to delivery boy
 */
exports.assignOrder = async (req, res) => {
  try {
    const { deliveryBoyId, orderId } = req.body;

    const deliveryBoy = await DeliveryBoy.findByIdAndUpdate(
      deliveryBoyId,
      {
        $push: { assignedOrders: orderId },
      },
      { new: true }
    );

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        deliveryBoyId: deliveryBoyId,
        deliveryStartTime: new Date(),
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Order assigned to delivery boy",
      data: { deliveryBoy, order },
    });
  } catch (error) {
    console.log("Assign Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Error assigning order",
    });
  }
};

/**
 * Complete delivery
 */
exports.completeDelivery = async (req, res) => {
  try {
    const { deliveryBoyId, orderId } = req.body;

    const deliveryBoy = await DeliveryBoy.findByIdAndUpdate(
      deliveryBoyId,
      {
        $pull: { assignedOrders: orderId },
        $inc: { completedOrders: 1, totalDeliveries: 1, successfulDeliveries: 1 },
      },
      { new: true }
    );

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        trackingStatus: "delivered",
        deliveryCompletedTime: new Date(),
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Delivery completed",
      data: { deliveryBoy, order },
    });
  } catch (error) {
    console.log("Complete Delivery Error:", error);
    res.status(500).json({
      success: false,
      message: "Error completing delivery",
    });
  }
};

/**
 * Get delivery boy dashboard
 */
exports.getDeliveryBoyDashboard = async (req, res) => {
  try {
    const { deliveryBoyId } = req.params;

    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId).populate("assignedOrders");

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "Delivery boy not found",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEarnings = deliveryBoy.dailyEarnings.find(
      (e) => new Date(e.date).toDateString() === today.toDateString()
    );

    return res.status(200).json({
      success: true,
      data: {
        deliveryBoy: {
          name: deliveryBoy.userId,
          phone: deliveryBoy.phone,
          rating: deliveryBoy.rating,
          totalDeliveries: deliveryBoy.totalDeliveries,
          successfulDeliveries: deliveryBoy.successfulDeliveries,
          failedDeliveries: deliveryBoy.failedDeliveries,
        },
        assignedOrders: deliveryBoy.assignedOrders,
        completedOrders: deliveryBoy.completedOrders,
        todayEarnings: todayEarnings?.amount || 0,
        totalEarnings: deliveryBoy.totalEarnings,
      },
    });
  } catch (error) {
    console.log("Get Delivery Boy Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching delivery boy dashboard",
    });
  }
};

/**
 * Update delivery boy location
 */
exports.updateDeliveryLocation = async (req, res) => {
  try {
    const { deliveryBoyId } = req.params;
    const { latitude, longitude } = req.body;

    const deliveryBoy = await DeliveryBoy.findByIdAndUpdate(
      deliveryBoyId,
      {
        currentLocation: {
          latitude,
          longitude,
          lastUpdated: new Date(),
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Location updated",
      data: deliveryBoy.currentLocation,
    });
  } catch (error) {
    console.log("Update Delivery Location Error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating location",
    });
  }
};

/**
 * Get nearby delivery boys
 */
exports.getNearbyDeliveryBoys = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;

    const deliveryBoys = await DeliveryBoy.find({
      isActive: true,
      assignedOrders: { $size: { $lt: 5 } },
    });

    // Filter by distance
    const nearby = deliveryBoys.filter((boy) => {
      if (!boy.currentLocation) return false;
      const distance = distanceCalculation.calculateDistance(
        latitude,
        longitude,
        boy.currentLocation.latitude,
        boy.currentLocation.longitude
      );
      return distance <= radius;
    });

    return res.status(200).json({
      success: true,
      count: nearby.length,
      data: nearby,
    });
  } catch (error) {
    console.log("Get Nearby Delivery Boys Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching nearby delivery boys",
    });
  }
};
