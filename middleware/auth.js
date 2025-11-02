import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "") || 
                  req.header("x-auth-token");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_fallback_secret");

    // Find user by ID in token payload
    // Support both id and userId formats
     const userId = decoded.id || decoded.userId;
     const user = await User.findById(userId).select("-password");
     if (!user) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default auth;
