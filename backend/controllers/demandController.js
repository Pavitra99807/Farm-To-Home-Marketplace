// backend/controllers/demandController.js
const demandForecasting = require("../utils/demandForecasting");

/**
 * Get demand by category
 */
exports.getDemandByCategory = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const salesData = await demandForecasting.getSalesDataByCategory(parseInt(days));

    return res.status(200).json({
      success: true,
      data: salesData,
    });
  } catch (error) {
    console.log("Get Demand By Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching demand data",
    });
  }
};

/**
 * Get categorized demand
 */
exports.getCategorizedDemand = async (req, res) => {
  try {
    const demand = await demandForecasting.categorizeDemand();

    return res.status(200).json({
      success: true,
      data: demand,
    });
  } catch (error) {
    console.log("Get Categorized Demand Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching demand categorization",
    });
  }
};

/**
 * Get recommended crops
 */
exports.getRecommendedCrops = async (req, res) => {
  try {
    const recommendations = await demandForecasting.getRecommendedCrops();

    return res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.log("Get Recommended Crops Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching crop recommendations",
    });
  }
};

/**
 * Get demand forecast
 */
exports.getDemandForecast = async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const forecast = await demandForecasting.forecastDemand(parseInt(days));

    return res.status(200).json({
      success: true,
      data: forecast,
    });
  } catch (error) {
    console.log("Get Demand Forecast Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching demand forecast",
    });
  }
};
