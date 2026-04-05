import mongoose from "mongoose";

const workflowSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: String,
    nodes: Array,
    edges: Array,
  },
  { timestamps: true }
);

export default mongoose.model("Workflow", workflowSchema);