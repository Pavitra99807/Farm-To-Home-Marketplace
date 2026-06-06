// backend/utils/demandForecasting.js
const Order = require("../Models/orderModel");

/**
 * Demand Forecasting System
 */

// Get sales data for crops
const getSalesDataByCategory = async (daysBack = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ["completed", "delivered"] },
        },
      },
      {
        $group: {
          _id: "$productCategory",
          totalSales: { $sum: "$quantity" },
          totalRevenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: "$totalAmount" },
        },
      },
      {
        $sort: { totalSales: -1 },
      },
    ]);

    return salesData;
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return [];
  }
};

/**
 * Categorize demand levels
 */
const categorizeDemand = async () => {
  try {
    const salesData = await getSalesDataByCategory();

    if (salesData.length === 0) {
      return {
        highDemand: [],
        mediumDemand: [],
        lowDemand: [],
      };
    }

    const avgSales = salesData.reduce((acc, item) => acc + item.totalSales, 0) / salesData.length;

    const categorized = {
      highDemand: salesData.filter((item) => item.totalSales > avgSales * 1.5).map((item) => ({
        category: item._id,
        sales: item.totalSales,
        revenue: item.totalRevenue,
        growth: calculateGrowth(item.totalSales),
      })),

      mediumDemand: salesData
        .filter((item) => item.totalSales > avgSales * 0.75 && item.totalSales <= avgSales * 1.5)
        .map((item) => ({
          category: item._id,
          sales: item.totalSales,
          revenue: item.totalRevenue,
          growth: calculateGrowth(item.totalSales),
        })),

      lowDemand: salesData.filter((item) => item.totalSales <= avgSales * 0.75).map((item) => ({
        category: item._id,
        sales: item.totalSales,
        revenue: item.totalRevenue,
        growth: calculateGrowth(item.totalSales),
      })),
    };

    return categorized;
  } catch (error) {
    console.error("Demand Categorization Error:", error);
    throw error;
  }
};

/**
 * Calculate growth rate
 */
const calculateGrowth = (currentSales) => {
  // Simplified growth calculation
  return Math.round((Math.random() - 0.3) * 100); // Mock calculation
};

/**
 * Get crop recommendations based on demand
 */
const getRecommendedCrops = async () => {
  try {
    const demand = await categorizeDemand();

    const recommendations = {
      veryHighDemand: demand.highDemand.slice(0, 5),
      stableGrowth: demand.mediumDemand.slice(0, 5),
      emergingCrops: demand.lowDemand.slice(0, 3),
      overallTrends: {
        topPerformer: demand.highDemand[0] || null,
        mostGrowth: demand.highDemand.sort((a, b) => b.growth - a.growth)[0] || null,
      },
    };

    return recommendations;
  } catch (error) {
    console.error("Recommendation Error:", error);
    throw error;
  }
};

/**
 * Forecast demand for next N days
 */
const forecastDemand = async (days = 7) => {
  try {
    const demand = await categorizeDemand();

    const forecast = {
      date: new Date(),
      forecastDays: days,
      predictions: {
        highDemand: demand.highDemand.map((item) => ({
          ...item,
          forecast: item.sales + item.sales * (item.growth / 100),
        })),
        mediumDemand: demand.mediumDemand.map((item) => ({
          ...item,
          forecast: item.sales + item.sales * (item.growth / 100),
        })),
        lowDemand: demand.lowDemand.map((item) => ({
          ...item,
          forecast: item.sales + item.sales * (item.growth / 100),
        })),
      },
    };

    return forecast;
  } catch (error) {
    console.error("Forecast Error:", error);
    throw error;
  }
};

module.exports = {
  getSalesDataByCategory,
  categorizeDemand,
  calculateGrowth,
  getRecommendedCrops,
  forecastDemand,
};
