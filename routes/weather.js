const express = require("express");
const axios = require("axios");
const router = express.Router();

// Get the key from environment variables
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Helper to process hourly OWM data into daily max temps
const transformOwmToDaily = (list, startDate) => {
  const dailyData = {};
  const dates = [];

  // Group hourly forecasts by date
  list.forEach((item) => {
    const date = item.dt_txt.substring(0, 10); // Extract YYYY-MM-DD
    if (!dailyData[date]) {
      dailyData[date] = {
        max: -Infinity,
        min: Infinity,
        weathercode: 0,
        count: 0,
      };
      dates.push(date);
    }

    // Calculate daily max and min from 3-hourly forecasts
    dailyData[date].max = Math.max(dailyData[date].max, item.main.temp_max);
    dailyData[date].min = Math.min(dailyData[date].min, item.main.temp_min);

    // Simple heuristic for weather code: use the midday code (or the first one)
    if (item.dt_txt.includes("12:00:00") || dailyData[date].count === 0) {
      // Map OWM's ID to a rough equivalent of Open-Meteo's WMO code (simplified)
      // 800 is Clear, 500-531 is Rain, 600-622 is Snow, 801-804 is Clouds
      dailyData[date].weathercode = item.weather[0].id === 800 ? 0 : 2; // 0=Clear, 2=Cloudy
    }
    dailyData[date].count++;
  });

  // Structure the data to match the frontend's expected format (DailyWeather)
  const times = [];
  const maxTemps = [];
  const minTemps = [];
  const weatherCodes = [];

  // Filter by the requested start date (or later)
  dates
    .filter((d) => d >= startDate)
    .forEach((date) => {
      times.push(date);
      maxTemps.push(dailyData[date].max);
      minTemps.push(dailyData[date].min);
      weatherCodes.push(dailyData[date].weathercode);
    });

  return {
    time: times,
    temperature_2m_max: maxTemps,
    temperature_2m_min: minTemps,
    weathercode: weatherCodes,
  };
};

// @route   GET /api/weather
// @desc    Get weather and timezone (using OpenWeatherMap)
// @access  Private
router.get("/", async (req, res) => {
  const { city, startDate, endDate } = req.query;

  if (!city || !startDate || !endDate || !OPENWEATHER_API_KEY) {
    return res.status(400).json({
      message: "Missing required query parameters or OpenWeather API Key",
    });
  }

  try {
    // 1. Geocode the city (OWM Geocoding)
    const geoResponse = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        city
      )}&limit=1&appid=${OPENWEATHER_API_KEY}`
    );

    const location = geoResponse.data?.[0];

    if (!location) {
      return res
        .status(404)
        .json({ message: "City not found by OpenWeatherMap" });
    }

    const { lat, lon, name } = location;

    // 2. Fetch the 5-day forecast (OWM Forecast)
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    // 3. Transform OWM hourly data into daily structure
    const dailyWeather = transformOwmToDaily(
      weatherResponse.data.list,
      startDate
    );

    // 4. Timezone Lookup (Using external service to get TIMEZONE NAME)
    // This is necessary because OWM only gives offset, but the frontend needs the name (Asia/Tokyo)
    const timezoneLookupResponse = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=your_opencage_key_here&pretty=1&no_annotations=1`
      // NOTE: You will need a simple key from OpenCageData or similar service for this.
    );
    const timezoneName =
      timezoneLookupResponse.data.results?.[0]?.annotations?.timezone?.name ||
      "Asia/Kolkata"; // Default to a known timezone

    // 5. Fetch time details (WorldTimeAPI is less complex than OWM for this)
    const timezoneDetailsResponse = await axios.get(
      `https://worldtimeapi.org/api/timezone/${timezoneName}`
    );

    // 6. Send the combined data
    res.json({
      weather: dailyWeather,
      timezone: timezoneDetailsResponse.data,
    });
  } catch (error) {
    // This catch block handles all three API failures
    console.error("OpenWeatherMap/Timezone API error:", error.message);
    res
      .status(500)
      .json({ message: "Server error fetching weather and time data" });
  }
});

module.exports = router;
