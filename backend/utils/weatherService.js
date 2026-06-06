// backend/utils/weatherService.js
const axios = require("axios");

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
console.log("1f1430ff19b8340a3fbbe6241309d226 =", WEATHER_API_KEY);
const WEATHER_API_BASE = process.env.WEATHER_API_BASE || "https://api.openweathermap.org/data/2.5";

/**
 * Get current weather for a location
 */
async function getCurrentWeather(latitude, longitude) {
  try {
    const response = await axios.get(`${WEATHER_API_BASE}/weather`, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: WEATHER_API_KEY,
        units: "metric",
      },
    });

    const data = response.data;

    return {
      success: true,
      data: {
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        cloudiness: data.clouds.all,
        rainProbability: data.rain?.["1h"] || 0,
        description: data.weather[0].main,
        icon: data.weather[0].icon,
        sunrise: new Date(data.sys.sunrise * 1000),
        sunset: new Date(data.sys.sunset * 1000),
      },
    };
  } catch (error) {
    console.log("Weather API Error:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get 5-day forecast
 */
async function getForecast(latitude, longitude) {
  try {
    const response = await axios.get(`${WEATHER_API_BASE}/forecast`, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: WEATHER_API_KEY,
        units: "metric",
      },
    });

    const forecast = response.data.list.map((item) => ({
      date: new Date(item.dt * 1000),
      temperature: item.main.temp,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      rainProbability: item.pop * 100,
      description: item.weather[0].main,
    }));

    return {
      success: true,
      data: forecast,
    };
  } catch (error) {
    console.log("Forecast API Error:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

async function getWeatherForecast(latitude, longitude) {
  return getForecast(latitude, longitude);
}

/**
 * Generate agricultural advisory based on weather
 */
function generateAdvisory(weather) {
  const advices = [];
  const alerts = [];

  // Temperature-based advice
  if (weather.temperature > 35) {
    advices.push("🌡️ High temperature detected. Ensure irrigation to prevent crop stress.");
    alerts.push("HIGH_TEMPERATURE");
  } else if (weather.temperature < 10) {
    advices.push("❄️ Low temperature detected. Protect sensitive crops from frost.");
    alerts.push("LOW_TEMPERATURE");
  }

  // Humidity-based advice
  if (weather.humidity > 80) {
    advices.push("💧 High humidity detected. Monitor for fungal diseases and increase ventilation.");
    alerts.push("HIGH_HUMIDITY");
  } else if (weather.humidity < 40) {
    advices.push("🏜️ Low humidity detected. Increase irrigation frequency.");
    alerts.push("LOW_HUMIDITY");
  }

  // Rain-based advice
  if (weather.rainProbability > 70) {
    advices.push("🌧️ Heavy rain expected. Postpone fertilizer application and spraying.");
    alerts.push("RAIN_ALERT");
  } else if (weather.rainProbability > 30) {
    advices.push("💦 Rain expected. Good time for irrigation.");
  }

  // Wind-based advice
  if (weather.windSpeed > 20) {
    advices.push("💨 Strong winds detected. Secure loose items and use windbreaks.");
    alerts.push("WIND_ALERT");
  }

  // Harvest recommendations
  const bestHarvestConditions = {
    tempMin: 15,
    tempMax: 30,
    humidityMin: 50,
    humidityMax: 80,
    rainProbabilityMax: 30,
  };

  const isGoodHarvestTime =
    weather.temperature >= bestHarvestConditions.tempMin &&
    weather.temperature <= bestHarvestConditions.tempMax &&
    weather.humidity >= bestHarvestConditions.humidityMin &&
    weather.humidity <= bestHarvestConditions.humidityMax &&
    weather.rainProbability <= bestHarvestConditions.rainProbabilityMax;

  if (isGoodHarvestTime) {
    advices.push("✅ Excellent conditions for harvesting today!");
  } else {
    advices.push("⏳ Current conditions are not ideal for harvesting. Wait for better weather.");
  }

  // Best selling time (fresh produce should be sold soon after harvest in good weather)
  const goodSellingConditions = isGoodHarvestTime && weather.rainProbability < 20;
  if (goodSellingConditions) {
    advices.push("📊 Good conditions to bring produce to market. High demand expected.");
  }

  return {
    advices: advices,
    alerts: alerts,
    bestHarvestTime: isGoodHarvestTime,
    bestSellingTime: goodSellingConditions,
    weatherScore: calculateWeatherScore(weather),
  };
}

async function getAgriculturalAdvisory(latitude, longitude, cropType = "general") {
  const weatherResult = await getCurrentWeather(latitude, longitude);

  if (!weatherResult.success) {
    return generateAdvisory({
      temperature: 28,
      humidity: 65,
      windSpeed: 8,
      rainProbability: 20,
      cropType,
    });
  }

  return generateAdvisory({
    ...weatherResult.data,
    cropType,
  });
}

/**
 * Calculate weather score (0-100) for agricultural operations
 */
function calculateWeatherScore(weather) {
  let score = 100;

  // Temperature penalty
  if (weather.temperature < 5 || weather.temperature > 40) score -= 30;
  else if (weather.temperature < 10 || weather.temperature > 35) score -= 15;

  // Humidity penalty
  if (weather.humidity < 30 || weather.humidity > 90) score -= 20;

  // Rain penalty
  if (weather.rainProbability > 80) score -= 25;
  else if (weather.rainProbability > 50) score -= 10;

  // Wind penalty
  if (weather.windSpeed > 25) score -= 20;
  else if (weather.windSpeed > 15) score -= 10;

  return Math.max(0, Math.min(100, score));
}

module.exports = {
  getCurrentWeather,
  getWeatherForecast,
  getForecast,
  getAgriculturalAdvisory,
  generateAdvisory,
  calculateWeatherScore,
};
