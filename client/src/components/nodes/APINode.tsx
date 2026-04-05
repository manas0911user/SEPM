import { Handle, Position } from "reactflow";
type APINodeProps = {
  data: {
    label: string;
  };
};

export default function APINode({ data }: APINodeProps) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #0f2027, #203a43)",
      border: "1px solid #06b6d4",
      borderRadius: "12px",
      padding: "12px 16px",
      minWidth: "160px",
      color: "#e2e8f0",
      fontFamily: "monospace",
      fontSize: "13px",
      boxShadow: "0 0 12px #06b6d433",
    }}>
      <Handle type="target" position={Position.Left} style={{ background: "#06b6d4" }} />
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "18px" }}>🌐</span>
        <div>
          <div style={{ fontWeight: 700, color: "#67e8f9" }}>API Call</div>
          <div style={{ fontSize: "11px", color: "#64748b" }}>{data.label}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: "#06b6d4" }} />
    </div>
  );
}