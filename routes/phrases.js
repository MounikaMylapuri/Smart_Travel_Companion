const express = require("express");
const router = express.Router();
const Phrase = require("../models/phrase");

// @route   GET /api/phrases
// @desc    Get phrases for a specific language
// @access  Private
router.get("/", async (req, res) => {
  const { language } = req.query; // e.g., "japanese"

  if (!language) {
    return res
      .status(400)
      .json({ message: "Language query parameter is required" });
  }

  // Language codes for Google TTS
  const langCodeMap = {
    japanese: "ja",
    french: "fr",
    spanish: "es",
    italian: "it",
    hindi: "hi",
    // Add more as needed
  };
  const ttsLangCode = langCodeMap[language.toLowerCase()];

  try {
    const phrasesFromDB = await Phrase.find({
      language: language.toLowerCase(),
    });

    // Dynamically add the Google TTS URL
    const phrases = phrasesFromDB.map((phrase) => {
      let ttsUrl = null;
      if (ttsLangCode) {
        // Create a URL that links to Google's TTS service
        ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${ttsLangCode}&q=${encodeURIComponent(
          phrase.phrase
        )}&client=tw-ob`;
      }

      return {
        _id: phrase._id,
        category: phrase.category,
        phrase: phrase.phrase,
        translation: phrase.translation,
        ttsUrl: ttsUrl, // Add the new URL
      };
    });

    res.json(phrases);
  } catch (error) {
    console.error("Phrase route error:", error.message);
    res.status(500).json({ message: "Server error fetching phrases" });
  }
});

module.exports = router;
