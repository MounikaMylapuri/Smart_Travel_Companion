import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// GET /api/weather?city=Tokyo
router.get("/", async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: "City required" });

    const apiKey = process.env.WEATHER_API_KEY;
    console.log("🌦 Fetching weather for:", city);
    console.log("✅ Using API key:", apiKey?.slice(0, 6) + "...");

    // Ensure API key is available
    if (!apiKey)
      return res.status(500).json({ error: "Server missing WEATHER_API_KEY" });

    // Step 1: Geocoding (using OpenWeatherMap Geo API)
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      city
    )}&limit=1&appid=${apiKey}`;

    const geoResponse = await axios.get(geoUrl);
    const geoData = geoResponse.data;
    if (!geoData || geoData.length === 0)
      return res.status(404).json({ error: "City not found" });

    const { lat, lon } = geoData[0];

    // Step 2: Forecast (5-day / 3-hour steps)
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastResponse = await axios.get(forecastUrl);
    const forecastData = forecastResponse.data;

    if (!forecastData.list) {
      return res.status(500).json({ error: "Weather data unavailable" });
    }

    // 🛠️ Step 3: Correctly Group by date and calculate Daily Max/Min
    const dailySummary = {};
    let firstWeather = null;

    forecastData.list.forEach((item, index) => {
      const date = item.dt_txt.split(" ")[0]; // e.g., "2025-11-01"
      const temp = item.main.temp;

      // Capture the first weather entry for overall icon/description
      if (index === 0) {
        firstWeather = item.weather[0];
      }

      if (!dailySummary[date]) {
        // Initialize for a new day
        dailySummary[date] = {
          max: temp,
          min: temp,
          // Store weather codes/descriptions for daily representation if needed
          weather: item.weather[0],
        };
      } else {
        // Update min/max for the existing day
        dailySummary[date].max = Math.max(dailySummary[date].max, temp);
        dailySummary[date].min = Math.min(dailySummary[date].min, temp);

        // You might choose to update weather based on the 12:00:00 entry or the most extreme code
        // For simplicity, we stick to the first entry's icon/desc for the overall summary.
      }
    });

    const temperature_2m_max = Object.values(dailySummary).map((d) => d.max);
    const temperature_2m_min = Object.values(dailySummary).map((d) => d.min);
    const time = Object.keys(dailySummary);

    // 🛠️ Step 4: Send Formatted Response with correct structure
    const weatherIcon = `https://openweathermap.org/img/wn/${firstWeather.icon}@2x.png`;
    const weatherDesc = firstWeather.description;

    res.json({
      weather: {
        time: time,
        temperature_2m_max: temperature_2m_max,
        temperature_2m_min: temperature_2m_min, // Added min temp
        // Note: weathercode and daily icon would require more complex grouping logic.
      },
      summary: {
        icon: weatherIcon,
        description: weatherDesc,
      },
      timezone: {
        name: forecastData.city.name,
        country: forecastData.city.country,
        utc_offset_seconds: forecastData.city.timezone,
      },
    });
  } catch (err) {
    console.error("Weather API Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
