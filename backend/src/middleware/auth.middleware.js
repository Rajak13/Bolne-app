import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt
        if(!token) return res.status(401).json({message:"Unauthorized: No Token Provided "})

        const decoded = jwt.verify(token, ENV.JWT_SECRET)
        if(!token) return res.status(401).json({message:"Unauthorized: Invalid Token Provided "})

        const user = await User.findById(decoded.userId).select("-password")
        if(!user) return res.status(404).json({message:"User not Found "})

        req.user = user
        next();

    }catch(error) {
        console.log("Error in middleware", error)
        res.status(500).json({message: "Internal error occured"})
    }
}