// backend/controllers/trackingController.js
const Order = require("../Models/orderModel");

/**
 * Update order tracking status
 */
exports.updateTrackingStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { trackingStatus, location, notes } = req.body;

    const validStatuses = ["order_confirmed", "packed", "out_for_delivery", "delivered", "cancelled"];

    if (!validStatuses.includes(trackingStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tracking status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        trackingStatus: trackingStatus,
        $push: {
          timeline: {
            status: trackingStatus,
            timestamp: new Date(),
            location: location,
            notes: notes,
          },
        },
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tracking status updated",
      data: order,
    });
  } catch (error) {
    console.log("Update Tracking Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating tracking status",
    });
  }
};

/**
 * Update warehouse status
 */
exports.updateWarehouseStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { warehouseStatus, notes } = req.body;

    const validStatuses = [
      "pending_approval",
      "approved",
      "waiting_pickup",
      "picked_up",
      "stored_in_warehouse",
      "quality_check",
      "ready_for_delivery",
    ];

    if (!validStatuses.includes(warehouseStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid warehouse status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        warehouseStatus: warehouseStatus,
        $push: {
          timeline: {
            status: warehouseStatus,
            timestamp: new Date(),
            notes: notes,
          },
        },
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Warehouse status updated",
      data: order,
    });
  } catch (error) {
    console.log("Update Warehouse Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating warehouse status",
    });
  }
};

/**
 * Get order tracking details
 */
exports.getOrderTracking = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("deliveryBoyId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        orderId: order._id,
        trackingStatus: order.trackingStatus,
        warehouseStatus: order.warehouseStatus,
        timeline: order.timeline,
        deliveryBoy: order.deliveryBoyId,
        estimatedDelivery: order.estimatedDeliveryTime,
      },
    });
  } catch (error) {
    console.log("Get Order Tracking Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order tracking",
    });
  }
};

/**
 * Get farmer order tracking view
 */
exports.getFarmerOrderTracking = async (req, res) => {
  try {
    const { farmerId } = req.params;

    const orders = await Order.find({ farmerId: farmerId }).select(
      "orderId trackingStatus warehouseStatus timeline createdAt"
    );

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log("Get Farmer Order Tracking Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching farmer order tracking",
    });
  }
};

/**
 * Get customer order tracking view
 */
exports.getCustomerOrderTracking = async (req, res) => {
  try {
    const { customerId } = req.params;

    const orders = await Order.find({ customerId: customerId }).select(
      "orderId trackingStatus timeline deliveryCompletedTime estimatedDeliveryTime createdAt"
    );

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log("Get Customer Order Tracking Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching customer order tracking",
    });
  }
};

/**
 * Get all orders for admin (with all statuses)
 */
exports.getAllOrdersTracking = async (req, res) => {
  try {
    const { limit = 10, skip = 0 } = req.query;

    const orders = await Order.find()
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments();

    return res.status(200).json({
      success: true,
      total: total,
      data: orders,
    });
  } catch (error) {
    console.log("Get All Orders Tracking Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
};
