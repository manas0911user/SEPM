import express from "express";
import { saveWorkflow, loadWorkflow, executeWorkflow } from "../controllers/workflowController.js";
import { protect } from "../middleware/authMiddleware.js"; // ✅

const router = express.Router();

router.post("/save",    protect, saveWorkflow);
router.get("/load",     protect, loadWorkflow);
router.post("/execute", protect, executeWorkflow);

export default router;