import { Handle, Position } from "reactflow";

export default function ConditionNode({ data }: any) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #0f1f18, #0f2018)",
      border: "1px solid #10b981",
      borderRadius: "12px",
      padding: "12px 16px",
      minWidth: "160px",
      color: "#e2e8f0",
      fontFamily: "monospace",
      fontSize: "13px",
      boxShadow: "0 0 12px #10b98133",
    }}>
      <Handle type="target" position={Position.Left} style={{ background: "#10b981" }} />
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "18px" }}>🔀</span>
        <div>
          <div style={{ fontWeight: 700, color: "#6ee7b7" }}>Condition</div>
          <div style={{ fontSize: "11px", color: "#64748b" }}>{data.label}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="true" style={{ background: "#10b981", top: "30%" }} />
      <Handle type="source" position={Position.Right} id="false" style={{ background: "#ef4444", top: "70%" }} />
    </div>
  );
}