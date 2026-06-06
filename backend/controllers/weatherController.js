// backend/controllers/weatherController.js
const weatherService = require("../utils/weatherService");

/**
 * Get current weather
 */
exports.getCurrentWeather = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Coordinates are required",
      });
    }

    const weather = await weatherService.getCurrentWeather(latitude, longitude);

   return res.status(200).json(weather);
  } catch (error) {
    console.log("Get Current Weather Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching weather data",
    });
  }
};

/**
 * Get weather forecast
 */
exports.getWeatherForecast = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Coordinates are required",
      });
    }

    const forecast = await weatherService.getWeatherForecast(latitude, longitude);

    return res.status(200).json(forecast);
  } catch (error) {
    console.log("Get Weather Forecast Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching weather forecast",
    });
  }
};

/**
 * Get agricultural advisory
 */
exports.getAgriculturalAdvisory = async (req, res) => {
  try {
    const { latitude, longitude, cropType } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Coordinates are required",
      });
    }

    const advisory = await weatherService.getAgriculturalAdvisory(
      latitude,
      longitude,
      cropType || "general"
    );

    return res.status(200).json({
      success: true,
      data: advisory,
    });
  } catch (error) {
    console.log("Get Agricultural Advisory Error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating advisory",
    });
  }
};
