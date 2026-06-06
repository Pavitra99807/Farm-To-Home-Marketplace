const User = require("../Models/userModel");
const Product = require("../Models/productModel");
const Order = require("../Models/orderModel");

const dashboardStats = async (req, res) => {
  try {
    const users = await User.countDocuments({
      role: "user",
    });

    const farmers = await User.countDocuments({
      role: "farmer",
    });

    const products = await Product.countDocuments();

    const orders = await Order.countDocuments();

    res.json({
      success: true,
      users,
      farmers,
      products,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "user",
    }).select("-password");

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllFarmers = async (req, res) => {
  try {
    const farmers = await User.find({
      role: "farmer",
    }).select("-password");

    res.json({
      success: true,
      farmers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const freezeFarmer = async (req, res) => {
  try {

    const farmer = await User.findById(
      req.params.id
    );

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    farmer.isFrozen = !farmer.isFrozen;

    await farmer.save();

    res.json({
      success: true,
      message: farmer.isFrozen
        ? "Farmer Frozen"
        : "Farmer Activated",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const deleteFarmer = async (req, res) => {
  try {

    await User.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "Farmer deleted",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const FarmerProduct = require("../Models/farmerProductModel");

const getFarmerDetails = async (req, res) => {
  try {

    const farmer = await User.findById(
      req.params.id
    ).select("-password");

    const products =
      await FarmerProduct.find({
        farmerId: req.params.id,
      });

    res.json({
      success: true,
      farmer,
      products,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
const freezeUser = async (req, res) => {
  try {

    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isFrozen = !user.isFrozen;

    await user.save();

    res.json({
      success: true,
      isFrozen: user.isFrozen,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const deleteUser = async (req, res) => {
  try {

    await User.findByIdAndDelete(
      req.params.id
    );

    res.json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  dashboardStats,
  getAllUsers,
  getAllFarmers,
  freezeUser,
  deleteUser,
  getFarmerDetails,
  deleteFarmer,
  freezeFarmer,
};