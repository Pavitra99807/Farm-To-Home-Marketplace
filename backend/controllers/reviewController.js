// backend/controllers/reviewController.js
const Review = require("../Models/reviewModel");
const Order = require("../Models/orderModel");

/**
 * Add review
 */
exports.addReview = async (req, res) => {
  try {
    const { orderId, customerId, farmerId, productRating, productReview, farmerRating, farmerReview, images } = req.body;

    // Check if order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ orderId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Review already exists for this order",
      });
    }

    const review = new Review({
      orderId,
      customerId,
      farmerId,
      productRating,
      productReview,
      farmerRating,
      farmerReview,
      images,
      isApproved: false,
    });

    await review.save();

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error) {
    console.log("Add Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding review",
    });
  }
};

/**
 * Approve review (Admin)
 */
exports.approveReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        isApproved: true,
        modApprovedAt: new Date(),
        modApprovedBy: req.user._id,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Review approved",
      data: review,
    });
  } catch (error) {
    console.log("Approve Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Error approving review",
    });
  }
};

/**
 * Get reviews by farmer
 */
exports.getReviewsByFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { limit = 10, skip = 0 } = req.query;

    const reviews = await Review.find({
      farmerId: farmerId,
      isApproved: true,
    })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({
      farmerId: farmerId,
      isApproved: true,
    });

    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.farmerRating, 0) / reviews.length : 0;

    return res.status(200).json({
      success: true,
      total,
      avgRating: parseFloat(avgRating.toFixed(2)),
      data: reviews,
    });
  } catch (error) {
    console.log("Get Reviews By Farmer Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
    });
  }
};

/**
 * Get reviews by product
 */
exports.getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 10, skip = 0 } = req.query;

    const reviews = await Review.find({
      isApproved: true,
    })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ isApproved: true });

    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.productRating, 0) / reviews.length : 0;

    return res.status(200).json({
      success: true,
      total,
      avgRating: parseFloat(avgRating.toFixed(2)),
      data: reviews,
    });
  } catch (error) {
    console.log("Get Reviews By Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
    });
  }
};

/**
 * Report review
 */
exports.reportReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        isReported: true,
        reportReason: reason,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Review reported",
      data: review,
    });
  } catch (error) {
    console.log("Report Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Error reporting review",
    });
  }
};

/**
 * Mark review as helpful
 */
exports.markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { helpful } = req.body;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        $inc: {
          helpfulCount: helpful ? 1 : 0,
          unhelpfulCount: !helpful ? 1 : 0,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Review marked",
      data: review,
    });
  } catch (error) {
    console.log("Mark Helpful Error:", error);
    res.status(500).json({
      success: false,
      message: "Error marking review",
    });
  }
};
