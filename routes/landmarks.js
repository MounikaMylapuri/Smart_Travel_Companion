const express = require("express");
const axios = require("axios");
const router = express.Router();
const Landmark = require("../models/Landmark"); // Import our new model

// You will need to get your Unsplash Access Key.
// Store this in your .env file!
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Helper function to fetch an image
const fetchImage = async (query) => {
  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query: query,
        per_page: 1,
        orientation: "landscape",
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });
    // Return the URL of the "small" version of the first image
    return response.data.results[0]?.urls?.small || null;
  } catch (error) {
    console.error("Unsplash API error:", error.message);
    return null; // Return null if image fetch fails
  }
};

// @route   GET /api/landmarks
// @desc    Get landmarks for a specific city
// @access  Private
router.get("/", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res
      .status(400)
      .json({ message: "City query parameter is required" });
  }

  try {
    // 1. Find landmarks in our database for the matching city
    const landmarksFromDB = await Landmark.find({
      city: city.toLowerCase(),
    }).limit(10); // Limit to 10 for now

    if (!landmarksFromDB.length) {
      return res.json([]); // Send empty array if no landmarks are found
    }

    // 2. Fetch images for each landmark
    // We do this in parallel for speed
    const landmarksWithImages = await Promise.all(
      landmarksFromDB.map(async (landmark) => {
        const imageUrl = await fetchImage(landmark.imageQuery);
        return {
          _id: landmark._id,
          name: landmark.name,
          description: landmark.description,
          category: landmark.category,
          imageUrl: imageUrl,
        };
      })
    );

    res.json(landmarksWithImages);
  } catch (error) {
    console.error("Landmark route error:", error.message);
    res.status(500).json({ message: "Server error fetching landmarks" });
  }
});

module.exports = router;
