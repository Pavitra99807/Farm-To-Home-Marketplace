// backend/Routes/weatherRoutes.js
const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");

// Get current weather
router.post("/current", weatherController.getCurrentWeather);

// Get weather forecast
router.post("/forecast", weatherController.getWeatherForecast);

// Get agricultural advisory
router.post("/advisory", weatherController.getAgriculturalAdvisory);

module.exports = router;
