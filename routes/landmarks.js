const express = require("express");
const axios = require("axios");
const router = express.Router();
const Landmark = require("../models/Landmark");

// Ensure this key is available in your .env file
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Helper function to fetch an image from Unsplash
const fetchImage = async (query) => {
  if (!UNSPLASH_ACCESS_KEY) {
    console.error("UNSPLASH_ACCESS_KEY is not defined. Image fetch skipped.");
    return null;
  }

  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query: query, per_page: 1, orientation: "landscape" },
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
    });
    // Return the small image URL, or null if no results
    return response.data.results[0]?.urls?.small || null;
  } catch (error) {
    console.error(`Unsplash API error for query "${query}":`, error.message);
    // Return a placeholder or null on API failure
    return null;
  }
};

// @route   GET /api/landmarks
// @desc    Fetch all landmarks, optionally filtered by city or country
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { city, country } = req.query;
    let filter = {};

    if (city) {
      filter.city = city.toLowerCase();
    }
    if (country) {
      filter.country = country.toLowerCase();
    }

    // Fetch landmarks from the database
    const landmarks = await Landmark.find(filter).lean();

    // Check if any landmarks are missing an imageUrl and try to fetch it
    const updatedLandmarks = await Promise.all(
      landmarks.map(async (landmark) => {
        // If imageUrl is missing or null, try to fetch it using imageQuery
        if (!landmark.imageUrl) {
          console.log(`Fetching missing image for: ${landmark.name}`);
          const newImageUrl = await fetchImage(
            landmark.imageQuery || landmark.name
          );

          if (newImageUrl) {
            // Update the database record in the background (fire and forget)
            Landmark.findByIdAndUpdate(landmark._id, { imageUrl: newImageUrl })
              .exec()
              .catch((err) =>
                console.error("Background image URL update failed:", err)
              );

            // Return the landmark object with the new URL for the current request
            return { ...landmark, imageUrl: newImageUrl };
          }
        }
        return landmark;
      })
    );

    res.json(updatedLandmarks);
  } catch (error) {
    console.error("Landmark fetch error:", error.message);
    res.status(500).json({ message: "Server error fetching landmarks" });
  }
});

// --- ADMIN ROUTES ---

// @route   POST /api/landmarks
// @desc    Admin: Create a new landmark
// @access  Protected (Requires Admin Authentication in production)
router.post("/", async (req, res) => {
  const { city, country, name, description, category, imageQuery } = req.body;

  if (!city || !name) {
    return res
      .status(400)
      .json({ message: "Missing required fields: city, name" });
  }

  try {
    // Fetch image immediately upon creation using the query or name
    const imageUrl = await fetchImage(imageQuery || name);

    const newLandmark = new Landmark({
      city: city.toLowerCase(),
      country: country.toLowerCase(),
      name,
      description,
      category,
      imageQuery,
      imageUrl, // Store the fetched image URL (or null if failed/missing key)
    });

    const landmark = await newLandmark.save();
    res.status(201).json(landmark);
  } catch (error) {
    console.error("Landmark creation error:", error.message);
    res.status(500).json({ message: "Server error creating landmark" });
  }
});

// @route   PUT /api/landmarks/:id
// @desc    Admin: Update an existing landmark
// @access  Protected
router.put("/:id", async (req, res) => {
  const { city, country, imageQuery } = req.body;
  const updates = { ...req.body };

  try {
    // Standardize city/country casing if provided
    if (city) updates.city = city.toLowerCase();
    if (country) updates.country = country.toLowerCase();

    // If the admin changes the image query, fetch a new image
    if (imageQuery) {
      updates.imageUrl = await fetchImage(imageQuery);
    }

    const landmark = await Landmark.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!landmark) {
      return res.status(404).json({ message: "Landmark not found" });
    }

    res.json(landmark);
  } catch (error) {
    console.error("Landmark update error:", error.message);
    res.status(500).json({ message: "Server error updating landmark" });
  }
});

// @route   DELETE /api/landmarks/:id
// @desc    Admin: Delete a landmark
// @access  Protected
router.delete("/:id", async (req, res) => {
  try {
    const landmark = await Landmark.findByIdAndDelete(req.params.id);
    if (!landmark) {
      return res.status(404).json({ message: "Landmark not found" });
    }
    res.json({ message: "Landmark removed successfully" });
  } catch (error) {
    console.error("Landmark delete error:", error.message);
    res.status(500).json({ message: "Server error deleting landmark" });
  }
});

module.exports = router;
