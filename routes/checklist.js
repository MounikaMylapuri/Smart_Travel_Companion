const express = require("express");
const router = express.Router();
const ChecklistTemplate = require("../models/ChecklistTemplate");
const axios = require("axios");

// Helper map for basic city types
const cityTypeMap = {
  japan: "urban",
  france: "urban",
  brazil: "tropical",
  australia: "tropical",
  usa: "urban",
  uk: "urban",
  india: "urban", // Added India for completeness
  // Note: The Admin should ideally manage this mapping!
};

// @route   GET /api/checklist
// @desc    Generates a weather-aware packing checklist (REQ_02)
// @access  Private
router.get("/", async (req, res) => {
  // We expect these values as strings from the frontend
  const { city, country, avgTempMax, isRainy } = req.query;

  if (!city || !avgTempMax || !country) {
    return res.status(400).json({
      message: "Missing required parameters for checklist generation",
    });
  }

  try {
    const avgTemp = parseFloat(avgTempMax);

    // 1. Determine the template keys
    // Use optional chaining and default to prevent crash if country is undefined/null
    const countryLower = (country || "").toLowerCase();
    const cityType = cityTypeMap[countryLower] || "urban"; // Default to 'urban'

    let weatherCondition = "mild";

    if (avgTemp >= 28) weatherCondition = "hot";
    else if (avgTemp <= 10) weatherCondition = "cold";
    // Note: isRainy logic can be added here, but for simplicity, we rely on temperature

    // 2. Find the template in the database
    const template = await ChecklistTemplate.findOne({
      cityType: cityType,
      weatherCondition: weatherCondition,
    });

    // 3. Handle Template Not Found (Return empty list with a message)
    if (!template) {
      return res.json({
        message: `Template not found for ${cityType}/${weatherCondition}. Please add more templates.`,
        items: [],
      });
    }

    // 4. Success: Return the list of items
    res.json(template.items);
  } catch (error) {
    // This will now catch any Mongoose/DB error and send the 500 status to the client
    console.error("Checklist route error:", error.message);
    res.status(500).json({
      message: "Server error generating checklist. Check server logs.",
    });
  }
});

module.exports = router;
