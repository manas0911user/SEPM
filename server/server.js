import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import workflowRoutes from "./routes/workflowRoutes.js";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://sepm-ten.vercel.app",
  ],
  credentials: true,
}));

app.use(express.json());

// 🔥 Routes (sab saath)
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/workflow", workflowRoutes);

app.get("/", (req, res) => res.send("API is running 🚀"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));