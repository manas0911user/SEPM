"use client";

import React, { useCallback, useRef, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Connection,
  BackgroundVariant,
  NodeTypes,
  ReactFlowInstance,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

const NODE_DEFS: Record<string, {
  label: string; desc: string; color: string; icon: string;
  fields: Array<{ name: string; label: string; type: string; placeholder: string }>;
}> = {
  webhook:      { label: "Webhook Trigger",     desc: "Triggers workflow when receiving HTTP request", color: "#3b55e6", icon: "🔗", fields: [] },
  schedule:     { label: "Schedule Trigger",    desc: "Runs workflow on a schedule",                  color: "#7c3aed", icon: "🕐", fields: [{ name: "cron", label: "Cron Expression", type: "text", placeholder: "0 * * * *" }] },
  "ai-text":    { label: "AI Text Generator",   desc: "Generate text using AI",                       color: "#9333ea", icon: "🎽", fields: [{ name: "prompt", label: "Prompt", type: "textarea", placeholder: "Write a professional email" }, { name: "temperature", label: "Temperature", type: "text", placeholder: "0.7" }, { name: "maxTokens", label: "Max Tokens", type: "text", placeholder: "500" }] },
  "ai-analyze": { label: "AI Content Analyzer", desc: "Analyze content with AI",                      color: "#0ea5e9", icon: "🌐", fields: [{ name: "mode", label: "Analysis Mode", type: "text", placeholder: "sentiment / keywords / summary" }] },
  "ai-chat":    { label: "AI Chatbot",          desc: "Generate chatbot responses",                   color: "#6366f1", icon: "🤖", fields: [{ name: "system", label: "System Prompt", type: "textarea", placeholder: "You are a helpful assistant" }] },
  "ai-extract": { label: "AI Data Extractor",   desc: "Extract structured data from text",            color: "#ec4899", icon: "📄", fields: [{ name: "schema", label: "Output Schema (JSON)", type: "textarea", placeholder: '{"name":"","email":""}' }] },
  http:         { label: "HTTP Request",        desc: "Make HTTP requests to APIs",                   color: "#10b981", icon: "🌍", fields: [{ name: "url", label: "URL", type: "text", placeholder: "https://api.example.com" }, { name: "method", label: "Method", type: "text", placeholder: "GET / POST" }] },
  transform:    { label: "Data Transform",      desc: "Transform data using JavaScript",              color: "#f59e0b", icon: "🔄", fields: [{ name: "code", label: "JavaScript", type: "textarea", placeholder: "return { result: input.data }" }] },
  email:        { label: "Send Email",          desc: "Send email (simulated)",                       color: "#ef4444", icon: "✉️", fields: [{ name: "to", label: "To", type: "text", placeholder: "user@example.com" }, { name: "subject", label: "Subject", type: "text", placeholder: "Workflow Result" }] },
};

const SIDEBAR_SECTIONS = [
  { label: "TRIGGER NODES", types: ["webhook", "schedule"] },
  { label: "AI NODES",      types: ["ai-text", "ai-analyze", "ai-chat", "ai-extract"] },
  { label: "ACTION NODES",  types: ["http", "transform", "email"] },
];

type NodeData = {
  nodeType: string;
  configured: boolean;
  config: Record<string, string>;
  onConfigure: (id: string) => void;
  result?: string;
};

function WorkflowNode({ id, data }: { id: string; data: NodeData }) {
  const def = NODE_DEFS[data.nodeType];
  if (!def) return null;
  return (
    <div style={{ minWidth: 220, position: "relative" }}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: def.color, width: 10, height: 10, border: "2px solid #0f1117" }}
      />
      <div style={{
        background: `${def.color}22`,
        border: `1.5px solid ${def.color}66`,
        borderRadius: data.result ? "10px 10px 0 0" : "10px 10px 0 0",
        padding: "10px 14px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 18 }}>{def.icon}</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{def.label}</div>
          <div style={{ fontSize: 11, color: "#8892b0", marginTop: 2 }}>{def.desc}</div>
        </div>
      </div>

      <div style={{
        background: "#0f1117",
        border: `1.5px solid ${def.color}33`,
        borderTop: "none",
        borderRadius: data.result ? "0" : "0 0 10px 10px",
        padding: "8px 14px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: data.configured ? "#10b981" : "#2a3555",
            display: "inline-block",
          }} />
          <span style={{ fontSize: 11, color: "#4a5080" }}>
            {data.configured ? "Configured" : "Not configured"}
          </span>
        </div>
        <span
          onClick={() => data.onConfigure(id)}
          style={{ fontSize: 11, color: def.color, cursor: "pointer" }}
        >
          ⚙ Configure
        </span>
      </div>

      {data.result && (
        <div style={{
          background: "#0a1a0a",
          border: `1.5px solid #10b98144`,
          borderTop: "none",
          borderRadius: "0 0 10px 10px",
          padding: "8px 14px",
          fontSize: 11,
          color: "#10b981",
          maxHeight: 80,
          overflowY: "auto",
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}>
          ✅ {data.result}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: def.color, width: 10, height: 10, border: "2px solid #0f1117" }}
      />
    </div>
  );
}

const nodeTypes: NodeTypes = { workflowNode: WorkflowNode };

let nodeCounter = 0;

export default function WorkflowPage() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [configId, setConfigId] = useState<string | null>(null);
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const [executing, setExecuting] = useState(false);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge({
          ...params,
          animated: true,
          style: { stroke: "#6366f1", strokeWidth: 2, strokeDasharray: "6 3" },
        }, eds)
      ),
    []
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const openConfig = useCallback((nodeId: string) => {
    setConfigId(nodeId);
    setNodes((nds) => {
      const node = nds.find((n) => n.id === nodeId);
      setConfigValues(node?.data?.config || {});
      return nds;
    });
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("nodeType");
      if (!type || !rfInstance || !reactFlowWrapper.current) return;
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = rfInstance.screenToFlowPosition({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });
      const id = `node-${++nodeCounter}`;
      setNodes((nds) => [
        ...nds,
        {
          id,
          type: "workflowNode",
          position,
          data: {
            nodeType: type,
            configured: false,
            config: {},
            onConfigure: openConfig,
          },
        },
      ]);
    },
    [rfInstance, openConfig]
  );

  const saveConfig = () => {
    if (!configId) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === configId
          ? { ...n, data: { ...n.data, configured: true, config: configValues } }
          : n
      )
    );
    setConfigId(null);
  };

  const saveWorkflow = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/workflow/save", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nodes, edges }),
      });
      alert("✅ Workflow saved!");
    } catch {
      alert("Save failed");
    }
  };

  const executeWorkflow = async () => {
    try {
      setExecuting(true);
      const token = localStorage.getItem("token");
      const res = await fetch("https://ai-workflow-backend-5dtn.onrender.com/api/workflow/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nodes, edges }),
      });
      const data = await res.json();

      // inject results into nodes
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: {
            ...n.data,
            result: data.results?.[n.id] ?? n.data.result,
          },
        }))
      );
    } catch {
      alert("Execution failed");
    } finally {
      setExecuting(false);
    }
  };

  const configNode = configId ? nodes.find((n) => n.id === configId) : null;
  const configDef = configNode ? NODE_DEFS[configNode.data.nodeType] : null;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0f1117", color: "#e2e8f0", fontFamily: "monospace" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 240, background: "#13151e", borderRight: "1px solid #1e2130", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #1e2130", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>Logichub</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={executeWorkflow}
              style={{ background: executing ? "#4338ca" : "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              {executing ? "⏳ Running..." : "▶ Execute"}
            </button>
            <button
              onClick={saveWorkflow}
              style={{ background: "#1a1d2e", color: "#8892b0", border: "1px solid #1e2130", borderRadius: 8, padding: "6px 10px", fontSize: 14, cursor: "pointer" }}
            >
              💾
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
          {SIDEBAR_SECTIONS.map((section) => (
            <div key={section.label}>
              <div style={{ fontSize: 10, letterSpacing: "1.5px", color: "#4a5080", fontWeight: 500, margin: "16px 0 8px 4px" }}>
                {section.label}
              </div>
              {section.types.map((type) => {
                const def = NODE_DEFS[type];
                return (
                  <div
                    key={type}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("nodeType", type)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, cursor: "grab", marginBottom: 4, border: "1px solid transparent", transition: "all 0.15s" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "#1a1d2e";
                      (e.currentTarget as HTMLElement).style.borderColor = "#2a2d40";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.borderColor = "transparent";
                    }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${def.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0, border: `1px solid ${def.color}44` }}>
                      {def.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0" }}>{def.label}</div>
                      <div style={{ fontSize: 11, color: "#4a5080", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{def.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      {/* ── Canvas ── */}
      <div ref={reactFlowWrapper} style={{ flex: 1, position: "relative" }}>
        <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", zIndex: 10, background: "#1a1d2e", border: "1px solid #2a2d40", borderRadius: 20, padding: "5px 16px", fontSize: 12, color: "#6b7db3", display: "flex", alignItems: "center", gap: 8 }}>
          <span>{nodes.length} nodes</span>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#2a3060", display: "inline-block" }} />
          <span>{edges.length} connections</span>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setRfInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          style={{ background: "#0a0c14" }}
        >
          <Background variant={BackgroundVariant.Dots} color="#1e2130" gap={20} size={1} />
          <Controls style={{ background: "#13151e", border: "1px solid #1e2130" }} />
        </ReactFlow>
      </div>

      {/* ── Config Panel ── */}
      {configId && configDef && (
        <div style={{ width: 320, background: "#13151e", borderLeft: "1px solid #1e2130", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "16px 18px", borderBottom: "1px solid #1e2130", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>Configure Node</div>
              <div style={{ fontSize: 12, color: "#4a5080", marginTop: 2 }}>{configDef.label}</div>
            </div>
            <span onClick={() => setConfigId(null)} style={{ cursor: "pointer", color: "#4a5080", fontSize: 20 }}>×</span>
          </div>

          <div style={{ flex: 1, padding: 18, display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
            {configDef.fields.length === 0 && (
              <p style={{ color: "#4a5080", fontSize: 13 }}>No configuration needed.</p>
            )}
            {configDef.fields.map((f) => (
              <div key={f.name}>
                <div style={{ fontSize: 12, color: "#8892b0", marginBottom: 6 }}>
                  {f.label} <span style={{ color: "#f87171", fontSize: 10 }}>*</span>
                </div>
                {f.type === "textarea" ? (
                  <textarea
                    rows={4}
                    placeholder={f.placeholder}
                    value={configValues[f.name] || ""}
                    onChange={(e) => setConfigValues((v) => ({ ...v, [f.name]: e.target.value }))}
                    style={{ width: "100%", background: "#0f1117", border: "1px solid #1e2130", borderRadius: 8, color: "#e2e8f0", fontSize: 13, padding: "10px 12px", outline: "none", resize: "none", fontFamily: "monospace" }}
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    value={configValues[f.name] || ""}
                    onChange={(e) => setConfigValues((v) => ({ ...v, [f.name]: e.target.value }))}
                    style={{ width: "100%", background: "#0f1117", border: "1px solid #1e2130", borderRadius: 8, color: "#e2e8f0", fontSize: 13, padding: "10px 12px", outline: "none", fontFamily: "monospace" }}
                  />
                )}
              </div>
            ))}
          </div>

          <div style={{ padding: "14px 18px", borderTop: "1px solid #1e2130", display: "flex", gap: 10 }}>
            <button onClick={saveConfig} style={{ flex: 1, background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, padding: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Save Configuration
            </button>
            <button onClick={() => setConfigId(null)} style={{ background: "#1a1d2e", color: "#8892b0", border: "1px solid #1e2130", borderRadius: 8, padding: "10px 14px", fontSize: 13, cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}