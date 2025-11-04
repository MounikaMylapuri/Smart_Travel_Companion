import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: "City required" });

    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing WEATHER_API_KEY in .env" });
    }

    // Current weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${apiKey}`;

    // 5-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${apiKey}`;

    // Fetch both in parallel
    const [currentRes, forecastRes] = await Promise.all([
      axios.get(currentUrl, { timeout: 15000 }),
      axios.get(forecastUrl, { timeout: 15000 }),
    ]);

    const current = currentRes.data;
    const forecast = forecastRes.data.list;

    // Group forecast into daily summaries
    const dailyData = {};
    forecast.forEach((entry) => {
      const date = entry.dt_txt.split(" ")[0];
      if (!dailyData[date]) dailyData[date] = { temps: [], descs: [], icons: [] };
      dailyData[date].temps.push(entry.main.temp);
      dailyData[date].descs.push(entry.weather[0].description);
      dailyData[date].icons.push(entry.weather[0].icon);
    });

    const weather = Object.entries(dailyData).map(([date, val]) => ({
      date,
      min: Math.min(...val.temps).toFixed(1),
      max: Math.max(...val.temps).toFixed(1),
      desc: val.descs[Math.floor(val.descs.length / 2)],
      icon: `https://openweathermap.org/img/wn/${
        val.icons[Math.floor(val.icons.length / 2)]
      }@2x.png`,
    }));

    const utc_offset_seconds = current.timezone;

    res.json({
      current: {
        temp: current.main.temp,
        feels_like: current.main.feels_like,
        description: current.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`,
        city: current.name,
        country: current.sys.country,
        local_time: new Date(Date.now() + utc_offset_seconds * 1000)
          .toISOString()
          .replace("T", " ")
          .slice(0, 16),
      },
      weather,
      timezone: {
        utc_offset_seconds,
        name: current.name,
        country: current.sys.country,
      },
    });
  } catch (err) {
    console.error("Weather API error:", err.message);
    res.status(500).json({ error: "Failed to fetch weather", details: err.message });
  }
});

export default router;
