"use client";

import React, { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Connection,
  BackgroundVariant,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import AINode from "@/components/nodes/AINode";
import APINode from "../../components/nodes/APINode";
import DelayNode from "../../components/nodes/DelayNode";
import ConditionNode from "../../components/nodes/ConditionNode";

const nodeTypes = {
  ai: AINode,
  api: APINode,
  delay: DelayNode,
  condition: ConditionNode,
};

const NODE_PALETTE = [
  { type: "ai",        label: "AI Node",        icon: "🤖", color: "#6366f1" },
  { type: "api",       label: "API Call",        icon: "🌐", color: "#06b6d4" },
  { type: "delay",     label: "Delay",           icon: "⏳", color: "#f59e0b" },
  { type: "condition", label: "Condition",       icon: "🔀", color: "#10b981" },
];

const initialNodes = [
  {
    id: "start",
    position: { x: 80, y: 200 },
    data: { label: "Start" },
    type: "input",
    style: {
      background: "linear-gradient(135deg, #1e1e2e, #2a2a3e)",
      border: "1px solid #6366f1",
      borderRadius: "10px",
      color: "#e2e8f0",
      fontFamily: "monospace",
      fontSize: "13px",
      padding: "10px 18px",
    },
  },
];

export default function WorkflowPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const onConnect = useCallback(
  (params: Connection) =>
    setEdges((eds) =>
      addEdge({ ...params, animated: true }, eds)
    ),
  [setEdges] // ✅ FIX
);


  const addNode = (type: string, label: string) => {
    const id = `${type}-${Date.now()}`;
    setNodes((nds) => [
      ...nds,
      {
        id,
        position: { x: 250 + Math.random() * 200, y: 150 + Math.random() * 200 },
        data: { label },
        type,
      },
    ]);
  };

  const saveWorkflow = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/workflow/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nodes, edges }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const executeWorkflow = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/workflow/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nodes, edges }),
      });
      const data = await res.json();
      console.log("Execution result:", data);
      alert("✅ Workflow executed! Check console.");
    } catch (err) {
      console.error("Execution failed:", err);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0f0f1a", color: "#e2e8f0" }}>
      {/* Sidebar */}
      <aside style={{
        width: "200px",
        background: "#13131f",
        borderRight: "1px solid #1e1e2e",
        padding: "20px 12px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}>
        <p style={{ fontSize: "11px", color: "#6366f1", fontFamily: "monospace", letterSpacing: "2px", marginBottom: "12px" }}>
          NODE PALETTE
        </p>
        {NODE_PALETTE.map((n) => (
          <button
            key={n.type}
            onClick={() => addNode(n.type, n.label)}
            style={{
              background: "#1a1a2e",
              border: `1px solid ${n.color}33`,
              borderRadius: "8px",
              color: "#e2e8f0",
              padding: "10px 12px",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = n.color)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${n.color}33`)}
          >
            <span>{n.icon}</span> {n.label}
          </button>
        ))}

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            onClick={saveWorkflow}
            style={{
              background: saving ? "#1e1e2e" : "#6366f1",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              padding: "10px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {saving ? "Saving..." : saved ? "✅ Saved!" : "💾 Save"}
          </button>
          <button
            onClick={executeWorkflow}
            style={{
              background: "#10b981",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              padding: "10px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            ▶ Run
          </button>
        </div>
      </aside>

      {/* Canvas */}
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} color="#1e1e2e" gap={20} />
          <Controls style={{ background: "#13131f", border: "1px solid #1e1e2e" }} />
          <MiniMap style={{ background: "#13131f" }} nodeColor="#6366f1" />
        </ReactFlow>
      </div>
    </div>
  );
}