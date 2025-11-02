import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// NOTE: Ensure this path is correct for your file structure
import User from "../../../models/User.js";

const router = express.Router();

// Get the secret outside the route handler for efficiency, or inside for dynamic environment updates
const JWT_SECRET = process.env.JWT_SECRET || "your_fallback_secret";
// Check if the secret is insecure (in case the environment file wasn't read)
if (JWT_SECRET === "your_fallback_secret") {
  console.warn(
    "⚠️ WARNING: JWT_SECRET is using the fallback. Production environment variable is MISSING."
  );
}

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

    const newUser = new User({
      name: actualName,
      email,
      password: password, // Plain password is fine; Mongoose pre('save') hook hashes it
    });

    await newUser.save(); // ✅ JWT FIX: Use the globally checked SECRET variable

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

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
    // ✅ FIX: Use type assertion for the user document returned by Mongoose
    const user = (await User.findOne({ email })) as any;
    if (!user)
      return res.status(400).json({ message: "Invalid email or password." });

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password." }); // ✅ JWT FIX: Use the globally checked SECRET variable

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
