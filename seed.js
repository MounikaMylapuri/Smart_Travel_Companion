const ChecklistTemplate = require("./models/ChecklistTemplate");
const mongoose = require("mongoose");
const Landmark = require("./models/Landmark");
const Phrase = require("./models/phrase"); // Adjust path if your model is elsewhere
require("dotenv").config(); // To get your DB connection string

// Your landmark data from above
const landmarks = [
  {
    city: "tokyo",
    country: "japan",
    name: "Tokyo Tower",
    description:
      "A communications and observation tower in the Shiba-koen district of Minato.",
    category: "cultural",
    imageQuery: "Tokyo Tower",
  },
  {
    city: "tokyo",
    country: "japan",
    name: "Senso-ji Temple",
    description:
      "An ancient Buddhist temple located in Asakusa, it is Tokyo's oldest temple.",
    category: "historical",
    imageQuery: "Senso-ji Temple Asakusa",
  },
  {
    city: "paris",
    country: "france",
    name: "Eiffel Tower",
    description:
      "Wrought-iron lattice tower on the Champ de Mars, a global cultural icon of France.",
    category: "cultural",
    imageQuery: "Eiffel Tower",
  },
  {
    city: "paris",
    country: "france",
    name: "Louvre Museum",
    description:
      "The world's largest art museum and a historic monument in Paris.",
    category: "historical",
    imageQuery: "Louvre Museum",
  },
  {
    city: "new york",
    country: "usa",
    name: "Statue of Liberty",
    description:
      "A colossal neoclassical sculpture on Liberty Island in New York Harbor.",
    category: "historical",
    imageQuery: "Statue of Liberty",
  },
  {
    city: "new york",
    country: "usa",
    name: "Central Park",
    description:
      "An urban park in Manhattan, providing a green oasis in the middle of the city.",
    category: "natural",
    imageQuery: "Central Park New York",
  },
  {
    city: "london",
    country: "uk",
    name: "Tower of London",
    description:
      "A historic castle on the north bank of the River Thames, home to the Crown Jewels.",
    category: "historical",
    imageQuery: "Tower of London",
  },
  {
    city: "rome",
    country: "italy",
    name: "Colosseum",
    description:
      "An oval amphitheater in the center of the city, the largest ancient amphitheater ever built.",
    category: "historical",
    imageQuery: "Colosseum Rome",
  },
  {
    city: "sydney",
    country: "australia",
    name: "Sydney Opera House",
    description:
      "A multi-venue performing arts centre at Sydney Harbour, a masterpiece of 20th-century architecture.",
    category: "cultural",
    imageQuery: "Sydney Opera House",
  },
  {
    city: "sydney",
    country: "australia",
    name: "Bondi Beach",
    description:
      "A popular beach known for its reliable surf and golden sands.",
    category: "natural",
    imageQuery: "Bondi Beach",
  },
  {
    city: "cairo",
    country: "egypt",
    name: "Pyramids of Giza",
    description:
      "The complex of ancient monuments, including three pyramid complexes and the Great Sphinx.",
    category: "historical",
    imageQuery: "Pyramids of Giza",
  },
  {
    city: "rio de janeiro",
    country: "brazil",
    name: "Christ the Redeemer",
    description:
      "An Art Deco statue of Jesus Christ, located at the peak of Corcovado mountain.",
    category: "cultural",
    imageQuery: "Christ the Redeemer Rio",
  },
  {
    city: "agra",
    country: "india",
    name: "Taj Mahal",
    description:
      "An ivory-white marble mausoleum on the south bank of the Yamuna river.",
    category: "historical",
    imageQuery: "Taj Mahal",
  },
  {
    city: "beijing",
    country: "china",
    name: "Great Wall of China",
    description:
      "A series of fortifications built to protect the Chinese states and empires.",
    category: "historical",
    imageQuery: "Great Wall of China Mutianyu",
  },
  {
    city: "san francisco",
    country: "usa",
    name: "Golden Gate Bridge",
    description:
      "A suspension bridge spanning the Golden Gate, the one-mile-wide strait connecting San Francisco Bay and the Pacific Ocean.",
    category: "cultural",
    imageQuery: "Golden Gate Bridge",
  },
  // ... (Feel free to copy/paste the rest of the 25 from the list above)
];

const phrases = [
  {
    language: "japanese",
    category: "greetings",
    phrase: "おはようございます",
    translation: "Good morning",
  },
  {
    language: "japanese",
    category: "greetings",
    phrase: "こんにちは",
    translation: "Hello / Good afternoon",
  },
  {
    language: "japanese",
    category: "greetings",
    phrase: "こんばんは",
    translation: "Good evening",
  },
  {
    language: "japanese",
    category: "greetings",
    phrase: "ありがとうございます",
    translation: "Thank you",
  },
  {
    language: "japanese",
    category: "greetings",
    phrase: "すみません",
    translation: "Excuse me / Sorry",
  },
  {
    language: "japanese",
    category: "dining",
    phrase: "お水ください",
    translation: "Water, please",
  },
  {
    language: "japanese",
    category: "dining",
    phrase: "メニューください",
    translation: "Menu, please",
  },
  {
    language: "japanese",
    category: "dining",
    phrase: "これは何ですか",
    translation: "What is this?",
  },
  {
    language: "japanese",
    category: "dining",
    phrase: "お会計お願いします",
    translation: "The check, please",
  },
  {
    language: "japanese",
    category: "emergency",
    phrase: "助けてください",
    translation: "Help!",
  },
  {
    language: "japanese",
    category: "emergency",
    phrase: "警察",
    translation: "Police",
  },
  {
    language: "japanese",
    category: "emergency",
    phrase: "病院はどこですか",
    translation: "Where is the hospital?",
  },
];

// --- CHECKLIST TEMPLATES ---
const checklistTemplates = [
  {
    cityType: "urban",
    weatherCondition: "hot",
    items: [
      { name: "Sunglasses", category: "essentials", required: true },
      { name: "Sunscreen", category: "essentials", required: true },
      { name: "Light T-Shirts (x3)", category: "clothing", required: false },
      { name: "Water Bottle", category: "gear", required: true },
      { name: "Light Jacket", category: "clothing", required: false },
    ],
  },
  {
    cityType: "urban",
    weatherCondition: "cold",
    items: [
      { name: "Winter Coat", category: "clothing", required: true },
      { name: "Gloves", category: "clothing", required: true },
      { name: "Scarf", category: "clothing", required: true },
      { name: "Thick Socks (x5)", category: "clothing", required: false },
      { name: "Lip Balm", category: "essentials", required: false },
    ],
  },
  {
    cityType: "tropical",
    weatherCondition: "hot",
    items: [
      { name: "Swimsuit", category: "clothing", required: true },
      { name: "Insect Repellent", category: "essentials", required: true },
      { name: "Sandals", category: "clothing", required: false },
      { name: "Rain Poncho", category: "gear", required: false },
    ],
  },
  // Add a basic default template (if you want one for conditions not covered)
  {
    cityType: "urban",
    weatherCondition: "mild",
    items: [
      { name: "Comfortable Shoes", category: "essentials", required: true },
      { name: "Camera", category: "gear", required: false },
    ],
  },
];
// ----------------------------

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // ... (Landmark and Phrase seeding blocks are here) ...

    // --- NEW: Seed Checklist Templates ---
    await ChecklistTemplate.deleteMany({});
    console.log("Cleared existing checklist templates.");
    await ChecklistTemplate.insertMany(checklistTemplates);
    console.log(
      `Successfully seeded ${checklistTemplates.length} new checklist templates!`
    );
    // -------------------------------------
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
};

seedDB();
