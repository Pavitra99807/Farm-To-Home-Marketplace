// backend/utils/pricePrediction.js
const PriceHistory = require("../Models/priceHistoryModel");

/**
 * AI Price Prediction using Simple Moving Average & Exponential Smoothing
 */

// Get historical price data
const getHistoricalPrices = async (cropName, days = 30) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const prices = await PriceHistory.find({
      cropName: cropName,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    return prices;
  } catch (error) {
    console.error("Error fetching historical prices:", error);
    return [];
  }
};

/**
 * Calculate Simple Moving Average
 */
const calculateSMA = (prices, period = 7) => {
  if (prices.length < period) return null;

  const sum = prices.slice(-period).reduce((acc, p) => acc + p.currentPrice, 0);
  return sum / period;
};

/**
 * Calculate Exponential Moving Average
 */
const calculateEMA = (prices, period = 7) => {
  if (prices.length === 0) return null;

  const k = 2 / (period + 1);
  let ema = prices[0].currentPrice;

  for (let i = 1; i < prices.length; i++) {
    ema = prices[i].currentPrice * k + ema * (1 - k);
  }

  return ema;
};

/**
 * Simple price trend prediction
 */
const predictPrice = async (cropName, daysAhead = 1) => {
  try {
    const historicalPrices = await getHistoricalPrices(cropName, 60);

    if (historicalPrices.length === 0) {
      return { error: "No historical data available" };
    }

    const recentPrices = historicalPrices.slice(-30);
    const priceArray = recentPrices.map((p) => p.currentPrice);

    // Calculate trend
    const sma7 = calculateSMA(historicalPrices, 7);
    const sma14 = calculateSMA(historicalPrices, 14);
    const ema7 = calculateEMA(historicalPrices, 7);

    const currentPrice = historicalPrices[historicalPrices.length - 1].currentPrice;
    const avgPrice = priceArray.reduce((a, b) => a + b, 0) / priceArray.length;
    const volatility = calculateVolatility(priceArray);

    // Simple prediction logic
    let predictedPrice = currentPrice;

    if (sma7 > sma14) {
      // Uptrend
      predictedPrice = currentPrice * (1 + volatility / 100);
    } else if (sma7 < sma14) {
      // Downtrend
      predictedPrice = currentPrice * (1 - volatility / 100);
    }

    // Generate predictions for multiple days
    const predictions = {
      cropName,
      currentPrice,
      avgPrice: Math.round(avgPrice),
      sma7: Math.round(sma7),
      sma14: Math.round(sma14),
      ema7: Math.round(ema7),
      trend: sma7 > sma14 ? "uptrend" : sma7 < sma14 ? "downtrend" : "stable",
      volatility: Math.round(volatility * 100) / 100,
      predictions: {
        tomorrow: Math.round(predictedPrice),
        threeDays: Math.round(predictedPrice * (1 + (volatility / 100) * 0.5)),
        sevenDays: Math.round(predictedPrice * (1 + (volatility / 100) * 1.2)),
      },
      confidence: calculateConfidence(volatility),
      lastUpdate: historicalPrices[historicalPrices.length - 1].date,
    };

    return predictions;
  } catch (error) {
    console.error("Price Prediction Error:", error);
    throw error;
  }
};

/**
 * Calculate price volatility
 */
const calculateVolatility = (prices) => {
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance = prices.reduce((acc, p) => acc + Math.pow(p - mean, 2), 0) / prices.length;
  return Math.sqrt(variance) / mean;
};

/**
 * Calculate prediction confidence
 */
const calculateConfidence = (volatility) => {
  if (volatility < 0.1) return "Very High";
  if (volatility < 0.2) return "High";
  if (volatility < 0.4) return "Medium";
  return "Low";
};

/**
 * Get price recommendation
 */
const getPriceRecommendation = async (cropName) => {
  try {
    const prediction = await predictPrice(cropName);

    if (prediction.error) return prediction;

    let recommendation = "";
    const changePercent = ((prediction.predictions.tomorrow - prediction.currentPrice) / prediction.currentPrice) * 100;

    if (changePercent > 5) {
      recommendation = "Sell Soon - Prices likely to increase";
    } else if (changePercent < -5) {
      recommendation = "Hold - Prices likely to decrease soon";
    } else {
      recommendation = "Neutral - Price expected to remain stable";
    }

    return {
      ...prediction,
      recommendation,
      changePercent: Math.round(changePercent * 100) / 100,
    };
  } catch (error) {
    console.error("Price Recommendation Error:", error);
    throw error;
  }
};

module.exports = {
  getHistoricalPrices,
  calculateSMA,
  calculateEMA,
  predictPrice,
  calculateVolatility,
  calculateConfidence,
  getPriceRecommendation,
};
