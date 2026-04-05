import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express(); // ✅ FIRST create app

// 🔥 Middlewares
app.use(cors());
app.use(express.json());

// 🔥 Routes
app.use("/api/auth", authRoutes); // ✅ AFTER app defined
app.use("/api/ai", aiRoutes);

// 🔥 MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB Error:", err));

// 🔥 Server start
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});