import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../models/User.js"; // Corrected relative path assumption

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
    console.error("Registration error:", (error as any).message);

    if ((error as any).name === "ValidationError") {
      return res.status(400).json({ message: (error as any).message });
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
    // Use 'as any' to satisfy TypeScript regarding the custom method
    const user = (await User.findOne({ email })) as any;
    if (!user)
      return res.status(400).json({ message: "Invalid email or password." }); // comparePassword method is defined on the model

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
    console.error("Login error:", (error as any).message);
    res.status(500).json({ message: "Server error during login." });
  }
});

export default router;
