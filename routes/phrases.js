import express from "express";
import Phrase from "../models/phrase.js"; // Assuming Phrase model is in ../models/phrase.js

const router = express.Router();

// @route   GET /api/phrases
// @desc    Fetch common phrases, filterable by language and category.
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { language, category } = req.query;
    let filter = {};

    // Filter by language (MANDATORY for phrase retrieval)
    if (language) {
      filter.language = language.toLowerCase();
    } else {
      // If no language is specified, we cannot return any phrases meaningfully
      return res
        .status(400)
        .json({ message: "Language parameter is required to fetch phrases." });
    }

    // Optional filter by category
    if (category) {
      filter.category = category.toLowerCase();
    }

    const phrases = await Phrase.find(filter).lean();

    if (phrases.length === 0) {
      return res
        .status(404)
        .json({ message: `No phrases found for language: ${language}` });
    }

    res.json(phrases);
  } catch (error) {
    console.error("Phrase fetch error:", error.message);
    res.status(500).json({ message: "Server error fetching phrases" });
  }
});

// @route   POST /api/phrases
// @desc    Admin: Create a new phrase entry
// @access  Protected (Requires Admin Authentication in production)
router.post("/", async (req, res) => {
  const {
    language,
    category,
    originalText,
    translation,
    notes,
    originalLanguage,
  } = req.body;

  if (!language || !originalText || !translation) {
    return res.status(400).json({
      message: "Missing required fields: language, originalText, translation",
    });
  }

  try {
    const newPhrase = new Phrase({
      language: language.toLowerCase(),
      category,
      originalText,
      translation,
      notes,
      originalLanguage: originalLanguage
        ? originalLanguage.toLowerCase()
        : undefined,
    });

    const phrase = await newPhrase.save();
    res.status(201).json(phrase);
  } catch (error) {
    console.error("Phrase creation error:", error.message);
    res.status(500).json({ message: "Server error creating phrase" });
  }
});

// The usual PUT and DELETE admin routes would go here if needed.

export default router;
