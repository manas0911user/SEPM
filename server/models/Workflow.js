import mongoose from "mongoose";

const workflowSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nodes: { type: Array, default: [] },
  edges: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Workflow", workflowSchema);