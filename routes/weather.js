const express = require("express");
const https = require("https");
const router = express.Router();

// Helper function to make https.get requests and parse JSON
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    // --- START OF FIX ---
    // We must parse the URL to create the options object
    const urlParts = new URL(url);

    const options = {
      hostname: urlParts.hostname,
      path: urlParts.pathname + urlParts.search,
      method: "GET",
      // Add headers to mimic a browser request
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
    };
    // --- END OF FIX ---

    // Use https.request with the options object
    const req = https.request(options, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(
          new Error(`HTTPS request failed with status code ${res.statusCode}`)
        );
      }

      let rawData = "";
      res.on("data", (chunk) => {
        rawData += chunk;
      });
      res.on("end", () => {
        try {
          const parsedData = JSON.parse(rawData);
          resolve(parsedData);
        } catch (e) {
          reject(new Error(`Failed to parse JSON response: ${e.message}`));
        }
      });
    });

    req.on("error", (e) => {
      reject(new Error(`HTTPS request error: ${e.message}`));
    });

    // End the request
    req.end();
  });
}

// The rest of your route file is UNCHANGED
router.get("/", async (req, res) => {
  const { city, startDate, endDate } = req.query;

  if (!city || !startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Missing required query parameters" });
  }

  try {
    // 1. Geocode the city
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city
    )}&count=1`;
    const geoResponse = await httpsGet(geoUrl);

    const location = geoResponse.results?.[0];

    if (!location) {
      return res.status(404).json({ message: "City not found" });
    }

    const { latitude, longitude, timezone } = location;

    // 2. Fetch the weather forecast
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const weatherResponse = await httpsGet(weatherUrl);

    // 3. Fetch the timezone data
    const timezoneUrl = `https://worldtimeapi.org/api/timezone/${timezone}`;
    const timezoneResponse = await httpsGet(timezoneUrl);

    // 4. Send back BOTH weather and timezone data
    res.json({
      weather: weatherResponse.daily,
      timezone: timezoneResponse,
    });
  } catch (error) {
    console.error("Native HTTPS route error:", error.message);
    res.status(500).json({ message: "Server error fetching data" });
  }
});

module.exports = router;
