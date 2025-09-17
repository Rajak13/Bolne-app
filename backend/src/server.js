import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import { connectDB } from './lib/db.js'

import { ENV } from './lib/env.js'

const app = express();
const __dirname = path.resolve();
const PORT = ENV.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite dev server (default)
    'http://localhost:5174', // Vite dev server (alternative port)
    'http://localhost:3000', // Backend server (for same-origin requests)
    'https://bolne.sevalla.app', // Production domain
    ENV.CLIENT_URL || 'http://localhost:5173' // From environment variable
  ],
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Increase payload limit for image uploads
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// Make the app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connectDB();
});
