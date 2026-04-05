import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Workflow from "../models/Workflow.js";

const router = express.Router();

// Create workflow
router.post("/", protect, async (req, res) => {
  const workflow = await Workflow.create({
    userId: req.user._id,
    name: req.body.name,
    nodes: req.body.nodes,
    edges: req.body.edges,
  });

  res.json(workflow);
});

// Get all workflows
router.get("/", protect, async (req, res) => {
  const workflows = await Workflow.find({ userId: req.user._id });
  res.json(workflows);
});

export default router;