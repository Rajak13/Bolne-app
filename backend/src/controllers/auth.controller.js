import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandler.js";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill in all the fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password should be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: `User with email ${email} already exists` });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    generateToken(savedUser._id, res);

    res.status(201).json({
      _id: savedUser._id,
      fullName: savedUser.fullName,
      email: savedUser.email,
      profilePic: savedUser.profilePic,
    });

    try {
      await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }
  } catch (error) {
    console.error("Error in signup controller:", error);
    res.status(500).json({ message: "Internal error occurred" });
  }
};

export const login = async (req,res) => {
  const { email, password} = req.body;

  try {
    const user = await User.findOne({email})
    if(!user) return res.status(400).json({message: "Invalid credentials"})

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if(!password) return res.status(400).json({message: "Invalid credentials"})

    generateToken(user._id,res)

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic, 
    })


  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal error occurred" })
  }
};

export const logout = async (req,res) => {
  res.cookie("jwt", "", {maxAge:0})
  res.status(200).json({message: "Logout was succesful "})
};

export const updateProfile = async (req,res) => {
  try {
    const profilePic = req.body
    if(!profilePic) return res.status(400).json({message: "Profile Picture is Required."})

    const userId = req.user._id

    await cloudinary.uploader.upload(profilePic)

    await User.findByIdAndUpdate(userId, 
      {profilePic:uploadResponse.secure_url},
      {new: true}
    );
  } catch (error) {
    
  }
};