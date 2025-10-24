const express = require("express");
const axios = require("axios");
const auth = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/weather/:city
// @desc    Get weather information for a city
// @access  Private
router.get("/:city", auth, async (req, res) => {
  try {
    const { city } = req.params;
    const { days = 5 } = req.query;

    // Using OpenWeatherMap API (you'll need to get an API key)
    const apiKey = process.env.WEATHER_API_KEY || "demo-key";
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);

    // Process the data to get daily forecasts
    const forecasts = response.data.list.reduce((acc, item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          temperature: Math.round(item.main.temp),
          minTemp: Math.round(item.main.temp_min),
          maxTemp: Math.round(item.main.temp_max),
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
          condition: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        };
      }
      return acc;
    }, {});

    const dailyForecasts = Object.values(forecasts).slice(0, days);

    res.json({
      city: response.data.city.name,
      country: response.data.city.country,
      forecasts: dailyForecasts,
    });
  } catch (error) {
    console.error("Weather API error:", error);

    // Fallback data for demo purposes
    const mockWeather = {
      city: req.params.city,
      country: "Demo",
      forecasts: [
        {
          date: new Date().toISOString().split("T")[0],
          temperature: 25,
          minTemp: 20,
          maxTemp: 30,
          humidity: 65,
          windSpeed: 5.2,
          condition: "Clear",
          description: "clear sky",
          icon: "01d",
        },
        {
          date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
          temperature: 23,
          minTemp: 18,
          maxTemp: 28,
          humidity: 70,
          windSpeed: 4.8,
          condition: "Clouds",
          description: "few clouds",
          icon: "02d",
        },
      ],
    };

    res.json(mockWeather);
  }
});

// @route   GET /api/weather/coordinates/:lat/:lon
// @desc    Get weather information by coordinates
// @access  Private
router.get("/coordinates/:lat/:lon", auth, async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const { days = 5 } = req.query;

    const apiKey = process.env.WEATHER_API_KEY || "demo-key";
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);

    const forecasts = response.data.list.reduce((acc, item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          temperature: Math.round(item.main.temp),
          minTemp: Math.round(item.main.temp_min),
          maxTemp: Math.round(item.main.temp_max),
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
          condition: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        };
      }
      return acc;
    }, {});

    const dailyForecasts = Object.values(forecasts).slice(0, days);

    res.json({
      city: response.data.city.name,
      country: response.data.city.country,
      coordinates: { lat: parseFloat(lat), lon: parseFloat(lon) },
      forecasts: dailyForecasts,
    });
  } catch (error) {
    console.error("Weather coordinates API error:", error);
    res.status(500).json({ message: "Weather service unavailable" });
  }
});

module.exports = router;
