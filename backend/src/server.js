import express from 'express';
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello from backend!");
});
app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

app.listen(PORT, ()=> console.log("Server is running on port: " + PORT))