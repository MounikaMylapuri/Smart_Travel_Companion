const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PhraseSchema = new Schema({
  language: {
    type: String, // e.g., "japanese", "french"
    required: true,
    lowercase: true,
    index: true,
  },
  category: {
    type: String, // e.g., "greetings", "dining", "emergency"
    required: true,
    lowercase: true,
  },
  phrase: {
    type: String,
    required: true,
  },
  translation: {
    type: String,
    required: true,
  },
  // We'll use Google Translate's text-to-speech URL
  // This lets us generate audio dynamically without storing files
  ttsUrl: {
    type: String,
  },
});

module.exports = mongoose.model("Phrase", PhraseSchema);
