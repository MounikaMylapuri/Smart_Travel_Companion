import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Define the JWT Secret outside the handler for efficiency
const JWT_SECRET = process.env.JWT_SECRET || "your_fallback_secret";

// --- POST /api/auth/register ---
router.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  const actualName = fullName;

  if (!actualName || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please enter all required fields." });
  }

  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }

    // Check JWT Secret availability before creating user (Best Practice)
    if (!process.env.JWT_SECRET) {
      console.error(
        "FATAL JWT ERROR: JWT_SECRET environment variable is not set."
      );
      throw new Error("Server configuration error: JWT secret is missing.");
    } // Pass the PLAIN password; pre('save') hook handles hashing

    const newUser = new User({
      name: actualName,
      email,
      password: password,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id },
      JWT_SECRET, // Use the reliable variable
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error during registration." });
  }
});

// --- POST /api/auth/login ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Please provide email and password." });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password." });

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password." });

    // Final JWT check before signing
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT secret not configured on the server.");
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error during login." });
  }
});

// --- GET /api/auth/profile ---
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Profile error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// --- PUT /api/auth/profile ---
router.put("/profile", auth, async (req, res) => {
  const { name, email, avatar } = req.body;
  
  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;
    
    await user.save();
    
    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error("Profile update error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
