const express = require("express");
const router = express.Router();
const ChecklistTemplate = require("../models/ChecklistTemplate"); // Make sure path is correct
const axios = require("axios"); // Though not used directly, good practice if fetching weather

// Helper map for basic city types
const cityTypeMap = {
  japan: "urban",
  france: "urban",
  brazil: "tropical",
  australia: "tropical",
  usa: "urban",
  uk: "urban",
  // Add more as needed
};

// @route   GET /api/checklist
// @desc    Generates a weather-aware packing checklist (REQ_02)
// @access  Private
router.get("/", async (req, res) => {
  // We get these values from the frontend's PackingListWidget
  const { city, country, avgTempMax, isRainy } = req.query;

  if (!city || !avgTempMax || !country) {
    return res.status(400).json({
      message: "Missing required parameters for checklist generation",
    });
  }

  try {
    const avgTemp = parseFloat(avgTempMax);

    // 1. Determine the template keys
    const cityType = cityTypeMap[country.toLowerCase()] || "urban";
    let weatherCondition = "mild";

    if (avgTemp >= 28) weatherCondition = "hot";
    else if (avgTemp <= 10) weatherCondition = "cold";

    // 2. Find the template in the database
    const template = await ChecklistTemplate.findOne({
      cityType: cityType,
      weatherCondition: weatherCondition,
    });

    // 3. Handle Template Not Found (Return empty list with message)
    if (!template) {
      return res.json({
        message: `Template not found for ${cityType}/${weatherCondition}.`,
        items: [],
      });
    }

    // 4. Success: Return the list of items
    res.json(template.items);
  } catch (error) {
    console.error("Checklist route error:", error.message);
    // This 500 error will trigger the Alert in your frontend
    res.status(500).json({ message: "Server error generating checklist" });
  }
});

module.exports = router;
