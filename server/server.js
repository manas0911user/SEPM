import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// 🔥 CORS FIX (IMPORTANT)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://sepm-ten.vercel.app", // 👈 tera frontend URL
    ],
    credentials: true,
  })
);

// 🔥 Middlewares
app.use(express.json());

// 🔥 Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

// 🔥 Health check (optional but useful)
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// 🔥 MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB Error:", err));

// 🔥 Use dynamic port (IMPORTANT for Render)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});