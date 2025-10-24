const mongoose = require("mongoose");
const User = require("./models/User");
const Trip = require("./models/Trip");
const Itinerary = require("./models/Itinerary");

// Test database connection and models
async function testDatabase() {
  try {
    console.log("🔍 Testing database connection...");

    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/smart-travel-companion",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("✅ Database connected successfully");

    // Test User model
    console.log("🔍 Testing User model...");
    const userCount = await User.countDocuments();
    console.log(`✅ User model working. Total users: ${userCount}`);

    // Test Trip model
    console.log("🔍 Testing Trip model...");
    const tripCount = await Trip.countDocuments();
    console.log(`✅ Trip model working. Total trips: ${tripCount}`);

    // Test Itinerary model
    console.log("🔍 Testing Itinerary model...");
    const itineraryCount = await Itinerary.countDocuments();
    console.log(
      `✅ Itinerary model working. Total itineraries: ${itineraryCount}`
    );

    console.log("🎉 All database tests passed!");
  } catch (error) {
    console.error("❌ Database test failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Database disconnected");
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  require("dotenv").config();
  testDatabase();
}

module.exports = testDatabase;
