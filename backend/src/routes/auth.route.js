import express from 'express';
import bcrypt from 'bcryptjs';
import { login, logout, signup , updateProfile} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js'; 
import { arcjetProtection } from '../middleware/arcjet.middleware.js';
import User from '../models/User.js';
import { generateToken } from '../lib/utils.js';

 const router = express.Router();

// router.use(arcjetProtection);

router.post("/signup",signup)

router.post("/login", login)

router.post("/logout", logout)

router.put("/update-profile",protectRoute, updateProfile)

router.get("/check", protectRoute,(req, res) => res.status(200).json(req.user))

// Test user creation endpoint (for development only)
router.post("/create-test-user", async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: "Not available in production" });
    }

    const { fullName, email, password } = req.body;
    
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    const token = generateToken(savedUser._id, res);

    res.status(201).json({
      _id: savedUser._id,
      fullName: savedUser.fullName,
      email: savedUser.email,
      profilePic: savedUser.profilePic,
      token: token
    });
  } catch (error) {
    console.error("Error creating test user:", error);
    res.status(500).json({ message: "Internal error occurred" });
  }
});

 export default router;