// backend/controllers/priceController.js
const pricePrediction = require("../utils/pricePrediction");
const PriceHistory = require("../Models/priceHistoryModel");

/**
 * Get price prediction
 */
exports.getPricePrediction = async (req, res) => {
  try {
    const { cropName } = req.params;

    if (!cropName) {
      return res.status(400).json({
        success: false,
        message: "Crop name is required",
      });
    }

    const prediction = await pricePrediction.predictPrice(cropName);

    return res.status(200).json({
      success: true,
      data: prediction,
    });
  } catch (error) {
    console.log("Price Prediction Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching price prediction",
    });
  }
};

/**
 * Get price recommendation
 */
exports.getPriceRecommendation = async (req, res) => {
  try {
    const { cropName } = req.params;

    if (!cropName) {
      return res.status(400).json({
        success: false,
        message: "Crop name is required",
      });
    }

    const recommendation = await pricePrediction.getPriceRecommendation(cropName);

    return res.status(200).json({
      success: true,
      data: recommendation,
    });
  } catch (error) {
    console.log("Price Recommendation Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching price recommendation",
    });
  }
};

/**
 * Get historical prices
 */
exports.getHistoricalPrices = async (req, res) => {
  try {
    const { cropName } = req.params;
    const { days = 30 } = req.query;

    if (!cropName) {
      return res.status(400).json({
        success: false,
        message: "Crop name is required",
      });
    }

    const prices = await pricePrediction.getHistoricalPrices(cropName, parseInt(days));

    return res.status(200).json({
      success: true,
      count: prices.length,
      data: prices,
    });
  } catch (error) {
    console.log("Historical Prices Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching historical prices",
    });
  }
};

/**
 * Get current market price
 */
exports.getCurrentMarketPrice = async (req, res) => {
  try {
    const { cropName } = req.params;

    if (!cropName) {
      return res.status(400).json({
        success: false,
        message: "Crop name is required",
      });
    }

    const priceData = await PriceHistory.findOne({ cropName: cropName }).sort({ date: -1 });

    if (!priceData) {
      return res.status(404).json({
        success: false,
        message: "Price data not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: priceData,
    });
  } catch (error) {
    console.log("Current Market Price Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching market price",
    });
  }
};

/**
 * Add price data (Admin)
 */
exports.addPriceData = async (req, res) => {
  try {
    const { cropName, cropCategory, currentPrice, minPrice, maxPrice, avgPrice, demandLevel, marketName, region } = req.body;

    const priceData = new PriceHistory({
      cropName,
      cropCategory,
      date: new Date(),
      currentPrice,
      minPrice,
      maxPrice,
      avgPrice,
      demandLevel,
      marketName,
      region,
      source: "mandi",
      dataQuality: "verified",
    });

    await priceData.save();

    return res.status(201).json({
      success: true,
      message: "Price data added successfully",
      data: priceData,
    });
  } catch (error) {
    console.log("Add Price Data Error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding price data",
    });
  }
};
