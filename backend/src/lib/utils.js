import jwt from 'jsonwebtoken';
import { ENV } from './env.js';


export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, ENV.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,                 // Helps prevent XSS
    sameSite: "strict",              // Helps prevent CSRF
    secure: ENV.NODE_ENV !== "development", // Only HTTPS in production
  });

  return token;
};
